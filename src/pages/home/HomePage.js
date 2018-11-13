import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    RefreshControl,
    ImageBackground,
    TouchableWithoutFeedback,
    Image, Platform, NativeModules, AsyncStorage, ScrollView, DeviceEventEmitter, InteractionManager
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import ShareTaskIcon from '../shareTask/components/ShareTaskIcon';
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
import Modal from 'CommModal';
import XQSwiper from '../../components/ui/XGSwiper';
import MessageApi from '../message/api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
import messageModalBg from './res/messageModalBg.png';
import messageSelected from './res/messageSelected.png';
import messageUnselected from './res/messageUnselected.png';
import MineApi from '../mine/api/MineApi';
import VersionUpdateModal from './VersionUpdateModal';
import DeviceInfo from 'react-native-device-info';
import StringUtils from '../../utils/StringUtils';
import DesignRule from 'DesignRule';
import res from '../../comm/res';

let TimerMixin = require('react-timer-mixin');
const closeImg = res.button.cancel_white_circle;
/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */

const { px2dp, statusBarHeight } = ScreenUtils;
const bannerHeight = px2dp(220);

@observer
export default class HomePage extends PureComponent {

    st = 0;
    shadowOpacity = 0.4;

    headerH = statusBarHeight + 44 - (ScreenUtils.isIOSX ? 10 : 0);
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
        whiteIcon: true
    };

    constructor(props) {
        super(props);
        homeModule.loadHomeList();
    }


    getVersion = async () => {
        let upVersion = '';
        try {
            upVersion = await AsyncStorage.getItem('isToUpdate');
        } catch (error) {
        }

        MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            if (resp.data.upgrade === 1) {
                if (StringUtils.isEmpty(upVersion) && upVersion !== resp.data.version) {
                    if (Platform.OS !== 'ios') {
                        NativeModules.commModule.apkExist(resp.data.version, (exist) => {
                            this.setState({
                                updateData: resp.data,
                                showUpdate: true,
                                apkExist: exist
                            });
                            this.updateModal && this.updateModal.open();
                        });
                    } else {
                        this.setState({
                            updateData: resp.data,
                            showUpdate: true
                        });
                        this.updateModal && this.updateModal.open();
                    }
                }
                if (resp.data.forceUpdate === 1) {
                    // 强制更新
                    this.setState({
                        forceUpdate: true
                    });
                }
            }
        });
    };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocusSubscription', state);
                if (state && state.routeName === 'HomePage') {
                    this.shareTaskIcon.queryTask();
                    this.setState({ isShow: true });
                }

            }
        );

        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.setState({ isShow: false });
                }
            }
        );
    }

    componentWillUnmount() {
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        InteractionManager.runAfterInteractions(() => {
            this.timer = TimerMixin.setTimeout(() => {
                // 检测版本更新
                this.getVersion();
                this.getMessageData();
            }, 2500);
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
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
            const { isShow } = this.state;
            return <ShowView navigation={this.props.navigation} isShow={isShow}/>;
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

    getMessageData = () => {
        var currStr = new Date().getTime() + '';
        AsyncStorage.getItem('lastMessageTime').then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                MessageApi.queryNotice({ page: this.currentPage, pageSize: 10, type: 100 }).then(resp => {
                    if (!EmptyUtils.isEmptyArr(resp.data.data)) {
                        this.messageModal && this.messageModal.open();
                        this.setState({
                            showMessage: true,
                            messageData: resp.data.data
                        });
                    }
                });
            }
        });
        AsyncStorage.setItem('lastMessageTime', currStr);

    };

    messageModalRender() {
        return (
            <Modal ref={(ref) => {
                this.messageModal = ref;
            }} visible={this.state.showMessage}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showMessage: false
                        });
                    }}>
                        <Image source={closeImg} style={styles.messageCloseStyle}/>
                    </TouchableWithoutFeedback>

                    <ImageBackground source={messageModalBg} style={styles.messageBgStyle}>
                        <XQSwiper
                            style={{ alignSelf: 'center', marginTop: 71, width: px2dp(230), height: px2dp(211) }}
                            height={px2dp(230)} width={px2dp(230)} renderRow={this.messageRender}
                            dataSource={EmptyUtils.isEmptyArr(this.state.messageData) ? [] : this.state.messageData}
                            loop={false}
                            onWillChange={(item, index) => {
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

    messageIndexRender() {
        if (EmptyUtils.isEmptyArr(this.state.messageData)) {
            return null;
        }
        let indexs = [];
        for (let i = 0; i < this.state.messageData.length; i++) {
            let view = i === this.state.messageIndex ?
                <Image source={messageSelected} style={styles.messageIndexStyle}/> :
                <Image source={messageUnselected} style={styles.messageIndexStyle}/>;
            indexs.push(view);
        }
        return (
            <View style={{
                flexDirection: 'row',
                width: px2dp(120),
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
                            title="下拉刷新"
                            tintColor={DesignRule.textColor_instruction}
                            titleColor={DesignRule.textColor_instruction}
                        />
                    }
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: bannerModule.bannerList.length > 0 ? 0 : statusBarHeight + 44 }}
                    onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                />
                <View style={[styles.navBarBg, { opacity: bannerModule.opacity }]}
                      ref={e => this._refHeader = e}/>
                <LinearGradient colors={['#000', 'transparent']}
                                ref={e => this.headerShadow = e}
                                style={[styles.navBar, {
                                    height: this.headerH + 14,
                                    opacity: bannerModule.opacity === 1 ? 0 : 0.4
                                }]}/>

                <HomeSearchView navigation={this.props.navigation}
                                whiteIcon={bannerModule.opacity === 1 ? false : this.state.whiteIcon}/>
                <ShareTaskIcon style={{ position: 'absolute', right: 0, top: px2dp(220) - 40 }}
                               ref={(ref) => {
                                   this.shareTaskIcon = ref;
                               }}
                />
                {this.messageModalRender()}
                <VersionUpdateModal updateData={this.state.updateData} showUpdate={this.state.showUpdate}
                                    apkExist={this.state.apkExist}
                                    ref={(ref) => {
                                        this.updateModal = ref;
                                    }}
                                    forceUpdate={this.state.forceUpdate} onDismiss={() => {
                    this.setState({ showUpdate: false });
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
        height: statusBarHeight + 44 - (ScreenUtils.isIOSX ? 10 : 0),
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
        height: statusBarHeight + 44 - (ScreenUtils.isIOSX ? 10 : 0),
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
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    messageBgStyle: {
        width: px2dp(300),
        height: px2dp(405),
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
        width: px2dp(12),
        height: px2dp(12)
    }
});
