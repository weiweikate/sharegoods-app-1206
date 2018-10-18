/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/18.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from "../../../../utils/ScreenUtils";
const { px2dp } = ScreenUtils;

type Props = {};
export default  class UserPromotionPage  extends BasePage<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this._bind();
  }

  $navigationBarOptions = {
    title: '我的推广订单',
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
  /**************************viewpart********************************/

  _itemRender(){
      return(
          <View>
              <View>
                  <View>
                      <Text>
                          50元推广试用套餐
                      </Text>
                      <Text>
                          剩余推广金额￥20.03
                      </Text>

                      <TouchableWithoutFeedback>
                          <View style={styles.grayButtonStyle}>
                              <Text >
                                  推广详情
                              </Text>
                          </View>

                      </TouchableWithoutFeedback>
                  </View>
              </View>
          </View>
      )
  }

  _render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    grayButtonWrapper:{
        borderColor:'#DDDDDD',
        borderWidth:px2dp(1),
        borderRadius:px2dp(10),
        width:px2dp(160),
        height:px2dp(70),
        justifyContent:'center',
        alignItems:'center'
    },
    redButtonWrapper:{
        borderColor:'#D51243',
        borderWidth:px2dp(1),
        borderRadius:px2dp(5),
        width:px2dp(80),
        height:px2dp(35),
        justifyContent:'center',
        alignItems:'center'
    },
    itemInfoWrapper:{
        justifyContent:'center',
        marginLeft:px2dp(15),
    }


});
