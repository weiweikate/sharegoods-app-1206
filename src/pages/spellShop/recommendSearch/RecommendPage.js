/*
* 店铺推荐页面
* */
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    RefreshControl, NativeModules, NativeEventEmitter
} from 'react-native';

import { observer } from 'mobx-react';

import ScreenUtils from '../../../utils/ScreenUtils';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/RecommendSegmentView';
import BasePage from '../../../BasePage';
import SpellStatusModel from '../model/SpellStatusModel';
import SpellShopApi from '../api/SpellShopApi';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import DesignRule from '../../../constants/DesignRule';
import RecommendBanner from './components/RecommendBanner';
import res from '../res';
import geolocation from '@mr/rn-geolocation';
import store from '@mr/rn-store';
import { TrackApi } from '../../../utils/SensorsTrack';
import { homeType } from '../../home/HomeTypes';
import { homeModule } from '../../home/model/Modules';
import { bannerModule } from './PinShopBannerModel';
import { IntervalMsgView, IntervalType } from '../../../comm/components/IntervalMsgView';
import RouterMap from '../../../navigation/RouterMap';

const { JSPushBridge } = NativeModules;
const JSManagerEmitter = new NativeEventEmitter(JSPushBridge);

const HOME_REFRESH = 'homeRefresh';

const ShopItemLogo = res.recommendSearch.dp_03;
const SearchItemLogo = res.recommendSearch.pdss_03;


