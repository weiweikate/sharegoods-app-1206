/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/22.
 *
 */

"use strict";
import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
const { px2dp } = ScreenUtils;
import UIText from "../../../../comm/components/UIText";
import icon from './res/selected.png'

type Props = {};
export default class PromotionPayPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isSelected:false
        };
        this._bind();
    }

    $navigationBarOptions = {
        title: "邀请推广",
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
        let unSelectView = (
            <View style={{backgroundColor:'white',borderColor:'#DDDDDD',borderWidth:px2dp(0.5),width:px2dp(22),height:px2dp(22),borderRadius:px2dp(11)}}/>
        );
        let isSelectedView = (
            <Image source={icon} style={{backgroundColor:'white',width:px2dp(22),height:px2dp(22)}}/>
        );

        return (
            <View style={styles.container}>
                <View style={{justifyContent:'center',paddingHorizontal:px2dp(15),height:px2dp(36)}}>
                    <UIText style={{color:'#999999',fontSize:px2dp(12)}} value={'固定金额红包'}/>
                </View>
                <View style={styles.itemWrapper}>
                    <UIText style={{color:'#222222',fontSize:px2dp(13),includeFontPadding:false}} value={`红包金额：${this.params.price}元`}/>
                    <UIText  style={{color:'#999999',fontSize:px2dp(11),includeFontPadding:false}} value={`（共发放${this.params.count}个红包）`}/>
                    <View style={{flex:1}}/>
                    <TouchableOpacity onPress={()=>{
                        this.setState({isSelected : !this.state.isSelected})
                    }}>
                    {this.state.isSelected ? isSelectedView : unSelectView}
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}/>
                <TouchableOpacity onPress={()=>alert()} disabled={!this.state.isSelected} >
                    <View style={[styles.buttonWrapper,this.state.isSelected ? { opacity: 1} : {opacity : 0.5}]}>
                        <UIText value={'提交支付'} style={{color:'white', fontSize: px2dp(16)}}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6"
    },
    itemWrapper:{
        height:px2dp(48),
        width:ScreenUtils.width,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:px2dp(15),
        borderTopColor:'#DDDDDD',
        borderBottomColor:'#DDDDDD',
        borderBottomWidth:px2dp(0.5),
        borderTopWidth:px2dp(0.5),
        backgroundColor:'white'
    },
    buttonWrapper:{
        height:px2dp(48),
        width:ScreenUtils.width - px2dp(30),
        alignSelf:'center',
        borderRadius:px2dp(5),
        backgroundColor:'#D51243',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:px2dp(15)
    }
});
