import React, { Component } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import ImageLoader from '@mr/image-placeholder';
import { limitGoModule, limitStatus } from '../model/HomeLimitGoModel';
import DesignRule from '../../../constants/DesignRule';
import resHome from '../res';
import res from '../res';
import { homeLinkType, homeRoute } from '../HomeTypes';
import { UIText } from '../../../components/ui';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import user from '../../../model/user';
import RouterMap, { routeNavigate, routePush } from '../../../navigation/RouterMap';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { observer } from 'mobx-react';
import { getSGspm_home, HomeSource } from '../../../utils/OrderTrackUtil';

const { px2dp } = ScreenUtils;

@observer
export default class HomeLimitGoGoodsView extends Component {

    _goToDetail(index, value, activityData) {
        routePush(homeRoute[homeLinkType.spike], { productCode: value.prodCode, ...getSGspm_home(HomeSource.limitGo, index, limitGoModule.currentPage) });
        // 限时购商品点击埋点
        track(trackEvent.SpikeProdClick,
            {
                'timeRangeId': activityData.activityCode,
                'timeRange': activityData.time,
                'timeRangeStatus': activityData.title,
                'supCode': value.prodCode,
                'spuName': value.name,
                'spuComment': value.promotionStatus === limitStatus.doing
                    ? '马上抢' :
                    (value.promotionStatus === limitStatus.noBegin
                        ? (value.promotionAttention ? '已关注' : '提前关注') :
                        (value.promotionStatus === limitStatus.end
                            ? '已抢光' : '已结束')),
                'productIndex': index
            });
    }