@observer
export default class RecommendPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            //刷新
            refreshing: false,//是否显示下拉的菊花
            noMore: false,//是否能加载更多
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1,

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            segmentIndex: 1,
            locationResult: {},//latitude  //longitude
            //data
            dataList: [{}],//默认一行显示状态页面使用 错误页 无数据页面
            pageFocused: false
        };
    }

    $navigationBarOptions = {
        title: '拼店',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        return <View style={styles.rightBarItemContainer}>
            <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickOpenShopItem}>
                <Image source={ShopItemLogo} style={{ width: 20, height: 20 }}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickSearchItem}>
                <Image source={SearchItemLogo} style={{ width: 20, height: 20 }}/>
            </TouchableOpacity>
        </View>;
    };

    componentDidMount() {
        this.listenerBannerRefresh = JSManagerEmitter.addListener(HOME_REFRESH, (type) => {
            if (type === homeType.pinShop) {
                bannerModule.loadBannerList();
            }
        });
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.setState({
                    pageFocused: false
                });
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    pageFocused: true
                });
            }
        );
        this._verifyLocation();
        bannerModule.loadBannerList();
    }

    componentWillUnmount() {
        this.listenerBannerRefresh && this.listenerBannerRefresh.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    _getSize = () => {
        const segmentIndex = this.state.segmentIndex;
        return segmentIndex === 1 ? 10 : 10;
    };

    _verifyLocation() {
        store.get('@mr/storage_MrLocation').then((value) => {
            //有缓存加载缓存
            if (value && StringUtils.isNoEmpty(value.latitude)) {
                this.state.locationResult = value;
                this._loadPageData();
            }
            //更新定位数据  没缓存的话加载数据
            geolocation.getLastLocation().then(result => {
                this.state.locationResult = result;
                store.save('@mr/storage_MrLocation', result);
                if (!value.latitude) {
                    this._loadPageData();
                }
            }).catch((error) => {
                    SpellStatusModel.alertAction(error, () => {
                        this.$navigateBackToHome();
                    }, () => {
                        this.$navigateBackToHome();
                    });
                }
            );
        });
    }

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._verifyLocation();
            bannerModule.loadBannerList();
            SpellStatusModel.getUser(0);
        });
    };

    _loadPageData = () => {
        this.state.page = 1;
        SpellShopApi.queryHomeStore({
            lat: this.state.locationResult.latitude,
            log: this.state.locationResult.longitude,
            page: this.state.page,
            size: this._getSize(),
            type: this.state.segmentIndex
        }).then((data) => {
            this.state.page++;
            let dataTemp = data.data || {};
            const dataList = dataTemp.data || [];
            //如果是空数据 显示空数据页面需要一个cell
            let isEmpty = !dataList || dataList.length === 0;
            this.setState({
                refreshing: false,
                loadingState: isEmpty ? PageLoadingState.empty : PageLoadingState.success,
                noMore: dataList.length < this._getSize(),
                dataList: isEmpty ? [{}] : dataList
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,
                netFailedInfo: error,
                dataList: [{}],
                loadingState: PageLoadingState.fail
            });
        });
    };

    _loadPageDataMore = () => {
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.queryHomeStore({
                lat: this.state.locationResult.latitude,
                log: this.state.locationResult.longitude,
                page: this.state.page,
                size: this._getSize(),
                type: this.state.segmentIndex
            }).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                let dataTemp = data.data || {};
                this.setState({
                    noMore: !dataTemp.data || dataTemp.data.length < this._getSize(),
                    loadingMore: false,
                    loadingMoreError: null,
                    dataList: this.state.dataList.concat(dataTemp.data || [])
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });
    };


    // 点击开启店铺页面
    _clickOpenShopItem = () => {
        //已缴纳保证金
        if (SpellStatusModel.storeStatus === 2) {
            this.$navigate(RouterMap.SetShopNamePage);
        } else if (SpellStatusModel.storeCode && StringUtils.isNoEmpty(SpellStatusModel.storeStatus) && SpellStatusModel.storeStatus !== 0) {//有店铺店铺没关闭
            this.props.navigation.popToTop();
        } else {
            this.$navigate(RouterMap.OpenShopExplainPage);
        }
    };

    // 点击搜索店铺
    _clickSearchItem = () => {
        this.$navigate(RouterMap.ShopSearchPage);
    };

    // 点击查看某个店铺
    _RecommendRowOnPress = (storeCode) => {
        this.$navigate(RouterMap.MyShop_RecruitPage, { storeCode: storeCode, wayToPinType: 2 });
    };

    // 点击轮播图广告
    _clickItem = (item) => {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode) || '';
        let params = homeModule.paramsNavigate(item);
        this.$navigate(router, { ...params });

        let trackDic = homeModule.bannerPoint(item) || {};
        TrackApi.BannerClick({ bannerLocation: 21, ...trackDic });
    };

    _segmentPressAtIndex = (index) => {
        this.setState({
            dataList: [{}],
            loadingState: PageLoadingState.loading,
            segmentIndex: index
        }, () => {
            this._verifyLocation();
        });
    };

    _renderListHeader = () => {
        return <RecommendBanner pageFocused={this.state.pageFocused}
                                onPress={this._clickItem}/>;
    };

    _renderSectionHeader = () => {
        return (<SegementHeaderView segmentPressAtIndex={this._segmentPressAtIndex}/>);
    };

    _renderItem = ({ item }) => {
        if (this.state.loadingState === PageLoadingState.success) {
            return (<RecommendRow RecommendRowItem={item} RecommendRowOnPress={this._RecommendRowOnPress}/>);
        } else {
            return <View style={{ height: 300 }}>
                {renderViewByLoadingState(this._getPageStateOptions(), null)}
            </View>;
        }
    };

    _ListFooterComponent = () => {
        if (this.state.loadingState !== PageLoadingState.success) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.onEndReached || this.state.loadingState !== PageLoadingState.success || this.state.noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._refreshing
            },
            emptyProps: {
                imageStyle: { width: 120, height: 120 },
                source: res.recommendSearch.shop_notHave,
                description: this.state.segmentIndex === 1 ? '抱歉, 附近暂时没有拼店' : '暂无拼店'
            }
        };
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <SectionList keyExtractor={(item) => item.id + ''}
                             style={{ backgroundColor: DesignRule.bgColor }}
                             refreshControl={
                                 <RefreshControl
                                     refreshing={this.state.refreshing}
                                     onRefresh={this._refreshing.bind(this)}
                                     title="下拉刷新"
                                     tintColor={DesignRule.textColor_instruction}
                                     titleColor={DesignRule.textColor_instruction}
                                     colors={[DesignRule.mainColor]}/>}
                             onEndReached={this._onEndReached.bind(this)}
                             onEndReachedThreshold={2.5}
                             ListFooterComponent={this._ListFooterComponent}
                             showsVerticalScrollIndicator={false}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             sections={[{ data: this.state.dataList }]}
                             stickySectionHeadersEnabled={true}
                             initialNumToRender={5}/>
                <IntervalMsgView pageType={IntervalType.shopHome}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // 顶部条 右边item容器
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightItemBtn: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },

    ViewPager: {
        height: ScreenUtils.autoSizeWidth(230),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: ScreenUtils.width
    }

});
