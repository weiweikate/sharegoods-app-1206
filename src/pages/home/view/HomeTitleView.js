import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenUtil from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import DesignRule from '../../../constants/DesignRule';

export default ({ title }) => <View style={styles.titleView}>
    <View style={styles.flag}/>
    <Text style={styles.title}>{title}</Text>
</View>

const styles = StyleSheet.create({
    flag: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(2),
        height: px2dp(8),
        borderRadius: px2dp(1)
    },
    titleView: {
        height: px2dp(42),
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(16),
        marginLeft: px2dp(10),
        fontWeight: '600'
    }
});
