import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { homeType } from '../../HomeTypes';
import { bannerModule } from '../../model/HomeBannerModel';
import HomeBannerView, { bannerHeight } from '../HomeBannerView';
import taskModel from '../../model/TaskModel';
import { channelModules } from '../../model/HomeChannelModel';
import { homeExpandBnnerModel } from '../../model/HomeExpandBnnerModel';
import { limitGoModule } from '../../model/HomeLimitGoModel';
import { homeModule } from '../../model/Modules';
import GoodsCell, { kHomeGoodsViewHeight } from '../HomeGoodsView';
import { homeTabManager } from '../../manager/HomeTabManager';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    View
} from 'react-native';
import { routePush } from '../../../../navigation/RouterMap';
import TaskView from '../TaskView';
import HomeChannelView from '../HomeChannelView';
import HomeExpandBannerView from '../HomeExpandBannerView';
import HomeLimitGoGoodsView from '../HomeLimitGoGoodsView';
import { StaticTabTitleView } from '../TabTitleView';
import { TopicImageAdView } from '../TopicImageAdView';
import GoodsCustomView from '../GoodsCustomView';
import DesignRule from '../../../../constants/DesignRule';
import intervalMsgModel from '../../../../comm/components/IntervalMsgView';
import { MRText as Text } from '../../../../components/ui/index';
import TextCustomView from '../TextCustomView';
import HeaderLoading from '../../../../comm/components/lottieheader/ListHeaderLoading';
import { tabModel } from '../../model/HomeTabModel';
import HomeLimitGoTopView from '../HomeLimitGoTopView';
import HomeLimitGoTimeView, { StaticLimitGoTimeView } from '../HomeLimitGoTimeView';
import HomeTitleView from '../HomeTitleView';
import StickyContainer from 'recyclerlistview/sticky';
import HomeActivityCenterView from '../HomeActivityCenterView';
import { homeNewUserModel } from '../../model/HomeNewUserModel';

