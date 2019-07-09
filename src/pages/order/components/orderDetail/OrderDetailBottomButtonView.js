import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Alert
} from "react-native";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
import { orderDetailModel, assistDetailModel } from "../../model/OrderDetailModel";
import OrderApi from "../../api/orderApi";
import Toast from "../../../../utils/bridge";
import { observer } from "mobx-react";
import RouterMap, { replaceRoute, routePop, routePush } from '../../../../navigation/RouterMap';
import { payStatus, payment, payStatusMsg } from "../../../payment/Payment";

const { px2dp } = ScreenUtils;
import { MRText as Text, NoMoreClick, UIText } from "../../../../components/ui";
import { clickOrderAgain, clickOrderConfirmReceipt, clickOrderLogistics } from '../../order/CommonOrderHandle';

@observer
export default class OrderDetailBottomButtonView extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        showDele: false
    };

    render() {
        let nameArr = [...orderDetailModel.menu];
        if (nameArr.length > 0) {
            if (nameArr.length === 4) {
                return (
                    <View style={styles.containerStyle}>
                        <View style={{
                            height: px2dp(48),
                            marginRight: 6,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <UIText value={"更多"} style={{ color: DesignRule.textColor_secondTitle, fontSize: 13 }}
                                    onPress={
                                       this.props.switchButton
                                    }/>
                        </View>
                        {nameArr.map((item, i) => {
                            if (i === 0){
                                return <View />
                            }
                            return <NoMoreClick key={i}
                                                style={[styles.touchableStyle, { borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                                onPress={() => {
                                                    this.operationMenuClick(item);
                                                }}>
                                <Text
                                    style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}
                                    allowFontScaling={false}>{item.operation}</Text>
                            </NoMoreClick>;
                        })}
                    </View>
                );
            } else {
                let datas=[];
                if (orderDetailModel.status === 4) {
                   datas=[
                    {
                        id: 7,
                            operation: "删除订单",
                        isRed: false
                    },{
                           id: 5,
                           operation: "查看物流",
                           isRed: false
                       }, {
                        id: 8,
                            operation: "再次购买",
                            isRed: true
                    }
                    ]
                }else {
                    datas=nameArr;
                }
                return (
                    <View style={styles.containerStyle}>
                        {datas.map((item, i) => {
                            return <NoMoreClick key={i}
                                                style={[styles.touchableStyle, { borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                                onPress={() => {
                                                    this.operationMenuClick(item);
                                                }}>
                                <Text
                                    style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}
                                    allowFontScaling={false}>{item.operation}</Text>
                            </NoMoreClick>;
                        })}
                    </View>
                );
            }

        } else {
            return null;
        }

    }

    operationMenuClick = (menu) => {
        /*
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
        switch (menu.id) {
            case 1:
                if (assistDetailModel.cancelArr.length > 0) {
                    this.props.openCancelModal&&this.props.openCancelModal();
                } else {
                    Toast.$toast("无取消类型！");
                }

                break;
            case 2:
                this.props.openCancelModal&&this.props.openCancelModal(()=> {this._goToPay()});
                break;
            case 3:
                this.props.openCancelModal&&this.props.openCancelModal(()=> {this._goToPay()});
                break;
            case 4:
                break;
            case 5:
                clickOrderLogistics(orderDetailModel.merchantOrderNo)
                break;
            case 6:
                clickOrderConfirmReceipt(orderDetailModel.merchantOrderNo,orderDetailModel.merchantOrder.subStatus, ()=> {
                    this.props.dataHandleConfirmOrder && this.props.dataHandleConfirmOrder();//本地修改列表数据状态到交易完成
                    orderDetailModel.dataHandleConfirmOrder();//本地修改详情状态到交易完成
                })
                break;
            case 8:
                clickOrderAgain(orderDetailModel.merchantOrderNo, orderDetailModel.productsList());
                break;
            case 7:
            case 9:
                this.deleteOrder();
                break;
            case 10:
                OrderApi.checkInfo({warehouseOrderNo:orderDetailModel.merchantOrderNo}).then(res => {
                    if(res.data === false){
                        routePush(RouterMap.P_ScorePublishPage, {
                            orderNo: orderDetailModel.merchantOrderNo
                        })
                    }else{
                        Toast.$toast('该商品已晒过单！');
                        this.props.loadPageData()
                    }

                }).catch(e =>{
                    Toast.$toast(e.msg);
                })

                break;
        }
    };

    deleteOrder(){
        Alert.alert("", `确定删除此订单吗?`, [
            {
                text: `取消`, onPress: () => {
                }
            },
            {
                text: `确定`, onPress: () => {
                    Toast.showLoading();
                    OrderApi.deleteOrder({ merchantOrderNo: orderDetailModel.merchantOrderNo }).then((response) => {
                        Toast.hiddenLoading();
                        Toast.$toast("订单已删除");
                        this.props.dataHandleDeleteOrder&&this.props.dataHandleDeleteOrder()
                        routePop()
                    }).catch(e => {
                        Toast.hiddenLoading();
                        Toast.$toast(e.msg);
                    });
                }
            }

        ], { cancelable: true });
    }

    async _goToPay() {
        let orderProductList = orderDetailModel.productsList();
        let platformOrderNo = orderDetailModel.platformOrderNo
        let merchantOrderNo = orderDetailModel.merchantOrderNo
        let result = await payment.checkOrderStatus(platformOrderNo,0,0,0,'')
        if (result.code === payStatus.payNo) {
            routePush("payment/PaymentPage", {
                orderNum: merchantOrderNo,
                amounts: result.unpaidAmount,
                platformOrderNo: platformOrderNo,
                orderProductList: orderProductList
            });
        } else if (result.code === payStatus.payNeedThrid) {
            routePush('payment/ChannelPage', {
                remainMoney: Math.floor(result.unpaidAmount * 100) / 100,
                orderProductList: orderProductList,
                orderNum: merchantOrderNo,
                platformOrderNo: platformOrderNo,
            })
        } else if (result.code === payStatus.payOut) {
            Toast.$toast(payStatusMsg[result.code])
            replaceRoute( 'order/order/MyOrdersListPage',
                 { index: 2 })
        } else {
            Toast.$toast(payStatusMsg[result.code])
        }
    }
}
const styles = StyleSheet.create({
    containerStyle: {
        height: px2dp(48), flexDirection: "row", alignItems: "center",
        justifyContent: "flex-end", backgroundColor: "white", marginTop: 1
    },
    touchableStyle: {
        borderWidth: 1,
        height: px2dp(30),
        borderRadius: px2dp(15),
        marginRight: px2dp(15),
        justifyContent: "center",
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20)
    }
});
