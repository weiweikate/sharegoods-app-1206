/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/12/25.
 *
 */


'use strict';
import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import BasePage from '../../../BasePage';
import {MRText as Text} from '../../../../components/ui'
// import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
// import ImageLoad from '@mr/image-placeholder'

type Props = {};
export default class MyShowFansPage extends BasePage<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  $navigationBarOptions = {
    title: '我的秀迷',
    show: true// false则隐藏导航
  };



  componentDidMount() {
    this.loadPageData();
  }

  loadPageData() {
  }

  _listItemRender=()=>{

  }

  _render() {
    return (
      <View style={styles.container}>
          <Text>
              激活人数：<Text>12</Text>/<Text>12</Text>
          </Text>

          <View style={styles.itemWrapper}>
          </View>
          {/*<RefreshFlatList*/}
              {/*style={styles.container}*/}
              {/*url={orderApi.afterSaleList}*/}
              {/*renderItem={this.renderItem}*/}
              {/*params={params}*/}
              {/*totalPageNum={(result)=> {return result.data.isMore ? 10 : 0}}*/}
              {/*handleRequestResult={(result)=>{return result.data.list}}*/}
              {/*// ref={(ref) => {this.list = ref}}*/}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
    itemWrapper:{
      height:100,
        width:ScreenUtils.width-DesignRule.margin_page*2,
        flexDirection:'row',
        backgroundColor:DesignRule.white,
        alignItems:'center'
    },
    fansIcon:{
      height:50,
        width:50
    }

});
