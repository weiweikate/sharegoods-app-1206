import React, { Component } from 'react';
import {
    View, Alert, DeviceEventEmitter, Keyboard, TouchableWithoutFeedback,
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import RefreshList from '../../../components/ui/RefreshList';
import constants from '../../../constants/constants';
import StringUtils from '../../../utils/StringUtils';
import GoodsListItem from './GoodsListItem';
import SingleSelectionModal from './BottomSingleSelectModal';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import Toast from '../../../utils/bridge';
import OrderApi from '../api/orderApi';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
// import userOrderNum from '../../../model/userOrderNum';
import DesignRule from '../../../constants/DesignRule';
import MineApi from '../../mine/api/MineApi';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';
import user from '../../../model/user';

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
            CONFIG: [],
            isError: false,
            errMsgText: '发生错误',
            allData: []
        };
        this.currentPage = 1;
        this.noMoreData = false;
        this.isFirst = true;
        this.isRefresh = false;
    }

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                orderNum={item.orderNo}
                orderStatus={item.orderStatus}
                orderProduct={item.orderProduct}
                shutOffTime={item.cancelTime}
                totalPrice={item.totalPrice}
                quantity={item.quantity}
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

    renderError() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <Image source={res.placeholder.netError}
                           style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                           resizeMode={'contain'}/>
                    <Text style={styles.titleStyle} allowFontScaling={false}>
                        {this.state.errMsgText}
                    </Text>
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnStyle}
                                      onPress={() => this.getDataFromNetwork()}>
                        <Text style={{
                            color: DesignRule.bgColor_btn,
                            fontSize: DesignRule.fontSize_mediumBtnText
                        }} allowFontScaling={false}>
                            重新加载
                        </Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                {this.state.isError ? this.renderError() : <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    initialNumToRender={5}
                    emptyTip={'暂无订单'}
                    emptyIcon={emptyIcon}
                    ListHeaderComponent={<View style={{ height: 10 }}/>}
                />}
                {this.renderModal()}
            </View>
        );
    }

    renderModal = () => {
        return (
            <View>
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
                            cancelReason: this.state.CONFIG[index],
                            orderNo: this.state.viewData[this.state.index].orderNo,
                            cancelType: 2,
                            platformRemarks: null
                        }).then((response) => {
                            Toast.hiddenLoading();
                            if (response.code === 10000) {
                                Toast.$toast('订单已取消');
                                track(trackEvent.cancelPayOrder, {
                                    orderID: this.state.allData[this.state.index].orderNo,
                                    orderAmount: this.state.allData[this.state.index].orderAmount
                                    ,
                                    actualPaymentAmount: this.state.allData[this.state.index].payAmount,
                                    paymentMethod: null,
                                    ifUseYiYuan: this.state.allData[this.state.index].tokenCoinAmount > 0 ? true : false,
                                    ifUseCoupons: this.state.allData[this.state.index].couponAmount > 0 ? true : false,
                                    couponsName: '',
                                    couponsAmount: this.state.allData[this.state.index].couponAmount,
                                    yiYuanCouponsAmount: this.state.allData[this.state.index].tokenCoinAmount,
                                    transportationCosts: this.state.allData[this.state.index].freightAmount,
                                    deliveryMethod: '',
                                    storeCode: user.storeCode ? user.storeCode : ''
                                });
                                index = -1;
                                this.onRefresh();
                            } else {
                                Toast.$toast(response.msg);
                            }
                        }).catch(e => {
                            Toast.hiddenLoading();
                            Toast.$toast(e.msg);
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
                spec: item.specValues.replace(/@/g, ''),
                imgUrl: item.specImg,
                price: StringUtils.formatMoneyString(item.unitPrice),
                num: item.quantity,
                status: item.status,
                orderType: item.subStatus,
                prodCode: item.prodCode,
                skuCode: item.skuCode
            });
        });
        return arrData;
    };
    getPlatformProduct = (list) => {
        let arrData = [];
        list.map((unit, index) => {
            unit.products.map((item) => {
                arrData.push({
                    id: item.id,
                    productId: item.prodCode,
                    productName: item.productName,
                    spec: item.specValues.replace(/@/g, ''),
                    imgUrl: item.specImg,
                    price: StringUtils.formatMoneyString(item.unitPrice),
                    num: item.quantity,
                    status: item.status,
                    orderType: item.subStatus,
                    prodCode: item.prodCode,
                    skuCode: item.skuCode
                });
            });
        });
        return arrData;
    };
    getList = (data) => {
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        if (StringUtils.isNoEmpty(data) && StringUtils.isNoEmpty(data.data)) {
            data.data.map((item, index) => {
                if (item.warehouseOrderDTOList[0].status === 1) {//未付款的
                    arrData.push({
                        orderProduct: this.getPlatformProduct(item.warehouseOrderDTOList),
                        orderNo: item.platformOrderNo,
                        quantity: item.quantity,
                        orderStatus: 1,
                        totalPrice: item.payAmount,
                        nowTime: item.nowTime,
                        cancelTime: item.warehouseOrderDTOList[0].cancelTime,
                        outTradeNo: item.warehouseOrderDTOList[0].outTradeNo,
                        orderAmount: item.orderAmount

                    });

                } else {
                    item.warehouseOrderDTOList.map((resp, index1) => {
                        arrData.push({
                            orderProduct: this.getOrderProduct(resp.products),
                            orderNo: resp.warehouseOrderNo,
                            cancelTime: resp.cancelTime,
                            quantity: this.totalAmount(resp.products),
                            orderType: resp.subStatus,
                            orderStatus: resp.status,
                            totalPrice: resp.payAmount,
                            expList: resp.expList || [],
                            nowTime: resp.nowTime,
                            unSendProductInfoList: resp.unSendProductInfoList || [],
                            outTradeNo: resp.outTradeNo
                        });
                    });
                }

            });
        } else {
            this.noMoreData = true;
        }
        // this.setState({ viewData: arrData }, this.timeDown);
        this.setState({ viewData: arrData });
    };

    totalAmount(data) {
        let num = 0;
        data.map((item) => {
            num = num + item.quantity;
        });
        return num;
    }

    componentDidMount() {
        //网络请求，业务处理
        if (this.isFirst) {
            this.getDataFromNetwork();
        }
        this.getCancelOrder();
        DeviceEventEmitter.addListener('OrderNeedRefresh', () => this.onRefresh());
        // this.timeDown();
    }

    getCancelOrder() {
        let arrs = [];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(resp => {
            if (resp.code === 10000 && StringUtils.isNoEmpty(resp.data)) {
                resp.data.map((item, i) => {
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

    handleDatas() {
        let params = {
            page: this.currentPage,
            size: constants.PAGESIZE,
            keywords: null,
            orderNo: null
        };
        let status = null;
        if (this.state.pageStatus > 0) {
            status = this.state.pageStatus;
        }
        OrderApi.queryPage({ ...params, status: status }).then((response) => {
            Toast.hiddenLoading();
            this.setState({ allData: response.data ? response.data.data : [] });
            this.getList(response.data);
            console.log(response);
            this.setState({ isEmpty: response.data.totalNum === 0, isError: false });
            this.isFirst = false;
        }).catch(e => {
            Toast.hiddenLoading();
            Toast.$toast(e.msg);
            if (e.code === 10009) {
                this.props.nav('login/login/LoginPage');
            }
            this.setState({ isError: true, errMsgText: e.msg || '未知错误' });
        });
    }

    getDataFromNetwork = () => {
        console.log('orderlistrefresh');
        // userOrderNum.getUserOrderNum();
        if (!this.isRefresh) {
            Toast.showLoading('加载中...');
        }
        this.isRefresh = false;
        if (this.props.orderNum) {
            OrderApi.queryPage({
                keywords: this.props.orderNum,
                page: this.currentPage,
                size: constants.PAGESIZE,
                status: null,
                orderNo: null
            }).then((response) => {
                Toast.hiddenLoading();
                this.isFirst = false;
                this.setState({ allData: response.data ? response.data.data : [] });
                this.getList(response.data);
                this.setState({ isEmpty: response.data.totalNum === 0, isError: false });
            }).catch(e => {
                Toast.hiddenLoading();
                this.setState({ isError: true, errMsgText: e.msg || '未知错误' });
                Toast.$toast(e.msg);
            });

            return;
        }
        this.handleDatas();
    };

    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab != this.state.pageStatus) {
            this.getDataFromNetwork();
        }
    }

    onRefresh = () => {
        console.log('onRefresh', this.currentPage);
        this.currentPage = 1;
        this.isRefresh = true;
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
                if (this.state.CONFIG.length > 0) {
                    this.setState({ isShowSingleSelctionModal: true });
                    this.cancelModal && this.cancelModal.open();
                } else {
                    Toast.$toast('无取消理由');
                }

                break;
            case 2:
                console.log('payment/PaymentMethodPage2', this.state.viewData[index]);
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].outTradeNo,
                    amounts: this.state.viewData[index].totalPrice
                });
                break;
            case 3:
                console.log('payment/PaymentMethodPage3', this.state.viewData[index]);
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData[index].outTradeNo,
                    amounts: this.state.viewData[index].totalPrice
                });
                break;
            case 4:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNo: this.state.viewData[index].orderNo,
                    amounts: this.state.viewData[index].price
                });
                break;
            case 5:
                if (this.state.viewData[index].expList.length === 0) {
                    Toast.$toast('当前物流信息不存在');
                }
                else if (this.state.viewData[index].expList.length === 1 && this.state.viewData[index].unSendProductInfoList.length == 0) {
                    this.props.nav('order/logistics/LogisticsDetailsPage', {
                        expressNo: this.state.viewData[index].expList[0].expNO
                    });
                } else {
                    this.props.nav('order/logistics/CheckLogisticsPage', {
                        expressList: this.state.viewData[index].expList,
                        unSendProductInfoList: this.state.viewData[index].unSendProductInfoList
                    });
                }
                break;
            case 6:
                console.log(this.state.viewData[index]);
                Alert.alert('', `是否确认收货?`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.confirmReceipt({ orderNo: this.state.viewData[index].orderNo }).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast('确认收货成功');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });
                        }
                    }

                ], { cancelable: true });
                break;
            case 7:
                Alert.alert('', `确定删除此订单？`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            console.log(this.state.menu);
                            Toast.showLoading();
                            OrderApi.deleteOrder({ orderNo: this.state.viewData[index].orderNo }).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast('订单已删除！');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });
                        }
                    }

                ], { cancelable: true });
                break;
            case 8:
                let cartData = [];
                this.state.viewData[index].orderProduct.map((item, index) => {
                    cartData.push({
                        productCode: item.prodCode,
                        skuCode: item.skuCode,
                        amount: item.num,
                        spuCode: item.prodCode
                    });
                });
                shopCartCacheTool.addGoodItem(cartData);
                this.props.nav('shopCart/ShopCart', { hiddeLeft: false });
                break;
            case 9:
                Alert.alert('', `确定删除此订单？`, [
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
                                Toast.$toast('订单已删除！');
                                this.onRefresh();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });
                        }
                    }

                ], { cancelable: true });
                break;
        }

    };
}

const styles = StyleSheet.create({
    errContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 10,
        textAlign: 'center'
    },
    btnText: {
        fontSize: 15,
        color: DesignRule.mainColor,
        textAlign: 'center'
    },
    btnStyle: {
        height: 36,
        width: 115,
        borderRadius: 18,
        borderColor: DesignRule.bgColor_btn,
        borderWidth: DesignRule.lineHeight * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    }
});
