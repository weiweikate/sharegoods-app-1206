import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import HomeTitleView from './HomeTitleView';
import ImageLoader from '@mr/image-placeholder';
import { limitGoModule, limitStatus } from '../model/HomeLimitGoModel';
import DesignRule from '../../../constants/DesignRule';
import resHome from '../res';
import { homeLinkType, homeRoute } from '../HomeTypes';
import { MRText } from '../../../components/ui';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import user from '../../../model/user';
import RouterMap, { routeNavigate, routePush } from '../../../navigation/RouterMap';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import productRes from '../../product/res/product';
import res from '../res'
import XiuDouResultModal from './XiuDouResultModal';

const { px2dp } = ScreenUtils;
const { saleSmallSkill } = productRes.pSacle;

export default class HomeLimitGoView extends Component {

    _onChangeTab(number) {
        this._selectedLimit(number.i);
    }

    _selectedLimit(number) {
        let index = number !== -1 ? number : this.state.page;
        let limit = limitGoModule.spikeList[index];
        if (limit) {
            limitGoModule.changeLimitGo(number);
            // 限时购tab点击埋点
            track(trackEvent.SpikeTimeClick,
                {
                    'timeRangeId': limit.activityCode,
                    'timeRange': limit.time,
                    'timeRangeStatus': limit.title
                });
        }
    }

    _renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const textColor = isTabActive ? '#FC533B' : '#333';
        const selectedValue = (value) => value.id === name;
        const selectedModels = limitGoModule.spikeList.filter(selectedValue);
        let selected = null;
        if (selectedModels) {
            selected = selectedModels[0];
        }
        if (!selected) {
            return <View/>;
        }
        const { time, title } = selected;
        return <TouchableOpacity
            key={`${name}_${page}`}
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[styles.tab, { marginLeft: page === 0 ? 0 : px2dp(12) }]}>
                <Text style={[styles.time, { color: textColor }]}>
                    {time}
                </Text>
                {
                    isTabActive
                        ?
                        <LinearGradient style={styles.active}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FF0050', '#FC5D39']}
                        >
                            <Text style={styles.activeTitle}>
                                {title}
                            </Text>
                        </LinearGradient>
                        :
                        <View style={styles.normal}>
                            <Text style={styles.normalTitle}>
                                {title}
                            </Text>
                        </View>

                }
            </View>
        </TouchableOpacity>;
    }

    _goToDetail(index, value, activityData) {
        routePush(homeRoute[homeLinkType.spike], { productCode: value.prodCode });
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

    _renderGoodsList(activityData) {
        let goodsItems = [];
        let goods = activityData.goods || [];
        goods.map((data, index) => {
            goodsItems.push(
                <TouchableWithoutFeedback key={index}
                                          onPress={() => this._goToDetail(index, data || {}, activityData)}>
                    <View>
                        <GoodsItem key={index} item={data || {}} activityCode={activityData.activityCode}
                                   navigate={this.props.navigate}/>
                        {index === goods.length - 1 ? null : <View style={{ height: px2dp(10) }}/>}
                    </View>
                </TouchableWithoutFeedback>
            );
        });
        return goodsItems.length > 0 ? goodsItems : null;
    }

    openModal(){
        this.modal && this.modal.open();
    }

    seeMore() {
        routePush('HtmlPage', {
            uri: `/spike`
        });
    }
    render() {
        let viewItems = [];
        const { spikeList } = limitGoModule;
        spikeList.map((data, index) => {
            viewItems.push(
                <View key={index}
                      tabLabel={data.id}>
                    {this._renderGoodsList(data || {})}
                </View>
            );
        });

        if (viewItems.length === 0) {
            return null;
        }

        return (
            <View style={styles.container}>
                <View style={{ paddingHorizontal: px2dp(15), flexDirection: 'row', alignItems: 'center'}}>
                    <HomeTitleView title={'限时购'}/>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity onPress={()=>{this.seeMore()}}>
                    <MRText style={{color: DesignRule.textColor_placeholder, fontSize: px2dp(12)}}>更多></MRText>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>{this.openModal()}}>
                    <Image source={res.limitGoHeader} style={{height: px2dp(60), width: ScreenUtils.width, marginTop: px2dp(-5)}}/>
                </TouchableOpacity>
                <ScrollableTabView
                    ref={ref => {
                        this.scrollableTabView = ref;
                    }}
                    style={styles.tabBar}
                    page={limitGoModule.currentPage !== -1 ? limitGoModule.currentPage : limitGoModule.initialPage}
                    renderTabBar={() => <ScrollableTabBar style={styles.scrollTab} underlineStyle={styles.underline}
                                                          renderTab={this._renderTab.bind(this)}/>}
                    tabBarUnderlineStyle={styles.underline}
                    locked={true}
                    scrollWithoutAnimation={true}
                    onChangeTab={(index) => this._onChangeTab(index)}
                    showsVerticalScrollIndicator={false}
                    initialPage={limitGoModule.initialPage}
                >
                    {viewItems}
                </ScrollableTabView>
                <XiuDouResultModal ref={(ref)=>{this.modal = ref}}/>
            </View>);
    }
}

