/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;

/*拼团开始*/
@observer
export class GroupActivityInView extends Component {
    render() {
        const { productDetailModel } = this.props;
        const { showTimeText, promotionMinPrice, singleActivity, minPrice, isSingleSpec } = productDetailModel;
        const { groupNum } = singleActivity || {};
        return (
            <View style={stylesWill.container}>
                <LinearGradient style={stylesWill.leftView}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}>
                    <MRText style={stylesWill.price}>
                        ¥
                        <MRText style={stylesWill.priceBig}>{promotionMinPrice}</MRText>
                        {!isSingleSpec ? '起' : ''}
                    </MRText>
                    <View style={{ flex: 1 }}>
                        <LinearGradient style={stylesWill.numView}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FFEDA9', '#FFC97F']}>
                            <MRText style={stylesWill.numText}>{groupNum}人团</MRText>
                        </LinearGradient>
                        <MRText style={stylesWill.priceO}>销售价:￥{minPrice}{!isSingleSpec ? '起' : ''}</MRText>
                    </View>
                </LinearGradient>
                <View style={stylesWill.rightView}>
                    <MRText style={stylesWill.rTopText}>距结束</MRText>
                    <MRText style={stylesWill.rBottomText}>{showTimeText}</MRText>
                </View>
            </View>
        );
    }
}

const stylesWill = StyleSheet.create({
    container: {
        height: 56, flexDirection: 'row'
    },

    leftView: {
        flex: 1, flexDirection: 'row', alignItems: 'center'
    },
    price: {
        fontSize: 20, color: 'white', marginLeft: 16, lineHeight: 36, marginRight: 10
    },
    priceBig: {
        fontSize: 36, color: 'white'
    },
    numView: {
        height: 16, borderRadius: 8, justifyContent: 'center', alignSelf: 'flex-start'
    },
    numText: {
        fontSize: 11, color: DesignRule.textColor_redWarn, paddingHorizontal: 4, fontWeight: '500'
    },
    priceO: {
        fontSize: 12, color: 'white'
    },

    rightView: {
        width: px2dp(120), justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE5ED'
    },
    rTopText: {
        fontSize: 11, color: DesignRule.textColor_redWarn
    },
    rBottomText: {
        fontSize: 15, color: DesignRule.textColor_redWarn
    }

});

/*拼团未开始*/
@observer
export class GroupActivityWillBeginView extends Component {
    render() {
        const { productDetailModel } = this.props;
        const { showTimeText, promotionMinPrice, isSingleSpec } = productDetailModel;
        return (
            <View style={stylesIn.container}>
                <MRText style={stylesIn.price}>¥{promotionMinPrice}{!isSingleSpec ? '起' : ''}</MRText>
                <View style={stylesIn.groupView}>
                    <MRText style={stylesIn.groupText}>拼团价</MRText>
                </View>
                <View style={{ flex: 1 }}/>
                <MRText style={stylesIn.timeText}>{showTimeText}</MRText>
            </View>
        );
    }
}

const stylesIn = StyleSheet.create({
    container: {
        backgroundColor: DesignRule.bgColor_light_yellow, height: 38,
        flexDirection: 'row', alignItems: 'center'
    },
    price: {
        fontSize: 17, color: DesignRule.textColor_green, marginLeft: 15, marginRight: 5,
        fontWeight: '500'
    },
    groupView: {
        width: 40, height: 16, borderRadius: 2, backgroundColor: DesignRule.bgColor_green,
        alignItems: 'center', justifyContent: 'center'
    },
    groupText: {
        fontSize: 11, color: 'white'
    },
    timeText: {
        fontSize: 12, color: DesignRule.textColor_mainTitle, marginRight: 15
    }
});
