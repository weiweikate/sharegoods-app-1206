/**
 * 首页
 */

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    RefreshControl
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import ShareTaskHomeAlert from '../shareTask/components/ShareTaskHomeAlert';
import { observer } from 'mobx-react';
import { homeType, homeModule, bannerModule } from './Modules';
import HomeSearchView from './HomeSearchView';
import HomeClassifyView from './HomeClassifyView';
import HomeStarShopView from './HomeStarShopView';
import HomeTodayView from './HomeTodayView';
import HomeRecommendView from './HomeRecommendView';
import HomeSubjectView from './HomeSubjectView';
import HomeBannerView from './HomeBannerView';
import HomeAdView from './HomeAdView';
import HomeGoodsView from './HomeGoodsView';
import HomeUserView from './HomeUserView';
import ShowView from '../show/ShowView';
import LinearGradient from 'react-native-linear-gradient';

const { px2dp, statusBarHeight } = ScreenUtils;
const bannerHeight = px2dp(220);

@observer
export default class HomePage extends Component {

    st = 0;
    headerH = statusBarHeight + 44;
    state = {
        isShow: true
    }

    constructor(props) {
        super(props);
        homeModule.loadHomeList();
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
              const {state } = payload
              if (state && state.routeName === 'HomePage') {
                  this.setState({isShow: true})
              }
            }
          );

        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
              const {state } = payload
              if (state && state.routeName === 'HomePage') {
                  this.setState({isShow: false})
              }
            }
          );
    }

    componentWillUnmount() {
        this.didBlurSubscription && this.didBlurSubscription.remove()
        this.willFocusSubscription && this.willFocusSubscription.remove()
    }

    // 滑动头部透明度渐变
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (!this._refHeader) {
            return;
        }
        if (bannerModule.bannerList.length <= 0) {
            this.st = 1;
            this._refHeader.setNativeProps({
                opacity: this.st
            });
            return;
        }
        if (Y < bannerHeight) {
            this.st = Y / (bannerHeight - this.headerH);
        } else {
            this.st = 1;
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    };

    _keyExtractor = (item, index) => item.id + '';
    _renderItem = (item) => {
        let data = item.item;
        if (data.type === homeType.swiper) {
            return <HomeBannerView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.classify) {
            return <HomeClassifyView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.ad) {
            return <HomeAdView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.today) {
            return <HomeTodayView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.recommend) {
            return <HomeRecommendView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.subject) {
            return <HomeSubjectView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.starShop) {
            return <HomeStarShopView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.user) {
            return <HomeUserView navigation={this.props.navigation}/>;
        } else if (data.type === homeType.goods) {
            return <HomeGoodsView data={data.itemData} navigation={this.props.navigation}/>;
        } else if (data.type === homeType.show) {
            const {isShow} = this.state
            return (<View>{
                isShow
                ?
                <ShowView navigation={this.props.navigation}/>
                :
                <View/>
            }</View>)
        } else if (data.type === homeType.goodsTitle) {
            return <View style={styles.titleView}>
                <Text style={styles.title}>为你推荐</Text>
            </View>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.loadHomeList();
    }

    componentDidMount() {
        //this.shareModal.open();
    }

    render() {
        const { homeList } = homeModule;
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
                            progressViewOffset={statusBarHeight + 44}
                            colors={['#d51243']}
                            title="下拉刷新"
                            tintColor="#999"
                            titleColor="#999"
                        />
                    }
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: bannerModule.bannerList.length > 0 ? 0 : statusBarHeight + 44 }}
                />
                <View style={[styles.navBarBg, { opacity: bannerModule.opacity }]}
                      ref={e => this._refHeader = e}/>
                <LinearGradient colors={['#000000', 'transparent']}
                                style={[styles.navBar, { height: this.headerH + 14, opacity: 0.4 }]}/>

                <HomeSearchView navigation={this.props.navigation}/>
                <ShareTaskHomeAlert ref={(ref) => this.shareModal = ref}
                                    onPress={() => {
                                        this.props.navigation.navigate('shareTask/ShareTaskListPage');
                                    }}/>
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
        zIndex: 2
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
        marginTop: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    }
});
