/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/16.
 *
 */
"use strict";

import React from "react";

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,Text
} from "react-native";

import {
    UIText,
    UIImage
} from '../../../components/ui';
import DesignRule from 'DesignRule';

export default class GoodsGrayItem extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }


    render() {
        let {uri, goodsName, salePrice, category, goodsNum, onPress,gift} = this.props;
        return (
            <TouchableWithoutFeedback onPress = {onPress}>
                <View style = {styles.container}>
                    <UIImage source = {{uri: uri}} style = {styles.image}/>
                    <View style = {{marginHorizontal: 10, flex: 1, height: 100}}>
                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                        <View style={{flex:1,flexDirection: 'row',marginRight:10,alignItems:'center'}}>
                            {gift?<View style={{marginRight:8,marginTop:10,borderWidth:1,borderRadius:2,borderColor:'#D51243',justifyContent:'center',padding:1}}><Text style={{fontSize:12,color:'#D51243'}}>礼包</Text></View>:null}
                            <Text  style = {[styles.title]} numberOfLines = {2}>{goodsName}</Text>
                        </View>
                        <UIText value = {salePrice} style = {styles.title}/>
                    </View>
                    <View style = {{ marginTop: 10, marginRight: 5, flexDirection: 'row'}}>
                        <UIText value = {category} style = {[styles.detail, {flex: 1, textAlign: 'left', marginRight: 10}]}/>
                        <UIText value = {'x' + goodsNum} style = {styles.detail}/>
                    </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 80,
        width: 80,
        marginLeft: 15,
    },
    title: {
        marginTop: 10,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
    },
    detail: {
        fontSize: 13,
        color: DesignRule.textColor_instruction,
        textAlign: 'right',
    }
});
