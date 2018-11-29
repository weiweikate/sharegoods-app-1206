/**
 * 我的店铺-店铺头
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import DesignRule from 'DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';
import TextTicker from 'react-native-text-ticker';

const HeaderBarBgImg = res.myShop.txbg_02;
const StarImg = res.myShop.dj_03;


export default class ShopHeader extends Component {

    static propTypes = {
        onPressShopAnnouncement: PropTypes.func,//点击公告
        item: PropTypes.object
    };


    render() {
        let {
            headUrl, name, storeNumber, storeStarId,
            storeNoticeDTO, profile
        } = this.props.item;
        const { content } = storeNoticeDTO || {};

        const starsArr = [];
        if (storeStarId && typeof storeStarId === 'number') {
            for (let i = 0; i < storeStarId; i++) {
                i <= 2 && starsArr.push(i);
            }
        }
        return <View>
            <Image source={HeaderBarBgImg}
                   style={[styles.imgBg]}/>
            <View style={{
                height: content ? px2dp(20) : 0,
                marginTop: ScreenUtils.headerHeight,
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center'
            }}>
                <View style={{ marginHorizontal: 15 }}>
                    <TextTicker
                        style={{ fontSize: 12, color: DesignRule.white }}
                        loop
                        bounce
                        repeatSpacer={100}
                        marqueeDelay={2000}
                    >{content || ''}</TextTicker>
                </View>
            </View>
            <View style={[styles.whiteBg]}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: px2dp(15),
                    marginHorizontal: px2dp(20)
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

                    <TouchableOpacity onPress={this.props.onPressShopAnnouncement}
                                      style={styles.announcementContainer}>
                        <Text style={styles.announcementTitle}>店铺公告</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginTop: px2dp(15),
                    marginBottom: px2dp(10),
                    backgroundColor: '#E4E4E4',
                    height: 0.5
                }}/>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 13,
                    marginHorizontal: px2dp(20)
                }}>店铺简介</Text>
                <Text style={{
                    color: DesignRule.textColor_secondTitle,
                    fontSize: 12,
                    marginHorizontal: px2dp(20),
                    marginTop: px2dp(5), marginBottom: px2dp(15)
                }}>{StringUtils.isNoEmpty(profile) ? profile : '店家很懒，没有介绍自己~'}</Text>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    imgBg: {
        position: 'absolute',
        left: 0, top: 0,
        width: ScreenUtils.width
    },
    whiteBg: {
        marginTop: px2dp(25),
        marginBottom: px2dp(15),
        backgroundColor: DesignRule.white,
        marginHorizontal: px2dp(15),
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
    }
});

