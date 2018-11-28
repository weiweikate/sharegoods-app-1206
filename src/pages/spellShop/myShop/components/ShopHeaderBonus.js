import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';

const { px2dp } = ScreenUtils;
import res from '../../res';
import StringUtils from '../../../../utils/StringUtils';

const CCZImg = res.myShop.ccz_03;

export default class ShopHeaderBonus extends Component {

    render() {
        //tradeBalance本月收入 bonusNeedMoney总额
        // currentUserSettle当前用户的钱(预计分红)
        //贡献度currentUserSettle/tradeBalance
        let {
            headUrl, name, storeNumber, storeStarId, userStatus,
            tradeBalance = 0, bonusNeedMoney = 0, currentUserSettle = 0,
            storeNoticeVO = {}, profile
        } = this.props.storeData;
        const { content } = storeNoticeVO;
        tradeBalance = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        currentUserSettle = StringUtils.isEmpty(currentUserSettle) ? 0 : parseFloat(currentUserSettle);

        return (
            <View>
                <View style={styles.whiteBg}>
                    <View style={styles.whiteBgTopRow}>
                        <Image source={CCZImg}/>
                        <Text style={styles.gongXian}>
                            贡献度：{`${tradeBalance === 0 ? 0 : ((currentUserSettle / tradeBalance) * 100).toFixed(2)}`}%
                        </Text>
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
                        <View style={{ width: px2dp(60), height: px2dp(60), marginLeft: px2dp(20) }}/>
                        <View>
                            <Text style={{
                                fontSize: 12,
                                marginTop: px2dp(5),
                                color: DesignRule.textColor_secondTitle
                            }}>本次分红任务完成度<Text style={{ color: DesignRule.textColor_redWarn }}>68%</Text></Text>
                            <Text style={{
                                fontSize: 12,
                                marginTop: px2dp(5),
                                color: DesignRule.textColor_secondTitle
                            }}>距离本次分红还有<Text style={{ color: DesignRule.textColor_redWarn }}>3</Text>天</Text>
                            <Text style={{
                                fontSize: 12,
                                marginTop: px2dp(5),
                                color: DesignRule.textColor_secondTitle
                            }}>预计本次可得额外品牌分红奖励金<Text style={{ color: DesignRule.textColor_redWarn }}>0</Text>元</Text>
                            <Text style={{
                                fontSize: 10,
                                marginTop: px2dp(5),
                                color: DesignRule.textColor_instruction
                            }}>分红任务达到100%，才可以分红</Text>
                        </View>
                    </View>
                </View>


                {/*<View style={{ flex: 1, alignItems: 'center' }}>*/}
                {/*<Text style={styles.progress}>{tradeBalance || 0}<Text style={{*/}
                {/*color: DesignRule.textColor_secondTitle*/}
                {/*}}>/{bonusNeedMoney || 0}</Text></Text>*/}

                {/*<ImageBackground source={ProgressImg} style={{*/}
                {/*overflow: 'hidden',*/}
                {/*marginTop: px2dp(5),*/}
                {/*borderRadius: px2dp(3.5),*/}
                {/*height: px2dp(7),*/}
                {/*width: 315 / 375 * SCREEN_WIDTH*/}
                {/*}}>*/}
                {/*<View style={[styles.progressBg, {*/}
                {/*marginLeft: 315 / 375 * SCREEN_WIDTH * (bonusNeedMoney === 0 ? 0 :*/}
                {/*(tradeBalance / bonusNeedMoney > 1 ? 1 : tradeBalance / bonusNeedMoney))*/}
                {/*}]}/>*/}
                {/*</ImageBackground>*/}

                {/*<Text*/}
                {/*style={styles.chaju}>距离分红还差{(bonusNeedMoney - tradeBalance) > 0 ? (bonusNeedMoney - tradeBalance).toFixed(2) : 0.00}元</Text>*/}

                {/*{userStatus === 1 ?*/}
                {/*<Text style={styles.fenghong}>预计该次分红金可得<Text style={{ color: '#F00006', fontSize: 13 }}>*/}
                {/*{currentUserSettle || 0}*/}
                {/*</Text>元</Text> : null}*/}

                {/*</View>*/}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    whiteBg: {
        marginTop: px2dp(15),
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
