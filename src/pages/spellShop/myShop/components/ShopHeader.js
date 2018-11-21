/**
 * 我的店铺-店铺头
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

import DesignRule from 'DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';
const HeaderBarBgImg = res.myShop.txbg_02;
const StarImg = res.myShop.dj_03;
const CCZImg = res.myShop.ccz_03;
const ProgressImg = res.myShop.jdt_05;


export default class ShopHeader extends Component {

    static propTypes = {
        onPressShopAnnouncement: PropTypes.func,//点击公告
        item: PropTypes.object
    };


    render() {
        //tradeBalance本月收入 bonusNeedMoney总额
        // currentUserSettle当前用户的钱(预计分红)
        //贡献度currentUserSettle/tradeBalance
        let {
            headUrl, name, storeNumber, storeStarId, userStatus,
            tradeBalance = 0, bonusNeedMoney = 0, currentUserSettle = 0
        } = this.props.item;

        tradeBalance = StringUtils.isEmpty(tradeBalance) ? 0 : tradeBalance;

        const starsArr = [];
        if (storeStarId && typeof storeStarId === 'number') {
            for (let i = 0; i < storeStarId; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return <View style={styles.container}>
            <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                <View style={styles.whiteBg}>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: px2dp(25),
                        marginLeft: px2dp(20),
                        marginRight: px2dp(20)
                    }}>
                        <Image style={styles.headerImg}
                               source={{ uri: StringUtils.isNoEmpty(headUrl) ? headUrl : '' }}/>
                        <View style={styles.shopInContainer}>
                            <Text style={styles.shopName}>{name || ''}</Text>
                            <Text style={styles.shopId}>ID：{storeNumber || ''}</Text>
                            <View style={styles.starRow}>
                                <Text style={{ fontSize: 11, color: '#999999' }}>店铺星级：</Text>
                                {
                                    starsArr.map((item, index) => {
                                        return <Image key={index} source={StarImg}/>;
                                    })
                                }
                            </View>
                        </View>
                        {userStatus === 1 ?
                            <TouchableOpacity onPress={this.props.onPressShopAnnouncement}
                                              style={styles.announcementContainer}>
                                <Text style={styles.announcementTitle}>店铺公告</Text>
                            </TouchableOpacity> : null}
                    </View>

                    <View style={styles.whiteBgTopRow}>
                        <Image source={CCZImg} style={styles.whiteBgTopRowIcon}/>
                        <Text style={styles.gongxian}>
                            贡献度：{`${tradeBalance === 0 ? 0 : ((currentUserSettle / tradeBalance) * 100).toFixed(2)}`}%
                        </Text>
                    </View>
                    <View style={{
                        marginHorizontal: px2dp(10),
                        marginTop: px2dp(10),
                        marginBottom: px2dp(15),
                        backgroundColor: '#E4E4E4',
                        height: 0.5
                    }}/>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.progress}>{tradeBalance || 0}<Text style={{
                            color: DesignRule.textColor_secondTitle
                        }}>/{bonusNeedMoney || 0}</Text></Text>

                        <ImageBackground source={ProgressImg} style={{
                            overflow: 'hidden',
                            marginTop: px2dp(5),
                            borderRadius: px2dp(3.5),
                            height: px2dp(7),
                            width: 315 / 375 * SCREEN_WIDTH
                        }}>
                            <View style={[styles.progressBg, {
                                marginLeft: 315 / 375 * SCREEN_WIDTH * (bonusNeedMoney === 0 ? 0 :
                                    (tradeBalance / bonusNeedMoney > 1 ? 1 : tradeBalance / bonusNeedMoney))
                            }]}/>
                        </ImageBackground>

                        <Text
                            style={styles.chaju}>距离分红还差{(bonusNeedMoney - tradeBalance) > 0 ? (bonusNeedMoney - tradeBalance).toFixed(2) : 0.00}元</Text>

                        <Text style={styles.fenghong}>预计该次分红金可得<Text style={{ color: '#F00006', fontSize: 13 }}>
                            {currentUserSettle || 0}
                        </Text>元</Text>

                    </View>
                </View>

            </ImageBackground>


        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.headerHeight + ScreenUtils.autoSizeWidth(271)
    },
    imgBg: {
        width: ScreenUtils.width,
        height: ScreenUtils.headerHeight + ScreenUtils.autoSizeWidth(173)
    },
    whiteBg: {
        marginTop: ScreenUtils.headerHeight + px2dp(15),
        backgroundColor: DesignRule.white,
        marginHorizontal: px2dp(15),
        height: ScreenUtils.autoSizeWidth(249),
        borderRadius: px2dp(10)
    },
    headerImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(30)
    },
    shopInContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center'
    },
    shopName: {
        fontSize: 13,
        color: '#333333'
    },
    shopId: {
        marginTop: px2dp(5),
        fontSize: 11,
        color: '#333333'
    },
    starRow: {
        marginTop: px2dp(5),
        flexDirection: 'row',
        alignItems: 'center'
    },
    // 公告
    announcementContainer: {
        width: 64,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: '#F00006',
        justifyContent: 'center',
        alignItems: 'center'
    },
    announcementTitle: {
        fontSize: 11,
        color: '#F00006'
    },

    whiteBgTopRow: {
        marginTop: px2dp(27),
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center'
    },
    gongxian: {
        marginLeft: 5,
        fontSize: 13,
        color: '#333333'
    },
    //0/10000
    progress: {
        color: '#F00006',
        fontSize: 11
    },
    progressBg: {
        height: px2dp(7),
        backgroundColor: '#E4E4E4'
    },
    chaju: {
        marginTop: px2dp(10),
        color: DesignRule.textColor_secondTitle,
        fontSize: 11
    },
    fenghong: {
        marginTop: px2dp(10),
        color: DesignRule.textColor_secondTitle,
        fontSize: 12
    }
});

