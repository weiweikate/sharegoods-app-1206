/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/29.
 *
 */
'use strict';

import React from 'react';

import {
  View,
} from 'react-native';

import {
  UIText,
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import UserSingleItem from '../../components/UserSingleItem';

export default class RefundDetailView extends React.Component {

  constructor(props) {
    super(props);

    this._bind();

    this.state = {};
  }

  _bind() {

  }

  componentDidMount() {
  }


  render() {
      let {refundCashAmount, refundAccountAmount} = this.props;
    return (
        <View style={{marginBottom: 10, marginTop: -5}}>
            <View
                style={{
                    backgroundColor: DesignRule.bgColor,
                    height: 40,
                    justifyContent: 'center',
                    paddingLeft: 15
                }}>
                <UIText value={'退款明细'}
                        style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
            </View>
            {/*<UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回1元抵扣券'}*/}
                            {/*leftTextStyle={{*/}
                                {/*color: DesignRule.textColor_mainTitle,*/}
                                {/*fontSize: 13*/}
                            {/*}}*/}
                            {/*rightText={'x' + parseInt(actualTokenCoin) + '张'}*/}
                            {/*rightTextStyle={{*/}
                                {/*color: DesignRule.textColor_mainTitle,*/}
                                {/*fontSize: 13,*/}
                                {/*marginRight: 5*/}
                            {/*}}*/}
                            {/*isArrow={false} isLine={false}/>*/}
            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回第三方账户'}
                            leftTextStyle={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 13
                            }}
                            rightText={StringUtils.formatMoneyString(refundCashAmount)}
                            rightTextStyle={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 13,
                                marginRight: 5
                            }}
                            isArrow={false} isLine={false}/>
            <View style={{ height: DesignRule.lineHeight, backgroundColor: DesignRule.lineColor_inColorBg }}/>
            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回现金账户'}
                            leftTextStyle={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 13
                            }}
                            rightText={StringUtils.formatMoneyString(refundAccountAmount)}
                            rightTextStyle={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 13,
                                marginRight: 5
                            }}
                            isArrow={false} isLine={false}/>
            <View style={{ height: DesignRule.lineHeight, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        </View>
    );
  }
}

