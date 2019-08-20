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
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';

const { px2dp } = ScreenUtils;

export default class WithdrawRecordDetailPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '提现详情',
        show: true // false则隐藏导航
    };

    _renderRow=(key,value,top=DesignRule.onePixel)=>{
        return(
            <View style={[styles.rowWrapper,{ marginTop: top}]}>
                <MRText style={styles.keyStyle}>
                    {key}
                </MRText>
                <MRText style={styles.keyStyle}>
                    {value}
                </MRText>
            </View>
        )
    }

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerWrapper}>
                    <MRText style={styles.numStyle}>
                        ￥100
                    </MRText>
                    <MRText style={styles.tipStyle}>
                        申请中
                    </MRText>
                </View>
                {this._renderRow('申请时间','2019-8-9')}
                {this._renderRow('银行卡号','2019-8-9')}
                {this._renderRow('所属银行','2019-8-9')}
                {this._renderRow('申请单号','2019-8-9')}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    headerWrapper: {
        background: DesignRule.white,
        height: px2dp(138),
        justifyContent:'center',
        alignItems:'center'
    },
    numStyle:{
        fontSize:px2dp(30),
        color:DesignRule.textColor_mainTitle
    },
    tipStyle:{
        fontSize:DesignRule.fontSize_threeTitle_28,
        color:'#3187FF',
        marginTop:px2dp(15)
    },
    rowWrapper:{
        flexDirection:'row',
        height:px2dp(50),
        width:DesignRule.width,
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:DesignRule.margin_page,
        background:DesignRule.white
    },
    keyStyle:{
        color:DesignRule.textColor_instruction,
        fontSize:DesignRule.fontSize_threeTitle_28
    },
    valueStyle:{
        color:DesignRule.textColor_mainTitle,
        fontSize:DesignRule.fontSize_threeTitle_28
    }
});
