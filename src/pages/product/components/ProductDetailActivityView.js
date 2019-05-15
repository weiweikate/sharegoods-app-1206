import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import res from '../res/product';
import { observer } from 'mobx-react';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import apiEnvironment from '../../../api/ApiEnvironment';
import { navigate } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';

const { arrow_right_black } = res.button;

/*
* 秒杀未开始
* */
@observer
export class ActivityWillBeginView extends Component {
    render() {
        const { productDetailModel } = this.props;
        const { promotionPrice, promotionAttentionNum, showTimeText, singleActivity, prodCode } = productDetailModel;
        const { extraProperty } = singleActivity;
        return (
            <NoMoreClick style={WillBeginStyles.bgView} onPress={() => {
                extraProperty === 'toSpike' && navigate('HtmlPage', {
                    uri: `${apiEnvironment.getCurrentH5Url()}/spike?spuCode=${prodCode}`
                });
            }}>
                <View style={WillBeginStyles.leftView}>
                    <MRText
                        style={WillBeginStyles.leftPriceText}>{`¥${promotionPrice}`}</MRText>
                    <View style={WillBeginStyles.leftExplainView}>
                        <MRText style={WillBeginStyles.leftExplainText}>秒杀价</MRText>
                    </View>
                    <MRText style={WillBeginStyles.numberText}>{`${promotionAttentionNum || 0}人已关注`}</MRText>
                </View>
                <View style={WillBeginStyles.rightView}>
                    <MRText style={WillBeginStyles.rightText}>{showTimeText}</MRText>
                    {extraProperty === 'toSpike' && <Image source={arrow_right_black}/>}
                </View>
            </NoMoreClick>
        );
    }
}

const WillBeginStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 38, backgroundColor: DesignRule.bgColor_light_yellow
    },
    leftView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 15
    },
    leftPriceText: {
        fontSize: 17, color: DesignRule.textColor_green
    },
    leftExplainView: {
        marginLeft: 10, justifyContent: 'center', alignItems: 'center',
        borderRadius: 2, backgroundColor: DesignRule.bgColor_green, width: 40, height: 16
    },
    leftExplainText: {
        fontSize: 11, color: DesignRule.white
    },
    numberText: {
        marginLeft: 10,
        fontSize: 12, color: DesignRule.textColor_secondTitle
    },
    rightView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 15
    },
    rightText: {
        paddingRight: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    }
});

/*
* 秒杀开始
* */
const progressWidth = 90;

@observer
export class ActivityDidBeginView extends Component {
    render() {
        const { productDetailModel } = this.props;
        const { promotionPrice, originalPrice, promotionSaleRate, showTimeText, prodCode, singleActivity } = productDetailModel;
        const { extraProperty } = singleActivity;
        const promotionSaleRateS = promotionSaleRate || 0;
        let progressWidthS = promotionSaleRateS * progressWidth;
        progressWidthS = progressWidthS > 0 && progressWidthS < 12 ? 12 : progressWidthS;
        return (
            <NoMoreClick style={DidBeginViewStyles.bgView} onPress={() => {
                extraProperty === 'toSpike' && navigate('HtmlPage', {
                    uri: `${apiEnvironment.getCurrentH5Url()}/spike?spuCode=${prodCode}`
                });
            }}>
                <View style={DidBeginViewStyles.leftView}>
                    <MRText style={DidBeginViewStyles.priceText}>¥<MRText
                        style={{ fontSize: 36, fontWeight: 'bold' }}>{promotionPrice}</MRText></MRText>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                            <View style={DidBeginViewStyles.skillView}>
                                <MRText style={DidBeginViewStyles.skillText}>秒杀价</MRText>
                            </View>
                        </View>
                        <MRText style={[DidBeginViewStyles.amountText]}>原价¥{originalPrice}</MRText>
                    </View>
                </View>
                <View style={DidBeginViewStyles.rightView}>
                    <View style={{ marginLeft: 13, marginRight: 8 }}>
                        <MRText style={DidBeginViewStyles.timeText}>{showTimeText}</MRText>
                        <View style={DidBeginViewStyles.leaveView}>
                            <View style={[DidBeginViewStyles.progressView, { width: progressWidthS }]}/>
                            <View style={DidBeginViewStyles.leaveAmountView}>
                                <View style={DidBeginViewStyles.textView}>
                                    <MRText
                                        style={DidBeginViewStyles.leaveAmountText}>{promotionSaleRateS == 1 ? '已抢光' : `还剩${StringUtils.sub(1, promotionSaleRateS) * 100}%`}</MRText>
                                </View>
                            </View>
                        </View>
                    </View>
                    {extraProperty === 'toSpike' && <Image source={arrow_right_black} style={{ marginRight: 13 }}/>}
                </View>
            </NoMoreClick>
        );
    }
}

const DidBeginViewStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', height: 56
    },
    leftView: {
        flexDirection: 'row', flex: 1, alignItems: 'center',
        backgroundColor: DesignRule.mainColor
    },
    priceText: {
        paddingLeft: 15, paddingRight: 10, paddingTop: (36 - 20) / 2,
        fontSize: 20, color: DesignRule.white
    },
    skillView: {
        justifyContent: 'center', alignItems: 'center', marginRight: 5,
        borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.1)', width: 40, height: 16
    },
    skillText: {
        fontSize: 11, color: DesignRule.white
    },
    amountText: {
        fontSize: 12, color: DesignRule.white, textDecorationLine: 'line-through'
    },

    rightView: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: DesignRule.bgColor_yellow
    },
    timeText: {
        fontSize: 10, color: DesignRule.textColor_mainTitle
    },
    leaveView: {
        marginTop: 5,
        backgroundColor: '#FFA186', borderRadius: 6, width: progressWidth, height: 12
    },
    progressView: {
        backgroundColor: DesignRule.mainColor, borderRadius: 6, height: 12
    },
    leaveAmountView: {
        justifyContent: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 6, right: 0
    },
    textView: {
        justifyContent: 'center', height: 14
    },
    leaveAmountText: {
        fontSize: 10, color: DesignRule.textColor_white
    }
});
