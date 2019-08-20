/**
 * @author xzm
 * @date 2019/8/20
 */

import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import MineAPI from '../../api/MineApi';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';

const { px2dp } = ScreenUtils;

export default class WithdrawRecordPage extends BasePage {
    $navigationBarOptions = {
        title: '提现记录',
        show: true // false则隐藏导航
    };

    _listItemRender = ({ item, index }) => {
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.rowWrapper}>
                    <MRText>
                        S201908121603006375
                    </MRText>
                    <MRText>
                        100.00
                    </MRText>
                </View>
                <View style={[styles.rowWrapper,{ marginTop: px2dp(5)}]}>
                    <MRText>
                        S201908121603006375
                    </MRText>
                    <MRText>
                        100.00
                    </MRText>
                </View>
                <View style={{height:DesignRule.onePixel,width:DesignRule.width-px2dp(15),background:DesignRule.lineColor_inWhiteBg}}/>
            </View>
        );
    };

    _render() {
        return (
            <View style={styles.contain}>
                <RefreshFlatList
                    style={styles.container}
                    url={MineAPI.queryWithdrawRecord}
                    renderItem={this._listItemRender}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    contain: {
        flex: 1
    },
    container: {
        marginTop: 15
    },
    itemWrapper: {
        paddingLeft: px2dp(15),
        width:ScreenUtils.width
    },
    rowWrapper:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginRight:px2dp(15),
        alignItems:'center'
    }
});


