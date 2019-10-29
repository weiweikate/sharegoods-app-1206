/**
 * @author zhoujianxin
 * @date on 2019/9/25.
 * @desc 自返金规则
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class ReturnCashRulePage extends BasePage {
    $navigationBarOptions = {
        title: '自返规则',
        show: true
    };

    _render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>1、什么是自返积分？</Text>
                <Text style={styles.content}>{`       自返积分指用户在秀购平台进行购物消费（活动商品及特殊商品除外），秀购给予用户对应的奖励，自返积分可用于商品购买抵用，在成为VIP会员后开启自返积分兑换。`}</Text>
                <View style={{width:1,height:20}}/>

                <Text style={styles.title}>2、如何获得自返积分？</Text>
                <Text style={styles.content}>{`       购买指定商品即可获得自返积分。`}</Text>
                <View style={{width:1,height:20}}/>

                <Text style={styles.title}>3、自返积分如何可以使用？</Text>
                <Text style={styles.content}>{`       成为VIP会员后即可开启自返积分兑换。`}</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop:15,
        paddingHorizontal: 15,
        paddingTop: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    },
    title: {
        fontSize: ScreenUtils.autoSizeWidth(16),
        color: '#333333',
        marginTop: ScreenUtils.autoSizeWidth(5),
        lineHeight: 23
    },
    content:{
        fontSize: ScreenUtils.autoSizeWidth(13),
        color: '#666666',
        lineHeight: 23
    }
});
