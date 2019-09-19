/**
 * 我的店铺-店铺头
 */
import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';
import TextTicker from 'react-native-text-ticker';
import AvatarImage from '../../../../components/ui/AvatarImage';
import {
    MRText as Text
} from '../../../../components/ui';


const HeaderBarBgImg = res.myShop.txbg_02;
const StarImg = res.myShop.dj_03;

export default class ShopHeader extends Component {

    render() {
        const { headUrl, name, showNumber, level, profile, roleType } = this.props.storeData;
        let { content } = this.props;
        content = (content || '').replace(/[\r\n]/g, '');
        const starsArr = [];
        if (level && typeof level === 'number') {
            for (let i = 0; i < level; i++) {
                i <= 2 && starsArr.push(i);
            }
        }
        const showTicker = StringUtils.isNoEmpty(content) && StringUtils.isNoEmpty(roleType);
        return <View>
            <Image source={HeaderBarBgImg}
                   style={[styles.imgBg]}/>
            <View style={{
                height: showTicker ? px2dp(20) : 0,
                marginTop: ScreenUtils.headerHeight,
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center'
            }}>
                {showTicker &&
                <View style={{ marginHorizontal: 15 }}>
                    <TextTicker
                        style={{ fontSize: 12, color: DesignRule.white }}
                        loop
                        bounce
                        repeatSpacer={100}
                        marqueeDelay={2000}
                    >{`公告: ${content}`}</TextTicker>
                </View>}
            </View>

            <View style={[styles.whiteBg]}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: px2dp(15),
                    marginHorizontal: px2dp(20)
                }}>
                    <AvatarImage style={styles.headerImg} borderRadius={px2dp(30)}
                                 source={{ uri: headUrl || '' }}/>
                    <View style={styles.shopInContainer}>
                        <Text style={styles.shopName}>{name || ''}</Text>
                        <Text style={styles.shopId}>ID：{showNumber || ''}</Text>
                        <View style={styles.starRow}>
                            <Text style={{ fontSize: 11, color: '#999999' }}>店铺星级：</Text>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} source={StarImg} style={{ width: 18, height: 18 }}/>;
                                })
                            }
                        </View>
                    </View>

                    {roleType === 0 ? <TouchableOpacity onPress={this.props.onPressShopAnnouncement}
                                                        style={styles.announcementContainer}>
                        <Text style={styles.announcementTitle} allowFontScaling={false}>店铺公告</Text>
                    </TouchableOpacity> : null}
                </View>
                <View style={{
                    marginTop: px2dp(15),
                    marginBottom: px2dp(10),
                    backgroundColor: '#E4E4E4',
                    height: 0.5
                }}/>
                <ScrollView style={{ maxHeight: 83 }}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 13,
                        marginHorizontal: px2dp(20)
                    }} allowFontScaling={false}>店铺简介</Text>
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 12,
                        marginHorizontal: px2dp(20),
                        marginTop: px2dp(5), marginBottom: px2dp(15)
                    }} allowFontScaling={false}>{StringUtils.isNoEmpty(profile) ? profile : '店家很懒，没有介绍自己~'}</Text>
                </ScrollView>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    imgBg: {
        position: 'absolute',
        left: 0, top: 0,
        width: ScreenUtils.width, height: px2dp(227)
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
        height: px2dp(60)
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

