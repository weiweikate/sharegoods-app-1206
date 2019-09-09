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

const { px2dp } = ScreenUtils;

/*拼团未开始*/
export class GroupActivityWillBeginView extends Component {
    render() {
        return (
            <View style={stylesWill.container}>
                <LinearGradient style={stylesWill.leftView}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}>
                    <MRText style={stylesWill.price}>
                        ¥
                        <MRText style={stylesWill.priceBig}>69</MRText>
                        起
                    </MRText>
                    <View>
                        <LinearGradient style={stylesWill.numView}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FFEDA9', '#FFC97F']}>
                            <MRText style={stylesWill.numText}>2人团</MRText>
                        </LinearGradient>
                        <MRText style={stylesWill.priceO}>销售价:￥79</MRText>
                    </View>
                </LinearGradient>
                <View style={stylesWill.rightView}>
                    <MRText style={stylesWill.rTopText}>距结束</MRText>
                    <MRText style={stylesWill.rBottomText}>14:17:24.09</MRText>
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
        height: 16, width: 37, borderRadius: 8, justifyContent: 'center', alignItems: 'center'
    },
    numText: {
        fontSize: 11, color: DesignRule.textColor_redWarn
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

export class GroupActivityInView extends Component {
    render() {
        return (
            <View style={stylesIn.container}>
                <MRText style={stylesIn.price}>¥23333</MRText>
                <View style={stylesIn.groupView}>
                    <MRText style={stylesIn.groupText}>拼团价</MRText>
                </View>
                <View style={{ flex: 1 }}/>
                <MRText style={stylesIn.timeText}>距开始23:59:24.9</MRText>
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
