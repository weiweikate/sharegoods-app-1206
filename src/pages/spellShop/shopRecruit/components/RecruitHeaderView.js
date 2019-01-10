import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    ImageBackground
} from 'react-native';
// 图片资源
import res from '../../res';
const HeaderBarBgImg = res.shopRecruit.bg_02;
const Shape = res.shopRecruit.Shape;
const shoushi = res.shopRecruit.shoushi;
const xiuling = res.shopRecruit.xiuling;

import ScreenUtils from '../../../../utils/ScreenUtils';
import DateUtils from '../../../../utils/DateUtils';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import UIImage from '@mr/image-placeholder'
import {
    MRText as Text
} from '../../../../components/ui';


export default class RecommendRow extends Component {

    static propTypes = {
        storeData: PropTypes.object
    };

    _judgeCanOpenShop = () => {
        let { storeUserList, maxUser } = this.props.storeData;
        storeUserList = storeUserList || [];
        return maxUser && maxUser <= storeUserList.length ? '已满足人员要求' : '尚未满足人员要求';
    };

    _renderItems = (img, tittle, content) => {
        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={img}/>
                <Text style={{ color: '#333333', fontSize: 13, marginLeft: 2 }} allowFontScaling={false}>{tittle}</Text>
            </View>
            <Text style={{
                color: '#666666',
                fontSize: 13,
                marginTop: 8,
                paddingHorizontal: ScreenUtils.autoSizeWidth(8)
            }} numberOfLines={1} allowFontScaling={false}>{content}</Text>
        </View>);
    };

    render() {
        const { name, showNumber, totalTradeBalance, bonusCount, manager = {} } = this.props.storeData;
        const { nickname, levelName, regTime } = manager || {};
        let { createTime, headUrl } = this.props.storeData;
        createTime = StringUtils.isNoEmpty(createTime) ? createTime : '';
        headUrl = StringUtils.isNoEmpty(headUrl) ? headUrl : '';
        let totalTradeBalance1 = totalTradeBalance || 0;
        totalTradeBalance1 = Math.floor(totalTradeBalance1 / 10000);
        return <View style={styles.bg}>
            <ImageBackground source={HeaderBarBgImg} style={styles.headerBg}>
                <View style={{
                    marginTop: ScreenUtils.autoSizeWidth(21) + ScreenUtils.headerHeight,
                    flexDirection: 'row',
                    marginLeft: ScreenUtils.autoSizeWidth(57)
                }}>
                    <UIImage source={{ uri: headUrl }} borderRadius={30} style={styles.shopIcon}/>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.shopName} allowFontScaling={false}>{name || ''}</Text>
                        <Text style={styles.shopId} allowFontScaling={false}>ID：{showNumber || ''}</Text>
                        <Text style={{
                            fontSize: 11,
                            color: '#FFFFFF',
                            marginTop: 5
                        }} allowFontScaling={false}>{`${DateUtils.formatDate(createTime, 'yyyy-MM-dd')}日发起招募`}</Text>
                        <Text style={{
                            fontFamily: 'PingFangSC-Medium',
                            fontSize: 13,
                            color: '#FFFFFF',
                            marginTop: 5
                        }} allowFontScaling={false}>{this._judgeCanOpenShop()}</Text>
                    </View>
                </View>

                <View style={styles.whiteBg}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        {this._renderItems(Shape, '店长', nickname || '')}
                        <View style={{ backgroundColor: '#E4E4E4', width: 0.5, height: 41 }}/>
                        {this._renderItems(shoushi, '会员等级', levelName || '')}
                        <View style={{ backgroundColor: '#E4E4E4', width: 0.5, height: 41 }}/>
                        {this._renderItems(xiuling, '秀龄', `${Math.floor(regTime ? (new Date().getTime() - regTime) / (24 * 3600 * 1000) : 0)}天`)}
                    </View>
                    <View style={{ backgroundColor: '#E4E4E4', height: 0.5 }}/>
                    <View style={{
                        flexDirection: 'row',
                        height: ScreenUtils.autoSizeWidth(57),
                        paddingHorizontal: 24,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text
                            style={{ fontSize: 12, color: '#666666' }}>完成总交易额：<Text
                            style={{ color: '#FE1A54' }}>{totalTradeBalance1 < 1 ? '1万以内' : (totalTradeBalance1 > 10 ? '10万+' : `${totalTradeBalance1}万+`)}</Text></Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#666666'
                        }} allowFontScaling={false}>参与平台奖励：<Text
                            style={{ color: '#FE1A54' }}>{`${bonusCount || 0}`}</Text>次</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>;
    }
}

const styles = StyleSheet.create({
    bg: {
        height: ScreenUtils.headerHeight + ScreenUtils.autoSizeWidth(271)
    },
    //header背景
    headerBg: {
        width: ScreenUtils.width,
        height: ScreenUtils.headerHeight + ScreenUtils.autoSizeWidth(173)
    },
    shopIcon: {
        marginRight: 10,
        width: 60,
        height: 60,
        borderRadius: 30
    },
    shopName: {
        fontSize: 13,
        color: '#FFFFFF'
    },
    shopId: {
        marginTop: 5,
        fontSize: 11,
        color: '#FFFFFF'
    },
    //白的面板背景
    whiteBg: {
        marginTop: ScreenUtils.autoSizeWidth(22.5),
        backgroundColor: DesignRule.white,
        marginHorizontal: 15,
        height: ScreenUtils.autoSizeWidth(144),
        borderRadius: 10
    }
});