const GoodsItem = ({ item, activityCode, navigate }) => {
    const promotionSaleRateS = item.promotionSaleRate || 0;
    let ratePercentText = promotionSaleRateS > 0.9 ? '即将售罄' : `还剩${Math.ceil((1 - promotionSaleRateS) * 100)}%`;
    ratePercentText = promotionSaleRateS >= 1 ? '已抢光' : ratePercentText;
    let progressWidthS = promotionSaleRateS * px2dp(120);
    progressWidthS = progressWidthS < px2dp(12) ? px2dp(12) : progressWidthS;
    return <View style={styles.goodsItem}>
        <ImageLoader
            source={{ uri: item.imgUrl }}
            showPlaceholder={false}
            width={px2dp(120)}
            height={px2dp(120)}
            style={styles.goodsImage}>
            {item.promotionStatus === limitStatus.end ?
                <Image source={resHome.home_sallout}
                       style={styles.goodsTag}/> : null}
            <Image source={saleSmallSkill} style={{ width: 50, height: 18, top: 5, left: 0, position: 'absolute' }}/>
        </ImageLoader>
        <View style={styles.goodsContent}>
            <Text style={styles.goodsTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.text} numberOfLines={1}>{item.secondName}</Text>
            {
                item.promotionStatus === limitStatus.noBegin ?
                    <Text style={styles.text}>已有{item.promotionAttentionNum}人关注了</Text>
                    :
                    <View style={styles.leaveView}>
                        <View style={[styles.progressView, { width: progressWidthS }]}/>
                        <View style={styles.leaveAmountView}>
                            <MRText style={styles.leaveAmountText}>{ratePercentText}</MRText>
                        </View>
                    </View>
            }
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
    </View>;
};

const GoodsItemButton = ({ data, activityCode, navigate }) => {
    if (data.promotionStatus === limitStatus.doing) {
        return <LinearGradient style={styles.button}
                               start={{ x: 0, y: 0 }}
                               end={{ x: 1, y: 0 }}
                               colors={['#FF0050', '#FC5D39']}>
            <Text style={styles.buttonTitle}>
                马上抢
            </Text>
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
    container: {
        flex: 1,
        width: ScreenUtils.width,
        marginTop: px2dp(3)
    },
    tab: {
        minWidth: px2dp(60),
        alignItems: 'center'
    },
    tabBar: {
        width: ScreenUtils.width,
        borderWidth: 0
    },
    underline: {
        height: 0
    },
    time: {
        color: '#FC533B',
        fontWeight: '400',
        fontSize: 16
    },
    normal: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(60),
        height: px2dp(20),
        marginTop: px2dp(3),
        borderRadius: px2dp(10)
    },
    normalTitle: {
        color: '#333',
        fontSize: px2dp(12)
    },
    active: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(60),
        height: px2dp(20),
        marginTop: px2dp(3),
        borderRadius: px2dp(10)
    },
    activeTitle: {
        color: '#fff',
        fontSize: px2dp(12)
    },
    scrollTab: {
        borderWidth: 0,
        height: px2dp(53)
    },
    goodsItem: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(5),
        height: px2dp(140),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    goodsImage: {
        width: px2dp(120),
        height: px2dp(120),
        borderRadius: px2dp(5),
        marginLeft: px2dp(10),
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
        color: '#999',
        fontSize: px2dp(12),
        lineHeight: 20
    },
    goodsTitle: {
        color: '#333',
        fontSize: px2dp(14),
        marginRight: px2dp(10),
        lineHeight: 20
    },
    moneyView: {
        flex: 1,
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
        width: px2dp(82),
        height: px2dp(28),
        borderRadius: px2dp(14),
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTitle: {
        color: '#fff',
        fontSize: px2dp(14)
    },
    buttonWill: {
        width: px2dp(82),
        height: px2dp(28),
        borderRadius: px2dp(14),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ScreenUtils.onePixel,
        borderColor: DesignRule.mainColor
    },
    buttonWillTitle: {
        color: DesignRule.mainColor,
        fontSize: px2dp(14)
    },
    disbutton: {
        width: px2dp(82),
        height: px2dp(28),
        borderRadius: px2dp(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.textColor_placeholder
    },
    disbuttonTitle: {
        color: 'white',
        fontSize: px2dp(14)
    },
    leaveView: {
        marginTop: px2dp(5),
        backgroundColor: 'rgba(255,0,80,0.1)', borderRadius: px2dp(6), width: px2dp(120), height: px2dp(12)
    },
    progressView: {
        backgroundColor: DesignRule.mainColor, borderRadius: px2dp(6), height: px2dp(12)
    },
    leaveAmountView: {
        justifyContent: 'center', marginLeft: px2dp(8),
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
    },
    leaveAmountText: {
        fontSize: 10, color: DesignRule.textColor_white
    }
});
