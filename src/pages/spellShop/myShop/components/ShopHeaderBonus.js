import React, { Component } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import LottieView from 'lottie-react-native';

const { px2dp } = ScreenUtils;
import res from '../../res';
import StringUtils from '../../../../utils/StringUtils';
import {
    MRText as Text
} from '../../../../components/ui';


const CCZImg = res.myShop.ccz_03;
const { shop_box_0, shop_box_25, shop_box_75, shop_box_100 } = res.myShop;

export default class ShopHeaderBonus extends Component {

    render() {
        //tradeBalance本月收入 bonusNeedMoney总额 //进度
        // currentUserSettle当前用户的钱(预计分红)
        //贡献度currentUserSettle/tradeBalance
        let {
            tradeBalance = 0, bonusNeedMoney = 0, currentUserSettle = 0, nextBonusTime
        } = this.props.storeData;
        tradeBalance = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        currentUserSettle = StringUtils.isEmpty(currentUserSettle) ? 0 : parseFloat(currentUserSettle);
        bonusNeedMoney = StringUtils.isEmpty(bonusNeedMoney) ? 0 : parseFloat(bonusNeedMoney);

        //个人贡献度去掉
        // let gxd = (tradeBalance === 0 ? 0.00 : ((currentUserSettle / tradeBalance) * 100)).toFixed(2);
        let progress = bonusNeedMoney === 0 ? 0.00 : ((tradeBalance / bonusNeedMoney) * 100).toFixed(2);
        let box_img = shop_box_0;
        if (progress >= 100) {
            box_img = shop_box_100;
        } else if (progress >= 75) {
            box_img = shop_box_75;
        } else if (progress >= 25) {
            box_img = shop_box_25;
        }
        return (
            <View>
                <View style={styles.whiteBg}>
                    <View style={styles.whiteBgTopRow}>
                        <Image source={CCZImg}/>
                        <Text style={styles.gongXian}>{`本店铺任务完成度${progress}%`}</Text>
                    </View>
                    <View style={{
                        marginHorizontal: px2dp(10),
                        backgroundColor: '#E4E4E4',
                        height: 0.5
                    }}/>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: px2dp(12),
                        marginBottom: px2dp(20)
                    }}>
                        <View style={{ width: px2dp(100), alignItems: 'center' }}>
                            <ImageBackground style={{
                                width: px2dp(60),
                                height: px2dp(60)
                            }} source={box_img}>
                                <LottieView autoPlay
                                            style={{
                                                width: px2dp(60),
                                                height: px2dp(60)
                                            }}
                                            imageAssetsFolder={'lottie/spellShop'}
                                            source={require('./animation_money.json')}
                                            loop/>
                            </ImageBackground>
                            <Text style={{
                                color: DesignRule.mainColor,
                                fontSize: 10,
                                marginTop: px2dp(5)
                            }} numberOfLines={2} allowFontScaling={false}>{tradeBalance}<Text
                                style={{ color: DesignRule.textColor_mainTitle }}>元待分红</Text></Text>
                        </View>

                        <View>
                            <View style={{ justifyContent: 'space-between', flex: 1 }}>
                                <Text style={{
                                    fontSize: 12,
                                    marginTop: px2dp(5),
                                    color: DesignRule.textColor_secondTitle
                                }}>距离本月品牌奖励还有<Text
                                    style={{ color: DesignRule.textColor_redWarn }}>{nextBonusTime || ''}</Text>天</Text>
                                <Text style={{
                                    fontSize: 12,
                                    marginTop: px2dp(5),
                                    color: DesignRule.textColor_secondTitle
                                }} numberOfLines={2}>预计本月个人销售额外可得品牌奖励<Text
                                    style={{ color: DesignRule.textColor_redWarn }}>{currentUserSettle}</Text>元</Text>
                                <Text style={{
                                    fontSize: 10,
                                    marginTop: px2dp(5),
                                    color: DesignRule.textColor_instruction
                                }}>任务达到100%，才可以获得奖励</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    whiteBg: {
        marginBottom: px2dp(15),
        backgroundColor: DesignRule.white,
        marginHorizontal: px2dp(15),
        borderRadius: px2dp(10)
    },

    whiteBgTopRow: {
        height: px2dp(39),
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center'
    },
    gongXian: {
        marginLeft: 5,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    }

});
