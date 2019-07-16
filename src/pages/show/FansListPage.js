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
  StyleSheet,
  View
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import RefreshFlatList from '../../comm/components/RefreshFlatList';
import ShowApi from './ShowApi';
import ScreenUtils from '../../utils/ScreenUtils';

const autoSizeWidth = ScreenUtils.autoSizeWidth;
/**
 *  type
 *  0 我的粉丝
 *  1 我的关注
 *  2 TA的粉丝
 *  3 TA的关注
 *
 *  id //查询的用户
 */

const Titles = ['我的粉丝', '我的关注', 'TA的粉丝', 'TA的关注'];
const Apis = [ShowApi.getUserFans, ShowApi.getUserFollow, ShowApi.getOtherFans,ShowApi.getOtherFollow]
export default class FansListPage extends BasePage {
  constructor(props) {
    super(props);
    this.state = {};
    this.type = this.params.type || 0;
    if ( this.type > 3){this.type = 0}
  }

  $navigationBarOptions = {
    title: Titles[this.type],
    show: true// false则隐藏导航
  };
  btnClick = (item, index)=>{

  }
  getParams = () => {
      if (this.type === 2 || this.type === 3){
          return {otherUserCode: this.params.id}
      }
      return {}
  }
  _render() {
    return (
      <View style={DesignRule.style_container}>
          <RefreshFlatList
              url={Apis[this.type]}
              paramsFunc={this.getParams}
              renderItem={this.renderItem}
              ref={(ref)=> {this.list = ref}}
          />
      </View>
    );
  }


    renderItem = ({item, index})=>{
      return(
          <View style={styles.itemContainer}>
          </View>
      )
    }
}

 const styles = StyleSheet.create({
     itemContainer:{
         height: autoSizeWidth(70),
         marginHorizontal: autoSizeWidth(15),
         marginTop: autoSizeWidth(10),
         borderRadius: 7,
         overflow: 'hidden',
         backgroundColor: 'white',
         flexDirection: 'row',
         alignItems: 'center'
     }
 });
