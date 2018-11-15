/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/11/14.
 *
 */
'use strict';
import React from 'react';
import {
  // StyleSheet,
  View,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../BasePage';
import DesignRule from 'DesignRule';
// import RouterMap from 'RouterMap';
import LoopScrollView from '../comm/components/LoopScrollView'
import  ScreenUtils from '../utils/ScreenUtils'


export default class Dome extends BasePage {
  constructor(props) {
    super(props);
    this.state = {index: 0, data: [
            "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1301/18/c2/17511503_1358489314559.jpg",
                "http://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f0079e33d8a40f4bfbfaed04d7.jpg",
                'http://g.hiphotos.baidu.com/zhidao/pic/item/a9d3fd1f4134970a7e03404a97cad1c8a7865d66.jpg',
            'http://img0.imgtn.bdimg.com/it/u=2891327980,1961111451&fm=214&gp=0.jpg',
            'http://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/b999a9014c086e061e241cde04087bf40bd1cb92.jpg',
            'http://i0.hdslb.com/bfs/archive/4adf32a81fe26118f44635109f5e61945809c57b.jpg'
        ]};
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
          <LoopScrollView
              style={{height: 100, width: ScreenUtils.width}}
              pageWidth={ScreenUtils.width * 0.8}
              data={this.state.data}
              scrollToIndex={(index)=>{this.setState({index})}}
          />
          <Text>{this.state.index}</Text>
          <TouchableOpacity onPress={() => {this.setState({data: []})}}>
              <Text>0张</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setState({data: ["http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1301/18/c2/17511503_1358489314559.jpg",
                  "http://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f0079e33d8a40f4bfbfaed04d7.jpg",
                  'http://g.hiphotos.baidu.com/zhidao/pic/item/a9d3fd1f4134970a7e03404a97cad1c8a7865d66.jpg']})}}>
              <Text>3张</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setState({data: [
              "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1301/18/c2/17511503_1358489314559.jpg",
                  "http://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f0079e33d8a40f4bfbfaed04d7.jpg",
                  'http://g.hiphotos.baidu.com/zhidao/pic/item/a9d3fd1f4134970a7e03404a97cad1c8a7865d66.jpg',
                  'http://img0.imgtn.bdimg.com/it/u=2891327980,1961111451&fm=214&gp=0.jpg',
                  'http://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/b999a9014c086e061e241cde04087bf40bd1cb92.jpg',
                  'http://i0.hdslb.com/bfs/archive/4adf32a81fe26118f44635109f5e61945809c57b.jpg'
              ]})}}>
              <Text>6张</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});
