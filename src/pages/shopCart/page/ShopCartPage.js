import React from 'react';
import { observer } from 'mobx-react';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView,
    RefreshControl
    // requireNativeComponent
} from 'react-native';
import { SwipeListView } from '../../../components/ui/react-native-swipe-list-view';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import {
    UIText
} from '../../../components/ui/index';
import res from '../res';
import shopCartStore from '../model/ShopCartStore';
import shopCartCacheTool from '../model/ShopCartCacheTool';
import DesignRule from 'DesignRule';
// import { activityString, statueImage, getSelectImage } from '../model/ShopCartMacro';
// import { renderShopCartCell } from './ShopCartCell';

// import Cell from '../NativeUI/MRShopCartCell';
const dismissKeyboard = require('dismissKeyboard');
import ShopCartEmptyView from '../components/ShopCartEmptyView';
// import ShopCartHeaderView from '../components/ListHeaderView';
// const CartListView = requireNativeComponent('ShopCartListView');
import ShopCartCell from '../components/ShopCartCell';
// import { track } from '../../../utils/SensorsTrack';
// import TempShopCartCell from '../components/TempShopCartCell';
// import  NavHeaderView from '../components/ShopCartNavHeaderView'
// import HeaderView from '../../order/afterSaleService/components/HeaderView';

