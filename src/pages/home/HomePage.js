/**
 * 首页
 */

import React, { Component } from 'react';
import {
    View,
    TouchableHighlight,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Platform
} from 'react-native';
import RouterMap from '../../RouterMap';
import ScreenUtils from '../../utils/ScreenUtils';
import {observer} from 'mobx-react';
import { homeType, HomeModule } from './Modules'
import HomeSearchView from './HomeSearchView'
import HomeClassifyView from './HomeClassifyView'
import HomeStarShopView from './HomeStarShopView'
import HomeTodayView from './HomeTodayView'
import HomeRecommendView from './HomeRecommendView'
import HomeActivityView from './HomeActivityView'
import HomeBannerView from './HomeBannerView'
import HomeSubjectView from './HomeSubjectView'
import LinearGradient from 'react-native-linear-gradient'

const { px2dp, statusBarHeight } = ScreenUtils;
const DemoList = [
    {
        title: '专题页面类型one',
        uri: 'home/subject/SubjectPage',
        params: {
            columnNumber: 2,
            subjectType: 1
        }
    },
    {
        title: '专题页面类型Two',
        uri: 'home/subject/SubjectPage',
        params: {
            columnNumber: 3,
            subjectType: 0
        }
    },
    {
        title: '专题页面类型Three',
        uri: 'home/subject/SubOpenPrizePage'

    },
    {
        title: '优惠券',
        uri: 'mine/coupons/CouponsPage'
    },
    {
        title: '用户协议',
        uri: 'HtmlPage',
        params: {
            title: '用户协议内容',
            uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
        }
    },
    {
        title: '登录页面',
        uri: 'login/login/LoginPage'
    },
    {
        title: '我的订单',
        uri: 'order/order/MyOrderTestPage',
        params: {
            index: 0
        }
    },
    {
        title: '搜索页面',
        uri: RouterMap.SearchPage
    },
    {
        title: '分类搜索',
        uri: 'home/search/CategorySearchPage'
    }
];


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
        console.log(item)
        let data = item.item
        if (data.type === homeType.swiper) {
            return <HomeBannerView/>
        } else if (data.type === homeType.classify) {
            return <HomeClassifyView navigation = {this.props.navigation}/>
        } else if (data.type === homeType.subject) {
            return <HomeSubjectView/>
        } else if (data.type === homeType.today) {
            return <HomeTodayView/>
        } else if (data.type === homeType.recommend) {
            return <HomeRecommendView/>
        } else if (data.type === homeType.activity) {
            return <HomeActivityView/>
        } else if (data.type === homeType.starShop) {
            return <HomeStarShopView/>
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
                {/* <View style={styles.navBarBg} ref={e => this._refHeader = e} >
                    <HomeSearchView navigation={this.props.navigation}/>
                </View> */}
                <View style={styles.navBarBg} ref={e => this._refHeader = e} />
                <View style={styles.navBar}>
                    <HomeSearchView navigation={this.props.navigation}/>
                </View>
                {/* <LinearGradient colors={['#000000', 'transparent']}
                                style={[styles.navBar, { paddingTop: Platform.OS === 'ios' ? 44 : this.state.androidStatusH },
                                    {
                                        height: this.headerH + 14,
                                        opacity: 0.5
                                    }]}/>
                <View colors={['#000000', 'transparent']}
                      style={[styles.navBar, { paddingTop: Platform.OS === 'ios' ? 44 : this.state.androidStatusH },
                          {
                              height: this.headerH,
                              opacity: 0.8
                          }]}>
                    <Image source={require('./res/icons/logo.png')} style={styles.logo}/>
                    <TouchableOpacity style={styles.searchBox} onPress={()=> this.props.navigation.navigate('home/search/SearchPage')}>
                        <Image source={require('./res/icon_search.png')} style={styles.searchIcon}/>
                        <View style={styles.inputText}/>
                    </TouchableOpacity>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('message/MessageCenterPage')}>
                        <Image source={require('./res/icons/msg.png')} style={styles.scanIcon}/>
                    </TouchableHighlight>
                </View>  */}

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
    
});
