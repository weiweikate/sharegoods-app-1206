/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/11/27.
 *
 */
'use strict';
import React from 'react';
// import {
//   StyleSheet,
//   View
// } from 'react-native';
import BasePage from '../../../BasePage';
// import DesignRule from 'DesignRule';
// import RouterMap from 'RouterMap';
import WebViewBridge from '@mr/react-native-webview'


export default class WebViewDemo extends BasePage {
  constructor(props) {
    super(props);
    this.state = {};
    this._bind();
  }

  $navigationBarOptions = {
    title:  '加载中...',
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

    _render(){
        return(
            <WebViewBridge
                token={'Q/FHsj8FwJOOwXFVmjsx3ma7vMzNmfwkV9fb3ATP2wrUIEMJ8D1ljGozxckLWy2ESJkHzel6a3gasklC5Apw7//6tkTH3vD9jx3zwPvjR3qgVUJuoBE9UmK6Lzxe8ZH1pD8ThhwSMyqSw/Uv5TMRxg=='}
                style={{flex: 1}}
                // source={this.props.source} //uri: 'http://172.16.10.117:9528/topic/first'
                source={{uri: 'http://devh5.sharegoodsmall.com/topic/first'}}
                // postMessage={msg => this._postMessage(msg)}
                navigateAppPage={(r, p) => {this.$navigate(r, p)}}
                // onLoadStart={() => this._onLoadStart()}
                // onLoadEnd={() => this._onLoadEnd()}
                // onError={e => this._onError(e)}
                onNavigationStateChange={event => event.title.length > 0 && this.$NavigationBarResetTitle(event.title)}
            />
        )
    }
}

// const styles = StyleSheet.create({});
