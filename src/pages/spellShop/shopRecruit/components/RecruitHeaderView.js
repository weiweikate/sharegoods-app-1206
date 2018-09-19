import React, { Component } from 'react';
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

export default class RecommendRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            store: {},
            dealerList: []
        };
    }

    _formatDate = () => {
        return 1 + '年' + 1 + '月' + 1 + '日发起招募';
    };

    _judgeCanOpenShop = () => {
        return this.state.dealerList.length >= this.state.needPersonNum ? '已满足拼店要求' : '尚未满足拼店要求';
    };

    render() {
        return <View style={styles.bg}>
            <ImageBackground source={HeaderBarBgImg} style={styles.headerBg}>
                <View style={{ marginTop: 30, flexDirection: 'row'}}>
                    <Image source={{ uri: this.state.store.headUrl }} style={styles.shopIcon}/>
                    <View>
                        <Text style={styles.shopName}>{'dianppp' || ''}</Text>
                        <Text style={styles.shopId}>店铺ID：{this.state.store.id || ''}</Text>
                    </View>
                </View>

                <Text style={{
                    fontFamily: 'PingFang-SC-Medium',
                    fontSize: 14,
                    color: '#f7f7f7',
                    marginTop: 20
                }}>{this._formatDate()}</Text>
                {
                    this.state.isOpenStore ? null : <Text style={{
                        fontFamily: 'PingFang-SC-Medium',
                        fontWeight: 'bold',
                        fontSize: 14,
                        color: '#f7f7f7',
                        marginTop: 5
                    }}>{this._judgeCanOpenShop()}</Text>
                }

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
                        }}/>
                        <View style={{ flex: 1, marginHorizontal: 15, justifyContent: 'center' }}>

                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#222222'
                            }}>店长：{'对安卓' || ''}</Text>

                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#666',
                                marginTop: 6
                            }}>等级：{'对安卓' || ''}</Text>


                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#666',
                                marginTop: 6
                            }}>参与平台{'3天'}</Text>
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
                        }}>完成总交易额
                            ：1元</Text>

                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#666',
                            marginTop: 6
                        }}>参与拼店分红：1次</Text>
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
