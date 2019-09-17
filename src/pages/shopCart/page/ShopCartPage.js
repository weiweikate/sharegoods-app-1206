'use strict';
import React from 'react';
import { observer } from 'mobx-react';

import { BackHandler, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from '../../../components/ui/react-native-swipe-list-view';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText, UIText } from '../../../components/ui/index';
import shopCartStore from '../model/ShopCartStore';
import shopCartCacheTool from '../model/ShopCartCacheTool';
import DesignRule from '../../../constants/DesignRule';
import ShopCartEmptyView from '../components/ShopCartEmptyView';
import ShopCartCell from '../components/ShopCartCell';
import SectionHeaderView from '../components/SectionHeaderView';
import RouterMap from '../../../navigation/RouterMap';
import { TrackApi } from '../../../utils/SensorsTrack';
import BottomMenu from '../components/BottomMenu';
import { shopCartEmptyModel } from '../model/ShopCartEmptyModel';
import res from '../res';
import HeaderLoading from '../../../comm/components/lottieheader/ListHeaderLoading';

const { px2dp } = ScreenUtils;
const { shopCartNoGoods } = res;


@observer
export default class ShopCartPage extends BasePage {
    $navigationBarOptions = {
        title: '购物车',
        leftNavItemHidden: true
    };

    constructor(props) {
        super(props);
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        this.$navigationBarOptions.leftNavItemHidden = hiddeLeft;
        this.state = {
            showNav: false
        };

        TrackApi.shoppingcart();
    }

    componentDidMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                this.pageFocus = true;
                shopCartCacheTool.getShopCartGoodsListData();
                shopCartEmptyModel.getRecommendProducts(true);
            }
        );
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.pageFocus = false;
            }
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    handleBackPress = () => {
        if (this.$navigationBarOptions.leftNavItemHidden) {
            this.$navigateBackToHome();
            return true;
        } else {
            return false;
        }
    };

    _render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderListView() : this._renderEmptyView()}
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderShopCartBottomMenu() : null}
            </View>
        );
    }

    _renderEmptyView = () => {
        const { emptyViewList } = shopCartEmptyModel;
        if (emptyViewList && emptyViewList.length === 0) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={shopCartNoGoods} style={{ width: px2dp(244), height: px2dp(140) }}/>
                <MRText style={{
                    fontSize: px2dp(13),
                    color: 'rgba(153, 153, 153, 1)',
                    marginTop: px2dp(5)
                }}>购物车竟然是空的</MRText>
            </View>;
        }
        return (
            <ShopCartEmptyView
                navigateToHome={this.$navigate}
            />
        );
    };
    _renderListView = () => {
        if (!this.pageFocus) {
            return;
        }
        return (
            <View style={styles.listBgContent}>
                <SwipeListView
                    extraData={this.state}
                    style={styles.swipeListView}
                    sections={shopCartStore.cartData}
                    useSectionList={true}
                    disableRightSwipe={true}
                    renderItem={(rowData, rowMap) => (
                        this._renderValidItem(rowData, rowMap)
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        this._renderRowHiddenComponent(data, rowMap)
                    )}
                    renderHeaderView={(sectionData) => {
                        {
                            return (<SectionHeaderView sectionData={sectionData.section} navigate={this.$navigate}/>);
                        }
                    }}
                    listViewRef={(listView) => this.contentList = listView}
                    rightOpenValue={-75}
                    showsVerticalScrollIndicator={false}
                    swipeRefreshControl={<HeaderLoading
                        refreshing={shopCartStore.isRefresh}
                        onRefresh={this._refreshFun}
                    />}

                />
            </View>
        );
    };
    _renderRowHiddenComponent = (data, rowMap) => {
        return (
            <TouchableOpacity
                style={styles.standaloneRowBack}
                onPress={() => {
                    rowMap[data.item.key].closeRow();
                    this._deleteFromShoppingCartByProductId(data);
                }} activeOpacity={0.7} >
                <View style={[styles.hideBgView, { marginTop: data.item.topSpace }]}>
                    <View style={styles.hideTextBgView}>
                        <UIText style={styles.backUITextWhite} value='删除'/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    _renderShopCartBottomMenu = () => {
        if (!this.pageFocus) {
            return;
        }
        let hideLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hideLeft = this.params.hiddeLeft;
        } else {
            hideLeft = true;
        }
        return (<BottomMenu navigate={this.$navigate} hideLeft={hideLeft}/>);
    };

    _renderValidItem = (itemData, rowMap) => {
        return (
            <ShopCartCell itemData={itemData.item}
                          rowMap={rowMap}
                          rowId={itemData.index}
                          sectionData={itemData.section}
                          cellClickAction={
                              (itemData) => {
                                  this._jumpToProductDetailPage(itemData);
                              }}/>
        );
    };

    _refreshFun = () => {
        shopCartStore.setRefresh(true);
        shopCartCacheTool.getShopCartGoodsListData();
        shopCartEmptyModel.getRecommendProducts(true);
    };
    _jumpToProductDetailPage = (itemData) => {
        if (itemData.productStatus === 0) {
            return;
        }
        if (itemData.sectionType === 8) {
            this.$navigate(RouterMap.XpDetailPage, {
                activityCode: itemData.activityCode
            });
            return;
        }
        this.$navigate(RouterMap.ProductDetailPage, {
            productId: itemData.productId,
            productCode: itemData.spuCode
        });
    };
    /*删除操作*/
    _deleteFromShoppingCartByProductId = (itemData) => {
        console.log('删除前');
        console.log(itemData);
        let delteCode = [
            { 'skuCode': itemData.item.skuCode }
        ];
        shopCartCacheTool.deleteShopCartGoods(delteCode);
    };
}

const shopCartListWidth = ScreenUtils.width - px2dp(30);

const styles = StyleSheet.create({
    listBgContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    swipeListView: { width: shopCartListWidth },
    standaloneRowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    backUITextWhite: {
        color: 'white',
        fontSize: px2dp(17)
    },
    hideBgView: {
        backgroundColor: 'white',
        height: px2dp(150),
        width: shopCartListWidth,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    hideTextBgView: {
        width: px2dp(75),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        height: px2dp(150)
    }
});
