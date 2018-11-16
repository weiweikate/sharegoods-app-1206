import React, { Component } from 'react';
import { View, NativeModules, Alert, DeviceEventEmitter } from 'react-native';
import RefreshList from '../../../components/ui/RefreshList';
import constants from '../../../constants/constants';
import StringUtils from '../../../utils/StringUtils';
import GoodsListItem from './GoodsListItem';
import SingleSelectionModal from './BottomSingleSelectModal';
import CommonTwoChoiceModal from './CommonTwoChoiceModal';
// import OrderUtils from './../components/OrderUtils';
import Toast from '../../../utils/bridge';
import user from '../../../model/user';
import OrderApi from '../api/orderApi';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import userOrderNum from '../../../model/userOrderNum';
import DesignRule from 'DesignRule';
import emptyIcon from '../res/kongbeuye_dingdan.png';
import MineApi from '../../mine/api/MineApi';
export default class MyOrdersListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeOff: [],//待付款时间
            viewData: [],
            pageStatus: this.props.pageStatus,
            isEmpty: false,
            currentPage: 1,
            isShowDeleteOrderModal: false,
            isShowSingleSelctionModal: false,
            isShowReceiveGoodsModal: false,
            menu: {},
            index: -1,
            CONFIG:[]
        };
        this.currentPage = 1;
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                id={item.id}
                orderNum={item.orderNum}
                orderType={item.orderType}
                orderCreateTime={item.orderCreateTime}
                orderStatus={item.orderStatus}
                freightPrice={item.freightPrice}
                totalPrice={item.totalPrice}
                orderProduct={item.orderProduct}
                platformPayTime={item.platformPayTime}
                finishTime={item.finishTime}
                sendTime={item.sendTime}
                deliverTime={item.deliverTime}
                shutOffTime={item.shutOffTime}
                cancelTime={item.cancelTime}
                autoReceiveTime={item.autoReceiveTime}
                clickItem={() => {
                    this.clickItem(index);
                }}
                goodsItemClick={() => this.clickItem(index)}
                operationMenuClick={(menu) => this.operationMenuClick(menu, index)}
                outTradeNo={item.outTradeNo}
                status={item.status}
                callBack={() => {
                    // this.onRefresh();
                }}
            />
        );
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                <RefreshList
                    style={{marginTop:10}}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无订单'}
                    emptyIcon={emptyIcon}
                />
                {this.renderModal()}
            </View>
        );
    }

    renderModal = () => {
        return (
            <View>
                <CommonTwoChoiceModal
                    isShow={this.state.isShowDeleteOrderModal}
                    ref={(ref) => {
                        this.deleteModal = ref;
                    }}
                    detail={{ title: '删除订单', context: '确定删除此订单吗', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                        console.log(this.state.menu);
                        if (this.state.viewData[this.state.index].orderStatus === 6||this.state.viewData[this.state.index].orderStatus === 7||this.state.viewData[this.state.index].orderStatus === 8) {
                            Toast.showLoading();
                            OrderApi.deleteClosedOrder({ orderNum: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });
                        } else if (this.state.viewData[this.state.index].orderStatus === 4||this.state.viewData[this.state.index].orderStatus === 5) {
                            Toast.showLoading();
                            OrderApi.deleteCompletedOrder({ orderNum: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });
                        } else {
                            NativeModules.commModule.toast('状态值异常，暂停操作');
                        }
                    }}
                    no={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                />
                <CommonTwoChoiceModal
                    isShow={this.state.isShowReceiveGoodsModal}
                    ref={(ref) => {
                        this.receiveModal = ref;
                    }}
                    detail={{ title: '确认收货', context: '是否确认收货?', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                        Toast.showLoading();
                        OrderApi.confirmReceipt({ orderNum: this.state.viewData[this.state.index].orderNum }).then((response) => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast('确认收货成功');
                            this.onRefresh();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast(e.msg);
                        });
                    }}
                    no={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                />
                <SingleSelectionModal
                    isShow={this.state.isShowSingleSelctionModal}
                    ref={(ref) => {
                        this.cancelModal = ref;
                    }}
                    detail={this.state.CONFIG}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            buyerRemark: this.state.CONFIG[index],
                            orderNum: this.state.viewData[this.state.index].orderNum
                        }).then((response) => {
                            Toast.hiddenLoading();
                            if (response.code === 10000) {
                                NativeModules.commModule.toast('订单已取消');
                                index=-1;
                                this.onRefresh();
                            } else {
                                NativeModules.commModule.toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast(e);
                        });
                    }}
                />
            </View>

        );
    };
    //多商品订单列表 maybe
    getOrderProduct = (list) => {
        let arrData = [];
        list.map((item, index) => {
            arrData.push({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                spec: item.spec,
                imgUrl: item.specImg,
                price: StringUtils.formatMoneyString(item.price),
                num: item.num,
                status: item.status,
                returnProductStatus: item.returnProductStatus,
                returnType: item.returnType
            });
        });
        return arrData;
    };
    getList = (data) => {
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        if (StringUtils.isNoEmpty(data) && StringUtils.isNoEmpty(data.data)) {
            // let arrData = this.currentPage === 1 ? [] : this.state.viewData;
            data.data.map((item, index) => {
                arrData.push({
                    id: item.id,
                    orderNum: item.orderNum,
                    expressNo: item.expressNo,
                    orderCreateTime: item.createTime,
                    platformPayTime: item.platformPayTime,
                    payTime: item.payTime,
                    sendTime: item.sendTime,
                    finishTime: item.finishTime,
                    deliverTime: item.deliverTime ? item.deliverTime : item.finishTime,
                    autoReceiveTime: item.autoReceiveTime ? item.autoReceiveTime : item.sendTime,
                    orderStatus: item.status,
                    freightPrice: item.freightPrice,
                    totalPrice: item.needPrice,
                    cancelTime: item.cancelTime ? item.cancelTime : null,
                    orderProduct: this.getOrderProduct(item.orderProductList),
                    pickedUp: item.pickedUp,
                    outTradeNo: item.outTradeNo,
                    shutOffTime: item.shutOffTime,
                    orderType: item.orderType
                });

            });
        }
        this.setState({ viewData: arrData });

    };

    componentDidMount() {
        //网络请求，业务处理
        this.getDataFromNetwork();
       this.getCancelOrder();
        DeviceEventEmitter.addListener('OrderNeedRefresh', () => this.onRefresh());
        this.timeDown();
    }
    getCancelOrder(){
        let arrs=[];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
            if (res.code == 10000 && StringUtils.isNoEmpty(res.data)) {
                res.data.map((item,i)=>{
                    arrs.push(item.value)
                })
                this.setState({
                    CONFIG: arrs
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    timeDown() {
        this.interval = setInterval(() => {
            let timeunit = new Date().valueOf();
            this.setState({ timeOff: timeunit });
        }, 1000);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        DeviceEventEmitter.removeAllListeners('OrderNeedRefresh');
    }


    getDataFromNetwork = () => {
        console.log('orderlistrefresh');
        userOrderNum.getUserOrderNum();
        let params = {
            userId: user.id,
            page: this.currentPage,
            size: constants.PAGESIZE
        };
        Toast.showLoading();
        if (this.props.orderNum) {
            OrderApi.queryPage({
                // orderNum: this.props.orderNum,
                condition:this.props.orderNum,
                page: 1,
                size: constants.PAGESIZE
            }).then((response) => {
                Toast.hiddenLoading();
                this.getList(response.data);
                this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });
            }).catch(e => {
                Toast.hiddenLoading();
                // NativeModules.commModule.toast(e.msg);
                if (e.code === 10009) {
                    this.$navigate('login/login/LoginPage', {
                        callback: () => {
                            this.getDataFromNetwork();
                        }
                    });
                }
            });

            return;
        }
        switch (this.state.pageStatus) {
            case 0:
                OrderApi.queryPage(params).then((response) => {
                    Toast.hiddenLoading();
                    this.getList(response.data);
                    console.log(response);
                    this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });

                }).catch(e => {
                    Toast.hiddenLoading();
                    console.log(e);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.getDataFromNetwork();
                            }
                        });
                    }
                });
                break;
            case 1:
                OrderApi.queryPage({ ...params, status: 1 }).then((response) => {
                    Toast.hiddenLoading();
                    this.getList(response.data);
                    this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });
                }).catch(e => {
                    Toast.hiddenLoading();
                    //NativeModules.commModule.toast(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.getDataFromNetwork();
                            }
                        });
                    }
                });
                break;
            case 2:
                OrderApi.queryPage({ ...params, status: 2 }).then((response) => {
                    Toast.hiddenLoading();
                    this.getList(response.data);
                    this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });

                }).catch(e => {
                    Toast.hiddenLoading();
                    // NativeModules.commModule.toast(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.getDataFromNetwork();
                            }
                        });
                    }
                });
                break;
            case 3:
                OrderApi.queryPage({ ...params, status: 3 }).then((response) => {
                    Toast.hiddenLoading();
                    this.getList(response.data);
                    this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });

                }).catch(e => {
                    Toast.hiddenLoading();
                    // NativeModules.commModule.toast(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.getDataFromNetwork();
                            }
                        });
                    }
                });
                break;
            case 4:
                OrderApi.queryPage({ ...params, status: 4 }).then((response) => {
                    Toast.hiddenLoading();
                    this.getList(response.data);
                    this.setState({ isEmpty: !(response.data && StringUtils.isNoEmpty(response.data) && StringUtils.isNoEmpty(response.data.data)) });

                }).catch(e => {
                    Toast.hiddenLoading();
                    // NativeModules.commModule.toast(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.getDataFromNetwork();
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    };

    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab < 8) {
            console.log(nextProps.selectTab + '==================================');

        }
    }

    onLoadNumber = () => {
        this.props.onLoadNumber && this.props.onLoadTabNumber();
    };

    onRefresh = () => {
        this.currentPage = 1;
        this.getDataFromNetwork();
    };

    onLoadMore = (page) => {
        this.currentPage++;
        this.getDataFromNetwork();
    };
    clickItem = (index) => {
        let orderStatus = this.state.viewData[index].orderStatus;
        if (orderStatus > (constants.pageStateString.length + 1)) {
            Toast.$toast('订单已结束');
        } else {
            this.props.nav('order/order/MyOrdersDetailPage', {
                orderId: this.state.viewData[index].id,
                status: this.state.viewData[index].orderStatus,
                orderNum: this.state.viewData[index].orderNum,
                callBack: this.onRefresh
            });
        }
    };
    operationMenuClick = (menu, index) => {
        /*
         * operation checklist
         * 取消订单                 ->  1
         * 去支付                   ->  2
         * 继续支付                 ->  3
         * 订单退款                 ->  4
         * 查看物流                 ->  5
         * 确认收货                 ->  6
         * 删除订单(已完成)          ->  7
         * 再次购买                 ->  8
         * 删除订单(已关闭(取消))    ->  9
         * */
        console.log(menu);
        this.setState({ menu: menu, index: index });
        switch (menu.id) {
            case 1:
                if(this.state.CONFIG.length>0){
                    this.setState({ isShowSingleSelctionModal: true });
                    this.cancelModal && this.cancelModal.open();
                }else{
                    NativeModules.commModule.toast('无取消理由');
                }

                break;
            case 2:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    amounts: this.state.viewData[index].totalPrice
                });
                break;
            case 3:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    amounts: this.state.viewData[index].totalPrice,
                    outTradeNo: this.state.viewData[index].outTradeNo
                    // amounts: this.state.viewData[index].totalPrice + this.state.viewData[index].freightPrice,
                    // orderType: this.state.viewData[index].pickedUp - 1
                });
                break;
            case 4:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    amounts: this.state.viewData[index].price
                });
                break;
            case 5:
                this.props.nav('order/logistics/LogisticsDetailsPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    // orderId: this.state.viewData[index].id,
                    expressNo: this.state.viewData[index].expressNo
                });
                break;
            case 6:
                console.log(this.state.viewData[index]);
                let j = 0;
                let returnTypeArr = ['', '退款', '退货', '换货'];
                for (let i = 0; i < this.state.viewData[index].orderProduct.length; i++) {
                    let returnProductStatus = this.state.viewData[index].orderProduct[i].returnProductStatus || 99999;
                    if (returnProductStatus === 1) {
                        let content = '确认收货将关闭' + returnTypeArr[this.state.viewData[index].orderProduct[i].returnType] + '申请，确认收货吗？';
                        Alert.alert('提示', `${ content }`, [
                            {
                                text: '取消', onPress: () => {
                                }
                            },
                            {
                                text: '确定', onPress: () => {
                                    Toast.showLoading();
                                    OrderApi.confirmReceipt({ orderNum: this.state.viewData[index].orderNum }).then((response) => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast('确认收货成功');
                                        this.onRefresh();
                                    }).catch(e => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast(e.msg);
                                    });
                                }
                            }
                        ], { cancelable: true });
                        j++;
                        break;
                    }
                }
                if (j == 0) {
                    this.setState({ isShowReceiveGoodsModal: true });
                    this.receiveModal && this.receiveModal.open();
                }
                break;
            case 7:
                this.setState({ isShowDeleteOrderModal: true });
                this.deleteModal && this.deleteModal.open();
                break;
            case 8:
                Toast.showLoading();
                OrderApi.againOrder({
                    orderNum: this.state.viewData[index].orderNum,
                    id: this.state.viewData[index].id
                }).then((response) => {
                    Toast.hiddenLoading();
                    let cartData = [];
                    /**
                     * 'amount': item.amount,
                     'priceId': item.priceId,
                     'productId': item.productId,
                     */
                    response.data.orderProducts.map((item, index) => {
                        cartData.push({ productId: item.productId, priceId: item.priceId, amount: item.num });
                    });
                    // let params = {
                    //     amount: response.data.orderProducts[0].num,
                    //     priceId: response.data.orderProducts[0].priceId,
                    //     productId: response.data.orderProducts[0].productId
                    // };
                    shopCartCacheTool.addGoodItem(cartData);
                    this.props.nav('shopCart/ShopCart', { hiddeLeft: false });
                }).catch(e => {
                    Toast.hiddenLoading();
                    NativeModules.commModule.toast(e.msg);
                });
                break;
            case 9:
                this.setState({ isShowDeleteOrderModal: true });
                this.deleteModal && this.deleteModal.open();
                break;
        }
    };
}