@observer
export default class ShopCartPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '购物车',
        leftNavItemHidden: true,
        // show:false
    };

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.contentList = null;
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        this.$navigationBarOptions.leftNavItemHidden = hiddeLeft;
        this.state = {
            showNav:false

        };
    }

    componentDidMount() {
        // this.contentList && this.contentList._updateVisibleRows();
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.pageFocus = true;
                shopCartCacheTool.getShopCartGoodsListData();
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
    }
    _render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderListView() : this._renderEmptyView()}
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderShopCartBottomMenu() : null}
            </View>
        );
    }
    // _renderNavHeaderView=()=>{
    //     return(
    //         <View
    //         style={{
    //             position:'absolute',
    //             zIndex:10
    //         }}
    //         >
    //             <NavHeaderView/>
    //         </View>
    //     )
    //
    // }
    _renderEmptyView = () => {
        return (
            <ShopCartEmptyView btnClickAction={() => {
                this._gotoLookAround();
            }}/>
        );
    };
    _gotoLookAround = () => {
        this.$navigateBackToHome();
    };
    _renderListView = () => {
        if (!this.pageFocus) {
            return;
        }
        const tempArr = this.ds.cloneWithRows(shopCartStore.cartData);
        const { statusBarHeight } = ScreenUtils;
        return (

            <View
                style={{
                    width:ScreenUtils.width,
                    justifyContent:'center',
                    alignItems:'center',
                    flex:1
                }}>
                {/*{this.state.showNav?this._renderNavHeaderView():null}*/}
                <SwipeListView
                    extraData={this.state}
                    style={{
                        width: ScreenUtils.width,
                    }}
                    dataSource={tempArr}
                    disableRightSwipe={true}
                    renderRow={(rowData, secId, rowId, rowMap) => (
                        this._renderValidItem(rowData, rowId, rowMap)
                    )}
                    renderHiddenRow={(data, secId, rowId, rowMap) => (
                        this._renderRowHiddenComponent(data, secId, rowId, rowMap)
                    )}

                    listViewRef={(listView) => this.contentList = listView}
                    rightOpenValue={-75}
                    swipeRefreshControl={
                        <RefreshControl
                            refreshing={shopCartStore.isRefresh}
                            onRefresh={() => {
                                this._refreshFun();
                            }
                            }
                            progressViewOffset={statusBarHeight + 44}
                            colors={[DesignRule.mainColor]}
                            title="下拉刷新"
                            tintColor={DesignRule.textColor_instruction}
                            titleColor={DesignRule.textColor_instruction}
                        />
                    }
                    // onScroll={(event) => {
                    //     console.log(event.nativeEvent.contentOffset.y);
                    //     const offSetY = event.nativeEvent.contentOffset.y;
                    //     if (offSetY > 100){
                    //         this.setState(
                    //             {
                    //                 showNav:true
                    //             }
                    //         )
                    //     } else {
                    //         this.setState(
                    //             {
                    //                 showNav:false
                    //             }
                    //         )
                    //     }
                    // }}
                    // listHeaderView={() => {
                    //     return (
                    //       <ShopCartHeaderView/>
                    //     );
                    // }}
                />
            </View>
        );
    };
    /**
     * 渲染每行的隐藏组件
     * @param data
     * @param secId
     * @param rowId
     * @param rowMap
     * @return {*}
     * @private
     */
    _renderRowHiddenComponent = (data, secId, rowId, rowMap) => {
        return (
            <TouchableOpacity
                style={styles.standaloneRowBack}
                onPress={() => {
                    rowMap[`${secId}${rowId}`].closeRow();
                    this._deleteFromShoppingCartByProductId(data.skuCode);
                }}>
                <View
                    style={
                        {
                            backgroundColor: DesignRule.mainColor,
                            height: 140,
                            width: 75,
                            marginTop: -20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    }
                >
                    <UIText style={styles.backUITextWhite} value='删除'/>
                </View>
                {/*<View*/}
                {/*style={{*/}
                    {/*width:40*/}
                {/*}}*/}
                {/*/>*/}
            </TouchableOpacity>
        );
    };

    _renderShopCartBottomMenu = () => {
        if (!this.pageFocus) {
            return;
        }
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        return (
            <View
                style={[{
                    height: 49,
                    width: ScreenUtils.width,
                    backgroundColor: 'white',
                    zIndex:20
                },
                    (!hiddeLeft && ScreenUtils.tabBarHeight > 49)
                        ?
                        { height: 83 }
                        :
                        null
                ]}
            >
                <View style={styles.CartBottomContainer}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', paddingLeft: 19, alignItems: 'center' }}
                        onPress={() => this._selectAll()}
                    >
                        <Image
                            source={shopCartStore.computedSelect ? res.button.selected_circle_red : res.button.unselected_circle}
                            style={{ width: 22, height: 22 }}/>
                        <UIText
                            value={'全选'}
                            style={{
                                fontSize: 13,
                                color: DesignRule.textColor_instruction,
                                marginLeft: 10
                            }}/>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={'合计'}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>
                        <UIText
                            value={'¥' + shopCartStore.getTotalMoney}
                            style={styles.totalPrice}/>
                        <TouchableOpacity
                            style={styles.selectGoodsNum}
                            onPress={() => this._toBuyImmediately()}
                        >
                            <UIText
                                value={`结算(${shopCartStore.getTotalSelectGoodsNum})`}
                                style={{ color: 'white', fontSize: 16 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    _renderValidItem = (itemData, rowId, rowMap) => {
        return (
            <ShopCartCell itemData={itemData}
                              rowMap={rowMap}
                              rowId={rowId}
                              cellClickAction={
                                  (itemData) => {
                                      this._jumpToProductDetailPage(itemData);
                                  }}/>
        );
    };
    /**
     * 下拉刷新
     * @param itemData
     * @private
     */
    _refreshFun = () => {
        shopCartStore.setRefresh(true);
        shopCartCacheTool.getShopCartGoodsListData();
    };
    /**
     * 前往结算
     * @private
     */
    _toBuyImmediately = () => {
        dismissKeyboard();
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            this.$toastShow('请先选择结算商品~');
            return;
        }
        let isCanSettlement = true;
        let haveNaNGood = false;
        let tempArr = [];
        selectArr.map(good => {
            if (good.amount > good.stock) {
                isCanSettlement = false;
            }
            if (good.amount > 0 && !isNaN(good.amount)) {
                tempArr.push(good);
            }
            if (isNaN(good.amount)) {
                haveNaNGood = true;
                isCanSettlement = false;
            }
        });

        if (haveNaNGood) {
            this.$toastShow('存在选中商品数量为空,或存在正在编辑的商品,请确认~');
            return;
        }
        if (!isCanSettlement) {
            this.$toastShow('商品库存不足请确认~');
            return;
        }
        if (isCanSettlement && !haveNaNGood) {
            this.$loadingShow();
            let buyGoodsArr = [];
            tempArr.map((goods) => {
                buyGoodsArr.push({
                    skuCode: goods.skuCode,
                    quantity: goods.amount,
                    productCode: goods.productCode
                });
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: buyGoodsArr,
                    source: 1
                }
            });
        }
    };
    _jumpToProductDetailPage = (itemData) => {
        if (itemData.status === 0) {
            //失效商品不可进入详情
            return;
        }
        //跳转产品详情
        this.$navigate('home/product/ProductDetailPage', {
            productId: itemData.productId,
            productCode: itemData.productCode,
            preseat:'购物车'
        });
    };
    _selectAll = () => {
        shopCartStore.isSelectAllItem(!shopCartStore.computedSelect);
    };
    /*删除操作*/
    _deleteFromShoppingCartByProductId = (skuCode) => {
        shopCartCacheTool.deleteShopCartGoods(skuCode);
    };
}

const styles = StyleSheet.create({
    standaloneRowBack: {
        alignItems: 'center',
        // backgroundColor: DesignRule.bgColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    backUITextWhite: {
        marginRight: 0,
        color: 'white',
        fontSize: 17
    },
    addOrReduceBtnStyle: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    validItemContainer: {
        height: 140,
        flexDirection: 'row',
        backgroundColor: DesignRule.bgColor
    },
    validProductImg: {
        width: 80,
        height: 80,
        marginLeft: 16,
        marginRight: 16
        // marginBottom: 10
    },
    validConUITextContainer: {
        flex: 1,
        height: 100,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 15
    },
    invalidItemContainer: {
        height: 100,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    invalidUITextInvalid: {
        width: 38,
        height: 20,
        borderRadius: 10,
        backgroundColor: DesignRule.textColor_instruction,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12
    },
    invalidProductImg: {
        width: 80,
        height: 80,
        marginLeft: 7,
        marginRight: 16
    },
    invalidUITextContainer: {
        flex: 1,
        height: 100,
        justifyContent: 'space-between',
        marginTop: 30,
        paddingRight: 15
    },

    CartBottomContainer: {
        width: ScreenUtils.width,
        height: 49,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalPrice: {
        fontSize: 13,
        color: DesignRule.mainColor,
        marginLeft: 10,
        marginRight: 10
    },
    selectGoodsNum: {
        width: 110,
        height: 49,
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    TextInputStyle: {
        padding: 0,
        paddingTop: 5,
        height: 30,
        width: 46,
        fontSize: 11,
        color: DesignRule.textColor_mainTitle,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 0
    },
    validContextContainer: {
        flex: 1,
        height: 100,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 15
    }
});
