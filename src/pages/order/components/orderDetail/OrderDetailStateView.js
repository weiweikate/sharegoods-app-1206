import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import {
    UIText, UIImage
} from "../../../../components/ui";
import StringUtils from "../../../../utils/StringUtils";
import DateUtils from "../../../../utils/DateUtils";
import DesignRule from "DesignRule";
import res from "../../res";
import {  orderDetailAfterServiceModel, orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from 'mobx-react/native';
const arrow_right = res.arrow_right;
const logisticCar = res.car;
const position = res.dizhi_icon;
import ScreenUtil from "../../../../utils/ScreenUtils";

const { px2dp } = ScreenUtil;

@observer
export default class OrderDetailStateView extends Component {
    constructor(props) {
        super(props);
    }

    go2Logistics(){
        if(orderDetailModel.expList.length === 0){
            // orderDetailAfterServiceModel.totalAsList.sellerState='';
        }else if( orderDetailModel.expList.length === 1&&orderDetailModel.unSendProductInfoList.length===0){
            this.props.nav("order/logistics/LogisticsDetailsPage", {
                expressNo: orderDetailModel.expList[0].expNO
            })
        }else {
            this.props.nav("order/logistics/CheckLogisticsPage", {
                expressList: orderDetailModel.expList,
                unSendProductInfoList:orderDetailModel.unSendProductInfoList
            });
        }

    }
    render() {
        if(orderDetailModel.expList.length > 1){
            orderDetailAfterServiceModel.totalAsList.sellerState = `该订单已拆成${orderDetailModel.expList.length+orderDetailModel.unSendProductInfoList.length}个包裹发出，点击"查看物流"可查看详情`
        }
        if (orderDetailModel.status === 1) {
            return (
                <View style={styles.topOrderDetail}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <UIImage source={position}
                                 style={{ height: px2dp(19), width: px2dp(19), marginLeft: px2dp(21) }} resizeMode={'contain'}/>
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <View style={{
                                flexDirection: "row",
                                marginLeft: px2dp(10),
                                justifyContent: "flex-end",
                                marginRight: px2dp(15)
                            }}>
                                <Text style={{
                                    flex: 1,
                                    fontSize: px2dp(15)
                                }}>{orderDetailModel.receiver}</Text>
                                <Text style={{
                                    fontSize: px2dp(15),
                                    marginRight: px2dp(30)
                                }}>{orderDetailModel.receiverPhone}</Text>
                            </View>
                            {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.sellerTime) ?
                                <UIText value={orderDetailAfterServiceModel.totalAsList.sellerTime}
                                        style={styles.DetailAddressStyle}/>
                                : null}
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <TouchableOpacity style={styles.topOrderDetail} onPress={() => this.go2Logistics()
                } disabled={!orderDetailModel.expList.length} activeOpacity={1}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <UIImage source={logisticCar}
                                 style={{ height: px2dp(19), width: px2dp(19), marginLeft: px2dp(21) }}/>
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <View style={{ marginLeft: px2dp(10) }}>
                                <UIText value={orderDetailAfterServiceModel.totalAsList.sellerState} style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: px2dp(15),
                                    marginRight: px2dp(46)
                                }}/>
                                {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.logisticsTime) ?
                                    <UIText style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: px2dp(15),
                                        marginTop: px2dp(3)
                                    }}
                                    value={DateUtils.getFormatDate(orderDetailAfterServiceModel.totalAsList.logisticsTime / 1000)}/> : null}
                            </View>
                            <View />
                        </View>
                        <UIImage source={arrow_right}
                                 style={{ height: px2dp(14), width: px2dp(10), marginRight: px2dp(11) }}
                                 resizeMode={"contain"}/>
                    </View>

                </TouchableOpacity>
            );
        }


    }
}
const styles = StyleSheet.create({
    topOrderDetail: {
        minHeight: px2dp(81),
        marginTop: px2dp(69),
        backgroundColor: "white",
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        borderRadius: px2dp(10),
        justifyContent: "center"
    },
    leftTextStyle: {
        flex: 1,
        fontSize: px2dp(15),
        color: DesignRule.textColor_instruction
    },
    phoneStyle: {
        fontSize: px2dp(15),
        marginLeft: px2dp(25),
        color: DesignRule.textColor_instruction
    },
    DetailAddressStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(10),
        marginRight: px2dp(55),
        marginTop: px2dp(5)
    }
});
