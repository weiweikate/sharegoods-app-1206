import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableWithoutFeedback,
    Image, Platform, AsyncStorage, ScrollView, DeviceEventEmitter, InteractionManager,
    RefreshControl, BackHandler
} from 'react-native';
import ImageLoad from '@mr/image-placeholder';
import ScreenUtils from '../../utils/ScreenUtils';
import ShareTaskIcon from '../shareTask/components/ShareTaskIcon';
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { homeType } from './HomeTypes';
import { bannerModule } from './HomeBannerModel';
import HomeSearchView from './HomeSearchView';
import HomeClassifyView, { kHomeClassifyHeight } from './HomeClassifyView';
import HomeTodayView, {todayHeight} from './HomeTodayView';
import HomeRecommendView, {recommendHeight} from './HomeRecommendView';
import HomeSubjectView from './HomeSubjectView';
import HomeBannerView, { bannerHeight } from './HomeBannerView';
import HomeAdView from './HomeAdView';
import HomeGoodsView, { kHomeGoodsViewHeight } from './HomeGoodsView';
import HomeUserView from './HomeUserView';
import HomeCategoryView, {categoryHeight} from './HomeCategoryView'
import Modal from '../../comm/components/CommModal';
import XQSwiper from '../../components/ui/XGSwiper';
import MessageApi from '../message/api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
import VersionUpdateModal from './VersionUpdateModal';
import StringUtils from '../../utils/StringUtils';
import DesignRule from '../../constants/DesignRule';
import TimerMixin from 'react-timer-mixin';
import res from './res';
import homeModalManager from './model/HomeModalManager';
import { withNavigationFocus } from 'react-navigation';
import user from '../../model/user';
import { homeRegisterFirstManager } from './model/HomeRegisterFirstManager';
import { MRText as Text } from '../../components/ui';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { adModules } from './HomeAdModel';
import { todayModule } from './HomeTodayModel';
import { recommendModule } from './HomeRecommendModel';
import { subjectModule } from './HomeSubjectModel';
import HomeTitleView from './HomeTitleView'

const closeImg = res.button.cancel_white_circle;
const messageUnselected = res.messageUnselected;
const home_notice_bg = res.home_notice_bg;

/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */

const { px2dp, headerHeight } = ScreenUtils;
import BasePage from '../../BasePage';
import bridge from '../../utils/bridge';

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={styles.footer}>
    <Text style={styles.text}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的' : (isFetching ? '加载中...' : '加载更多'))}</Text>
</View>;

@observer
class HomePage extends BasePage {

    st = 0;
    shadowOpacity = 0.4;

    $navigationBarOptions = {
        title: '',
        show: false
    };

    headerH = headerHeight - (ScreenUtils.isIOSX ? 10 : 0);
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

