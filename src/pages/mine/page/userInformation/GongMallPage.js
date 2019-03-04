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
import MineAPI from '../../api/MineApi';

type Props = {};
export default class GongMallPage  extends BasePage<Props> {
  constructor(props) {
    super(props);
    this.state = {
        url:null
    };
  }

  $navigationBarOptions = {
    title: '工猫认证',
    show: true// false则隐藏导航
  };

  componentDidMount() {
    this.loadPageData();
  }

  loadPageData=()=> {
      MineAPI.gongmallEnter().then((data)=>{
          this.setState({
              url:data.data
          })
      }).catch(error=>{
          this.$toastShow(error.msg);
      });

  }

  _render() {
    return (
      <View style={styles.container}>
          {this.state.url ?  <WebView source={{ uri: this.state.url }}
                                      javaScriptEnabled={true}
                                      domStorageEnabled={true}
                                      scalesPageToFit={true}
                                      style={styles.webViewWrapper}
          />:null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
