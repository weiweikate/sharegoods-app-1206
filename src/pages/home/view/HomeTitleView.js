import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenUtil from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { homeModule } from '../model/Modules';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtil;

@observer
export default class HomeTitleView extends Component {
    render() {
        if (homeModule.goods.length === 0 && this.props.title === '为你推荐') {
            return null;
        }
        return (
            <View style={styles.titleView}>
                <View style={styles.flag}/>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>);
    }
}

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
