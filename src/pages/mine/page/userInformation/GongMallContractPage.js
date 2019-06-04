/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2019/3/1.
 *
 */

'use strict';
import React from 'react';
import {
  StyleSheet,
  View,
    WebView
} from 'react-native';
import BasePage from '../../../../BasePage';

type Props = {};
export default class GongMallContractPage  extends BasePage<Props> {

  $navigationBarOptions = {
    title: '工猫合同',
    show: true// false则隐藏导航
  };

  _render() {
    return (
      <View style={styles.container}>
          <WebView source={{ uri: 'http://' + this.params.url }}
                   javaScriptEnabled={true}
                   domStorageEnabled={true}
                   scalesPageToFit={true}
                   style={styles.webViewWrapper}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
