import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
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

const { px2dp, statusBarHeight, headerHeight } = ScreenUtils;
const bannerHeight = px2dp(220);
import BasePage from '../../BasePage';
import bridge from '../../utils/bridge';

@observer
class HomePage extends BasePage {

    st = 0;
    shadowOpacity = 0.4;

    $navigationBarOptions = {
        title: '',
        show: false
    };

    headerH = headerHeight - (ScreenUtils.isIOSX ? 10 : 0);
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
        homeModule.loadHomeList(true);
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
        this.loadMessageCount();
        this._homeModaldata();
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
            this.shadowOpacity = 0;
            this.headerShadow.setNativeProps({
                opacity: this.shadowOpacity
            });
            return;
        }
        if (Y < bannerHeight) {
            this.st = Y / (bannerHeight - this.headerH);
            this.shadowOpacity = (1 - Y / (bannerHeight - this.headerH)) * 0.4;
            this.setState({
                whiteIcon: this.st > 0.7 ? false : true
            });
        } else {
            this.st = 1;
            this.shadowOpacity = 0;
            this.setState({
                whiteIcon: false
            });
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
        this.headerShadow.setNativeProps({
            opacity: this.shadowOpacity
        });
    };

    _onScrollBeginDrag() {
        this.shareTaskIcon.close();
    }

    _keyExtractor = (item, index) => item.id + '';
    _renderItem = (item) => {
        let data = item.item;
        if (data.type === homeType.swiper) {
            return <HomeBannerView navigate={this.$navigate}/>;
        } else if (data.type === homeType.classify) {
            return <HomeClassifyView navigate={this.$navigate}/>;
        } else if (data.type === homeType.ad) {
            return <HomeAdView navigate={this.$navigate}/>;
        } else if (data.type === homeType.today) {
            return <HomeTodayView navigate={this.$navigate}/>;
        } else if (data.type === homeType.recommend) {
            return <HomeRecommendView navigate={this.$navigate}/>;
        } else if (data.type === homeType.subject) {
            return <HomeSubjectView navigate={this.$navigate}/>;
        } else if (data.type === homeType.starShop) {
            return <HomeStarShopView navigate={this.$navigate}/>;
        } else if (data.type === homeType.user) {
            return <HomeUserView navigate={this.$navigate}/>;
        } else if (data.type === homeType.goods) {
            return <HomeGoodsView data={data.itemData} navigate={this.$navigate}/>;
        } else if (data.type === homeType.show) {
            const { isShow } = this.state;
            return <ShowView navigation={this.props.navigation} isShow={isShow}/>;
        } else if (data.type === homeType.goodsTitle) {
            return <View style={styles.titleView}>
                <Text style={styles.title} allowFontScaling={false}>为你推荐</Text>
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
                                this.$toastShow('领取成功');
                            }}>
                                <ImageLoad source={{ uri: homeRegisterFirstManager.showRegisterModalUrl }}
                                           resizeMode={'contain'}
                                           style={styles.messageBgStyle}/>
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

    _renderTableHeader() {
        return !bannerModule.isShowHeader ? null : <View style={{ height: headerHeight }}/>;
    }

    render() {
        const { homeList } = homeModule;
        return (
            <View style={styles.container}>
                {this._renderTableHeader()}
                <FlatList
                    data={homeList}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={this._keyExtractor.bind(this)}
                    onScroll={this._onScroll.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.2}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                    refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                    onRefresh={this._onRefresh.bind(this)}
                                                    colors={[DesignRule.mainColor]}
                                                    progressViewOffset={ScreenUtils.headerHeight}/>}
                />
                <View style={[styles.navBarBg, { opacity: bannerModule.opacity }]}
                      ref={e => this._refHeader = e}/>
                <LinearGradient colors={['#000', 'transparent']}
                                ref={e => this.headerShadow = e}
                                style={[styles.navBar, {
                                    height: this.headerH + 14,
                                    opacity: bannerModule.opacity === 1 ? 0 : 0.4
                                }]}/>

                <HomeSearchView navigation={this.$navigate}
                                whiteIcon={bannerModule.opacity === 1 ? false : this.state.whiteIcon}
                                hasMessage={this.state.hasMessage}
                                pageFocused={this.homeFocused}
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
    // headerBg
    navBarBg: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        height: headerHeight - (ScreenUtils.isIOSX ? 10 : 0),
        width: ScreenUtils.width,
        paddingTop: statusBarHeight,
        backgroundColor: '#fff',
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
        height: headerHeight - (ScreenUtils.isIOSX ? 10 : 0),
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
        marginTop: px2dp(25),
        marginBottom: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
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
    }
});

export default withNavigationFocus(HomePage);
