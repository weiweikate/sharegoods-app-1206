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

export default class ReturnCashRulePage extends BasePage {
    $navigationBarOptions = {
        title: '自返规则',
        show: true
    };

    _render() {
        return (
            <View style={styles.container}>
                <Text>自返规则自返规则自返规则自返规则自返规则自返规则</Text>
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    },
});
