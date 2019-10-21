import React from 'react';
import { Animated, DeviceEventEmitter, InteractionManager, Platform, StyleSheet, View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './model/Modules';
import HomeSearchView from './view/HomeSearchView';
import MessageApi from '../message/api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
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
import { routePush } from '../../navigation/RouterMap';
import { tabModel } from './model/HomeTabModel';
import HomeFirstTabView from './view/List/HomeFirstTabView';
import HomeNormalList from './view/List/HomeNormalList';
import DIYTopicList from './view/List/DIYTopicList';
import { observer } from 'mobx-react';
import HomeTopTarBar from './HomeTopTarBar';


/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */

const tabBarHeight = ScreenUtils.px2dp(42);

@observer
class HomePage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            hasMessage: false,
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
                        if (user.token) {
                            this.loadMessageCount();
                        } else {
                            this.setState({
                                hasMessage: false
                            });
                        }
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
                    height: ScreenUtils.headerHeight + tabBarHeight,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    backgroundColor: 'white'
                }}/>
                <View style={{
                    height: ScreenUtils.headerHeight - (ScreenUtils.isIOSX ? 10 : 0),
                    backgroundColor: 'transparent'
                }}/>
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
                    style={{ zIndex: 3 }}
                    renderTabBar={this._renderTabBar.bind(this)}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                    {viewItems}
                </ScrollableTabView>
                <HomeSearchView navigation={routePush}
                                hasMessage={this.state.hasMessage}/>

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
