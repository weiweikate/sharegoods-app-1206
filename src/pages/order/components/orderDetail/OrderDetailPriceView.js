import React, { Component } from "react";
import {
    View,
    Text,
    Image, StyleSheet, TouchableOpacity
} from "react-native";
import { orderDetailAfterServiceModel, orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from "mobx-react/native";
import StringUtils from "../../../../utils/StringUtils";
import UserSingleItem from "../UserSingleItem";
import res from "../../res";
import DesignRule from "DesignRule";

const couponIcon = res.coupons_icon;

@observer
export default class OrderDetailPriceView extends Component {

    renderGiftAfterSales = () => {
        return (
            <View>
                {orderDetailAfterServiceModel.currentAsList.length === 0 ? null :
                    <View>
                        <View style={{
                            flexDirection: "row",
                            height: 48,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            backgroundColor: "white"
                        }}>
                            {this.renderMenus()}
                        </View>
                        {this.renderLine()}
                    </View>
                }
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    renderMenus = () => {
        let itemArr = [];
        for (let i = 0; i < orderDetailAfterServiceModel.currentAsList.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i}
                                  style={[styles.grayView, { borderColor: orderDetailAfterServiceModel.currentAsList[i].isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                  onPress={() => {
                                      this.afterSaleServiceClick(orderDetailAfterServiceModel.currentAsList[i], i);
                                  }}>
                    <Text
                        style={[styles.grayText, { color: orderDetailAfterServiceModel.currentAsList[i].isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }]}>{orderDetailAfterServiceModel.currentAsList[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };

    render() {
        return (
            <View style={{ backgroundColor: "white", paddingTop: 10 }}>
                {orderDetailModel.orderType === 5 ? this.renderGiftAfterSales() : null}
                {(orderDetailModel.orderType === 5 || orderDetailModel.orderType === 98) && this.props.giftBagCoupons.length > 0 ?
                    <View>
                        {this.renderLine()}
                        {this.props.giftBagCoupons.map((item, index) => {
                            return <View style={{ backgroundColor: "white" }} key={index}>
                                {index === 0 ? <Image source={couponIcon} style={styles.couponsIconStyle}/> : null}
                                <View style={styles.couponsOuterStyle}>
                                    <Text style={styles.couponsTextStyle}>{item.couponName}</Text>
                                    <Text style={[styles.couponsTextStyle, { marginRight: 14 }]}>x1</Text>
                                </View>
                                <View style={styles.couponsLineStyle}/>
                            </View>;
                        })}
                        {this.renderWideLine()}
                    </View>
                    :
                    null}
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={"商品总价"}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={StringUtils.formatMoneyString(this.props.goodsPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={"运费（快递）"}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={StringUtils.formatMoneyString(this.props.freightPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={"优惠券优惠"}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={"-" + StringUtils.formatMoneyString(this.props.couponPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={"1元现金券"}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={"-" + StringUtils.formatMoneyString(this.props.tokenCoin)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 35 }} leftText={"订单总价"}
                                leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                                rightText={StringUtils.formatMoneyString(this.props.totalPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                                isArrow={false}
                                isLine={false}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    couponsIconStyle: {
        width: 15,
        height: 12,
        position: "absolute",
        left: 15,
        top: 12
    },
    couponsOuterStyle: {
        height: 34,
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 36
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        alignSelf: "center"
    },
    couponsLineStyle: {
        marginLeft: 36,
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: "100%"
    }
});

