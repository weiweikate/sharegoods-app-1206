/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huyufeng on 2019/1/3.
 *
 */


'use strict';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View,Image } from 'react-native';
// import { UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
// import res from '../res';
import PropTypes from 'prop-types';
import ScreenUtils from '../../../utils/ScreenUtils';
import {shopCartEmptyModel} from '../model/ShopCartEmptyModel'
import Waterfall from '@mr/react-native-waterfall'
// import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import { MRText } from '../../../components/ui';
import ShopCartEmptyCell from './ShopCartEmptyCell';
import res from '../res'

const {px2dp} = ScreenUtils;
const { shopCartNoGoods } = res
@observer
export default class ShopCartEmptyView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.waterfall && this.waterfall.addItems(shopCartEmptyModel.emptyViewList);
    }
    _renderItem = (itemData) => {
        return(<ShopCartEmptyCell itemData={itemData}/>)
    };
    _onRefresh=()=>{

    }
    _keyExtractor=(dataItem)=>{
        return dataItem.id;
    }
    refreshing=()=>{

    }
    infiniting=()=>{

    }

    _renderHeaderView=()=>{
        return(
            <View style={{width:ScreenUtils.width,height:350,paddingLeft:px2dp(15),paddingRight:px2dp(15)}}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Image source={shopCartNoGoods} style={{width:px2dp(244),height:px2dp(140)}}></Image>
                  <MRText style={{fontSize:px2dp(13),color:'rgba(153, 153, 153, 1)',marginTop:px2dp(5)}}>暂无商品</MRText>
              </View>
                <View style={{width:ScreenUtils.width,height:px2dp(50),flexDirection:'row',alignItems:'center'}}>
                    <View style={{width:px2dp(2),height:px2dp(8),backgroundColor:'#FF0050'}}/>
                    <MRText style={{marginLeft:px2dp(5), fontSize:px2dp(16)}}>为你推荐</MRText>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.bgViewStyle}>
                <Waterfall
                    space={3}
                    ref={(ref)=>{this.waterfall = ref}}
                    renderHeader={()=>{return this._renderHeaderView()}}
                    columns={2}
                    infinite={true}
                    hasMore={false}
                    renderItem={item => this._renderItem(item)}
                    style={{flex:1}}
                    // containerStyle={{marginLeft: 15, marginRight: 15}}
                    keyExtractor={(data) => this._keyExtractor(data)}
                    // infiniting={(done)=>this.infiniting(done)}
                />
            </View>
        );
    }
}
ShopCartEmptyView.propTypes = {
    //去逛逛
    navigateToHome: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    bgViewStyle: {
        backgroundColor: DesignRule.bgColor,
        flex: 1,
    },
    imgStyle: {
        height: 115,
        width: 115
    },
    topTextStyle: {
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    },
    bottomTextBgViewStyle: {
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        borderRadius: 18,
        width: 115,
        height: 36
    },
    bottomTextStyle: {
        color: DesignRule.mainColor,
        fontSize: 15
    },
    addSomethingTipStyle: {
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    }

});
