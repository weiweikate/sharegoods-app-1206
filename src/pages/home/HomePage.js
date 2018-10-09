/**
 * 首页
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
    Image
} from 'react-native';
import RouterMap from '../../RouterMap';
import ViewPager from '../../components/ui/ViewPager';
import ScreenUtils from '../../utils/ScreenUtils';
import {observer} from 'mobx-react';
import Modules from './Modules'
const { bannerModule } = Modules
import HomeSearchView from './HomeSearchView'
import HomeClassifyView from './HomeClassifyView'
import HomeStarShopView from './HomeStarShopView'
import HomeTodayView from './HomeTodayView'
import HomeRecommendView from './HomeRecommendView'
import HomeActivityView from './HomeActivityView'

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

class HomePage extends Component {

    st = 0;
    headerH = statusBarHeight + 44;

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

    constructor(props) {
        super(props)
        const {loadbBnnerList} = this.props.bannerModule
        loadbBnnerList && loadbBnnerList()
    }

    render() {
        const { bannerList } = this.props.bannerModule
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}
                            onScroll={this._onScroll}
                            scrollEventThrottle={10}>
                    <View style={styles.viewPager}>
                        <ViewPager
                            swiperShow={true}
                            arrayData={bannerList.toJS()}
                            renderItem={(item) => this.renderViewPageItem(item)}
                            dotStyle={{
                                height: px2dp(5),
                                width: px2dp(5),
                                borderRadius: px2dp(5),
                                backgroundColor: '#ffffff',
                                opacity: 0.4
                            }}
                            activeDotStyle={{
                                height: px2dp(5),
                                width: px2dp(30),
                                borderRadius: px2dp(5),
                                backgroundColor: '#ffffff'
                            }}
                            autoplay={true}
                            height={bannerHeight}
                        />
                    </View>
                    {/*头部分类*/}
                    <HomeClassifyView navigation = {this.props.navigation}/>
                    <View style={[styles.box, { paddingTop: 10, paddingBottom: 10 }]}>
                        <View style={styles.featureBox}>
                            <View style={[styles.featureBox1]}>
                                <Image
                                    source={{ uri: 'https://yanxuan.nosdn.127.net/b72c6486bc681f7b0dcb87d9af0ab1bb.png' }}
                                    style={styles.featureBox1Image}/>
                            </View>
                            <View style={[styles.featureBox2]}>
                                <Image
                                    source={{ uri: 'https://yanxuan.nosdn.127.net/957c8d117473d103b52ff694f372a346.png' }}
                                    style={styles.featureBox2Image}/>
                            </View>
                            <View style={[styles.featureBox3]}>
                                <Image
                                    source={{ uri: 'https://yanxuan.nosdn.127.net/e3bcfdff30c97ba87d510da8d9da5d09.png' }}
                                    style={styles.featureBox2Image}/>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.box]}>
                        {
                            DemoList.map(item => {
                                const { title, uri, params } = item;
                                return (
                                    <View key={title} style={styles.rowCell}>
                                        <TouchableHighlight
                                            style={{ flex: 1 }}
                                            underlayColor="#e6e6e6"
                                            onPress={() => {
                                                this.redirect(uri, params);
                                            }}
                                        >
                                            <View style={styles.eventRowsContainer}>
                                                <Text style={{ color: '#474747' }}>{title}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                );
                            })
                        }
                    </View>
                    <HomeStarShopView/>
                    <HomeTodayView/>
                    <HomeRecommendView/>
                    <HomeActivityView/>
                </ScrollView>
                <View style={styles.navBarBg} ref={e => this._refHeader = e} >
                    <HomeSearchView navigation={this.props.navigation}/>
                </View>
            </View>

        );
    }

    renderViewPageItem = (item) => {
        return (
            <Image
                source={{ uri: item }}
                style={{ height: px2dp(220), width: ScreenUtils.width }}
                resizeMode="cover"
            />);
    };
    redirect = (uri, params) => {
        this.props.navigation.navigate(uri, params || {});
    };

}

@observer
export default class Home extends Component {
    render () {
        return <HomePage bannerModule={bannerModule} {...this.props}/>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    viewPager: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: ScreenUtils.width,
        height: bannerHeight
    },
    dotStyle: {
        height: px2dp(5),
        width: px2dp(5),
        borderRadius: px2dp(5),
        backgroundColor: '#fff',
        opacity: 0.4
    },
    activeDotStyle: {
        height: px2dp(5),
        width: px2dp(30),
        borderRadius: px2dp(5),
        backgroundColor: '#fff'
    },
    box: {
        backgroundColor: '#ffffff',
        marginBottom: 10,
        marginTop: 10
    },
    // headerBg
    navBarBg: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        height: statusBarHeight + 44,
        paddingTop: statusBarHeight,
        backgroundColor: '#d51243',
        alignItems: 'center',
        opacity: 0,
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 2
    },
    logo: {
        height: 27,
        width: 35
    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        flex: 1,  // 类似于android中的layout_weight,设置为1即自动拉伸填充
        borderRadius: 15,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 10
    },
    scanIcon: {
        height: 24,
        width: 24
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 16,
        height: 16
    },
    inputText: {
        flex: 1,
        backgroundColor: '#666666',
        padding: 0
    },

    // banner
    banner: {},

    // menu
    menuView: {
        flexDirection: 'row',
        paddingTop: ScreenUtils.px2dp(10),
        backgroundColor: '#ffffff',
        paddingBottom: ScreenUtils.px2dp(10),
        marginBottom: ScreenUtils.px2dp(10)
    },
    iconImg: {
        width: ScreenUtils.px2dp(48),
        height: ScreenUtils.px2dp(48),
        marginBottom: ScreenUtils.px2dp(5)
    },
    showText: {
        fontSize: 12
    },
    featureBox: {
        position: 'relative',
        height: ScreenUtils.px2dp(200),
        marginLeft: ScreenUtils.px2dp(12),
        marginRight: ScreenUtils.px2dp(12)
    },
    featureBox1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200)
    },
    featureBox1Image: {
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200),
        borderRadius: 5
    },
    featureBox2: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },
    featureBox2Image: {
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96),
        borderRadius: 5
    },
    featureBox3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },

    // 行样式
    rowCell: {
        paddingLeft: 10,
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between'
    },
    eventRowsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 15
    }
});
