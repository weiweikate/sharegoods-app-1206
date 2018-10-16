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
    TouchableWithoutFeedback
} from "react-native";

import {
    UIText,
    UIImage
} from '../../../components/ui';

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
        let {uri, goodsName, salePrice, category, goodsNum, onPress} = this.props;
        return (
            <TouchableWithoutFeedback onPress = {onPress}>
                <View style = {styles.container}>
                    <UIImage source = {{uri: uri}} style = {styles.image}/>
                    <View style = {{marginHorizontal: 10, flex: 1, height: 100}}>
                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                        <UIText value = {goodsName} style = {[styles.title, {flex: 1, marginRight: 10}]} numberOfLines = {2}/>
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
        backgroundColor: 'white',
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
        color: '#222222',
    },
    detail: {
        fontSize: 13,
        color: '#999999',
        textAlign: 'right',
    }
});
