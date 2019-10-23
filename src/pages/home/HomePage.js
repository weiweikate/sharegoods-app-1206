import React from 'react';
import { Animated, DeviceEventEmitter, Platform, StyleSheet, View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './model/Modules';
import HomeSearchView from './view/HomeSearchView';
import VersionUpdateModalView from './view/VersionUpdateModalView';
import DesignRule from '../../constants/DesignRule';
import homeModalManager from './manager/HomeModalManager';
import { withNavigationFocus } from 'react-navigation';
import user from '../../model/user';
import { homeTabManager } from './manager/HomeTabManager';
import LuckyIcon from '../guide/LuckyIcon';
import HomeMessageModalView, { GiftModal, HomeAdModal } from './view/HomeMessageModalView';
import { limitGoModule } from './model/HomeLimitGoModel';
import PraiseModel from './view/PraiseModel';
import ScrollableTabView from '@mr/react-native-scrollable-tab-view';
import BasePage from '../../BasePage';
import { track, TrackApi, trackEvent } from '../../utils/SensorsTrack';
import taskModel from './model/TaskModel';
import { IntervalMsgView, IntervalType } from '../../comm/components/IntervalMsgView';
import { UserLevelModalView } from './view/TaskModalView';
import { tabModel } from './model/HomeTabModel';
import HomeFirstTabView from './view/List/HomeFirstTabView';
import HomeNormalList from './view/List/HomeNormalList';
import DIYTopicList from './view/List/DIYTopicList';
import { observer } from 'mobx-react';
import HomeTopTarBar from './HomeTopTarBar';
import ImageLoad from '@mr/image-placeholder';
import store from '@mr/rn-store';
import StringUtils from '../../utils/StringUtils';


/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */


@observer
class HomePage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            y: new Animated.Value(0)
        };
    }

    componentDidMount() {
        homeModalManager.requestData();
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                homeModule.homeFocused(false);
                homeTabManager.setHomeFocus(false);
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    homeModalManager.leaveHome();
                }
            }
        );

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                homeModalManager.entryHome();
                if (state && state.routeName === 'HomePage') {
                    if (homeModule.firstLoad) {
                        homeModule.loadHomeList(false);
                    }
                    store.get('@mr/homeSkin').then((data) => {
                        homeModule.setSkinData(data);
                    });
                }
            }
        );

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.luckyIcon && this.luckyIcon.getLucky(1, '');
                    track(trackEvent.ViewHomePage);
                    homeTabManager.setHomeFocus(true);
                    homeModule.homeFocused(true);
                    user.getToken().then(() => {//让user初始化完成
                        this.luckyIcon && this.luckyIcon.getLucky(1, '');
                        if (!homeModule.firstLoad) {
                            taskModel.getData();
                            limitGoModule.loadLimitGo(false);
                        }
                        homeModalManager.refreshPrize();
                    });
                }
                TrackApi.homePage();//埋点
            }
        );
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        this.listenerMessage = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.listenerLogout = DeviceEventEmitter.addListener('login_out', this.loadMessageCount);
        this.limitGoTimeViewlistener = DeviceEventEmitter.addListener('staticeLimitGoTimeView', (value) => {
            if (value) {//限时购是否处于吸顶状态
                this.topTarBar && this.topTarBar.close();
            } else {
                this.topTarBar && this.topTarBar.open();
            }
        });
    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.listenerMessage && this.listenerMessage.remove();
        this.listenerLogout && this.listenerLogout.remove();
        this.limitGoTimeViewlistener && this.limitGoTimeViewlistener.remove();
    }

    trackViewHomePageChannel(tabData, i) {
        // channelType  频道页类型      0：未知 1：推荐 2：专题 3：类目
        // channelName  频道页名称  字符串  8.15
        let channelType = 0;
        let channelName = '';
        if (i === 0) {
            channelType = 1;
            channelName = '推荐';
        } else {
            let navType = tabData[i - 1].navType;
            if (navType === 2) {
                channelType = 2;
            }

            if (navType === 1) {
                channelType = 3;
            }
            channelName = tabData[i - 1].navName;
        }
        track(trackEvent.ViewHomePageChannel, { channelType, channelName });
    }


    render() {
        let { tabList } = tabModel;

        let viewItems = [];
        viewItems.push(<HomeFirstTabView
            key={'HomeList_flag'}
            tabLabel={'推荐'}
            ref={(ref => {
                this.homeList = ref;
            })}
            onScrollBeginDrag={() => {
                this.luckyIcon.close();
            }}
            onScroll={(y) => {
                if (y < ScreenUtils.width) {
                    this.topTarBar && this.topTarBar.open();
                }
            }}
        />);
        tabList.map((item, index) => {
            if (item.navType === 2) {
                viewItems.push(<DIYTopicList tabLabel={item.navName}
                                             key={'id' + item.id}
                                             index={index + 1}
                                             data={item}/>);
            } else if (item.navType === 1) {
                viewItems.push(<HomeNormalList tabLabel={item.navName}
                                               data={item}
                                               index={index + 1}
                                               key={'id' + item.id}/>);
            }
        });

        return (
            <View style={[styles.container, { minHeight: ScreenUtils.headerHeight, minWidth: 1 }]}>
                <View style={{
                    width: ScreenUtils.width,
                    height: ScreenUtils.headerHeight,
                    position: 'absolute',
                    backgroundColor: StringUtils.isEmpty(homeModule.statusImg) ? 'white' : 'transparent',
                    left: 0,
                    right: 0
                }}>
                    <ImageLoad
                        style={{
                            width: ScreenUtils.width,
                            height: ScreenUtils.statusBarHeight
                        }}
                        source={{ uri: homeModule.statusImg }}
                        showPlaceholder={false}/>
                    <ImageLoad
                        style={{
                            width: ScreenUtils.width,
                            height: ScreenUtils.autoSizeWidth(44)
                        }}
                        source={{ uri: homeModule.titleImg }}
                        showPlaceholder={false}/>
                </View>
                <HomeSearchView/>
                <ScrollableTabView
                    onChangeTab={(obj) => {

                        let i = obj.i;
                        tabModel.changeTabIndex(i);
                        //首页回顶部
                        this.homeList && this.homeList.scrollToTop();
                        //埋点
                        this.trackViewHomePageChannel(tabList, i);
                        this.topTarBar && this.topTarBar.scrollTo({ x: i * 60 - ScreenUtils.width / 2 + 30 });
                        this.topTarBar && this.topTarBar.open();
                    }}
                    renderTabBar={this._renderTabBar.bind(this)}
                    style={{ zIndex: -1 }}
                    //进界面的时候打算进第几个
                    initialPage={0}>

                    {viewItems}
                </ScrollableTabView>

                <LuckyIcon ref={(ref) => {
                    this.luckyIcon = ref;
                }}
                           isHome={true}
                />
                <PraiseModel/>
                <GiftModal/>
                <UserLevelModalView/>
                <IntervalMsgView pageType={IntervalType.home}/>
                {Platform.OS !== 'ios' ? <HomeAdModal/> : null}
                <HomeMessageModalView/>
                <VersionUpdateModalView/>
            </View>
        );
    }

    _renderTabBar(p) {
        return <HomeTopTarBar p={p} ref={(r) => {
            this.topTarBar = r;
        }}/>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width,
        backgroundColor: DesignRule.bgColor
    },
    tabNomal: {
        fontSize: 12,
        color: '#999'
    },
    tabSelect: {
        fontSize: 14,
        color: DesignRule.mainColor
    }
});

export default withNavigationFocus(HomePage);
