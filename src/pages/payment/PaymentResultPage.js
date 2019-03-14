/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/3/14.
 *
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import RouterMap from 'RouterMap';


export default class PaymentResultPage extends BasePage {
  constructor(props) {
    super(props);
    this.state = {};
    this._bind();
  }

  $navigationBarOptions = {
    title: '',
    show: true// false则隐藏导航
  };

  _bind() {
    this.loadPageData = this.loadPageData.bind(this);
  }

  componentDidMount() {
    this.loadPageData();
  }

  loadPageData() {
  }

  _render() {
    return (
      <View style={DesignRule.style_container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