        switch (type) {
            case homeType.category:
                dim.height = categoryHeight;
                break;
            case homeType.swiper:
                dim.height = bannerHeight;
                break;
            case homeType.classify:
                dim.height = kHomeClassifyHeight;
                break;
            case homeType.ad:
                dim.height =  adModules.adHeight ;
                break;
            case homeType.today:
                dim.height = todayList.length > 0 ?  todayHeight : 0;
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
        isShow: true,
        showMessage: false,
        messageData: null,
        messageIndex: 0,
        updateData: {},
        showUpdate: false,
        forceUpdate: false,
        apkExist: false,
        shadowOpacity: this.shadowOpacity,
        whiteIcon: true,
        hasMessage: false,
        showRegister: false
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
                    this.setState({ isShow: true });
                }
            }
        );

        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.homeFocused = false;
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.setState({ isShow: false }, () => {
                        // android状态栏黑色字体
                        bridge.setLightMode();
                    });
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

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        this.listenerMessage = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.listenerLogout = DeviceEventEmitter.addListener('login_out', this.loadMessageCount);
        InteractionManager.runAfterInteractions(() => {
            this.loadMessageCount();
            this._homeModaldata();
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
        this.listenerMessage && this.listenerMessage.remove();
        this.listenerLogout && this.listenerLogout.remove();
    }

    handleBackPress = () => {
        return this.state.forceUpdate;
    };

    _homeModaldata = () => {
        InteractionManager.runAfterInteractions(() => {
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
        });
    };

    loadMessageCount = () => {
        if (user.token) {
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
        if (homeRegisterFirstManager.showRegisterModalUrl) {
            //活动
            this.setState({
                showRegister: true
            });
            this.registerModal && this.registerModal.open();
        } else {
            //公告弹窗
            if (!this.state.showUpdate) {
                this.showMessageModal();
            }
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
            return <HomeCategoryView navigate={this.$navigate}/>
        } else if (type === homeType.swiper) {
            return <HomeBannerView navigate={this.$navigate}/>;
        } else if (type === homeType.classify) {
            return <HomeClassifyView navigate={this.$navigate}/>;
        } else if (type === homeType.ad) {
            return <HomeAdView navigate={this.$navigate}/>;
        } else if (type === homeType.today) {
            return <HomeTodayView navigate={this.$navigate}/>;
        } else if (type === homeType.recommend) {
            return <HomeRecommendView navigate={this.$navigate}/>;
        } else if (type === homeType.subject) {
            return <HomeSubjectView navigate={this.$navigate}/>;
        } else if (type === homeType.user) {
            return <HomeUserView navigate={this.$navigate}/>;
        } else if (type === homeType.goods) {
            return <HomeGoodsView data={data.itemData} navigate={this.$navigate}/>;
        } else if (type === homeType.goodsTitle) {
            return <View style={styles.titleView}><HomeTitleView title={'为你推荐'}/></View>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.loadHomeList(true);
        this.loadMessageCount();
    }

    getMessageData = () => {

        MessageApi.queryNotice({ page: 1, pageSize: 10, type: 100 }).then(resp => {
            if (!EmptyUtils.isEmptyArr(resp.data.data)) {
                homeModalManager.setHomeMessage(resp);
                this.showModal();
            }
        });


    };

    messageModalRender() {
        return (
            <Modal ref={(ref) => {
                this.messageModal = ref;
            }}
                   onRequestClose={() => {
                       this.setState({
                           showMessage: false
                       });
                   }}
                   visible={this.state.showMessage}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showMessage: false
                        });
                    }}>
                        <Image source={closeImg} style={styles.messageCloseStyle}/>
                    </TouchableWithoutFeedback>

                    <ImageBackground source={home_notice_bg} style={styles.messageBgStyle}>
                        <XQSwiper
                            style={{
                                alignSelf: 'center',
                                marginTop: px2dp(145),
                                width: px2dp(230),
                                height: px2dp(211)
                            }}
                            height={px2dp(230)} width={px2dp(230)} renderRow={this.messageRender}
                            dataSource={EmptyUtils.isEmptyArr(this.state.messageData) ? [] : this.state.messageData}
                            loop={false}
                            onDidChange={(item, index) => {
                                this.setState({
                                    messageIndex: index
                                });
                            }}
                        />
                        <View style={{ flex: 1 }}/>
                        {this.messageIndexRender()}
                    </ImageBackground>
                </View>
            </Modal>
        );
    }

    registerModalRender = () => {

        return (
            <Modal ref={(ref) => {
                this.registerModal = ref;
            }}
                   onRequestClose={() => {
                       this.setState({
                           showRegister: false
                       });
                       homeRegisterFirstManager.setShowRegisterModalUrl(null);
                   }}
                   visible={this.state.showRegister}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showRegister: false
                        });
                        this.registerModal.close();
                        homeRegisterFirstManager.setShowRegisterModalUrl(null);
                    }}>
                        <Image source={closeImg} style={styles.messageCloseStyle}/>
                    </TouchableWithoutFeedback>
                    {
                        homeRegisterFirstManager.showRegisterModalUrl ?
                            <TouchableWithoutFeedback onPress={() => {
                                this.setState({
                                    showRegister: false
                                });
                                this.registerModal.close();
                                homeRegisterFirstManager.setShowRegisterModalUrl(null);
                                this.$toastShow('领取成功！请到我的-优惠券中查看');
                            }}>
                                <View>
                                    <ImageLoad source={{ uri: homeRegisterFirstManager.showRegisterModalUrl }}
                                               resizeMode={'contain'}
                                               style={styles.messageBgStyle}/>
                                </View>
                            </TouchableWithoutFeedback>
                            : <View style={styles.messageBgStyle}/>
                    }


                </View>
            </Modal>
        );
    };


    messageIndexRender() {
        if (EmptyUtils.isEmptyArr(this.state.messageData)) {
            return null;
        }
        let indexs = [];
        for (let i = 0; i < this.state.messageData.length; i++) {
            let view = i === this.state.messageIndex ?
                <View style={[styles.messageIndexStyle, { backgroundColor: '#FF427D' }]}/> :
                <View source={messageUnselected} style={[styles.messageIndexStyle, { backgroundColor: '#f4d7e4' }]}/>;
            indexs.push(view);
        }
        return (
            <View style={{
                flexDirection: 'row',
                width: px2dp(12 * this.state.messageData.length),
                justifyContent: this.state.messageData.length === 1 ? 'center' : 'space-between',
                marginBottom: px2dp(12),
                height: 12,
                alignSelf: 'center'
            }}>
                {indexs}
            </View>
        );
    }

    messageRender(item, index) {
        return (
            <View onStartShouldSetResponder={() => true}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ showsVerticalScrollIndicator: false }}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: DesignRule.fontSize_secondTitle,
                        alignSelf: 'center'
                    }}>
                        {item.title}
                    </Text>
                    <Text style={{
                        width: px2dp(230),
                        color: DesignRule.textColor_secondTitle,
                        fontSize: DesignRule.fontSize_24,
                        marginTop: 14,
                        marginBottom: 10,
                        height: 500
                    }}>
                        {item.content}
                    </Text>
                </ScrollView>
            </View>
        );
    }

    render() {
        console.log('getBanner render', adModules.adHeight) //千万别去掉
        const { homeList } = homeModule;
        this.dataProvider = this.dataProvider.cloneWithRows(homeList);
        return (
            <View style={[styles.container, { minHeight: ScreenUtils.headerHeight, minWidth: 1 }]}>
                <HomeSearchView navigation={this.$navigate}
                                whiteIcon={bannerModule.opacity === 1 ? false : this.state.whiteIcon}
                                hasMessage={this.state.hasMessage}
                                pageFocused={this.homeFocused}
                />
                <RecyclerListView
                    style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                    refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                    onRefresh={this._onRefresh.bind(this)}
                                                    colors={[DesignRule.mainColor]}/>}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={ScreenUtils.height / 2}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    showsVerticalScrollIndicator={false}
                    renderFooter={() => <Footer
                        isFetching={homeModule.isFetching}
                        errorMsg={homeModule.errorMsg}
                        isEnd={homeModule.isEnd}/>
                    }
                />
                <ShareTaskIcon style={{ position: 'absolute', right: 0, top: px2dp(220) - 40 }}
                               ref={(ref) => {
                                   this.shareTaskIcon = ref;
                               }}
                />
                {this.messageModalRender()}
                {this.registerModalRender()}
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
        marginTop: px2dp(10),
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
