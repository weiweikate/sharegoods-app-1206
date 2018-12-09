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
// import user from '../../../model/user';
import OrderApi from '../api/orderApi';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
// import userOrderNum from '../../../model/userOrderNum';
import DesignRule from 'DesignRule';
import MineApi from '../../mine/api/MineApi';
import res from '../res';
const emptyIcon = res.kongbeuye_dingdan;

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
            CONFIG: []
        };
        this.currentPage = 1;
        this.noMoreData = false;
        this.isFirst = true;
    }

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                orderNum={item.orderNo}
                orderType={item.orderType}
                orderStatus={item.orderStatus}
                orderProduct={item.orderProduct}
                shutOffTime={item.cancelTime}
                totalPrice={item.totalPrice}
                clickItem={() => {
                    this.clickItem(index);
                }}
                goodsItemClick={() => this.clickItem(index)}
                operationMenuClick={(menu) => this.operationMenuClick(menu, index)}
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
                    style={{ marginTop: 10 }}
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
                    detail={{ title: '删除订单', context: '确定删除此订单?', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                        console.log(this.state.menu);
                        if (this.state.viewData[this.state.index].orderStatus === 6 || this.state.viewData[this.state.index].orderStatus === 7 || this.state.viewData[this.state.index].orderStatus === 8) {
                            Toast.showLoading();
                            OrderApi.deleteClosedOrder({ orderNum: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });
                        } else if (this.state.viewData[this.state.index].orderStatus === 4 || this.state.viewData[this.state.index].orderStatus === 5) {
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
                                index = -1;
                                this.onRefresh();
                            } else {
                                NativeModules.commModule.toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast(e.msg);
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
                productId: item.prodCode,
                productName: item.productName,
                spec: item.specValues,
                imgUrl: item.specImg,
                price: StringUtils.formatMoneyString(item.payAmount),
                num: item.quantity,
                status: item.status,
                orderType:item.subStatus,
                // returnProductStatus: item.returnProductStatus,
                // returnType: item.returnType
            });
        });
        return arrData;
    };
    getList = (data) => {
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        if (StringUtils.isNoEmpty(data) && StringUtils.isNoEmpty(data.data)) {
            data.data.map((item, index) => {
                if(item.warehouseOrderDTOList[0].status==1){//未付款的
                    item.warehouseOrderDTOList.map((resp,index1)=>{
                        arrData.push({
                            orderProduct: this.getOrderProduct(resp.products),
                            orderNo:resp.platformOrderNo,
                            cancelTime:resp.cancelTime,
                            quantity:resp.quantity,
                            orderType:resp.subStatus,
                            orderStatus:resp.status,
                            totalPrice: resp.payAmount,
                            expressList:resp.expressList||[]

                        })
                    })

                }else{
                    item.warehouseOrderDTOList.map((resp,index1)=>{
                        arrData.push({
                            orderProduct: this.getOrderProduct(resp.products),
                            orderNo:resp.warehouseOrderNo,
                            cancelTime:resp.cancelTime,
                            quantity:resp.products.length,
                            orderType:resp.subStatus,
                            orderStatus:resp.status,
                            totalPrice: resp.payAmount,
                            expressList:resp.expressList||[]
                        })
                    })
                }
                // arrData.push({
                //     id: item.id,
                //     orderNum: item.orderNum,
                //     expressNo: item.expressNo,
                //     orderCreateTime: item.createTime,
                //     platformPayTime: item.platformPayTime,
                //     payTime: item.payTime,
                //     sendTime: item.sendTime,
                //     finishTime: item.finishTime,
                //     deliverTime: item.deliverTime ? item.deliverTime : item.finishTime,
                //     autoReceiveTime: item.autoReceiveTime ? item.autoReceiveTime : item.sendTime,
                //     orderStatus: item.status,
                //     freightPrice: item.freightPrice,
                //     totalPrice: item.needPrice,
                //     cancelTime: item.cancelTime ? item.cancelTime : null,
                //     orderProduct: this.getOrderProduct(item.orderProductList),
                //     pickedUp: item.pickedUp,
                //     outTradeNo: item.outTradeNo,
                //     shutOffTime: item.shutOffTime,
                //     orderType: item.orderType
                // });

            });
            // this.setState({ viewData: arrData });
        } else {
            this.noMoreData = true;
            // NativeModules.commModule.toast('无更多数据');
        }
        this.setState({ viewData: arrData });
    };

    componentDidMount() {
        //网络请求，业务处理
        if (this.isFirst) {
            this.getDataFromNetwork();
        }
        this.getCancelOrder();
        DeviceEventEmitter.addListener('OrderNeedRefresh', () => this.onRefresh());
        this.timeDown();
    }

    getCancelOrder() {
        let arrs = [];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
            if (res.code == 10000 && StringUtils.isNoEmpty(res.data)) {
                res.data.map((item, i) => {
                    arrs.push(item.value);
                });
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

   handleDatas(){
       let params = {
           page: this.currentPage,
           size: constants.PAGESIZE,
           keywords:null,
           orderNo:null
       };
       let status=null;
       if(this.state.pageStatus>0){
           status=this.state.pageStatus
       }
       OrderApi.queryPage({ ...params, status: status }).then((response) => {
           Toast.hiddenLoading();
           this.getList(response.data);
           console.log(response);
           this.setState({ isEmpty: response.data.totalNum===0 });
           this.isFirst = false;
       }).catch(e => {
           Toast.hiddenLoading();
           NativeModules.commModule.toast(e.msg);
           if (e.code === 10009) {
               this.props.nav('login/login/LoginPage', {
                   callback: () => {
                       this.getDataFromNetwork();
                   }
               });
           }
       });
   }

    getDataFromNetwork = () => {
        console.log('orderlistrefresh');
        // userOrderNum.getUserOrderNum();
        Toast.showLoading();
        if (this.props.orderNum) {
            OrderApi.queryPage({
                keywords: this.props.orderNum,
                page: this.currentPage,
                size: constants.PAGESIZE,
                status:null,
                orderNo:null
            }).then((response) => {
                Toast.hiddenLoading();
                this.isFirst = false;
                this.getList(response.data);
                this.setState({ isEmpty: response.data.totalNum===0});
            }).catch(e => {
                Toast.hiddenLoading();
                NativeModules.commModule.toast(e.msg);
            });

            return;
        }
        this.handleDatas();
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
        console.log('onRefresh', this.currentPage);
        this.currentPage = 1;
        this.getDataFromNetwork();
    };

    onLoadMore = () => {
        // console.log('onLoadMore',this.currentPage++);
        if (!this.noMoreData) {
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };
    clickItem = (index) => {
        let orderStatus = this.state.viewData[index].orderStatus;
        if (orderStatus > (constants.pageStateString.length + 1)) {
            Toast.$toast('订单已结束');
        } else {
            this.props.nav('order/order/MyOrdersDetailPage', {
                orderNo: this.state.viewData[index].orderNo,
                callBack: ()=>this.onRefresh
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
                if (this.state.CONFIG.length > 0) {
                    this.setState({ isShowSingleSelctionModal: true });
                    this.cancelModal && this.cancelModal.open();
                } else {
                    NativeModules.commModule.toast('无取消理由');
                }

                break;
            case 2:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNo: this.state.viewData[index].orderNo,
                    amounts: this.state.viewData[index].totalPrice
                });
                break;
            case 3:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNo,
                    amounts: this.state.viewData[index].totalPrice,
                    outTradeNo: this.state.viewData[index].outTradeNo
                });
                break;
            case 4:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNo,
                    amounts: this.state.viewData[index].price
                });
                break;
            case 5:
                // OrderApi.findLogisticsDetail({})
                // this.props.nav('order/logistics/LogisticsDetailsPage', {
                //     orderNo: this.state.viewData[index].orderNo,
                //     // orderId: this.state.viewData[index].id,
                //     expressNo: this.state.viewData[index].expressNo
                // });
                if(this.state.viewData[index].expressList.length===0){
                    NativeModules.commModule.toast('当前物流信息不存在！');
                }
                else if(this.state.viewData[index].expressList.length===1){
                    this.props.nav("order/logistics/LogisticsDetailsPage", {
                        expressList: this.state.viewData[this.state.index].expressList
                    });
                }else{
                    this.props.nav("order/logistics/CheckLogisticsPage", {
                        expressList: this.state.viewData[index].expressList
                    });
                }
                break;
            case 6:
                console.log(this.state.viewData[index]);
                    // this.setState({ isShowReceiveGoodsModal: true });
                    // this.receiveModal && this.receiveModal.open();
                    Alert.alert('',`是否确认收货?`, [
                        {
                            text: `取消`, onPress: () => {
                            }
                        },
                        {
                            text: `确定`, onPress: () => {
                                Toast.showLoading();
                                OrderApi.confirmReceipt({ orderNo: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('确认收货成功');
                                    this.onRefresh();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });
                            }}

                    ], { cancelable: true });
                break;
            case 7:
                // this.setState({ isShowDeleteOrderModal: true });
                Alert.alert('',`确定删除此订单？`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            console.log(this.state.menu);
                                Toast.showLoading();
                                OrderApi.deleteOrder({ orderNo: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除！');
                                    this.onRefresh();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });
                        }}

                ], { cancelable: true });
                // this.deleteModal && this.deleteModal.open();
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
                // this.setState({ isShowDeleteOrderModal: true });
                // this.deleteModal && this.deleteModal.open();
                Alert.alert('',`确定删除此订单？`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            console.log(this.state.menu);
                            Toast.showLoading();
                            OrderApi.deleteOrder({ orderNo: this.state.viewData[this.state.index].orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除！');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });
                        }}

                ], { cancelable: true });
                break;
        }

    };
}
