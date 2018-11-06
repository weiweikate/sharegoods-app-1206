import React from 'react';
import { observer } from 'mobx-react';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView, TouchableHighlight,
    Text,
    TextInput,
    RefreshControl
} from 'react-native';
import { SwipeListView } from '../../../components/ui/react-native-swipe-list-view';
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

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.isUnFishFirstRender = true;
        this.contentList = null;
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        this.$navigationBarOptions.leftNavItemHidden = hiddeLeft;
    }

    componentDidMount() {
        this.contentList && this.contentList._updateVisibleRows();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.log('payload is run ----');
                let offSet = this.contentList ? this.contentList.props.contentOffset : 'meiyou offset';
                console.log(offSet);

                if (this.isUnFishFirstRender &&
                    shopCartStore.data.length > 0 &&
                    this.contentList) {
                    this.contentList.scrollTo({ x: 0, y: 1, animated: true });
                    this.isUnFishFirstRender = false;
                }
            }
        );

        // const {statusBarHeight} = ScreenUtils
        // if (this.contentList){
        //     this.contentList.refreshControl = <RefreshControl
        //         refreshing={homeModule.isRefreshing}
        //         onRefresh={this._onRefresh.bind(this)}
        //         progressViewOffset={statusBarHeight + 44}
        //         colors={['#d51243']}
        //         title="下拉刷新"
        //         tintColor="#999"
        //         titleColor="#999"
        //     />
        // }
    }


    componentWillUnmount() {
        this.didBlurSubscription.remove();

    }

    _render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                {/*{shopCartStore.data && shopCartStore.data.length > 0 ? this._renderListView() : this._renderEmptyView()}*/}
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderListView() : this._renderEmptyView()}
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
                    ~购物车更新暂无商品1.0.2~!
                </Text>
            </View>
        );
    };

    _renderListView = () => {
        const tempArr = this.ds.cloneWithRows(shopCartStore.cartData);
        const { statusBarHeight } = ScreenUtils;
        return (
            <SwipeListView
                style={{ backgroundColor: ColorUtil.Color_f7f7f7 }}
                dataSource={tempArr}
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
                        <UIText style={styles.backUITextWhite} value='删除'/>
                    </TouchableOpacity>
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
                        colors={['#d51243']}
                        title="下拉刷新"
                        tintColor="#999"
                        titleColor="#999"
                    />
                }
            />
        );
    };


    _renderShopCartBottomMenu = () => {
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
                    backgroundColor: ColorUtil.Color_ffffff
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
                        style={{ flexDirection: 'row', paddingLeft: 19 }}
                        onPress={() => this._selectAll()}
                    >
                        <Image
                            source={shopCartStore.computedSelect ? ShopCartRes.selectImg : ShopCartRes.unSelectImg}
                            style={{ width: 22, height: 22 }}/>

                        <UIText
                            value={'全选'}
                            style={{
                                fontSize: 13,
                                color: '#999999',
                                marginLeft: 10
                            }}/>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={'合计'}
                            style={{ fontSize: 13, color: ColorUtil.Color_222222 }}/>
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
            </View>
        );
    };
    _toBuyImmediately = () => {
        // this.$navigate('LoginModal')
        // return;
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            bridge.$toast('请先选择结算商品~');
        } else {
            let tempArr = [];
            selectArr.map((goods) => {
                tempArr.push({
                    priceId: goods.priceId,
                    num: goods.amount,
                    productId: goods.productId
                });
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: tempArr
                }
            });
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

                                let [...tempValues] = shopCartStore.data;

                                if (tempValues[rowId].status === 0) {
                                    bridge.$toast('失效商品不可结算');
                                } else {
                                    tempValues[rowId].isSelected = !tempValues[rowId].isSelected;
                                }
                                shopCartStore.data = tempValues;
                            }}
                        />
                        <UIImage
                            source={{ uri: itemData.imgUrl ? itemData.imgUrl : '' }}
                            style={[styles.validProductImg]}
                        />
                        {
                            activityString[itemData.activityType]
                                ?
                                <UIText
                                    value={
                                        activityString[itemData.activityType]
                                    }
                                    style={
                                        {
                                            position: 'absolute',
                                            padding: 2,
                                            left: 140,
                                            top: 20,
                                            fontSize: 10,
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
                            itemData.status === 0 ?
                                <UIImage
                                    source={ShopCartRes.invalidGoodImg}
                                    style={{
                                        // backgroundColor:'red',
                                        position: 'absolute',
                                        marginLeft: 55,
                                        width: 60,
                                        height: 60
                                    }}
                                />
                                : null
                        }

                        <View style={styles.validContextContainer}>
                            <View>
                                <UIText
                                    value={
                                        itemData.productName
                                            ?
                                            (
                                                activityString[itemData.activityType]
                                                    ?
                                                    '    ' + itemData.productName
                                                    :
                                                    '' + itemData.productName
                                            )
                                            :
                                            ''}
                                    numberOfLines={2}
                                    style={{
                                        marginTop: 0,
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
                                        {/*<UIText*/}
                                        {/*style={styles.TextInputStyle}*/}
                                        {/*value={itemData.amount}*/}
                                        {/*/>*/}
                                        <TextInput
                                            style={styles.TextInputStyle}
                                            value={itemData.amount ? '' + itemData.amount : ''}
                                            underlineColorAndroid={'transparent'}
                                            // onChangeText={(text) => this.setState({text})}
                                            onChangeText={text => {
                                                console.log('输入后的值' + text);
                                                itemData.amount = parseInt(text);
                                                let [...tempArr] = shopCartStore.data.slice();
                                                tempArr[rowId] = itemData;
                                                shopCartStore.data = tempArr;
                                            }}
                                            // onEndEditing={text => this.onNumberTextChange(itemData,text,rowId)}
                                            // onSubmitEditing={text => this.onNumberTextChange(itemData,text,rowId)}
                                            // onEndEditing={text => this.onNumberTextChange(itemData,text,rowId)}
                                            onEndEditing={text => this.onNumberTextChange(itemData, text, rowId)}
                                            placeholder=''
                                            keyboardType='numeric'
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

                <View
                    style={{
                        backgroundColor: ColorUtil.Color_f7f7f7
                    }}
                >
                    {
                        (
                            (itemData.activityType === 1 || itemData.activityType === 2) &&
                            this._getSkillIsBegin(itemData) === 1 || this._getSkillIsBegin(itemData) === 0
                        )
                            ?
                            <View
                                style={
                                    [{
                                        height: 15,
                                        width: ScreenUtils.width,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                        // opacity:0.2
                                    },
                                        this._getSkillIsBegin(itemData) === 0
                                            ?
                                            { backgroundColor: 'rgba(213, 18, 67, 0.5)' }
                                            :
                                            { backgroundColor: 'rgba(213, 18, 67, 1)' }
                                    ]
                                }
                            >
                                <Text style={{
                                    flex: 1,
                                    color: ColorUtil.Color_ffffff,
                                    fontSize: 11
                                }}>
                                    {
                                        itemData.activityType === 1 ?
                                            (this._getSkillIsBegin(itemData) === 0 ? '秒杀活动未开始,暂不可购买~' : '该商品正在进行秒杀活动,快去看看~') :
                                            '该商品正在进行降价拍活动,快去看看~'
                                    }
                                </Text>
                            </View>
                            : null
                    }
                    <View
                        style={{ height: 10, backgroundColor: ColorUtil.Color_f7f7f7, width: ScreenUtils.width }}
                    />
                </View>
            </View>

        );
    };


    /**
     * 获取秒杀是否开始或者结束
     * @param itemData
     * @private
     * return 0 未开始 1进行中 2已结束
     */
    _getSkillIsBegin = (itemData) => {
        if ((new Date().getTime()) < itemData.activityBeginTime) {
            return 0;
        } else if (
            (new Date().getTime()) > itemData.activityBeginTime &&
            (new Date().getTime()) < itemData.activityEndTime
        ) {
            return 1;
        } else {
            return 2;
        }

    };
    /**
     * 下拉刷新
     * @param itemData
     * @private
     */
    _refreshFun = () => {

        shopCartStore.isRefresh = true;
        shopCartCacheTool.getShopCartGoodsListData();

    };

    _jumpToProductDetailPage = (itemData) => {
        if (itemData.status === 0) {
            //失效商品不可进入详情
            return;
        }
        //跳转产品详情
        this.$navigate('home/product/ProductDetailPage', {
            productId: itemData.productId,
            productCode: itemData.productId
        });
    };
    onNumberTextChange = (itemData, text, rowId) => {
        // console.log('------在执行');
        // console.log(itemData)
        // console.log(itemData.amount);
        // console.log(typeof itemData.amount)
        if (isNaN(itemData.amount)) {
            console.log('执行了判断内部函数');
            itemData.amount = 1;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }
        if (itemData.amount >= itemData.stock) {
            bridge.$toast('已达商品库存最大数');
            itemData.amount = itemData.stock;
        }
        if (itemData.amount <= 0) {
            itemData.amount = 1;
        }
        if (itemData.amount > 200) {
            itemData.amount = 200;
            bridge.$toast('单个商品最多200件');
        }
        shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        // if(StringUtils.checkIsPositionNumber(parseInt(text))) {
        //     itemData.amount = parseInt(text)
        //
        // }
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
    };
    /*删除操作*/
    _deleteFromShoppingCartByProductId = (priceId) => {
        shopCartCacheTool.deleteShopCartGoods(priceId);
    };
}

const
    styles = StyleSheet.create({
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
            padding: 0,
            paddingTop: 5,
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
