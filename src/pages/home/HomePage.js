import React from 'react';
import {
    Animated,
    DeviceEventEmitter,
    InteractionManager,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
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
import { MRText as Text } from '../../components/ui';
import LuckyIcon from '../guide/LuckyIcon';
import HomeMessageModalView, { GiftModal, HomeAdModal } from './view/HomeMessageModalView';
import { limitGoModule } from './model/HomeLimitGoModel';
import PraiseModel from './view/PraiseModel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
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
            hasMessage: false,
            y: new Animated.Value(0)
        };
    }


    componentDidMount() {
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
                if (state && state.routeName === 'HomePage') {
                    if (homeModule.firstLoad) {
                        homeModule.loadHomeList(true);
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
                    homeModalManager.entryHome();
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
                        homeModalManager.requestData();
                        homeModalManager.refreshPrize();
                    });
                }
                TrackApi.homePage();//埋点
            }
        );
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        this.listenerMessage = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.listenerLogout = DeviceEventEmitter.addListener('login_out', this.loadMessageCount);
    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.listenerMessage && this.listenerMessage.remove();
        this.listenerLogout && this.listenerLogout.remove();
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
            key={'HomeList__flag'}
            tabLabel={'推荐'}
            ref={(ref => {
                this.homeList = ref;
            })}
            onScrollBeginDrag={() => {
                this.luckyIcon.close();
            }}
        />);
        tabList.map((item) => {
            if (item.navType === 2) {
                viewItems.push(<DIYTopicList tabLabel={item.navName}
                                             key={'id' + item.id}
                                             data={item}/>);
            } else if (item.navType === 1) {
                viewItems.push(<HomeNormalList tabLabel={item.navName}
                                               data={item}
                                               key={'id' + item.id}/>);
            }
        });
        return (
            <View style={[styles.container, { minHeight: ScreenUtils.headerHeight, minWidth: 1 }]}>
                <HomeSearchView navigation={routePush}
                                hasMessage={this.state.hasMessage}/>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        let i = obj.i;
                        //首页回顶部
                        this.homeList && this.homeList.scrollToTop();
                        //埋点
                        this.trackViewHomePageChannel(tabList, i);
                        this.tab && this.tab.scrollTo({ x: i * 60 - ScreenUtils.width / 2 + 30 });
                    }}
                    renderTabBar={this._renderTabBar.bind(this)}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                    {viewItems}
                </ScrollableTabView>
                <LuckyIcon ref={(ref) => {
                    this.luckyIcon = ref;
                }}/>
                <PraiseModel/>
                <GiftModal/>
                <UserLevelModalView/>
                <IntervalMsgView pageType={IntervalType.home}/>
                <HomeAdModal/>
                <HomeMessageModalView/>
                <VersionUpdateModalView/>
            </View>
        );
    }

    _renderTabBar(p) {
        let itemWidth = 60;
        let tabBarHeight = 42;
        return (
            <View style={{ backgroundColor: 'white', height: tabBarHeight, width: ScreenUtils.width }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ref={ref => {
                        this.tab = ref;
                    }}>
                    <DefaultTabBar
                        activeTab={p.activeTab}
                        style={{ width: itemWidth * p.tabs.length, borderBottomWidth: 0, height: tabBarHeight }}
                        containerWidth={itemWidth * p.tabs.length}
                        scrollValue={p.scrollValue}
                        tabs={p.tabs}
                        underlineStyle={{
                            backgroundColor: DesignRule.mainColor,
                            left: (itemWidth - 20) / 2,
                            width: 18,
                            height: 2.5,
                            bottom: 8,
                            borderRadius: 2
                        }}
                        renderTab={(name, page, isTabActive) => {
                            return (
                                <TouchableOpacity style={{
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: itemWidth
                                }} onPress={() => p.goToPage(page)}>
                                    <Text style={isTabActive ? styles.tabSelect : styles.tabNomal}
                                          numberOfLines={1}>{name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        width: ScreenUtils.width
    },
    tabNomal: {
        fontSize: 12,
        color: '#999999'
    },
    tabSelect: {
        fontSize: 14,
        color: DesignRule.mainColor
    }
});

export default withNavigationFocus(HomePage);
