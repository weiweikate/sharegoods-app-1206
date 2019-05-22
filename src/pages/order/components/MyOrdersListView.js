import React, { Component } from 'react';
import {
    View, Alert, Keyboard, TouchableWithoutFeedback,
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import constants from '../../../constants/constants';
import StringUtils from '../../../utils/StringUtils';
import GoodsListItem from './GoodsListItem';
import SingleSelectionModal from './BottomSingleSelectModal';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import Toast from '../../../utils/bridge';
import OrderApi from '../api/orderApi';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
// import userOrderNum from '../../../manager/userOrderNum';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';
// import user from '../../../manager/user';
import RouterMap from '../../../navigation/RouterMap';
import { payStatus, payment, payStatusMsg } from '../../payment/Payment';
import { NavigationActions } from 'react-navigation';
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';
import RefreshFlatList from '../../../comm/components/RefreshFlatList';
const emptyIcon = res.kongbeuye_dingdan;

@SmoothPushPreLoadHighComponent
export default class MyOrdersListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeOff: [],//待付款时间
            pageStatus: this.props.pageStatus,
        };
        this.itemIndex = -1; //用于
        this.item = {};

    }

    render() {
        let { pageStatus } = this.state;
        let params ={
            status: pageStatus > 0? pageStatus: '',
            commentStatus:  pageStatus > 3 ? true : '',
            keywords: this.props.keywords || '',
            orderNo: ''
        };
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                <RefreshFlatList
                    ref={ref=> {this.list = ref}}
                    url={OrderApi.queryPage}
                    paramsFunc={()=> {return params}}
                    renderItem={this.renderItem}
                    renderError={(error) => this.renderError(error)}
                    defaultEmptyImage={emptyIcon}
                    defaultEmptyText={'暂无订单'}
                    renderHeader={()=>{return <View style={{ height: 10 }}/>}}
                    handleRequestResult={(data)=>{return this.getList(data.data)}}
                    onStartRefresh={()=> {Toast.showLoading()}}
                    onEndRefresh={() => {Toast.hiddenLoading()}}
                />
                {this.renderModal()}
            </View>
        );
    }

    onRefresh = () => {
        this.list && this.list.onRefresh();
    }

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                orderNum={item.orderNo}
                orderStatus={item.orderStatus}
                warehouseType={item.warehouseType}
                subStatus={item.subStatus}
                orderProduct={item.orderProduct}
                shutOffTime={item.cancelTime}
                totalPrice={item.totalPrice}
                quantity={item.quantity}
                nowTime={item.nowTime}
                orderCreateTime={item.createTime}
                clickItem={() => {
                    this.clickItem(item);
                }}
                commentStatus={item.commentStatus || false}
                goodsItemClick={() => this.clickItem(item)}
                operationMenuClick={(menu) => this.operationMenuClick(menu, index, item)}
                status={item.status}
                callBack={() => {
                    // this.onRefresh();
                }}
            />
        );
    };

    renderError(error) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <Image source={res.placeholder.netError}
                           style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                           resizeMode={'contain'}/>
                    <Text style={styles.titleStyle} allowFontScaling={false}>
                        {error.msg}
                    </Text>
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnStyle}
                                      onPress={() => this.onRefresh()}>
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

    renderModal = () => {
        return (
            <SingleSelectionModal
                ref={(ref) => {
                    this.cancelModal = ref;
                }}
                detail={this.props.cancelReasons}
                commit={(index) => {
                    Toast.showLoading();
                    OrderApi.cancelOrder({
                        cancelReason: this.props.cancelReasons[index],
                        orderNo: this.item.orderNo,
                        cancelType: 2,
                        platformRemarks: null
                    }).then((response) => {
                        Toast.hiddenLoading();
                        if (response.code === 10000) {
                            Toast.$toast('订单已取消');
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

        );
    };

    cancelOrder = () => {

    }
    //多商品订单列表 maybe
    getOrderProduct = (list) => {
        let arrData = [];
        list.map((item, index) => {
            arrData.push({
                id: item.id,
                productId: item.prodCode,
                productName: item.productName,
                spec: item.spec,
                imgUrl: item.specImg,
                price: StringUtils.formatMoneyString(item.unitPrice),
                num: item.quantity,
                status: item.status,
                orderType: item.subStatus,
                prodCode: item.prodCode,
                skuCode: item.skuCode,
                activityCodes:item.activityCodes,
                afterSaleTime: item.afterSaleTime,
                orderCustomerServiceInfoDTO: item.orderCustomerServiceInfoDTO
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
                    spec: item.spec,
                    imgUrl: item.specImg,
                    price: StringUtils.formatMoneyString(item.unitPrice),
                    num: item.quantity,
                    status: item.status,
                    orderType: item.subStatus,
                    prodCode: item.prodCode,
                    skuCode: item.skuCode,
                    activityCodes:item.activityCodes
                });
            });
        });
        return arrData;
    };
    getList = (data) => {
        let arrData = [];
        if (StringUtils.isNoEmpty(data) && StringUtils.isNoEmpty(data.data)) {
            data.data.map((item, index) => {
                if (item.warehouseOrderDTOList[0].status === 1) {//未付款的
                    arrData.push({
                        orderProduct: this.getPlatformProduct(item.warehouseOrderDTOList),
                        orderNo: item.platformOrderNo,
                        quantity: item.quantity,
                        orderStatus: 1,
                        subStatus:item.warehouseOrderDTOList[0].subStatus,
                        warehouseType:item.warehouseOrderDTOList[0].warehouseType,
                        totalPrice: item.payAmount,
                        nowTime: item.nowTime,
                        cancelTime: item.warehouseOrderDTOList[0].cancelTime,
                        createTime: item.warehouseOrderDTOList[0].createTime,
                        outTradeNo: item.warehouseOrderDTOList[0].outTradeNo,
                        orderAmount: item.orderAmount,
                        commentStatus: item.commentStatus,
                        platformOrderNo: item.platformOrderNo
                    });

                } else {
                    item.warehouseOrderDTOList.map((resp, index1) => {
                        arrData.push({
                            orderProduct: this.getOrderProduct(resp.products),
                            orderNo: resp.warehouseOrderNo,
                            cancelTime: resp.cancelTime,
                            createTime: resp.createTime,
                            quantity: this.totalAmount(resp.products),
                            orderType: resp.subStatus,
                            orderStatus: resp.status,
                            subStatus:item.warehouseOrderDTOList[0].subStatus,
                            warehouseType:item.warehouseOrderDTOList[0].warehouseType,
                            totalPrice: resp.payAmount,
                            expList: resp.expList || [],
                            nowTime: item.nowTime,
                            unSendProductInfoList: resp.unSendProductInfoList || [],
                            outTradeNo: resp.outTradeNo,
                            commentStatus: resp.commentStatus,
                            platformOrderNo: item.platformOrderNo
                        });
                    });
                }

            });
        }

        return arrData;
    };

    totalAmount(data) {
        let num = 0;
        data.map((item) => {
            num = num + item.quantity;
        });
        return num;
    }

    componentDidMount() {

    }

    clickItem = (data) => {
        let orderStatus = data.orderStatus;
        if (orderStatus > (constants.pageStateString.length + 1)) {
            Toast.$toast('订单已结束');
        } else {
            this.props.nav('order/order/MyOrdersDetailPage', {
                orderNo: data.orderNo
            });
        }
    };
    operationMenuClick = (menu, index, data) => {
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
        this.itemIndex = index;
        this.item = data;
        switch (menu.id) {
            case 1:
                if (this.props.cancelReasons.length > 0) {
                    this.cancelModal && this.cancelModal.open();
                } else {
                    Toast.$toast('无取消理由');
                }

                break;
            case 2:
                this._goToPay(index);
                break;
            case 3:
                this._goToPay(index);
                break;
            case 4:
                this._goToPay(index);
                break;
            case 5:
                if (StringUtils.isEmpty(data.expList)) {
                    Toast.$toast('当前物流信息不存在');
                }
                else if (data.expList.length === 1 && data.unSendProductInfoList.length === 0) {
                    this.props.nav('order/logistics/LogisticsDetailsPage', {
                        expressNo: data.expList[0].expNO
                    });
                } else {
                    this.props.nav('order/logistics/CheckLogisticsPage', {
                        expressList: data.expList,
                        unSendProductInfoList: data.unSendProductInfoList
                    });
                }
                break;
            case 6:
                console.log(data);
                let content = `确定收到货了吗?`;
                data.orderProduct.map((value) => {
                    if (value.status < 3) {
                        content = '您还有商品未发货，确认收货吗？';
                    }
                });
                Alert.alert('', `${content}`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.confirmReceipt({ orderNo: data.orderNo }).then((response) => {
                                Toast.hiddenLoading();
                                this.props.nav('order/order/ConfirmReceiveGoodsPage', {
                                    orderNo: data.orderNo
                                });
                                Toast.$toast('确认收货成功');
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
                            OrderApi.deleteOrder({ orderNo: data.orderNo }).then((response) => {
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
                data.orderProduct.map((item, index) => {
                    cartData.push({
                        productCode: item.prodCode,
                        skuCode: item.skuCode,
                        amount: item.num,
                        spuCode: item.prodCode
                    });
                });
                track(trackEvent.OrderAgain,{
                    orderId:data.orderNo, })
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
                            OrderApi.deleteOrder({ orderNo: data.orderNo }).then((response) => {
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
            case 10:
                OrderApi.checkInfo({ warehouseOrderNo: data.orderNo }).then(res => {
                    if (res.data) {
                        this.props.nav(RouterMap.P_ScorePublishPage, {
                            orderNo: data.orderNo
                        });
                    } else {
                        Toast.$toast('该商品已晒过单！');
                        this.onRefresh();
                    }

                }).catch(e => {
                    Toast.$toast(e.msg);
                });
                break;
            case 99:
                this.clickItem(data)
                break
        }

    };

    async _goToPay(index) {
        let payData = this.state.viewData[index];
        const { platformOrderNo, orderNo, totalPrice, orderProduct } = payData;
        const {productName} = orderProduct;
        console.log('_goToPay', payData);
        //从订单发起的都是普通支付
        let result = await payment.checkOrderStatus(platformOrderNo,0,0,totalPrice,productName);
        // return;
        if (result.code === payStatus.payNo) {
            this.props.nav('payment/PaymentPage', {
                orderNum: orderNo,
                amounts: totalPrice,
                platformOrderNo: platformOrderNo,
                orderProductList: orderProduct
            });
        } else if (result.code === payStatus.payNeedThrid) {
            this.props.nav('payment/ChannelPage', {
                remainMoney: Math.floor(result.unpaidAmount * 100) / 100,
                orderNum: orderNo,
                platformOrderNo: platformOrderNo,
                orderProductList: orderProduct
            });
        } else if (result.code === payStatus.payOut) {
            Toast.$toast(payStatusMsg[result.code]);
            let replace = NavigationActions.replace({
                key: this.props.navigation.state.key,
                routeName: 'order/order/MyOrdersListPage',
                params: { index: 2 }
            });
            this.props.navigation.dispatch(replace);
        } else {
            Toast.$toast(payStatusMsg[result.code] || '系统处理失败');
        }
    }
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
