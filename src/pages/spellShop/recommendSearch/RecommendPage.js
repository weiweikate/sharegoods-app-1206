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

//source
import ShopItemLogo from './src/dp_03.png';
import SearchItemLogo from './src/pdss_03.png';

import ScreenUtils from '../../../utils/ScreenUtils';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/RecommendSegmentView';
import BasePage from '../../../BasePage';
import SpellStatusModel from '../model/SpellStatusModel';
import ViewPager from '../../../components/ui/ViewPager';
import UIImage from '../../../components/ui/UIImage';
import SpellShopApi from '../api/SpellShopApi';
import HomeAPI from '../../home/api/HomeAPI';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';

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

            segmentIndex: 1,
            //data
            dataList: [],
            adList: []
        };
    }

    $navigationBarOptions = {
        title: '拼店',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        const showShopItem = SpellStatusModel.canCreateStore;
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
        this._loadPageData();
    }

    _getSize = () => {
        const segmentIndex = this.state.segmentIndex;
        return segmentIndex === 1 ? 5 : segmentIndex === 2 ? 8 : 5;
    };
    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._loadPageData();
        });
    };

    _loadPageData = () => {
        this.state.page = 1;
        SpellShopApi.queryHomeStore({
            page: this.state.page,
            size: this._getSize(),
            type: this.state.segmentIndex
        }).then((data) => {
            this.state.page++;
            let dataTemp = data.data || {};
            this.setState({
                refreshing: false,
                noMore: dataTemp.data.length < this._getSize(),
                dataList: dataTemp.data || []
            });
        }).catch((error) => {
            this.setState({
                refreshing: false
            });
            this.$toastShow(error.msg);
        });
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
                page: this.state.page,
                size: this._getSize(),
                type: this.state.segmentIndex
            }).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                let dataTemp = data.data || {};
                this.setState({
                    noMore: dataTemp.data.length < this._getSize(),
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
        if (SpellStatusModel.storeStatus === 2) {
            this.$navigate('spellShop/shopSetting/SetShopNamePage');
        } else if (SpellStatusModel.storeId) {
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
    _RecommendRowOnPress = (id) => {
        this.$navigate('spellShop/MyShop_RecruitPage', { storeId: id });
    };

    // 点击轮播图广告
    _clickItem = (item) => {
        if (item.linkType === 1) {
            this.$navigate('home/product/ProductDetailPage', {
                productCode: item.linkTypeCode
            });
        } else if (item.linkType === 2) {
            this.$navigate('topic/DownPricePage', {
                linkTypeCode: item.linkTypeCode
            });
        } else if (item.linkType === 6) {
            this.$navigate('HtmlPage', {
                title: '详情',
                uri: item.linkTypeCode
            });
        } else if (item.linkType === 3 || item.linkType === 4 || item.linkType === 5) {
            let type = item.linkType === 3 ? 2 : item.linkType === 4 ? 1 : 3;
            this.$navigate('topic/TopicDetailPage', {
                activityCode: item.linkTypeCode,
                activityType: type
            });
        }
    };

    _segmentPressAtIndex = (index) => {
        this.setState({
            dataList: [],
            segmentIndex: index
        }, () => {
            this._loadPageData();
        });
    };

    _renderListHeader = () => {
        return (<ViewPager
            swiperShow={true}
            arrayData={this.state.adList}
            renderItem={this._renderViewPageItem}
            dotStyle={{
                height: 5,
                width: 5,
                borderRadius: 5,
                backgroundColor: '#fff',
                opacity: 0.4
            }}
            activeDotStyle={{
                height: 5,
                width: 30,
                borderRadius: 5,
                backgroundColor: '#fff'
            }}
            autoplay={true}
            height={ScreenUtils.autoSizeWidth(150)}
        />);
    };

    _renderViewPageItem = (item) => {
        const { imgUrl } = item;
        return (
            <UIImage
                source={{ uri: imgUrl }}
                style={{ height: ScreenUtils.autoSizeWidth(150), width: ScreenUtils.width }}
                onPress={() => this._clickItem(item)}
                resizeMode="cover"
            />);
    };

    _renderSectionHeader = () => {
        return (<SegementHeaderView segmentPressAtIndex={this._segmentPressAtIndex}/>);
    };

    _renderItem = ({ item }) => {
        return (<RecommendRow RecommendRowItem={item} RecommendRowOnPress={this._RecommendRowOnPress}/>);
    };

    _ListFooterComponent = () => {
        if (this.state.dataList.length === 0) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.onEndReached || !this.state.dataList.length || this.state.noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <SectionList keyExtractor={(item, index) => `${index}`}
                             refreshControl={
                                 <RefreshControl
                                     refreshing={this.state.refreshing}
                                     onRefresh={this._refreshing.bind(this)}
                                     title="下拉刷新"
                                     tintColor="#999"
                                     titleColor="#999"/>}
                             onEndReached={this._onEndReached.bind(this)}
                             onEndReachedThreshold={0.1}
                             ListFooterComponent={this._ListFooterComponent}
                             stickySectionHeadersEnabled={false}
                             showsVerticalScrollIndicator={false}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             sections={[{ data: this.state.dataList }]}/>
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
