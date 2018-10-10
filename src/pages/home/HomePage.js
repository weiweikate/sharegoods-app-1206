/**
 * 首页
 */

import React, { Component } from 'react';
import { View, StyleSheet,  FlatList, Text } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import {observer} from 'mobx-react';
import { homeType, HomeModule } from './Modules'
import HomeSearchView from './HomeSearchView'
import HomeClassifyView from './HomeClassifyView'
import HomeStarShopView from './HomeStarShopView'
import HomeTodayView from './HomeTodayView'
import HomeRecommendView from './HomeRecommendView'
import HomeSubjectView from './HomeSubjectView'
import HomeBannerView from './HomeBannerView'
import HomeAdView from './HomeAdView'
import HomeGoodsView from './HomeGoodsView'

const { px2dp, statusBarHeight } = ScreenUtils;

const bannerHeight = px2dp(220)

@observer
export default class HomePage extends Component {

    st = 0;
    headerH = statusBarHeight + 44;
    constructor(props) {
        super(props)
        this.homeModule = new HomeModule()
        this.homeModule.loadHomeList()
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
    };

    _keyExtractor = (item, index) => item.id + ''
    _renderItem = (item) => {
        let data = item.item
        console.log('_renderItem', data.type)
        if (data.type === homeType.swiper) {
            return <HomeBannerView/>
        } else if (data.type === homeType.classify) {
            return <HomeClassifyView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.ad) {
            return <HomeAdView/>
        } else if (data.type === homeType.today) {
            return <HomeTodayView/>
        } else if (data.type === homeType.recommend) {
            return <HomeRecommendView/>
        } else if (data.type === homeType.subject) {
            return <HomeSubjectView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.starShop) {
            return <HomeStarShopView/>
        } else if (data.type === homeType.goods) {
            let itemData = [
                {imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/1b4c510fd9f9d72ad3f6b420df2a2834349bbb79.jpg', title: '海外品牌 100%纯棉', discribe: 'TRENDIANO男装夏装纯棉宽松字母印花圆领短袖...', money: '123.00'},
                {imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/1b4c510fd9f9d72ad3f6b420df2a2834349bbb79.jpg', title: '海外品牌 100%纯棉', discribe: 'TRENDIANO男装夏装纯棉宽松字母印花圆领短袖...', money: '123.00'},
            ]
            return <HomeGoodsView data={itemData}/>
        } else if (data.type === homeType.goodsTitle) {
            return <View style={styles.titleView}>
                <Text style={styles.title}>为你推荐</Text>
            </View>
        }
        return <View/>
    }

    render() {
        const { homeList } = this.homeModule
        return (
            <View style={styles.container}>
                <FlatList
                    data={homeList}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={this._keyExtractor.bind(this)}
                    onScroll={this._onScroll.bind(this)}
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    }
});
