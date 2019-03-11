import React from 'react';
import {
    View,
    StyleSheet,
    Platform, AsyncStorage, DeviceEventEmitter, InteractionManager,
    RefreshControl, BackHandler
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import ShareTaskIcon from '../shareTask/components/ShareTaskIcon';
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { homeType } from './HomeTypes';
import HomeSearchView from './HomeSearchView';
import HomeClassifyView, { kHomeClassifyHeight } from './HomeClassifyView';
import HomeTodayView, { todayHeight } from './HomeTodayView';
import HomeRecommendView, { recommendHeight } from './HomeRecommendView';
import HomeSubjectView from './HomeSubjectView';
import HomeBannerView, { bannerHeight } from './HomeBannerView';
import HomeAdView from './HomeAdView';
import HomeGoodsView, { kHomeGoodsViewHeight } from './HomeGoodsView';
import HomeUserView from './HomeUserView';
import HomeCategoryView, { categoryHeight } from './HomeCategoryView';
import MessageApi from '../message/api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
import VersionUpdateModal from './VersionUpdateModal';
import StringUtils from '../../utils/StringUtils';
import DesignRule from '../../constants/DesignRule';
import TimerMixin from 'react-timer-mixin';
import homeModalManager from './model/HomeModalManager';
import { withNavigationFocus } from 'react-navigation';
import user from '../../model/user';
import { homeTabManager } from './model/HomeTabManager';
import { MRText as Text } from '../../components/ui';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { adModules } from './HomeAdModel';
import { todayModule } from './HomeTodayModel';
import { recommendModule } from './HomeRecommendModel';
import { bannerModule } from './HomeBannerModel';
import { subjectModule } from './HomeSubjectModel';
import { categoryModule } from './HomeCategoryModel';
import HomeTitleView from './HomeTitleView';
import GuideModal from '../guide/GuideModal';
import LuckyIcon from '../guide/LuckyIcon';
import HomeMessageModal from './HomeMessageModal';

/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */

const { px2dp, height, headerHeight } = ScreenUtils;
const scrollDist = height / 2 - headerHeight;
import BasePage from '../../BasePage';
import bridge from '../../utils/bridge';

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={styles.footer}>
    <Text style={styles.text}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的' : (isFetching ? '加载中...' : '加载更多'))}</Text>
</View>;

@observer
class HomePage extends BasePage {

    st = 0;

    $navigationBarOptions = {
        title: '',
        show: false
    };

    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i).type || 0;
    }, (type, dim) => {
        dim.width = ScreenUtils.width;
        const { todayList } = todayModule;
        const { recommendList } = recommendModule;
        const { subjectHeight } = subjectModule;
        const { bannerList } = bannerModule;
        const { categoryList } = categoryModule;

        switch (type) {
            case homeType.category:
                dim.height = categoryList.length > 0 ? categoryHeight : 0;
                break;
            case homeType.swiper:
                dim.height = bannerList.length > 0 ? bannerHeight : 0;
                break;
            case homeType.classify:
                dim.height = kHomeClassifyHeight;
                break;
            case homeType.ad:
                dim.height = adModules.adHeight;
                break;
            case homeType.today:
                dim.height = todayList.length > 0 ? todayHeight : 0;
                break;
            case homeType.recommend:
                dim.height = recommendList.length > 0 ? recommendHeight : 0;
                break;
            case homeType.subject:
                dim.height = subjectHeight;
                break;
            case homeType.user:
                dim.height = user.isLogin ? px2dp(44) : 0;
                break;
            case homeType.goods:
                dim.height = kHomeGoodsViewHeight;
                break;
            case homeType.goodsTitle:
                dim.height = px2dp(52);
                break;
            default:
                dim.height = 0;

        }
    });


    state = {
        showMessage: false,
        messageData: null,
        messageIndex: 0,
        updateData: {},
        showUpdate: false,
        forceUpdate: false,
        apkExist: false,
        hasMessage: false
    };

    constructor(props) {
        super(props);
        InteractionManager.runAfterInteractions(() => {
            homeModule.loadHomeList(true);
        });
    }


    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.homeFocused = true;
                const { state } = payload;
                if (user.token) {
                    this.loadMessageCount();
                } else {
                    this.setState({
                        hasMessage: false
                    });
                }
                console.log('willFocusSubscription', state);
                if (state && state.routeName === 'HomePage') {
                    // this.shareTaskIcon.queryTask();
                    this.guideModal.getUserRecord();
                    this.luckyIcon.getLucky();
                }
            }
        );

        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.homeFocused = false;
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.guideModal.cancelUserRecord();
                }
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.homeFocused = true;
                this.showModal();
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        this.listenerMessage = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.listenerLogout = DeviceEventEmitter.addListener('login_out', this.loadMessageCount);
        this.listenerRetouchHome = DeviceEventEmitter.addListener('retouch_home', this.retouchHome);

        InteractionManager.runAfterInteractions(() => {
            this._homeModaldata();
            user.getToken().then(() => {//让user初始化完成
                this.luckyIcon.getLucky();
                this.guideModal.getUserRecord();
                this.loadMessageCount();
            });
        });
    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.listenerMessage && this.listenerMessage.remove();
        this.listenerLogout && this.listenerLogout.remove();
        this.listenerRetouchHome && this.listenerRetouchHome.remove();
    }

    retouchHome = () => {
        if (homeTabManager.aboveRecommend) {
            this.recyclerListView && this.recyclerListView.scrollToTop(true);
        }
    };

    handleBackPress = () => {
        return this.state.forceUpdate;
    };

    _homeModaldata = () => {
        TimerMixin.setTimeout(() => {
            // 检测版本更新
            // this.getVersion();
            homeModalManager.getVersion().then((data) => {
                homeModalManager.getMessage().then(data => {
                    if (!this.props.isFocused) {
                        return;
                    }
                    this.showModal();
                });
            });
        }, 2500);
    };

    loadMessageCount = () => {
        if (user.token) {
            InteractionManager.runAfterInteractions(() => {
                MessageApi.getNewNoticeMessageCount().then(result => {
                    if (!EmptyUtils.isEmpty(result.data)) {
                        this.setState({
                            hasMessage: result.data.shopMessageCount || result.data.noticeCount || result.data.messageCount
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        hasMessage: false
                    });
                });
            });
        }
    };

    showModal = () => {
        if (EmptyUtils.isEmpty(homeModalManager.versionData)) {
            this._showMessageOrActivity();
        } else {
            //展示升级提示
            this.showUpdateModal();
        }
    };

    _showMessageOrActivity = () => {
        //公告弹窗
        if (!this.state.showUpdate) {
            this.showMessageModal();
        }
    };

    showUpdateModal = async () => {
        if (!EmptyUtils.isEmpty(homeModalManager.versionData)) {
            let upVersion = '';
            try {
                upVersion = await AsyncStorage.getItem('isToUpdate');
            } catch (error) {

            }
            let resp = homeModalManager.versionData;
            if (resp.data.upgrade === 1) {
                let showUpdate = resp.data.forceUpdate === 1 ? true : ((StringUtils.isEmpty(upVersion) || upVersion !== resp.data.version) ? true : false);
                if (Platform.OS !== 'ios') {
                    bridge.isApkExist(resp.data.version, (exist) => {
                        this.setState({
                            updateData: resp.data,
                            showUpdate: showUpdate,
                            forceUpdate: resp.data.forceUpdate === 1,
                            apkExist: exist
                        });
                    });
                } else {
                    this.setState({
                        updateData: resp.data,
                        showUpdate: showUpdate,
                        forceUpdate: resp.data.forceUpdate === 1
                    });
                }
                if (showUpdate) {
                    this.updateModal && this.updateModal.open();
                } else {
                    this._showMessageOrActivity();
                }
            } else {
                this._showMessageOrActivity();
            }
        }
    };


    showMessageModal() {
        if (!EmptyUtils.isEmpty(homeModalManager.homeMessage)) {
            let resp = homeModalManager.homeMessage;
            let currStr = new Date().getTime() + '';
            AsyncStorage.getItem('lastMessageTime').then((value) => {
                if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                    if (!EmptyUtils.isEmptyArr(resp.data.data)) {
                        this.messageModal && this.messageModal.open();
                        this.setState({
                            showMessage: true,
                            messageData: resp.data.data
                        });
                        homeModalManager.setHomeMessage(null);
                    }
                }
            });
            AsyncStorage.setItem('lastMessageTime', currStr);
        }
    }

    _keyExtractor = (item, index) => item.id + '';

    _renderItem = (type, item) => {
        let data = item;
        if (type === homeType.category) {
            return <HomeCategoryView navigate={this.$navigate}/>;
        } else if (type === homeType.swiper) {
            return <HomeBannerView navigate={this.$navigate} pageFocused={this.homeFocused}/>;
        } else if (type === homeType.classify) {
            return <HomeClassifyView navigate={this.$navigate}/>;
        } else if (type === homeType.ad) {
            return <HomeAdView navigate={this.$navigate}/>;
        } else if (type === homeType.today) {
            return <HomeTodayView navigate={this.$navigate} pageFocused={this.homeFocused}/>;
        } else if (type === homeType.recommend) {
            return <HomeRecommendView navigate={this.$navigate} pageFocused={this.homeFocused}/>;
        } else if (type === homeType.subject) {
            return <HomeSubjectView navigate={this.$navigate}/>;
        } else if (type === homeType.user) {
            return <HomeUserView navigate={this.$navigate}/>;
        } else if (type === homeType.goods) {
            return <HomeGoodsView data={data.itemData} navigate={this.$navigate}/>;
        } else if (type === homeType.goodsTitle) {
            return <View style={styles.titleView}
                         ref={e => this.toGoods = e}
                         onLayout={event => {
                             // 保留，不能删除
                         }}>
                <HomeTitleView title={'为你推荐'}/>
            </View>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.loadHomeList(true);
        this.loadMessageCount();
        this.luckyIcon.getLucky();
        this.guideModal.getUserRecord();

    }

    getMessageData = () => {

        MessageApi.queryNotice({ page: 1, pageSize: 10, type: 100 }).then(resp => {
            if (!EmptyUtils.isEmptyArr(resp.data.data)) {
                homeModalManager.setHomeMessage(resp);
                this.showModal();
            }
        });
    };

    _onListViewScroll = (event) => {
        let offsetY = event.nativeEvent.contentOffset.y;
        if (this.toGoods) {
            this.toGoods.measure((fx, fy, width, height, left, top) => {
                if (offsetY > ScreenUtils.height && top < scrollDist) {
                    homeTabManager.setAboveRecommend(true);
                } else {
                    homeTabManager.setAboveRecommend(false);
                }
            });
        } else {
            homeTabManager.setAboveRecommend(false);
        }
    };

    render() {
        console.log('getBanner render', adModules.adHeight); //千万别去掉
        const { homeList } = homeModule;
        this.dataProvider = this.dataProvider.cloneWithRows(homeList);
        return (
            <View style={[styles.container, { minHeight: ScreenUtils.headerHeight, minWidth: 1 }]}>
                <HomeSearchView navigation={this.$navigate}
                                hasMessage={this.state.hasMessage}
                                pageFocused={this.homeFocused}
                />
                <RecyclerListView
                    ref={(ref) => {
                        this.recyclerListView = ref;
                    }}
                    style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                    refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                    onRefresh={this._onRefresh.bind(this)}
                                                    colors={[DesignRule.mainColor]}/>}
                    onEndReached={this._onEndReached.bind(this)}
                    scrollEventThrottle={200}
                    onEndReachedThreshold={ScreenUtils.height / 2}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    onScrollBeginDrag={() => {
                        this.luckyIcon.close();
                    }}
                    showsVerticalScrollIndicator={false}
                    onScroll={this._onListViewScroll}
                    renderFooter={() => <Footer
                        isFetching={homeModule.isFetching}
                        errorMsg={homeModule.errorMsg}
                        isEnd={homeModule.isEnd}/>
                    }
                />
                <ShareTaskIcon style={{ position: 'absolute', right: 0, top: px2dp(220) - 40 }}/>
                <LuckyIcon ref={(ref) => {
                    this.luckyIcon = ref;
                }}/>
                <HomeMessageModal messageData={this.state.messageData} showMessage={this.state.showMessage}
                                  onRequestClose={() => {
                                      this.setState({
                                          showMessage: false
                                      });
                                  }}/>
                <GuideModal ref={(ref) => {
                    this.guideModal = ref;
                }}/>
                <VersionUpdateModal updateData={this.state.updateData} showUpdate={this.state.showUpdate}
                                    apkExist={this.state.apkExist}
                                    onRequestClose={() => {
                                        homeModalManager.setVersion(null);
                                        this.setState({ showUpdate: false });
                                    }}
                                    ref={(ref) => {
                                        this.updateModal = ref;
                                    }}
                                    forceUpdate={this.state.forceUpdate} onDismiss={() => {
                    this.setState({ showUpdate: false });
                    homeModalManager.setVersion(null);

                }}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    titleView: {
        marginTop: px2dp(13),
        paddingLeft: px2dp(15),
        width: ScreenUtils.width
    },
    messageBgStyle: {
        width: px2dp(295),
        height: px2dp(390),
        marginTop: px2dp(20)
    },
    messageCloseStyle: {
        width: px2dp(24),
        height: px2dp(24),
        marginTop: px2dp(100),
        alignSelf: 'flex-end',
        marginRight: ((ScreenUtils.width) - px2dp(300)) / 2
    },
    messageIndexStyle: {
        width: px2dp(10),
        height: px2dp(10),
        borderRadius: px2dp(5)
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    text: {
        color: '#999',
        fontSize: DesignRule.fontSize_24
    }
});

export default withNavigationFocus(HomePage);