const { JSPushBridge } = NativeModules;
const JSManagerEmitter = new NativeEventEmitter(JSPushBridge);
const { px2dp, height, headerHeight } = ScreenUtils;
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

        switch (type.type) {
            case homeType.tabStaticView:
                // 此处用autoSizeWidth，不要改成px2dp
                dim.height = ScreenUtils.autoSizeWidth(40);
                break;
            case homeType.swiper:
                dim.height = bannerModule.bannerList.length > 0 ? bannerHeight : 0;
                break;
            case homeType.activityCenter:
                dim.height = homeModule.centerImgHeight;
                break;
            case homeType.newUserArea:
                dim.height = homeNewUserModel.imgHeight;
                break;
            case homeType.task:
                dim.height = taskModel.homeHeight;
                break;
            case homeType.channel:
                dim.height = channelModules.channelHeight;
                break;
            case homeType.expandBanner:
                dim.height = homeExpandBnnerModel.bannerHeight;
                break;
            case homeType.limitGoTop:
                dim.height = limitGoModule.spikeList.length > 0 ? limitGoModule.limitTopHeight : 0;
                break;
            case homeType.limitGoTime:
                dim.height = limitGoModule.spikeList.length > 0 ? limitGoModule.limitTimeHeight : 0;
                break;
            case homeType.limitGoGoods:
                dim.height = px2dp(140);
                break;
            case homeType.goodsTitle:
                // dim.height = homeModule.tabList.length > 0 ? px2dp(66-13) : 0;
                dim.height = px2dp(42);
                break;
            case homeType.goods:
                dim.height = kHomeGoodsViewHeight;
                break;
            case homeType.custom_text:
            case homeType.custom_goods:
            case homeType.custom_imgAD:
                dim.height = type.itemHeight || 0;
                break;
            default:
                dim.height = 0;
                break;
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
        if (type === homeType.swiper) {
            return <HomeBannerView navigate={routePush}/>;
        } else if (type === homeType.task) {
            return <TaskView type={'home'} style={{
                marginTop: ScreenUtils.autoSizeWidth(5),
                marginBottom: ScreenUtils.autoSizeWidth(10)
            }}/>;
        } else if (type === homeType.activityCenter) {
            return <HomeActivityCenterView/>;
        } else if (type === homeType.channel) {
            return <HomeChannelView navigate={routePush}/>;
        } else if (type === homeType.expandBanner) {
            return <HomeExpandBannerView navigate={routePush}/>;
        } else if (type === homeType.limitGoTop) {
            return <HomeLimitGoTopView navigate={routePush}/>;
        } else if (type === homeType.limitGoTime) {
            return <HomeLimitGoTimeView navigate={routePush}/>;
        } else if (type === homeType.limitGoGoods) {
            return <HomeLimitGoGoodsView navigate={routePush} data={item}/>;
        } else if (type === homeType.goods) {
            return <GoodsCell data={item} goodsRowIndex={index} otherLen={homeModule.goodsOtherLen}
                              navigate={routePush}/>;
        } else if (type === homeType.goodsTitle) {
            return <View ref={e => this.toGoods = e}
                         style={{ marginLeft: px2dp(15) }}
                         onLayout={event => {
                             // 保留，不能删除
                         }}>
                <HomeTitleView title={'为你推荐'}/>
                {/*<TabTitleView/>*/}
            </View>;
        } else if (type === homeType.custom_goods) {
            return <GoodsCustomView data={item}/>;
        } else if (type === homeType.custom_text) {
            return <TextCustomView data={item}/>;
        } else if (type === homeType.custom_imgAD) {
            return <TopicImageAdView data={item}/>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.isRefreshing = true;
        homeModule.loadHomeList();
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

    renderRefreshLoading = () => {
        return (
            <HeaderLoading
                isRefreshing={homeModule.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                lineTop={ScreenUtils.autoSizeWidth(40) + 1}
                styled={{ marginTop: ScreenUtils.autoSizeWidth(40) + 1, height: headerHeight }}
            />
        );
    };

    _overrideRowRenderer = (type, data, index) => {
        if (type.type === homeType.goodsTitle) {
            return (
                <StaticTabTitleView/>
            );
        }

        if (type.type === homeType.limitGoTime) {
            return <StaticLimitGoTimeView/>;
        }

        if (type.type === homeType.limitStaticViewDismiss) {
            DeviceEventEmitter.emit('staticeLimitGoTimeView', true);
        }
        return <View/>;
    };


    render() {
        if (Math.abs(tabModel.tabIndex) > 1) {
            return null;
        }
        const { homeList } = homeModule;
        this.dataProvider = this.dataProvider.cloneWithRows(homeList);
        let stickyHeaderIndices = [];
        homeList.forEach((item, index) => {
            if (item.type === homeType.goodsTitle) {
                stickyHeaderIndices.push(index);
            }

            if (item.type === homeType.limitGoTime) {
                stickyHeaderIndices.push(index - 1);
                stickyHeaderIndices.push(index);
            }

            if (item.type === homeType.limitStaticViewDismiss) {
                stickyHeaderIndices.push(index);
            }

        });
        return (
            <StickyContainer
                stickyHeaderIndices={stickyHeaderIndices}
                overrideRowRenderer={this._overrideRowRenderer}>
                <RecyclerListView
                    ref={(ref) => {
                        this.recyclerListView = ref;
                    }}
                    style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                    refreshControl={this.renderRefreshLoading()}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={ScreenUtils.height / 3}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    onScrollBeginDrag={this.props.onScrollBeginDrag}
                    showsVerticalScrollIndicator={false}
                    onScroll={this._onListViewScroll}
                    renderFooter={() => <Footer
                        isFetching={homeModule.isFetching}
                        errorMsg={homeModule.errorMsg}
                        isEnd={homeModule.isEnd}/>
                    }
                />
            </StickyContainer>
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
