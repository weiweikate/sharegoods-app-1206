import React, { Component } from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { UIText, NoMoreClick, MRText as Text } from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import user from '../../../model/user';
import { observer } from 'mobx-react';
import res from '../res';
import StringUtils from '../../../utils/StringUtils';
import LinearGradient from 'react-native-linear-gradient';
const { px2dp } = ScreenUtils;
const unUsedBgex = res.couponsImg.youhuiquan_bg_unUsedBg_ex;
const unUsedBgExd = res.couponsImg.youhuiquan_bg_unUsedBg_exd;
// const usedBgex = res.couponsImg.youhuiquan_bg_usedBg_ex;
// const useBgexd = res.couponsImg.youhuiquan_bg_usedBg_exd;
const itemUp = res.couponsImg.youhuiquan_icon_smallUp;
const itemDown = res.couponsImg.youhuiquan_icon_smallDown;

@observer
export default class CouponExplainItem extends Component {

    render() {
        let { item, index } = this.props;
        let stateImg = item.status === 1 ? res.couponsImg.youhuiquan_icon_yishiyong :
            (item.status === 2 ? res.couponsImg.youhuiquan_icon_yishixiao : res.couponsImg.youhuiquan_icon_daijihuo);

        return (
            <TouchableOpacity
                style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5, justifyContent: 'center' }}
                onPress={() => this.props.clickItem(index, item)}>
                <ImageBackground style={{
                    width: ScreenUtils.width - px2dp(30),
                    height: item.tobeextend ? px2dp(109) : px2dp(130),
                    margin: 2,
                }}
                                 // source={item.status === 0 ? (item.levelimit ? (item.tobeextend ? useBgexd : usedBgex) : (item.tobeextend ? unUsedBgExd : unUsedBgex)) : (item.tobeextend ? useBgexd : usedBgex)}
                                 source={ item.status === 0 ?(item.tobeextend ? unUsedBgExd : unUsedBgex):item.tobeextend ? unUsedBgExd : unUsedBgex}
                                 resizeMode='stretch'>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: px2dp(109) }}>
                        <View style={styles.itemFirStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    item.type === 3 || item.type === 4 || item.type === 5 || item.type === 12 ? null :
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : '#FF80A7',
                                                    marginBottom: 4
                                                }} allowFontScaling={false}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: item.type === 4 ? 20 : (item.value && item.value.length < 3 ? 33 : 26),
                                        color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : '#FF80A7'
                                    }} allowFontScaling={false}>{item.value}</Text>
                                </View>
                                {
                                    item.type === 3 ?
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                                    marginBottom: 4
                                                }} allowFontScaling={false}>折</Text>
                                        </View> : null}
                            </View>
                        </View>

                        <View style={{
                            flex: 2,
                            alignItems: 'flex-start',
                            marginLeft: 10,
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: item.status === 0 ? DesignRule.textColor_mainTitle : DesignRule.textColor_instruction,
                                    marginRight: 10
                                }} allowFontScaling={false} numberOfLines={1}>
                                    {item.name}</Text>
                                {item.type === 12 ? <UIText value={'x' + item.number} style={{
                                    fontSize: 15,
                                    color: DesignRule.textColor_mainTitle
                                }}/> : null}
                            </View>
                            {item.timeStr ? <Text style={{
                                fontSize: 11,
                                color: DesignRule.textColor_instruction,
                                marginTop: 1
                            }} allowFontScaling={false}>{item.timeStr}</Text> : null}
                            <UIText style={{ fontSize: 11, color: DesignRule.textColor_instruction, marginTop: 1 }}
                                    value={item.limit}/>
                        </View>
                        <View style={{
                            width: 80,
                            alignItems: 'flex-start',
                            marginLeft: 10,
                            justifyContent: 'center',
                            height: px2dp(109)}}>
                            {item.status === 0 ?
                                (
                                    item.type === 99 ?
                                        <View style={{alignItems: 'center', marginRight: 10}}>
                                            <UIText style={[styles.xNumStyle, {marginRight: 0}]}
                                                    value={'x' + user.tokenCoin}/>
                                            {!StringUtils.isEmpty(user.blockedTokenCoin) && user.blockedTokenCoin !== 0 ?
                                                <Text style={{
                                                    fontSize: 11,
                                                    color: DesignRule.textColor_secondTitle
                                                }}>{'待激活：'}
                                                    <UIText style={[styles.xNumStyle, {marginRight: 0}]}
                                                            value={'x' + user.blockedTokenCoin}/>
                                                </Text>
                                                : null}
                                        </View>
                                        : (item.levelimit ?
                                        <View
                                            style={{marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                                            {item.count > 1 ? <UIText value={'x' + item.count}
                                                                      style={styles.xNumsStyle}/> : null}
                                            <UIText value={'等级受限'}
                                                    style={{
                                                        fontSize: 13,
                                                        color: DesignRule.textColor_instruction
                                                    }}/>
                                        </View>
                                        : (item.count > 1 ? <UIText value={'x' + item.count}
                                                                    style={styles.xNumsStyle}/> :
                                            <NoMoreClick style={{
                                                height: ScreenUtils.autoSizeWidth(27),
                                                width: ScreenUtils.autoSizeWidth(60),
                                                borderRadius: ScreenUtils.autoSizeWidth(14),
                                                overflow: 'hidden'
                                            }}
                                                         onPress={() => {
                                                         }}>
                                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                                colors={['#FC5D39', '#FF0050']}
                                                                style={{
                                                                    alignItems: 'center',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                    flex: 1
                                                                }}
                                                >
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: 'white',
                                                    }} allowFontScaling={false}>去使用</Text>
                                                </LinearGradient>
                                            </NoMoreClick>)))

                                : <View style={{marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={{width: 55, height: 55}}
                                           source={stateImg}/>
                                    {item.count > 1 ? <UIText value={'x' + item.count}
                                                              style={styles.xNumsStyle}/> : null}
                                </View>}
                        </View>
                    </View>
                    {!item.tobeextend ?
                        <NoMoreClick style={{ height: px2dp(24), justifyContent: 'center', alignItems: 'center' }}
                                     onPress={() => this.props.pickUpData(item)}><Image style={{ width: 14, height: 7 }}
                                                                                        source={itemDown}/>
                        </NoMoreClick> : null}
                </ImageBackground>
                {item.tobeextend ?
                    <View style={{
                        backgroundColor: item.status === 0 ? (item.levelimit ? DesignRule.white : DesignRule.white) : DesignRule.white,
                        width: ScreenUtils.width - px2dp(30),
                        marginLeft: 1,
                        borderRadius: 5,
                        marginTop: -2
                    }}>
                        <View style={{ marginTop: 10, marginLeft: 10 }}>
                            <Text style={{
                                marginTop: 5,
                                color: item.status === 0 ?DesignRule.textColor_secondTitle:DesignRule.textColor_secondTitle,
                                lineHeight: 25,
                                fontSize: 10

                            }} allowFontScaling={false}>{item.remarks}</Text>
                        </View>
                        <NoMoreClick style={{ height: px2dp(24), justifyContent: 'center', alignItems: 'center' }}
                                     onPress={() => this.props.toExtendData(item)}><Image
                            style={{ width: 14, height: 7 }}
                            source={itemUp}/>
                        </NoMoreClick>
                    </View> : null}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    xNumStyle: {
        marginRight: 15,
        marginTop: 15,
        fontSize: 14,
        color: DesignRule.textColor_mainTitle
    },
    xNumsStyle: {
        // marginRight: 15,
        // marginBottom: 5,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle_222
    },
    itemFirStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: px2dp(80)
    }
});
