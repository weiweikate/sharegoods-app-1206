import React from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
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
import HomeMessageModalView from './view/HomeMessageModalView';
import { limitGoModule } from './model/HomeLimitGoModel';
import PraiseModel from './view/PraiseModel';
import ScrollableTabView from '@mr/react-native-scrollable-tab-view';
import BasePage from '../../BasePage';
import { track, TrackApi, trackEvent } from '../../utils/SensorsTrack';
import { IntervalMsgView, IntervalType } from '../../comm/components/IntervalMsgView';
import { UserLevelModalView } from './view/TaskModalView';
import { tabModel } from './model/HomeTabModel';
import HomeFirstTabView from './view/List/HomeFirstTabView';
import HomeNormalList from './view/List/HomeNormalList';
import DIYTopicList from './view/List/DIYTopicList';
import { observer } from 'mobx-react';
import HomeTopTarBar from './view/HomeTopTarBar';
import ImageLoad from '@mr/image-placeholder';
import store from '@mr/rn-store';
import StringUtils from '../../utils/StringUtils';
import homeController from '../marketing/controller/HomeController';
import { homeNewUserModel } from './model/HomeNewUserModel';

const headerHeight = ScreenUtils.statusBarHeight + ScreenUtils.autoSizeWidth(44);
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
        this.state = {};
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
                    store.get('@mr/homeTopSkin').then((data) => {
                        homeModule.setTopSkinData(data);
                    });
                    store.get('@mr/homeBottomSkin').then((data) => {
                        homeModule.setBottomSkinData(data);
                    });
                }
            }
        );

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    //通知HomeController进入首页
                    homeController.notifyArrivedHome();
                    this.luckyIcon && this.luckyIcon.getLucky(1, '');
                    // 新人专区实时刷，新老用户变换
                    homeNewUserModel.loadNewUserArea();
                    track(trackEvent.ViewHomePage);
                    homeTabManager.setHomeFocus(true);
                    homeModule.homeFocused(true);
                    user.getToken().then(() => {//让user初始化完成
                        this.luckyIcon && this.luckyIcon.getLucky(1, '');
                        if (!homeModule.firstLoad) {
                            limitGoModule.loadLimitGo(false);
                        }
                        homeModalManager.refreshPrize();
                    });
                }
                TrackApi.homePage();//埋点
            }
        );
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
        this.limitGoTimeViewlistener && this.limitGoTimeViewlistener.remove();
    }



    onChangeTab = (obj) => {
        let { tabList } = tabModel;
        let i = obj.i;
        tabModel.changeTabIndex(i);
        //首页回顶部
        this.homeList && this.homeList.scrollToTop();
        //埋点
        this.trackViewHomePageChannel(tabList, i);
        //顶部类目滑动
        this.topTarBar && this.topTarBar.scrollTo({ x: i * 60 - ScreenUtils.width / 2 + 30 });
        //顶部类目展开
        this.topTarBar && this.topTarBar.open();
    }

    /**
     * 左右切换埋点
     */
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
        return (
            <View style={[styles.container, { minHeight: headerHeight, minWidth: 1 }]}>
                {this._renderSkinView()}
                <HomeSearchView/>
                <ScrollableTabView
                    style={{ zIndex: -1 }}
                    initialPage={0}
                    onChangeTab={this.onChangeTab}
                    renderTabBar={this._renderTabBar.bind(this)}>
                    {this._renderViewItems()}
                </ScrollableTabView>
                {this._renderModal()}
            </View>
        );
    }
    /**
     * 首页顶部换肤的View
     */
    _renderSkinView(){
        return(
            <View style={{
                width: ScreenUtils.width,
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
        )
    }

    /**
     * 生成ScrollableTabView的各个子视图
     */
    _renderViewItems() {
        let { tabList } = tabModel;

        let viewItems = [];
        viewItems.push(<HomeFirstTabView
            key={'HomeList_flag'}
            tabLabel={'推荐'}
            ref={(ref => {this.homeList = ref;})}
            onScrollBeginDrag={() => {this.luckyIcon.close();}}
            onScroll={(y) => {
                if (y < ScreenUtils.width) {
                    this.topTarBar && this.topTarBar.open();
                }
            }}
        />);
        tabList.forEach((item, index) => {
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

        return viewItems;
    }

    /**
     * 顶部类目
     */
    _renderTabBar(p) {
        return <HomeTopTarBar p={p}
                              ref={(r) => this.topTarBar = r}/>;
    }

    /**
     * 首页弹窗
     */
    _renderModal(){
        return (
            [<LuckyIcon ref={(ref) => this.luckyIcon = ref}
                        isHome={true}/>,
                <PraiseModel/>,
                <UserLevelModalView/>,
                <IntervalMsgView pageType={IntervalType.home}/>,
                <HomeMessageModalView/>,
                <VersionUpdateModalView/>
            ])

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
