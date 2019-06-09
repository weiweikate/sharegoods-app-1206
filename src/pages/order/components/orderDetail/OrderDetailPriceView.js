import React, { Component } from "react";
import {
    View,
} from "react-native";
import { orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from "mobx-react/native";
import StringUtils from "../../../../utils/StringUtils";
import UserSingleItem from "../UserSingleItem";
import DesignRule from '../../../../constants/DesignRule';

@observer
export default class OrderDetailPriceView extends Component {

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
   render(){
       let {status, promotionAmount, totalAmount, freightAmount, tokenCoinAmount, couponAmount} = orderDetailModel.merchantOrder;

       return(
           <View style={{ backgroundColor: 'white',marginTop:10 ,paddingTop:10}}>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'商品总价'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={StringUtils.formatMoneyString(totalAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'运费（快递）'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={StringUtils.formatMoneyString(freightAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               {
                   promotionAmount !== 0?
                       <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'组合优惠'}
                                       leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                       rightText={promotionAmount>=0?('-¥'+promotionAmount):('+¥'+ Math.abs(promotionAmount))}
                                       rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                       isLine={false}/>
                       : null
               }

               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'1元现金券'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={'-' + StringUtils.formatMoneyString(tokenCoinAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'优惠券优惠'}
                               leftTextStyle={{ color: DesignRule.textColor_instruction }}
                               rightText={'-' + StringUtils.formatMoneyString(couponAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                               isLine={false}/>
               <UserSingleItem itemHeightStyle={{ height: 35 }} leftText={'订单总价'}
                               leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                               rightText={StringUtils.formatMoneyString(orderDetailModel.detail.orderAmount)}
                               rightTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }} isArrow={false}
                               isLine={false}/>
               {this.renderLine()}
               <UserSingleItem itemHeightStyle={{ height: 45 }} leftText={`${status > 1 ? '实付款' : '需付款'}`}
                               leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                               rightText={status > 1 ? StringUtils.formatMoneyString(orderDetailModel.warehouseOrderDTOList[0].payAmount):StringUtils.formatMoneyString(orderDetailModel.detail.payAmount)}
                               rightTextStyle={{ color: DesignRule.mainColor, fontSize: 15 }} isArrow={false}
                               isLine={true}/>
           </View>
       )
    }
}

