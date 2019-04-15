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

const { px2dp } = ScreenUtils;

export default class HomeLimitGoView extends Component {

    _onChangeTab(number) {
        this._selectedLimit(number.i);
    }

    _selectedLimit(number) {
        let index = number !== -1 ? number : this.state.page;
        let limit = limitGoModule.timeList[index];
        if (limit) {
            limitGoModule.changeLimitGo(limit.id, number);
        }
    }

    _renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const textColor = isTabActive ? '#FC533B' : '#333';
        const selectedValue = (value) => value.id === name;
        const selectedModels = limitGoModule.timeList.filter(selectedValue);
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
                        <Text style={styles.normalTitle}>
                            {title}
                        </Text>
                }
            </View>
        </TouchableOpacity>;
    }

    _goToDetail(value) {
        this.props.navigate('topic/TopicDetailPage', {
            activityCode: value.activityCode,
            activityType: value.activityType
        });
    }

    _renderGoodsList(id) {
        let goodsItems = [];
        const goods = limitGoModule.goodsList[id];
        goods.map((value, index) => {
            goodsItems.push(
                <TouchableWithoutFeedback key={index} onPress={() => this._goToDetail(value)}>
                    <View>
                        <GoodsItem key={index} item={value}/>
                        <View style={{ height: px2dp(10) }}/>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
        return (<View>
            <View style={{ height: px2dp(10) }}/>
            {goodsItems}
        </View>);
    }

    render() {
        let viewItems = [];
        limitGoModule.timeList.map((value, index) => {
            viewItems.push(
                <View key={index} tabLabel={value.id}>
                    {this._renderGoodsList(value.id)}
                </View>
            );
        });

        if (viewItems.length === 0) {
            return null;
        }

        return (
            <View style={[styles.container, { height: limitGoModule.limitHeight }]}>
                <View style={{ paddingLeft: px2dp(15), marginTop: px2dp(3) }}>
                    <HomeTitleView title={'限时购'}/>
                </View>
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
            </View>);
    }
}

const GoodsItem = (item) => {
    let data = item.item;
    console.log('GoodsItem', data);
    return <View style={styles.goodsItem}>
        <ImageLoader
            source={{ uri: data.specImg }}
            showPlaceholder={false}
            width={px2dp(120)}
            height={px2dp(120)}
            style={styles.goodsImage}>
            {data.status === limitStatus.end ?
                <Image source={resHome.home_sallout}
                       style={styles.goodsTag}/> : null}
        </ImageLoader>
        <View style={styles.goodsContent}>
            <Text style={styles.goodsTitle} numberOfLines={2}>{data.productName}</Text>
            <Text style={styles.text}>{data.secondName}</Text>
            {data.status === limitStatus.doing ? null : <Text style={styles.text}>已有{data.subscribeCount}人关注了</Text>}
            <View style={{ flex: 1 }}/>
            <View style={styles.moneyView}>
                {
                    data.seckillPrice
                        ?
                        <Text style={styles.money}>¥<Text
                            style={styles.moneyText}>{data.seckillPrice + ' '}</Text>
                            <Text style={styles.originMoneyText}>¥{data.originalPrice}</Text>
                        </Text>
                        :
                        null
                }
                <View style={{ flex: 1 }}/>
                <GoodsItemButton data={data}/>
            </View>
        </View>
    </View>;
};

const GoodsItemButton = ({ data }) => {
    if (data.status === limitStatus.doing) {
        return <LinearGradient style={styles.button}
                               start={{ x: 0, y: 0 }}
                               end={{ x: 1, y: 0 }}
                               colors={['#FF0050', '#FC5D39']}>
            <Text style={styles.buttonTitle}>
                马上抢
            </Text>
        </LinearGradient>;
    } else if (data.status === limitStatus.noBegin) {
        return <View style={styles.buttonWill}>
            <Text style={styles.buttonWillTitle}>
                即将开抢
            </Text>
        </View>;
    } else {
        return <View style={styles.disbutton}>
            <Text style={styles.disbuttonTitle}>
                {data.status === limitStatus.end ? '抢光了' : '已结束'}
            </Text>
        </View>;
    }
};

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width
    },
    tab: {
        height: px2dp(59),
        minWidth: px2dp(60),
        alignItems: 'center'
    },
    tabBar: {
        height: px2dp(59),
        width: ScreenUtils.width,
        borderWidth: 0
    },
    underline: {
        height: 0
    },
    time: {
        color: '#FC533B',
        fontWeight: '600',
        fontSize: 16
    },
    normalTitle: {
        color: '#333',
        fontSize: px2dp(12),
        marginTop: px2dp(5)
    },
    active: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(60),
        height: px2dp(20),
        borderRadius: px2dp(10),
        marginTop: px2dp(5)
    },
    activeTitle: {
        color: '#fff',
        fontSize: px2dp(12)
    },
    scrollTab: {
        borderWidth: 0
    },
    goodsItem: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(5),
        height: px2dp(140),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    goodsImage: {
        width: px2dp(120),
        height: px2dp(120),
        marginTop: px2dp(-1.5),
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
        marginTop: px2dp(14),
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
        alignItems: 'center',
        marginBottom: px2dp(2),
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
        fontSize: px2dp(14),
        marginBottom: px2dp(2)
    },
    buttonWill: {
        width: px2dp(82),
        height: px2dp(28),
        borderRadius: px2dp(14),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ScreenUtils.onePixel,
        borderColor: '#FF0050',
        marginBottom: px2dp(2)
    },
    buttonWillTitle: {
        color: '#FF0050',
        fontSize: px2dp(14)
    },
    disbutton: {
        width: px2dp(82),
        height: px2dp(28),
        borderRadius: px2dp(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        marginBottom: px2dp(2)
    },
    disbuttonTitle: {
        color: '#fff',
        fontSize: px2dp(14)
    }
});
