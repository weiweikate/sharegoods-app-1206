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
    RefreshControl
} from 'react-native';

import { observer } from 'mobx-react';

import ScreenUtils from '../../../utils/ScreenUtils';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/RecommendSegmentView';
import BasePage from '../../../BasePage';
import SpellStatusModel from '../model/SpellStatusModel';
import SpellShopApi from '../api/SpellShopApi';
import HomeAPI from '../../home/api/HomeAPI';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import DesignRule from '../../../constants/DesignRule';
import RecommendBanner from './components/RecommendBanner';
import res from '../res';
import geolocation from '@mr/rn-geolocation';
import Storage from '../../../utils/storage';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { homeLinkType } from '../../home/HomeTypes';

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
            adList: []
        };
    }

    $navigationBarOptions = {
        title: '拼店',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        const showShopItem = SpellStatusModel.canCreateStore || SpellStatusModel.storeCode && SpellStatusModel.storeStatus && SpellStatusModel.storeStatus !== 0;
        return <View style={styles.rightBarItemContainer}>
            {
                showShopItem ? <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickOpenShopItem}>
                    <Image source={ShopItemLogo}/>
                </TouchableOpacity> : null
            }
            <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickSearchItem}>
                <Image source={SearchItemLogo}/>
            </TouchableOpacity>
        </View>;
    };

    componentDidMount() {
        this._verifyLocation();
        this._getSwipers();
    }

    _getSize = () => {
        const segmentIndex = this.state.segmentIndex;
        return segmentIndex === 1 ? 10 : 10;
    };

    _verifyLocation = () => {
        Storage.get('storage_MrLocation', {}).then((value) => {
                //有缓存加载缓存
                if (value && StringUtils.isNoEmpty(value.latitude)) {
                    this.state.locationResult = value;
                    this._loadPageData();
                }
                //更新定位数据  没缓存的话加载数据
                geolocation.getLastLocation().then(result => {
                    this.state.locationResult = result;
                    Storage.set('storage_MrLocation', result);
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
            }
        );
    };

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._verifyLocation();
            this._getSwipers();
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

    _getSwipers = () => {
        HomeAPI.getSwipers({
            type: 9
        }).then((data) => {
            this.setState({
                adList: data.data || []
            });
        }).catch((error) => {
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
            this.$navigate('spellShop/shopSetting/SetShopNamePage');
        } else if (SpellStatusModel.storeCode && StringUtils.isNoEmpty(SpellStatusModel.storeStatus) && SpellStatusModel.storeStatus !== 0) {//有店铺店铺没关闭
            this.props.navigation.popToTop();
        } else {
            this.$navigate('spellShop/openShop/OpenShopExplainPage');
        }
    };

    // 点击搜索店铺
    _clickSearchItem = () => {
        this.$navigate('spellShop/recommendSearch/SearchPage');
    };

    // 点击查看某个店铺
    _RecommendRowOnPress = (storeCode) => {
        this.$navigate('spellShop/MyShop_RecruitPage', { storeCode: storeCode });
    };

    // 点击轮播图广告
    _clickItem = (item) => {
        track(trackEvent.bannerClick, {
            pageType: '拼店banner',
            bannerLocation: '拼店',
            bannerID: item.id,
            bannerRank: item.rank,
            url: item.imgUrl,
            bannerName: item.linkTypeCode
        });
        if (item.linkType === homeLinkType.good) {
            this.$navigate('home/product/ProductDetailPage', {
                productCode: item.linkTypeCode, preseat: '拼店推荐banner'
            });
        } else if (item.linkType === homeLinkType.subject) {
            this.$navigate('topic/DownPricePage', {
                linkTypeCode: item.linkTypeCode
            });
        } else if (item.linkType === homeLinkType.web) {
            this.$navigate('HtmlPage', {
                title: '详情',
                uri: item.linkTypeCode
            });
        } else if (item.linkType === 3 || item.linkType === 4 || item.linkType === 5) {
            let type = item.linkType === 3 ? 2 : item.linkType === 4 ? 1 : 3;
            this.$navigate('topic/TopicDetailPage', {
                activityCode: item.linkTypeCode,
                activityType: type, preseat: '拼店推荐banner'
            });
        } else if (item.linkType === homeLinkType.show) {
            this.$navigate('show/ShowDetailPage', {
                code: item.linkTypeCode
            });
        }
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
        if (this.state.adList.length > 0) {
            return <RecommendBanner bannerList={this.state.adList} onPress={this._clickItem}/>;
        } else {
            return null;
        }
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
                             onEndReachedThreshold={0.1}
                             ListFooterComponent={this._ListFooterComponent}
                             showsVerticalScrollIndicator={false}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             sections={[{ data: this.state.dataList }]}
                             initialNumToRender={5}/>
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
