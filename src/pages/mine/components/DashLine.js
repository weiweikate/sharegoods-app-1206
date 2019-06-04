/**
 * Created by zhoujianxin on 2019/6/4.
 * @Desc
 */


import React from 'react';
import {View} from 'react-native';

/**
 * 虚线组件
 * @param {String} color 线条颜色
 * @param {String} backgroundColor 背景颜色
 * @param {Number} lineWidth 线条粗细
 * @param {Object} style 组件样式
 * @returns {Component}
 */
export default ({color = 'black', backgroundColor = 'white', lineWidth, style = {}}) => {
    let wrapperStyle = {
        height: lineWidth,
        overflow: 'hidden'
    };
    let lineStyle = {
        height: 0,
        borderColor: color,
        borderWidth: lineWidth,
        borderStyle: 'dashed'
    };
    let lineMask = {
        marginTop: -lineWidth,
        height: lineWidth,
        backgroundColor: backgroundColor
    };

    return (
        <View style={[wrapperStyle, style]}>
            <View style={lineStyle} />
            <View style={lineMask} />
        </View>
    );
};
