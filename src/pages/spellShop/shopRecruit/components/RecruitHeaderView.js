import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    Text,
    ImageBackground
} from 'react-native';
// 图片资源
import HeaderBarBgImg from '../src/bg_02.png';
import Shape from '../src/Shape.png';
import shoushi from '../src/shoushi.png';
import xiuling from '../src/xiuling.png';

import ScreenUtils from '../../../../utils/ScreenUtils';
import DateUtils from '../../../../utils/DateUtils';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from 'DesignRule';

export default class RecommendRow extends Component {

    static propTypes = {
        storeData: PropTypes.object
    };

    _judgeCanOpenShop = () => {
        let { storeUserList, maxUser } = this.props.storeData;
        storeUserList = storeUserList || [];
        return maxUser && maxUser <= storeUserList.length ? '已满足拼店要求' : '尚未满足拼店要求';
    };

    _renderItems = (img, tittle, content) => {
        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={img}/>
                <Text style={{ color: '#333333', fontSize: 13, marginLeft: 2 }}>{tittle}</Text>
            </View>
            <Text style={{ color: '#666666', fontSize: 13, marginTop: 8 }}>{content}</Text>
        </View>);
    };

    render() {
        const { name, storeNumber, totalTradeBalance, bonusCount, manager = {} } = this.props.storeData;
        let { createTime, headUrl } = this.props.storeData;
        createTime = StringUtils.isNoEmpty(createTime) ? createTime : '';
        headUrl = StringUtils.isNoEmpty(headUrl) ? headUrl : '';
        let totalTradeBalance1 = totalTradeBalance || 0;
        totalTradeBalance1 = Math.floor(totalTradeBalance1 / 10000);
        return <View style={styles.bg}>
            <ImageBackground source={HeaderBarBgImg} style={styles.headerBg}>
                <View style={{
                    marginTop: 21 + ScreenUtils.headerHeight,
                    flexDirection: 'row',
                    marginLeft: ScreenUtils.autoSizeWidth(57)
                }}>
                    <Image source={{ uri: headUrl }} style={styles.shopIcon}/>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.shopName}>{name || ''}</Text>
                            <Text style={styles.shopId}>ID：{storeNumber || ''}</Text>
                        </View>
                        <Text style={{
                            fontSize: 11,
                            color: '#FFFFFF',
                            marginTop: 5
                        }}>{`${DateUtils.formatDate(createTime, 'yyyy-MM-dd')}日发起招募`}</Text>
                        <Text style={{
                            fontFamily: 'PingFangSC-Medium',
                            fontSize: 13,
                            color: '#FFFFFF',
                            marginTop: 5
                        }}>{this._judgeCanOpenShop()}</Text>
                    </View>
                </View>

                <View style={styles.whiteBg}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        {this._renderItems(Shape, '店长', manager.nickname || '')}
                        <View style={{ backgroundColor: '#E4E4E4', width: 0.5, height: 41 }}/>
                        {this._renderItems(shoushi, '会员等级', manager.levelName || '')}
                        <View style={{ backgroundColor: '#E4E4E4', width: 0.5, height: 41 }}/>
                        {this._renderItems(xiuling, '秀龄', `${Math.floor((new Date().getTime() - manager.regTime) / (24 * 3600 * 1000))}天`)}
                    </View>
                    <View style={{ backgroundColor: '#E4E4E4', height: 0.5 }}/>
                    <View style={{
                        flexDirection: 'row',
                        height: 57,
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
                        }}>参与平台分红：<Text style={{ color: '#FE1A54' }}>{`${bonusCount || 0}`}</Text>次</Text>
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
        borderRadius: 30,
        backgroundColor: DesignRule.lineColor_inColorBg
    },
    shopName: {
        fontSize: 13,
        color: '#FFFFFF'
    },
    shopId: {
        marginLeft: ScreenUtils.autoSizeWidth(30),
        fontSize: 11,
        color: '#FFFFFF'
    },
    //白的面板背景
    whiteBg: {
        marginTop: 30,
        backgroundColor: DesignRule.white,
        marginHorizontal: 15,
        height: ScreenUtils.autoSizeWidth(144),
        borderRadius: 10
    }
});