    render() {
        let { spikeList, currentPage, tabWidth } = limitGoModule;
        let activityData = '';
        if (spikeList && spikeList[currentPage]) {
            activityData = spikeList[currentPage];
        }

        let index = 1;
        let data = this.props.data;
        return (
            <TouchableWithoutFeedback key={index}
                                      onPress={() => this._goToDetail(index, data || {}, activityData)}>
                <View style={{ marginTop: data.marginTop }}>
                    <GoodsItem
                        key={index}
                        item={data || {}}
                        activityCode={activityData.activityCode}
                        labelUrl={activityData.labelUrl}
                        labelWidth={tabWidth}
                        navigate={this.props.navigate}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const GoodsItem = ({ item, activityCode, labelUrl, labelWidth, navigate }) => {
    const promotionSaleRateS = item.promotionSaleRate || 0;
    const discountString = (item.promotionPrice / item.originalPrice * 10) + '';
    let discountNum = discountString.substring(0, discountString.indexOf('.') + 2);
    discountNum = discountNum < 0.1 ? '0.1' : discountNum;
    let progressW = px2dp(110) + px2dp((promotionSaleRateS - 0.9) * 100);
    return <View style={styles.goodsItem}>
        <ImageLoader
            source={{ uri: item.imgUrl }}
            showPlaceholder={false}
            width={px2dp(130)}
            height={px2dp(130)}
            style={styles.goodsImage}>
            {item.promotionStatus === limitStatus.end ?
                <Image source={resHome.home_sallout}
                       style={styles.goodsTag}/> : null}
            <Image source={{ uri: labelUrl }}
                   resizeMode={'contain'}
                   style={{ height: px2dp(18), width: labelWidth, top: 5, left: 0, position: 'absolute' }}/>
        </ImageLoader>
        <View style={styles.goodsContent}>
            <Text style={styles.goodsTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.text} numberOfLines={1}>{item.secondName}</Text>
            {
                item.promotionStatus === limitStatus.noBegin ?
                    <Text style={[styles.text, {
                        color: '#999',
                        fontSize: px2dp(10)
                    }]}>已有{item.promotionAttentionNum}人关注了</Text>
                    :
                    (
                        promotionSaleRateS > 0.9 && promotionSaleRateS < 1 ?
                            <View style={{
                                width: px2dp(120),
                                height: px2dp(12),
                                marginTop: px2dp(5),
                                borderRadius: px2dp(6),
                                backgroundColor: 'rgba(255,0,80,0.1)'
                            }}>
                                <ImageBackground style={[styles.leaveView, { width: progressW }]}
                                                 source={resHome.home_limit_progress}
                                                 resizeMode={'stretch'}>
                                    <UIText value={'即将售罄'}
                                            style={{ fontSize: px2dp(9), color: 'white', marginLeft: px2dp(6) }}/>
                                </ImageBackground>
                            </View>
                            : null
                    )
            }
            <View style={{
                flexDirection: 'column',
                flex: 1
            }}>
                <View style={{
                    justifyContent: 'flex-end',
                    flex: 1
                }}>
                    <ImageBackground source={resHome.discount} style={{
                        height: px2dp(14),
                        width: px2dp(33),
                        marginBottom: px2dp(-6),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <UIText value={discountNum + '折'} style={{ fontSize: px2dp(9), color: 'white' }}/>
                    </ImageBackground>
                </View>
                <View style={styles.moneyView}>
                    {
                        item.promotionPrice
                            ?
                            <Text style={styles.money}>¥<Text
                                style={styles.moneyText}>{item.promotionPrice + ' '}</Text>
                                <Text style={styles.originMoneyText}>¥{item.originalPrice}</Text>
                            </Text>
                            :
                            null
                    }
                    <View style={{ flex: 1 }}/>
                    <GoodsItemButton data={item} activityCode={activityCode} navigate={navigate}/>
                </View>
            </View>
        </View>
    </View>;
};

const GoodsItemButton = ({ data, activityCode, navigate }) => {
    if (data.promotionStatus === limitStatus.doing) {
        return <LinearGradient style={styles.button}
                               start={{ x: 0, y: 0 }}
                               end={{ x: 1, y: 0 }}
                               colors={['#FF0050', '#FC5D39']}>
            <UIText value={'马上抢'} style={styles.buttonTitle}/>
            <Image source={res.button.white_go} style={{ width: 7, height: 13, marginLeft: 3, marginTop: 1.5 }}/>
        </LinearGradient>;
    } else if (data.promotionStatus === limitStatus.noBegin) {
        return <NoMoreClick onPress={() => {
            if (user.isLogin) {
                data.promotionAttention ? limitGoModule.cancleFollow(data.prodCode, activityCode) : limitGoModule.followSpike(data.prodCode, activityCode);
            } else {
                routeNavigate(RouterMap.LoginPage);
            }
        }} style={styles.buttonWill}>
            <Text ref={e => this.follow = e} style={styles.buttonWillTitle}>
                {data.promotionAttention ? '已关注' : '提前关注'}
            </Text>
        </NoMoreClick>;
    } else {
        return <View style={styles.disbutton}>
            <Text style={styles.disbuttonTitle}>
                {data.promotionStatus === limitStatus.end ? '已抢光' : '已结束'}
            </Text>
        </View>;
    }
};

const styles = StyleSheet.create({
    goodsItem: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(5),
        height: px2dp(130),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    goodsImage: {
        width: px2dp(130),
        height: px2dp(130),
        borderTopLeftRadius: px2dp(5),
        borderBottomLeftRadius: px2dp(5),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    goodsTag: {
        width: px2dp(80),
        height: px2dp(80)
    },
    goodsContent: {
        marginLeft: px2dp(10),
        marginTop: px2dp(13),
        marginBottom: px2dp(10),
        flex: 1
    },
    text: {
        color: DesignRule.mainColor,
        fontSize: px2dp(12),
        lineHeight: 20
    },
    goodsTitle: {
        color: '#333',
        fontSize: px2dp(15),
        marginRight: px2dp(10),
        fontWeight: '600',
        lineHeight: 20
    },
    moneyView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: px2dp(5)
    },
    money: {
        fontSize: px2dp(12),
        color: DesignRule.mainColor
    },
    moneyText: {
        fontSize: px2dp(20),
        marginLeft: px2dp(3),
        color: DesignRule.mainColor
    },
    originMoneyText: {
        fontSize: px2dp(12),
        color: DesignRule.textColor_instruction,
        textDecorationLine: 'line-through'
    },
    button: {
        flexDirection: 'row',
        width: px2dp(70),
        height: px2dp(32),
        marginRight: px2dp(4),
        borderRadius: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTitle: {
        color: '#fff',
        fontSize: px2dp(14)
    },
    buttonWill: {
        width: px2dp(70),
        height: px2dp(32),
        marginRight: px2dp(4),
        borderRadius: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        backgroundColor: 'rgba(255,0,80,0.1)'
    },
    buttonWillTitle: {
        color: DesignRule.mainColor,
        fontSize: px2dp(14)
    },
    disbutton: {
        width: px2dp(70),
        height: px2dp(32),
        marginRight: px2dp(4),
        borderRadius: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.textColor_placeholder
    },
    disbuttonTitle: {
        color: 'white',
        fontSize: px2dp(14)
    },
    leaveView: {
        height: px2dp(12),
        justifyContent: 'center'
    }
});
