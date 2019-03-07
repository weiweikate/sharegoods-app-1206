import React, { Component } from 'react'
import { View } from 'react-native'
import DesignRule from '../../../constants/DesignRule';
import {MRText as Text} from '../../../components/ui/index';

export class PriceExplain extends Component {
  render() {
    return (
        <View style={{ backgroundColor: 'white' }}>
            <Text
                style={{
                    paddingVertical: 13,
                    marginLeft: 15,
                    fontSize: 15,
                    color: DesignRule.textColor_mainTitle
                }} allowFontScaling={false}>价格说明</Text>
            <View style={{
                height: 0.5,
                marginHorizontal: 0,
                backgroundColor: DesignRule.lineColor_inColorBg
            }}/>
            <Text style={{
                padding: 15,
                color: DesignRule.textColor_instruction,
                fontSize: 13
            }} allowFontScaling={false}>{`划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过销售价等，并非原价，仅供参考\n未划线价格：指商品的实时价格，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化最终以订单结算页价格为准。`}</Text>
        </View>
    )
  }
}

export default PriceExplain
