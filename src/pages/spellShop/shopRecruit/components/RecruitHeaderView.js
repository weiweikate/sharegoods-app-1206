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
import WhiteBgImg from '../src/bg_03.png';
import AdminImg from '../src/dyxx_03.png';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DateUtils from '../../../../utils/DateUtils';
import StringUtils from '../../../../utils/StringUtils';

export default class RecommendRow extends Component {

    static propTypes = {
        storeData: PropTypes.object
    };

    _judgeCanOpenShop = () => {
        let { storeUserList, maxUser } = this.props.storeData;
        storeUserList = storeUserList || [];
        return maxUser && maxUser <= storeUserList.length ? '已满足拼店要求' : '尚未满足拼店要求';
    };

    render() {
        // const { name, storeNumber, storeUserName, starName, totalTradeVolume, bonusCount, manager = {} } = this.props.storeData;
        const { name, storeNumber, totalTradeVolume, bonusCount, manager = {} } = this.props.storeData;
        let { createTime, headUrl } = this.props.storeData;
        createTime = StringUtils.isNoEmpty(createTime) ? createTime : '';
        headUrl = StringUtils.isNoEmpty(headUrl) ? headUrl : '';
        return <View style={styles.bg}>
            <ImageBackground source={HeaderBarBgImg} style={styles.headerBg}>
                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                    <Image source={{ uri: headUrl }} style={styles.shopIcon}/>
                    <View>
                        <Text style={styles.shopName}>{name || ''}</Text>
                        <Text style={styles.shopId}>店铺ID：{storeNumber || ''}</Text>
                    </View>
                </View>

                <Text style={{
                    fontFamily: 'PingFang-SC-Medium',
                    fontSize: 14,
                    color: '#f7f7f7',
                    marginTop: 20
                }}>{`${DateUtils.formatDate(createTime, 'yyyy-MM-dd')}日发起招募`}</Text>
                <Text style={{
                    fontFamily: 'PingFang-SC-Medium',
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: '#f7f7f7',
                    marginTop: 5
                }}>{this._judgeCanOpenShop()}</Text>

                <ImageBackground source={WhiteBgImg} style={styles.whiteBg}>
                    <View style={{ height: 43, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={AdminImg} style={{ marginLeft: 17, marginRight: 6 }}/>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 15,
                            color: '#000000'
                        }}>店长信息</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Image style={{
                            width: 44,
                            height: 44,
                            backgroundColor: '#eee',
                            borderRadius: 22,
                            marginLeft: 20,
                            marginTop: 13
                        }} source={{ uri: manager.headImg || '' }}/>
                        <View style={{ flex: 1, marginHorizontal: 15, justifyContent: 'center' }}>

                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#222222'
                            }}>店长：{manager.nickname || ''}</Text>

                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#666',
                                marginTop: 6
                            }}>等级：{manager.levelName || ''}</Text>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#666',
                                marginTop: 6
                            }}>{`参与平台${Math.floor((new Date().getTime() - manager.regTime) / (24 * 3600 * 1000))}天`}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 15,
                        paddingHorizontal: 19,
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#c8c8c8',
                            marginTop: 6
                        }}>{`完成总交易额：${totalTradeVolume || 0}元`}</Text>

                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#666',
                            marginTop: 6
                        }}>{`参与拼店分红：${bonusCount || 0}次`}</Text>
                    </View>
                </ImageBackground>
            </ImageBackground>
        </View>;
    }
}

const styles = StyleSheet.create({
    bg: {
        height: ScreenUtils.autoSizeWidth(223) + ScreenUtils.autoSizeWidth(98) + 10 + 10
    },
    //header背景
    headerBg: {
        width: ScreenUtils.width,
        height: ScreenUtils.autoSizeWidth(223),
        alignItems: 'center'
    },
    shopIcon: {
        marginRight: 10,
        width: 50,
        height: 50,
        borderRadius: 2,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#c8c8c8'
    },
    shopName: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#f7f7f7'
    },
    shopId: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#f7f7f7',
        marginTop: 8
    },
    //白的面板背景
    whiteBg: {
        marginTop: 10,
        width: ScreenUtils.width - 24,
        height: ScreenUtils.autoSizeWidth(175),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        overflow: 'hidden',
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 12
    }
});
