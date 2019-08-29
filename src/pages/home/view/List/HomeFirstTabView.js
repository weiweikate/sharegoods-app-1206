import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { todayModule } from '../../model/HomeTodayModel';
import { recommendModule } from '../../model/HomeRecommendModel';
import { subjectModule } from '../../model/HomeSubjectModel';
import { homeFocusAdModel } from '../../model/HomeFocusAdModel';
import { homeType } from '../../HomeTypes';
import { bannerModule } from '../../model/HomeBannerModel';
import HomeBannerView, { bannerHeight } from '../HomeBannerView';
import user from '../../../../model/user';
import taskModel from '../../model/TaskModel';
import { channelModules } from '../../model/HomeChannelModel';
import { homeExpandBnnerModel } from '../../model/HomeExpandBnnerModel';
import { limitGoModule } from '../../model/HomeLimitGoModel';
import HomeTodayView, { todayHeight } from '../HomeTodayView';
import HomeRecommendView, { recommendHeight } from '../HomeRecommendView';
import { homeModule } from '../../model/Modules';
import GoodsCell, { kHomeGoodsViewHeight } from '../HomeGoodsView';
import { homeTabManager } from '../../manager/HomeTabManager';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';
import { routePush } from '../../../../navigation/RouterMap';
import HomeUserView from '../HomeUserView';
import TaskVIew from '../TaskVIew';
import HomeChannelView from '../HomeChannelView';
import HomeExpandBannerView from '../HomeExpandBannerView';
import HomeFocusAdView from '../HomeFocusAdView';
import HomeLimitGoView from '../HomeLimitGoView';
import HomeSubjectView from '../HomeSubjectView';
import TabTitleView from '../TabTitleView';
import { TopicImageAdView } from '../TopicImageAdView';
import GoodsCustomView from '../GoodsCustomView';
import DesignRule from '../../../../constants/DesignRule';
import intervalMsgModel from '../../../../comm/components/IntervalMsgView';
import { MRText as Text } from '../../../../components/ui/index';
import TextCustomView from '../TextCustomView';


const { JSPushBridge } = NativeModules;
const JSManagerEmitter = new NativeEventEmitter(JSPushBridge);
const { px2dp, height, headerHeight, width } = ScreenUtils;
const scrollDist = height / 2 - headerHeight;
const nowTime = new Date().getTime();
const HOME_REFRESH = 'homeRefresh';
const HOME_SKIP = 'activitySkip';

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={styles.footer}>
    <ActivityIndicator style={{ marginRight: 6 }} animating={errorMsg ? false : (isEnd ? false : true)} size={'small'}
                       color={DesignRule.mainColor}/>
    <Text style={styles.text}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的~' : (isFetching ? '加载中...' : '加载更多中...'))}</Text>
</View>;

