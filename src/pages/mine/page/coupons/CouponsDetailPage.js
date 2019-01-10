/**
 * Created by xiangchen on 2018/7/23.
 */
import React from 'react';
import {
    StyleSheet, View, DeviceEventEmitter,
    ImageBackground, Image
} from 'react-native';

import BasePage from '../../../../BasePage';

import ScreenUtils from '../../../../utils/ScreenUtils';
import UIText from '../../../../components/ui/UIText';
import user from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import StringUtils from '../../../../utils/StringUtils';
import { MRText as Text } from '../../../../components/ui';

const {
    youhuiquan_bg_zhihui: usedBg,
    youhuiquan_bg_nor: unuesdBg,
    youhuiquan_icon_daijihuo_nor: tobeActive,
    youhuiquan_icon_yishixiao_nor: ActivedIcon,
    youhuiquan_icon_yishiyong_nor: usedRIcon,
    youhuiquan_limit: limitIcon
} = res.couponsImg;

const { px2dp } = ScreenUtils;

export default class CouponsDetailPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            viewData: this.params.item || {},
            // viewData: {
            //     value:12,
            //     useConditions:500,
            //     productNames:'葫芦小精钢',
            //     startTime:1537324480000,
            //     outTime:1537327480000,
            // },
            explain: '去使用'
        };
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    $navigationBarOptions = {
        show: true,
        title: '优惠券详情'
    };

    fmtDate(obj) {
        let date = new Date(obj);
        let y = 1900 + date.getYear();
        let m = '0' + (date.getMonth() + 1);
        let d = '0' + date.getDate();
        return y + '.' + m.substring(m.length - 2, m.length) + '.' + d.substring(d.length - 2, d.length);
    }

    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView(this.state.viewData)}
            </View>
        );
    }

    go2OrderPage() {
        DeviceEventEmitter.emit('usedCoupons', this.state.viewData);
    }

    renderBodyView = (item) => {
        let BG = item.status === 0 && !item.levelimit ? unuesdBg : usedBg;
        let BGR = item.status === 3 ? tobeActive : (item.status === 0 ? (item.levelimit ? limitIcon : '') : (item.status === 1 ? usedRIcon : ActivedIcon));
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center' }}>
                    <ImageBackground style={{
                        width: ScreenUtils.width - px2dp(20),
                        height: px2dp(109),
                        marginTop: px2dp(10)
                    }} source={BG} resizeMode='stretch'>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: px2dp(73) }}>
                            <View style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: px2dp(80)
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {
                                        item.type === 3 || item.type === 4 || item.type === 12 ? null :
                                            <View style={{ alignSelf: 'flex-end', marginBottom: 4 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: DesignRule.textColor_mainTitle,
                                                        marginBottom: 2
                                                    }} allowFontScaling={false}>￥</Text>
                                            </View>}
                                    <View>
                                        <Text style={{
                                            fontSize: item.type === 4 ? 20 : (item.value && item.value.length === 3 ? 26 : 33),
                                            color: DesignRule.textColor_mainTitle
                                        }} allowFontScaling={false}>{item.value}</Text>
                                    </View>
                                    {
                                        item.type === 3 ?
                                            <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: DesignRule.textColor_mainTitle,
                                                        marginBottom: 4
                                                    }} allowFontScaling={false}>折</Text>
                                            </View> : null}
                                </View>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle,
                                        marginRight: 10
                                    }} allowFontScaling={false}>
                                        {item.name}{item.type !== 99 ? null : <UIText value={'（可叠加使用）'} style={{
                                        fontSize: 11,
                                        color: DesignRule.textColor_instruction
                                    }}/>}</Text>
                                    {item.type === 12 ? <UIText value={'x' + item.number} style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle
                                    }}/> : null}
                                </View>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_instruction,
                                    marginTop: 6
                                }} allowFontScaling={false}>使用有效期：{item.timeStr}</Text>
                            </View>
                            <Image style={{ marginTop: -6 }} source={BGR}/>
                            {item.type === 99 ?
                                <UIText value={'x' + user.tokenCoin}
                                        style={{
                                            marginRight: 15,
                                            marginTop: 15,
                                            fontSize: 14,
                                            color: DesignRule.textColor_mainTitle
                                        }}/> : null}
                        </View>

                        <View style={{ height: px2dp(33), justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction }}
                                  allowFontScaling={false}>{item.limit}</Text>
                        </View>

                    </ImageBackground>
                </View>
                {
                    StringUtils.isEmpty(item.remarks) ? null :
                        <View style={{ marginTop: 20,  marginLeft: 10}}>
                            <Text style={{ marginTop: 5, color: DesignRule.textColor_mainTitle }}
                                  allowFontScaling={false}>使用说明:</Text>
                            <Text style={{
                                marginTop: 5,
                                color: DesignRule.textColor_secondTitle,
                                lineHeight: 25,

                            }} allowFontScaling={false}>{item.remarks}</Text>
                        </View>}
                <View
                    style={{
                        width: ScreenUtils.width,
                        height: 180,
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}/>
            </View>
        );
    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});
