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
const unUsedBg = res.couponsImg.youhuiquan_bg_unUseBg;
// const usedBg = res.couponsImg.youhuiquan_bg_usedBg;
const dropImg = res.couponsImg.youhuiquan_bg_drop;
const remark = res.couponsImg.youhuiquan_bg_remark;
const dropUnuser = res.couponsImg.youhuiquan_bg_drop_unUser;
const dropUser = res.couponsImg.youhuiquan_bg_drop_user;

const itemUp = res.couponsImg.youhuiquan_icon_smallUp;
const itemDown = res.couponsImg.youhuiquan_icon_smallDown;
const dashLine = res.couponsImg.youhuiquan_icon_dashLine;

@observer
export default class CouponExplainItem extends Component {

    render() {
        let { item, index } = this.props;
        let stateImg = item.status === 1 ? res.couponsImg.youhuiquan_icon_yishiyong :
            (item.status === 2 ? res.couponsImg.youhuiquan_icon_yishixiao : res.couponsImg.youhuiquan_icon_daijihuo);

        return (
            <TouchableOpacity
                style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5, justifyContent: 'center' }}
                onPress={() => {console.log('item',item)}}>
                <ImageBackground style={{
                    width: ScreenUtils.width - px2dp(30),
                    // height: item.tobeextend ? px2dp(109) : px2dp(130),
                    marginTop: 2, marginLeft: 2, marginRight: 2,
                }}
                                 // source={item.status === 0 ? (item.levelimit ? (item.tobeextend ? useBgexd : usedBgex) : (item.tobeextend ? unUsedBgExd : unUsedBgex)) : (item.tobeextend ? useBgexd : usedBgex)}
                                 source={ item.status === 0 ? (item.tobeextend ? dropUnuser : unUsedBg) : item.tobeextend ? dropUser : dropUser}
                                 resizeMode='stretch'>
                    <View style={{ flexDirection: 'row', alignItems: 'center', display:'flex' }}>
                        <View style={styles.itemFirStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    item.type === 2 || item.type === 3 || item.type === 4 || item.type === 5 || item.type === 12 ? null :
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : '#FF80A7',
                                                }} allowFontScaling={false}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: item.type === 4 ? 20 : (item.value && item.value.length < 3 ? 33 : 20),
                                        fontWeight:'bold',
                                        color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : '#FF80A7'
                                    }} allowFontScaling={false}>{item.value}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{
                            flex: 2,
                            alignItems: 'flex-start',
                            marginLeft: 10,
                            justifyContent: 'space-between',
                            marginTop: 15,
                            marginBottom: 15
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
                            flex: 1,
                            alignItems: 'center',
                            marginLeft: 5,
                            marginRight: 10,
                            justifyContent: 'center'}}>
                            {item.status === 0 ?
                                (
                                    item.type === 99 ?
                                        <View style={{alignItems: 'center', marginRight: 10}}>
                                            {!StringUtils.isEmpty(user.blockedTokenCoin) && user.blockedTokenCoin !== 0 ?
                                                <View style={{
                                                    marginRight: 15,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Image style={{width: 55, height: 55}}
                                                           source={stateImg}/>
                                                    <UIText value={'x' + user.blockedTokenCoin}
                                                            style={styles.xNumsStyle}/>
                                                </View>
                                                : null}
                                            <UIText style={[styles.xNumStyle, {marginRight: 0}]}
                                                    value={'x' + user.tokenCoin}/>
                                        </View>
                                        : (item.levelimit ?
                                        <View
                                            style={{marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                                            <UIText value={'等级受限'}
                                                    style={{
                                                        fontSize: 13,
                                                        color: DesignRule.textColor_instruction
                                                    }}/>
                                            {item.count > 1 ? <UIText value={'x' + item.count}
                                                                      style={styles.xNumsStyle}/> : null}
                                        </View>
                                        : (item.count > 1 ? <UIText value={'x' + item.count}
                                                                    style={styles.xNumsStyle}/> :
                                            (item.redirectType && item.redirectType!=0?
                                            <NoMoreClick style={{
                                                height: ScreenUtils.autoSizeWidth(27),
                                                width: ScreenUtils.autoSizeWidth(60),
                                                borderRadius: ScreenUtils.autoSizeWidth(14),
                                                overflow: 'hidden'
                                            }} onPress={() => {this.props.clickItem(index, item);}}>
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
                                            </NoMoreClick>:null))))

                                : <View style={{marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={{width: 55, height: 55}}
                                           source={stateImg}/>
                                    {item.count > 1 ? <UIText value={'x' + item.count}
                                                              style={styles.xNumsStyle}/> : null}
                                </View>}
                        </View>
                    </View>

                    <Image style={{ width: ScreenUtils.width - px2dp(38), height: 1,marginLeft:4 }}
                                              source={dashLine}/>
                    {!item.tobeextend ?
                        <NoMoreClick style={{ height: px2dp(24), alignItems: 'center',backgroundColor:'#F9F9F9' }}
                                     onPress={() => this.props.pickUpData(item)}>
                            <ImageBackground style={{
                                width: ScreenUtils.width - px2dp(30),
                                height: px2dp(24),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} source={dropImg} resizeMode='stretch'>
                            <Image style={{ width: 14, height: 7 }}
                                   source={itemDown}/>
                            </ImageBackground>
                        </NoMoreClick> : null}
                </ImageBackground>
                {item.tobeextend ?
                    <ImageBackground style={{
                        width: ScreenUtils.width - px2dp(30),
                        marginLeft: 2,
                        borderRadius: 5,
                    }} source={remark} resizeMode='stretch'>
                        <View style={{ marginLeft: 20, }}>
                            <Text style={{
                                marginTop: 5,
                                color: item.status === 0 ? DesignRule.textColor_secondTitle : DesignRule.textColor_secondTitle,
                                lineHeight: 25,
                                fontSize: 10

                            }} allowFontScaling={false}>{item.remarks}</Text>
                        </View>
                        <NoMoreClick style={{ height: px2dp(24), justifyContent: 'center', alignItems: 'center',marginBottom:3 }}
                                     onPress={() => this.props.toExtendData(item)}><Image
                            style={{ width: 14, height: 7 }}
                            source={itemUp}/>
                        </NoMoreClick>
                    </ImageBackground> : null}
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
