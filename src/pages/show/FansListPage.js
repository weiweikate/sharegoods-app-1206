/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/7/16.
 *
 */

'use strict';
import React from 'react';
import {
  // StyleSheet,
  View
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';


export default class FansListPage extends BasePage {
    static propTypes = {

    };

    static defaultProps = {

    }
  constructor(props) {
    super(props);
    this.state = {};

  }

  $navigationBarOptions = {
    title: '',
    show: true// false则隐藏导航
  };


  componentDidMount() {
  }



  _render() {
    return (
      <View style={DesignRule.style_container}>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});
