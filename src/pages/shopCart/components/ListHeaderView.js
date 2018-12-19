/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/18.
 *
 */

'use strict';

import React from 'react';
import {observer} from 'mobx-react'

import {
  View,
} from 'react-native';

import {
  UIText,
} from '../../../components/ui';
// import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import ShopCartStore from '../model/ShopCartStore'

@observer
export default class  extends React.Component {

  constructor(props) {
    super(props);
  }
  _bind() {
  }
  componentDidMount() {
  }


  render() {
    return (
        <View
            {...this.props}
            style={{
                height:200,
                width:ScreenUtils.width,
                flexDirection:'column'
            }}
        >
            <View
                style={{
                    position:'absolute',
                    width:ScreenUtils.width,
                    backgroundColor:DesignRule.mainColor,
                    height:280,
                }}
            />
            <UIText
            value={'购物车'}
            style={{
                fontSize:30,
                color:DesignRule.white,
                marginLeft:20,
                marginTop:80
            }}
            />
            <UIText
                value={'共'+ShopCartStore.getTotalGoodsNumber+'件商品'}
                style={{
                    fontSize:20,
                    color:DesignRule.white,
                    marginLeft:20
                }}
            />
        </View>
    );
  }
}

// const styles = StyleSheet.create({});
