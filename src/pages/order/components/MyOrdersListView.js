import React, { Component } from 'react';
import { View } from 'react-native';
import RefreshList from '../../../components/ui';
import constants from '../../../constants/constants';
import StringUtils from '../../../utils/StringUtils';
import GoodsListItem from './GoodsListItem';
import NoMessage from '../../../comm/res/empty_list_message.png';
import user from '../../../model/user';
import SingleSelectionModal from './BottomSingleSelectModal';
import CommonTwoChoiceModal from './CommonTwoChoiceModal';
import Toast from '../../../utils/bridge';
import OrderApi from 'OrderApi';

export default class MyOrdersListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewData: [
                // {
                //     id:49,
                //     orderNum:'2018070250371039050793800',
                //     expressNo:'',
                //     orderCreateTime:1530470345000,
                //     orderStatus:0,
                //     freightPrice:2092,
                //     totalPrice:3000,
                //     orderProduct:[
                //         {
                //             id:52,
                //             productId:null,
                //             productName:null,
                //             spec:'175kg-22cm-狂野',
                //             specImg:null,
                //             price:1600,
                //             num:2,
                //             status:1,
                //         },
                //     ],
                //     pickedUp:2,//2为自提，1为快递
                // },
            ],
            pageStatus: this.props.pageStatus,
            isEmpty: false,
            currentPage: 1,
            isShowDeleteOrderModal: false,
            isShowSingleSelctionModal: false,
            isShowReceiveGoodsModal: false,
            menu: {},
            index: -1
        };
    }

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                id={item.id}
                orderNum={item.orderNum}
                orderCreateTime={item.orderCreateTime}
                orderStatus={item.orderStatus}
                freightPrice={item.freightPrice}
                totalPrice={item.totalPrice}
                orderProduct={item.orderProduct}
                clickItem={() => {
                    this.clickItem(index);
                }}
                goodsItemClick={() => this.clickItem(index)}
                operationMenuClick={(menu) => this.operationMenuClick(menu, index)}
                outTrandNo={item.outTrandNo}
            />
        );
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <RefreshList
                    style={{ backgroundColor: '#F6F6F6' }}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    emptyIcon={NoMessage}
                    emptyTip={'暂无数据!'}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    isHideFooter={true}
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
                    detail={{ title: '删除订单', context: '确定删除此订单吗', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                        if (this.state.menu.id == 7) {
                            Toast.showLoading();
                            OrderApi.deleteOrder({ orderId: this.state.viewData[this.state.index].id }).then((response) => {
                                Toast.hiddenLoading();
                                if (response.ok) {
                                    Toast.$toast('订单已删除');
                                    this.getDataFromNetwork();
                                } else {
                                    Toast.$toast(response.msg);
                                }
                            }).catch(e => {
                                Toast.$toast('' + e);
                            });
                        } else if (this.state.menu.id == 9) {
                            Toast.showLoading();
                            OrderApi.deleteClosedOrder({ orderId: this.state.viewData[this.state.index].id }).then((response) => {
                                Toast.hiddenLoading();
                                if (response.ok) {
                                    Toast.hiddenLoading();
                                    Toast.$toast('订单已删除');
                                    this.getDataFromNetwork();
                                } else {
                                    Toast.$toast(response.msg);
                                }
                            }).catch(e => {
                                Toast.$toast('' + e);
                            });
                        } else {
                            Toast.$toast('状态值异常，暂停操作');
                        }
                    }}
                    no={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                />
                <CommonTwoChoiceModal
                    isShow={this.state.isShowReceiveGoodsModal}
                    detail={{ title: '确认收货', context: '是否确认收货?', no: '取消', yes: '确认' }}
                    close={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                        Toast.showLoading();
                        OrderApi.confirmReceipt({ orderId: this.state.viewData[this.state.index].id }).then((response) => {
                            Toast.hiddenLoading();
                            if (response.ok) {
                                Toast.$toast('确认收货成功');
                                this.getDataFromNetwork();
                            } else {
                                Toast.$toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.$toast('' + e);
                        });
                    }}
                    no={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                />
                <SingleSelectionModal
                    isShow={this.state.isShowSingleSelctionModal}
                    detail={['我不想买了', '信息填写错误，重新拍', '其他原因']}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            buyerRemark: ['我不想买了', '信息填写错误，重新拍', '其他原因'][index],
                            orderNum: this.state.viewData[this.state.index].orderNum
                        }).then((response) => {
                            Toast.hiddenLoading();
                            if (response.ok) {
                                Toast.$toast('订单已取消');
                                this.getDataFromNetwork();
                            } else {
                                Toast.$toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.$toast('' + e);
                        });
                    }}
                />
            </View>

        );
    };
    getOrderProduct = (list) => {
        let arrData = [];
        list.map((item, index) => {
            arrData.push({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                spec: item.spec,
                imgUrl: item.imgUrl,
                price: StringUtils.formatMoneyString(item.price),
                num: item.num,
                status: item.status
            });
        });
        return arrData;
    };
    getList = (data) => {
        if (StringUtils.isNoEmpty(data)) {
            let arrData = this.state.currentPage == 1 ? [] : this.state.viewData;
            data.data.map((item, index) => {
                arrData.push({
                    id: item.id,
                    orderNum: item.orderNum,
                    expressNo: item.expressNo,
                    orderCreateTime: item.orderCreateTime,
                    orderStatus: item.orderStatus,
                    freightPrice: item.freightPrice,
                    totalPrice: item.totalPrice,
                    orderProduct: this.getOrderProduct(item.orderProduct),
                    pickedUp: item.pickedUp,
                    outTrandNo: item.outTrandNo
                });
            });
            this.setState({ viewData: arrData });
        }
    };

    componentDidMount() {
        //网络请求，业务处理
        this.getDataFromNetwork();
    }

    getDataFromNetwork = () => {
        let params = {
            dealerId: user.id,
            page: this.state.currentPage,
            pageSize: constants.PAGESIZE
        };
        Toast.showLoading();
        switch (this.state.pageStatus) {
            case 0:
                OrderApi.queryAllOrderPageList(params).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        Toast.hiddenLoading();
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.toast(e);
                });
                break;
            case 1:
                OrderApi.queryUnPaidOrderPageList(params).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        Toast.hiddenLoading();
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.$toast('' + e);
                });
                break;
            case 2:
                OrderApi.queryUnSendOutOrderPageList(params).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        Toast.hiddenLoading();
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.$toast('' + e);
                });
                break;
            case 3:
                OrderApi.queryWaitReceivingOrderPageList(params).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        Toast.hiddenLoading();
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.$toast('' + e);
                });
                break;
            case 4:
                OrderApi.queryCompletedOrderPageList(params).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        Toast.hiddenLoading();
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.$toast(e);
                });
                break;
            default:
                let orderNum = this.props.orderNum;
                OrderApi.queryAllOrderPageList({
                    dealerId: user.id,
                    page: this.state.currentPage,
                    pageSize: constants.PAGESIZE,
                    condition: orderNum
                }).then((response) => {
                    Toast.hiddenLoading();
                    if (response.ok) {
                        this.getList(response.data);
                        this.setState({ isEmpty: response.data && StringUtils.isNoEmpty(response.data) && response.data.length != 0 });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.$toast('' + e);
                });
                break;
        }
    };

    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab < 8) {
            console.log(nextProps.selectTab + '=======================');

        }
    }

    onLoadNumber = () => {
        this.props.onLoadNumber && this.props.onLoadTabNumber();
    };

    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork();
    };

    onLoadMore = (page) => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork();
    };
    clickItem = (index) => {
        let orderStatus = this.state.viewData[index].orderStatus;
        if (orderStatus > (constants.pageStateString.length + 1)) {
            Toast.$toast('订单已结束');
        } else {
            this.props.nav('order/order/MyOrdersDetailPage', {
                orderId: this.state.viewData[index].id,
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
        this.setState({ menu: menu, index: index });
        switch (menu.id) {
            case 1:
                this.setState({ isShowSingleSelctionModal: true });
                break;
            case 2:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    amounts: this.state.viewData[index].price
                });
                break;
            case 3:
                //订单 0:快递订单 1:自提订单
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].orderNum,
                    amounts: this.state.viewData[index].totalPrice + this.state.viewData[index].freightPrice,
                    orderType: this.state.viewData[index].pickedUp - 1
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
                    orderId: this.state.viewData[index].id,
                    expressNo: this.state.viewData[index].expressNo
                });
                break;
            case 6:
                this.setState({ isShowReceiveGoodsModal: true });
                break;
            case 7:
                this.setState({ isShowDeleteOrderModal: true });
                break;
            case 8:
                Toast.showLoading();
                OrderApi.orderOneMore({ orderId: this.state.viewData[index].id }).then((response) => {
                    if (response.ok) {
                        let cartData = [];
                        response.data.map((item, index) => {
                            cartData.push({ sareSpecId: item.id, productNumber: item.num });
                        });
                        OrderApi.shoppingCartFormCookieToSession({ jsonString: JSON.stringify(cartData) }).then((response) => {
                            Toast.hiddenLoading();
                            if (response.ok) {
                                Toast.hiddenLoading();
                                this.props.nav('shopCart/CartPage', { isInnerPage: true });
                            } else {
                                Toast.$toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.hiddenLoading();
                        });
                    } else {
                        Toast.$toast(response.msg);
                    }
                }).catch(e => {
                    Toast.hiddenLoading();
                });
                break;
            case 9:
                this.setState({ isShowDeleteOrderModal: true });
                break;
        }
    };
}


