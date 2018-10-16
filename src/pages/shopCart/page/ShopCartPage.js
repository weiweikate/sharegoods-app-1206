import React from 'react';
import { observer } from 'mobx-react';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView, TouchableHighlight,
    Text
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';
import {
    UIText,
    UIImage
} from '../../../components/ui/index';
import ShopCartRes from '../res/ShopCartRes';
import shopCartStore from '../model/ShopCartStore';
import StringUtils from '../../../utils/StringUtils';
import shopCartCacheTool from '../model/ShopCartCacheTool';
import bridge from '../../../utils/bridge';


const activityCode = {
    skill: 1,//秒杀
    makeDown: 2,//降价拍
    discount: 3,//优惠套餐
    helpFree: 4,//助力免费领
    payGift: 5,//支付有礼
    fullReduce: 6,//满减
    guaguaLe: 7//呱呱乐
};

const activityString = {
    [activityCode.skill]: '秒',
    [activityCode.makeDown]: '降',
    [activityCode.discount]: '优',
    [activityCode.helpFree]: '助',
    [activityCode.payGift]: '支',
    [activityCode.fullReduce]: '满',
    [activityCode.guaguaLe]: '刮'
};

@observer
export default class ShopCartPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '购物车',
        leftNavItemHidden: true

    };
 /*   $NavBarRenderRightItem = () => {
        return (
            <View
            />
        );
    };*/

    componentDidMount() {
        shopCartCacheTool.getShopCartGoodsListData();
    }

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            viewData: [
                { a: 11 }

            ]
        };
    }

    _render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                {shopCartStore.data && shopCartStore.data.length > 0 ? this._renderListView() : this._renderEmptyView()}
                {this._renderShopCartBottomMenu()}
            </View>
        );
    }

    _renderEmptyView = () => {
        return (
            <View style={{
                backgroundColor: ColorUtil.Color_f7f7f7,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text>
                    ~购物车暂无商品~!
                </Text>
            </View>
        );
    };

    _renderListView = () => {
        return (
            <SwipeListView
                style={{ backgroundColor: ColorUtil.Color_f7f7f7 }}
                dataSource={this.ds.cloneWithRows(shopCartStore.data.slice())}
                disableRightSwipe={true}
                // renderRow={ data => (
                //     data.status==validCode? this._renderValidItem(data): this._renderInvalidItem(data)
                // )}
                renderRow={(rowData, secId, rowId, rowMap) => (
                    this._renderValidItem(rowData, rowId, rowMap)
                )}
                renderHiddenRow={(data, secId, rowId, rowMap) => (
                    <TouchableOpacity
                        style={styles.standaloneRowBack}
                        onPress={() => {
                            rowMap[`${secId}${rowId}`].closeRow();
                            this._deleteFromShoppingCartByProductId(data.priceId);
                        }}>
                        <UIText style={styles.backUITextWhite} value='删除'></UIText>
                    </TouchableOpacity>
                )}
                rightOpenValue={-75}
            />
        );
    };

    _renderShopCartBottomMenu = () => {
        return (
            <View style={styles.CartBottomContainer}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', paddingLeft: 19 }}
                    onPress={() => this._selectAll()}
                >
                    <Image

                        source={shopCartStore.computedSelect ? ShopCartRes.selectImg : ShopCartRes.unSelectImg}
                        style={{ width: 22, height: 22 }}/>

                    <UIText
                        value={'全选'}
                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#999999', marginLeft: 10 }}/>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UIText
                        value={'合计'}
                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: ColorUtil.Color_222222 }}/>
                    <UIText
                        value={StringUtils.formatMoneyString(shopCartStore.getTotalMoney)}
                        style={styles.totalPrice}/>
                    <TouchableOpacity
                        style={styles.selectGoodsNum}
                        onPress={() => this._toBuyImmediately()}
                    >
                        <UIText
                            value={`结算(${shopCartStore.getTotalSelectGoodsNum})`}
                            style={{ color: ColorUtil.Color_ffffff, fontSize: 16 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    _toBuyImmediately = () => {

        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            bridge.$toast('请先选择结算商品~');
        } else {
            let goodsAllNumber = 0;
            let allPrice = 0.00;
            selectArr.map((goods) => {
                goodsAllNumber += goods.amount;
                allPrice += goods.amount * goods.price;
            });
            bridge.$toast('选中商品类型' + selectArr.length + '种,商品数量' + goodsAllNumber + '个,总价:' + StringUtils.formatMoneyString(allPrice));
        }
    };
    _selectAll = () => {
        shopCartStore.isSelectAllItem(!shopCartStore.computedSelect);
    };
    _renderValidItem = (itemData, rowId, rowMap) => {
        return (
            <View>
                <TouchableHighlight
                    onPress={() => {
                        rowMap;
                        this._jumpToProductDetailPage(itemData);
                    }}
                    style={styles.itemContainer}>
                    <View style={styles.standaloneRowFront}>
                        <UIImage
                            source={itemData.isSelected ? ShopCartRes.selectImg : ShopCartRes.unSelectImg}
                            style={{ width: 22, height: 22, marginLeft: 10 }}
                            onPress={() => {
                                console.warn();
                                let [...tempValues] = shopCartStore.data;
                                tempValues[rowId].isSelected = !tempValues[rowId].isSelected;
                                shopCartStore.data = tempValues;
                            }}
                        />
                        <UIImage
                            source={{ uri: itemData.imgUrl ? itemData.imgUrl : '' }}
                            style={[styles.validProductImg]}
                        />
                        {
                            activityString[itemData.activityCode]
                                ?
                                <UIText
                                    value={
                                        activityString[itemData.activityCode]
                                    }
                                    style={
                                        {
                                            position: 'absolute',
                                            padding: 2,
                                            left: 140,
                                            top: 20,
                                            fontSize: 11,
                                            color: ColorUtil.mainRedColor,
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            borderColor: ColorUtil.mainRedColor
                                        }
                                    }
                                />
                                : null
                        }


                        {/*<UIImage*/}
                        {/*source={{ uri: itemData.imgUrl ? itemData.imgUrl : '' }}*/}
                        {/*style={[styles.validProductImg]}*/}
                        {/*/>*/}
                        {
                            itemData.state === 1 ?
                                <UIImage
                                    source={ShopCartRes.invalidGoodImg}
                                    style={{
                                        // backgroundColor:'red',
                                        position: 'absolute',
                                        marginLeft: 55,
                                        width: 60,
                                        height: 60
                                    }}
                                /> : null
                        }

                        <View style={styles.validContextContainer}>
                            <View>
                                <UIText
                                    value={
                                        itemData.productName
                                            ?
                                            (
                                                activityString[itemData.activityCode]
                                                    ?
                                                    '    ' + itemData.productName
                                                    :
                                                    ''+itemData.productName
                                            )
                                            :
                                            ''}
                                    numberOfLines={2}
                                    style={{
                                        marginTop: 0,
                                        fontFamily: 'PingFang-SC-Medium',
                                        fontSize: 13,
                                        lineHeight: 16,
                                        height: 32,
                                        color: ColorUtil.Color_222222
                                    }}
                                />

                                <UIText
                                    value={itemData.specString ? itemData.specString : ''}
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'PingFang-SC-Medium',
                                        fontSize: 13,
                                        color: ColorUtil.Color_999999
                                    }}/>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <UIText
                                    value={'￥ ' + StringUtils.formatMoneyString(itemData.price, false)}
                                    style={{ fontSize: 14, color: '#e60012' }}/>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._reduceProductNum(itemData, rowId);
                                        }}
                                    >
                                        <UIText
                                            value={'-'}
                                            // style={{fontSize:15,color:data.num<=1?ColorUtil.Color_dddddd:ColorUtil.Color_222222}}
                                            style={{ fontSize: 11, color: ColorUtil.Color_222222 }}
                                        />
                                    </TouchableOpacity>
                                    <View style={[styles.rectangle, {
                                        width: 46,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0
                                    }]}>
                                        <UIText
                                            style={styles.TextInputStyle}
                                            value={itemData.amount}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._addProductNum(itemData, rowId);
                                        }}>
                                        <UIText
                                            value={'+'}
                                            // style={{fontSize:15,color:data.num>=data.stock?color.gray_DDD:color.black_222}}
                                            style={{ fontSize: 11, color: ColorUtil.Color_222222 }}

                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>

                {
                    itemData.activityCode === 2
                        ?
                        <View
                            style={
                                [{
                                    height: 13,
                                    backgroundColor: ColorUtil.mainRedColor,
                                    width: ScreenUtils.width,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }]
                            }
                        >
                            <Text style={{
                                flex: 1,
                                textAlign: 'center',
                                color: ColorUtil.Color_ffffff,
                                fontSize: 11
                            }}>
                                该商品正在进行秒杀活动,快去看看~
                            </Text>
                        </View>
                        : null
                }

                <View
                    style={{ height: 10, backgroundColor: ColorUtil.Color_f7f7f7, width: ScreenUtils.width }}
                />
            </View>
        );
    };
    _jumpToProductDetailPage = (itemData) => {
        //跳转产品详情
        this.$navigate('home/product/ProductDetailPage', {
            productId: itemData.productId,
            productCode: itemData.productId
        });
    };
    /*action*/
    /*减号操作*/
    _reduceProductNum = (itemData, rowId) => {
        if (itemData.amount > 1) {
            itemData.amount--;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        } else if (itemData.amount === 1) {
            bridge.$toast('已达商品最小数量');
        }
        // itemData.amount
    };
    /*加号按钮操作*/
    _addProductNum = (itemData, rowId) => {

        if (itemData.amount >= itemData.stock) {
            bridge.$toast('已达商品库存最大数');
        } else {
            itemData.amount++;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }

        // shopCartStore.data[rowId] = itemData;
    };
    /*删除操作*/
    _deleteFromShoppingCartByProductId = (priceId) => {
        shopCartCacheTool.deleteShopCartGoods(priceId);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green' //每个界面背景颜色不一样
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: ColorUtil.mainRedColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15

    },
    backUITextWhite: {
        // flex:1,
        marginRight: 0,
        color: '#ffffff'
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 130,
        width: ScreenUtils.width,
        flexDirection: 'row',
        marginRight: 16
    },
    rectangle: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: ColorUtil.Color_dddddd,
        alignItems: 'center'
    },

    validItemContainer: {
        height: 140,
        flexDirection: 'row',
        backgroundColor: ColorUtil.Color_f7f7f7
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
        backgroundColor: ColorUtil.Color_ffffff
    },
    invalidUITextInvalid: {
        width: 38,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#999999',
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
        backgroundColor: ColorUtil.Color_ffffff,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalPrice: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: ColorUtil.mainRedColor,
        marginLeft: 10,
        marginRight: 10
    },
    selectGoodsNum: {
        width: 110,
        height: 49,
        backgroundColor: ColorUtil.mainRedColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    TextInputStyle: {
        paddingTop: 8,
        height: 30,
        width: 46,
        fontSize: 11,
        color: ColorUtil.Color_222222,
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
