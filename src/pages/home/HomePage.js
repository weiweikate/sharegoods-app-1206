/**
 * 首页
 */

import React, { Component } from 'react';
import { View, StyleSheet,  FlatList, Text, RefreshControl } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import {observer} from 'mobx-react';
import { homeType, homeModule } from './Modules'
import HomeSearchView from './HomeSearchView'
import HomeClassifyView from './HomeClassifyView'
import HomeStarShopView from './HomeStarShopView'
import HomeTodayView from './HomeTodayView'
import HomeRecommendView from './HomeRecommendView'
import HomeSubjectView from './HomeSubjectView'
import HomeBannerView from './HomeBannerView'
import HomeAdView from './HomeAdView'
import HomeGoodsView from './HomeGoodsView'
import HomeUserView from './HomeUserView'
import ShowView from '../show/ShowView'

const { px2dp, statusBarHeight } = ScreenUtils;

const bannerHeight = px2dp(220)

@observer
export default class HomePage extends Component {

    st = 0;
    headerH = statusBarHeight + 44;

    constructor(props) {
        super(props)
        homeModule.loadHomeList()
    }

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < bannerHeight) {
            this.st = Y / (bannerHeight - this.headerH);
        } else {
            this.st = 1;
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    }

    _keyExtractor = (item, index) => item.id + ''
    _renderItem = (item) => {
        let data = item.item
        if (data.type === homeType.swiper) {
            return <HomeBannerView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.classify) {
            return <HomeClassifyView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.ad) {
            return <HomeAdView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.today) {
            return <HomeTodayView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.recommend) {
            return <HomeRecommendView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.subject) {
            return <HomeSubjectView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.starShop) {
            return <HomeStarShopView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.user) {
            return <HomeUserView navigation = {this.props.navigation}/>
        }else if (data.type === homeType.goods) {
            return <HomeGoodsView data={data.itemData} navigation = {this.props.navigation}/>
        } else if (data.type === homeType.show) {
            return <ShowView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.goodsTitle) {
            return <View style={styles.titleView}>
                <Text style={styles.title}>为你推荐</Text>
            </View>
        }
        return <View/>
    }

    _onEndReached() {
        homeModule.loadMoreHomeList()
    }

    _onRefresh() {
        homeModule.loadHomeList()
    }

    render() {
        const { homeList } = homeModule
        return (
            <View style={styles.container}>
                <FlatList
                    data={homeList}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={this._keyExtractor.bind(this)}
                    onScroll={this._onScroll.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={homeModule.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            title="下拉刷新"
                            tintColor="#999"
                            titleColor="#999"
                        />
                    }
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.1}
                />
                <View style={styles.navBarBg} ref={e => this._refHeader = e} />
                <View style={styles.navBar}>
                    <HomeSearchView navigation={this.props.navigation}/>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    // headerBg
    navBarBg: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        height: statusBarHeight + 44,
        width: ScreenUtils.width,
        paddingTop: statusBarHeight,
        backgroundColor: '#d51243',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        opacity: 0
    },
    // header
    navBar: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        height: statusBarHeight + 44,
        width: ScreenUtils.width,
        paddingTop: statusBarHeight,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 3
    },
    titleView: {
        backgroundColor: '#fff',
        height: px2dp(53),
        marginTop:px2dp(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    }
});
