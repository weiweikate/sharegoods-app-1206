import React, { Component } from "react";
import {
    View,
    Image, StyleSheet,
} from "react-native";
import { orderDetailAfterServiceModel, orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from "mobx-react/native";
import StringUtils from "../../../../utils/StringUtils";
import UserSingleItem from "../UserSingleItem";
import res from "../../res";
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text,NoMoreClick} from '../../../../components/ui';
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
                <NoMoreClick key={i}
                                  style={[styles.grayView, { borderColor: orderDetailAfterServiceModel.currentAsList[i].isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                  onPress={() => {
                                      this.afterSaleServiceClick(orderDetailAfterServiceModel.currentAsList[i], i);
                                  }}>
                    <Text
                        style={[styles.grayText, { color: orderDetailAfterServiceModel.currentAsList[i].isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }]} allowFontScaling={false}>{orderDetailAfterServiceModel.currentAsList[i].operation}</Text>
                </NoMoreClick>
            );
        }
        return itemArr;
    };

   render(){
       return(
           <View style={{ backgroundColor: 'white',marginTop:10 ,paddingTop:10}}>
               {orderDetailModel.orderSubType >= 3 ? this.renderGiftAfterSales() : null}
               {orderDetailModel.orderSubType >= 3 && orderDetailModel.giftCouponDTOList.length > 0 ?
                   <View>
                       {this.renderLine()}
                       {orderDetailModel.giftCouponDTOList.map((item, index) => {
                           return <View style={{ backgroundColor: 'white' }} key={index}>
                               {index === 0 ? <Image source={couponIcon} style={styles.couponsIconStyle}/> : null}
                               <View style={styles.couponsOuterStyle}>
                                   <Text style={styles.couponsTextStyle} allowFontScaling={false}>{item.couponName}</Text>
                                   <Text style={[styles.couponsTextStyle, { marginRight: 14 }]} allowFontScaling={false}>x1</Text>
                               </View>
                               <View style={styles.couponsLineStyle}/>
                           </View>
                       })}
                       {this.renderWideLine()}
                   </View>
                   :
                   null}
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'商品总价'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={orderDetailModel.status>1?StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].productPrice):StringUtils.formatMoneyString(orderDetailModel.detail.productPrice)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'1元抵扣券'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={'-' + (orderDetailModel.status>1?StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].tokenCoinAmount):StringUtils.formatMoneyString(orderDetailModel.detail.tokenCoinAmount))}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'优惠券优惠'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={'-' + (orderDetailModel.status>1?StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].couponAmount):StringUtils.formatMoneyString(orderDetailModel.detail.couponAmount))}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'运费（快递）'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={orderDetailModel.status>1?StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].freightAmount):StringUtils.formatMoneyString(orderDetailModel.detail.freightAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 35 }} leftText={'订单总价'}
                               leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                               rightText={orderDetailModel.status>1?StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].orderAmount):StringUtils.formatMoneyString(orderDetailModel.detail.orderAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }} isArrow={false}
                               isLine={false}/>
               {this.renderLine()}
               <UserSingleItem itemHeightStyle={{ height: 45 }} leftText={`${orderDetailModel.status > 1 ? '实付款' : '需付款'}`}
                               leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                               rightText={orderDetailModel.status > 1 ? StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].payAmount):StringUtils.formatMoneyString(orderDetailModel.detail.payAmount)}
                               rightTextStyle={{ color: DesignRule.mainColor, fontSize: 15 }} isArrow={false}
                               isLine={true}/>
           </View>
       )
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