@observer
export default class HomeFirstTabView extends Component {
    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i) || {};
    }, (type, dim) => {
        dim.width = ScreenUtils.width;
        const { todayList } = todayModule;
        const { recommendList } = recommendModule;
        const { subjectHeight, subjectList } = subjectModule;
        const { foucusHeight } = homeFocusAdModel;

        switch (type.type) {
            case homeType.swiper:
                dim.height = bannerModule.bannerList.length > 0 ? bannerHeight : 0;
                break;
            case homeType.user:
                dim.height = user.isLogin ? (bannerModule.bannerList.length > 0 ? px2dp(44) : px2dp(31)) : 0;
                break;
            case homeType.task:
                dim.height = taskModel.homeHeight;
                break;
            case homeType.channel:
                dim.height = channelModules.channelList.length > 0 ? px2dp(90) : 0;
                break;
            case homeType.expandBanner:
                dim.height = homeExpandBnnerModel.bannerHeight;
                break;
            case homeType.focusGrid:
                dim.height = foucusHeight > 0 ? (foucusHeight + (homeExpandBnnerModel.banner.length > 0 ? px2dp(20) : px2dp(10))) : 0;
                break;
            case homeType.limitGo:
                dim.height = limitGoModule.spikeList.length > 0 ? limitGoModule.limitHeight : 0;
                break;
            case homeType.today:
                dim.height = todayList.length > 0 ? todayHeight : 0;
                break;
            case homeType.fine:
                dim.height = recommendList.length > 0 ? recommendHeight : 0;
                break;
            case homeType.homeHot:
                dim.height = subjectList.length > 0 ? subjectHeight : 0;
                break;
            case homeType.goodsTitle:
                dim.height = homeModule.tabList.length > 0 ? px2dp(66) : 0;
                break;
            case homeType.goods:
                dim.height = kHomeGoodsViewHeight;
                break;
            case homeType.custom_goods:
            case homeType.custom_imgAD:
                dim.height = type.itemHeight;
                break;
            case homeType.custom_text:
                dim.height = 1;
                break;
            case  homeType.placeholder:
                dim.height = 1;
                break;
            default:
                dim.height = 0;
        }
    });

    constructor(props) {
        super(props);
        // 重置
        homeModule.initHomeParams();
        homeTabManager.setAboveRecommend(false);
        this.offsetY = 0;
    }


    _keyExtractor = (item, index) => item.id + '';

    _renderItem = (type, item, index) => {
        type = type.type;
        let data = item;
        if (type === homeType.swiper) {
            return <HomeBannerView navigate={routePush}/>;
        } else if (type === homeType.user) {
            return <HomeUserView navigate={routePush}/>;
        } else if (type === homeType.task) {
            return <TaskVIew type={'home'} style={{
                marginTop: ScreenUtils.autoSizeWidth(5),
                marginBottom: ScreenUtils.autoSizeWidth(10)
            }}/>;
        } else if (type === homeType.channel) {
            return <HomeChannelView navigate={routePush}/>;
        } else if (type === homeType.expandBanner) {
            return <HomeExpandBannerView navigate={routePush}/>;
        } else if (type === homeType.focusGrid) {
            return <HomeFocusAdView navigate={routePush}/>;
        } else if (type === homeType.limitGo) {
            return <HomeLimitGoView navigate={routePush}/>;
        } else if (type === homeType.today) {
            return <HomeTodayView navigate={routePush}/>;
        } else if (type === homeType.fine) {
            return <HomeRecommendView navigate={routePush}/>;
        } else if (type === homeType.homeHot) {
            return <HomeSubjectView navigate={routePush}/>;
        } else if (type === homeType.goods) {
            return <GoodsCell data={data} goodsRowIndex={index} otherLen={homeModule.goodsOtherLen}
                              navigate={routePush}/>;
        } else if (type === homeType.goodsTitle) {
            return <View ref={e => this.toGoods = e}
                         onLayout={event => {
                             // 保留，不能删除
                         }}>
                <TabTitleView/>
            </View>;
        } else if (type === homeType.custom_goods) {
            return <GoodsCustomView data={item}/>;
        } else if (type === homeType.custom_text) {
            // let p = {specialTopicId:  this.props.data.linkCode}
            // p.specialTopicArea = 6;
            return <TextCustomView data={item}/>;
        } else if (type === homeType.custom_imgAD) {
            // p.specialTopicArea = 1;
            return <TopicImageAdView data={item}/>;
        } else if (type === homeType.placeholder) {
            return <View style={{ width: width, height: 1, backgroundColor: 'white' }}/>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.isRefreshing = true;
        homeModule.loadHomeList(true);
        taskModel.getData();
        this.luckyIcon && this.luckyIcon.getLucky(1, '');
    }

    _onListViewScroll = (event) => {
        if (!homeModule.isFocused) {
            return;
        }
        this.offsetY = event.nativeEvent.contentOffset.y;
        this.props.onScroll && this.props.onScroll(this.offsetY);
        this.toGoods && this.toGoods.measure((fx, fy, w, h, left, top) => {
            if (this.offsetY > height && top < scrollDist) {
                homeTabManager.setAboveRecommend(true);
            } else {
                homeTabManager.setAboveRecommend(false);
            }
        });
    };

    homeTabChange = () => {
        this.toGoods && this.toGoods.measure((fx, fy, w, h, left, top) => {
            if (top) {
                if (top < 0) {
                    if (!homeTabManager.isAboveRecommend) {
                        homeTabManager.setAboveRecommend(true);
                    }
                } else {
                    if (this.offsetY > height && top < scrollDist) {
                        if (!homeTabManager.isAboveRecommend) {
                            homeTabManager.setAboveRecommend(true);
                        }
                    } else {
                        if (homeTabManager.isAboveRecommend) {
                            homeTabManager.setAboveRecommend(false);
                        }
                    }
                }
            }
        });
    };


    render() {
        const { homeList } = homeModule;
        this.dataProvider = this.dataProvider.cloneWithRows(homeList);
        return (
            <RecyclerListView
                ref={(ref) => {
                    this.recyclerListView = ref;
                }}
                style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                onRefresh={this._onRefresh.bind(this)}
                                                colors={[DesignRule.mainColor]}/>}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={ScreenUtils.height / 3}
                dataProvider={this.dataProvider}
                rowRenderer={this._renderItem.bind(this)}
                layoutProvider={this.layoutProvider}
                onScrollBeginDrag={this.props.onScrollBeginDrag}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                forceNonDeterministicRendering={true}
                onScroll={this._onListViewScroll}
                renderFooter={() => <Footer
                    isFetching={homeModule.isFetching}
                    errorMsg={homeModule.errorMsg}
                    isEnd={homeModule.isEnd}/>
                }
            />
        );
    }

    componentDidMount() {
        this.listenerRetouchHome = DeviceEventEmitter.addListener('retouch_home', this.retouchHome);
        this.listenerHomeRefresh = JSManagerEmitter.addListener(HOME_REFRESH, this.homeTypeRefresh);
        this.listenerSkip = JSManagerEmitter.addListener(HOME_SKIP, this.homeSkip);
        // 修复首页图标不准确
        this.homeTabChange();
    }

    componentWillUnmount() {
        this.listenerRetouchHome && this.listenerRetouchHome.remove();
        this.listenerHomeRefresh && this.listenerHomeRefresh.remove();
        this.listenerSkip && this.listenerSkip.remove();
    }

    retouchHome = () => {
        if (homeTabManager.aboveRecommend) {
            this.recyclerListView && this.recyclerListView.scrollToTop(true);
            homeTabManager.setAboveRecommend(false);
        }
    };

    scrollToTop = () => {
        this.recyclerListView && this.recyclerListView.scrollToTop(true);
        homeTabManager.setAboveRecommend(false);
    };

    homeTypeRefresh = (type) => {
        let refreshTime = new Date().getTime();
        // 防止透传消息堆积，不停的刷新
        if (refreshTime - nowTime > 10 * 1000) {
            homeModule.refreshHome(type);
        }
    };

    homeSkip = (data) => {
        // 跳标
        const content = JSON.parse(data) || {};
        intervalMsgModel.setMsgData(content);
    };
}

const styles = StyleSheet.create({
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    text: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24
    }
});
