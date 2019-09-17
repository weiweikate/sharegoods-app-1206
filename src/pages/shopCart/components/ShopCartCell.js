/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huyufeng on 2019/1/3.
 *
 */
'use strict';

import React, { Component } from 'react';
import { Image, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { MRTextInput as TextInput, UIImage, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import shopCartStore from '../model/ShopCartStore';
import { getSelectImage, getTipString, statueImage } from '../model/ShopCartMacro';
import bridge from '../../../utils/bridge';
import ScreenUtils from '../../../utils/ScreenUtils';
import shopCartCacheTool from '../model/ShopCartCacheTool';
import shopRes from '../res';

const dismissKeyboard = require('dismissKeyboard');

const { px2dp } = ScreenUtils;
const Cell_Height = px2dp(150);

export default class ShopCartCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { itemData, rowMap, rowId, cellClickAction, sectionData } = this.props;
        return (
            <View>
                {this._renderCellView(itemData, rowMap, rowId, cellClickAction, sectionData)}
            </View>
        );
    }

    _renderCellView = (itemData, rowMap, rowId, cellClickAction, sectionData) => {
        return (
            <View rowMap={rowMap} style={{
                backgroundColor: DesignRule.bgColor,
                paddingBottom: px2dp(1),
                marginTop: itemData.topSpace,
                alignItems:'center'
            }}>
                <TouchableHighlight onPress={() => {
                    cellClickAction(itemData);
                }}
                >
                    <View style={styles.standaloneRowFront}>
                        <View style={{ flexDirection: 'row', paddingTop: px2dp(10), height: Cell_Height }}>
                            <View style={{ height: px2dp(80), alignItems: 'center', justifyContent: 'center' }}>
                                <UIImage source={getSelectImage(itemData)} style={styles.itemSelectImg}
                                         onPress={() => {
                                             this._selectImageClick(sectionData, rowId);
                                         }}/>
                            </View>

                            <UIImage source={{ uri: itemData.imgUrl ? itemData.imgUrl : '' }}
                                     style={[styles.validProductImg]}/>
                            {
                                (itemData.productStatus !== 1) ?
                                    <UIImage source={statueImage[itemData.productStatus]}
                                             style={styles.statusImg}/>
                                    : (itemData.orderOnProduct === 0 ?
                                    <UIImage source={statueImage[4]} style={styles.statusImg}/> : null)
                            }
                        </View>
                        <View style={styles.validContextContainer}>
                            <View style={{ flex: 1 }}>
                                <UIText value={itemData.productName ? itemData.productName : ''} numberOfLines={2}
                                        style={styles.productName}/>
                                <UIText value={itemData.specifyContent ? itemData.specifyContent : ''} numberOfLines={2}
                                        style={styles.specifyContent}/>
                                <UIText value={getTipString(itemData).tipString} numberOfLines={2}
                                        style={styles.topTipString}/>
                                <View style={{ flexDirection: 'row' }}>{this._getTipArrView(itemData)}</View>
                            </View>
                            <View style={styles.priceBgView}>
                                <UIText value={'￥' + itemData.price} style={styles.priceText}/>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity activeOpacity={0.7} style={styles.rectangle} onPress={() => {
                                        this._reduceProductNum(itemData, rowId);
                                    }}>
                                        <Image style={styles.addOrReduceBtnStyle} source={(itemData.sellStock === 0 ||
                                            itemData.productStatus === 0 ||
                                            itemData.productStatus === 2) ? shopRes.gouwuche_jian_hui : shopRes.gouwuche_jian}/>
                                    </TouchableOpacity>
                                    <View style={[styles.textInputBgView]}>
                                        <TextInput
                                            allowFontScaling={false}
                                            style={
                                                [styles.TextInputStyle,
                                                    (itemData.sellStock === 0 ||
                                                        itemData.productStatus === 0 ||
                                                        itemData.productStatus === 2) ?
                                                        {
                                                            color: DesignRule.textColor_placeholder
                                                        } : null
                                                ]
                                            }
                                            value={itemData.amount ? '' + itemData.amount : ''}
                                            onFocus={() => {
                                                if (itemData.sellStock === 0 ||
                                                    itemData.productStatus === 0 ||
                                                    itemData.productStatus === 2) {
                                                    dismissKeyboard();
                                                }
                                            }}
                                            onChangeText={text => {
                                                if (itemData.productStatus === 0 ||
                                                    itemData.productStatus === 2) {
                                                    bridge.$toast('此商品不可编辑');
                                                } else {
                                                    console.log('输入后的值' + text);
                                                    let goodNumber = parseInt(text);
                                                    if (goodNumber === 0) {
                                                        bridge.$toast('不支持0件商品');
                                                        itemData.amount = 1;
                                                    } else if ((goodNumber > 200)) {
                                                        bridge.$toast('单件商品最多购买200件');
                                                        itemData.amount = 200;
                                                    } else {
                                                        itemData.amount = goodNumber;
                                                    }
                                                    let [...tempArr] = shopCartStore.data.slice();
                                                    (tempArr[sectionData.sectionIndex].data)[rowId] = itemData;
                                                    shopCartStore.data = tempArr;

                                                }
                                            }}
                                            onEndEditing={text => this.onNumberTextChange(itemData, text, rowId)}
                                            placeholder=''
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._addProductNum(itemData, rowId);
                                        }}>
                                        <Image style={styles.addOrReduceBtnStyle} source={(itemData.sellStock === 0 ||
                                            itemData.productStatus === 0 ||
                                            itemData.productStatus === 2) ? shopRes.gouwuche_jia_hui : shopRes.gouwuche_jia}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    };

    _getTipArrView = (itemData) => {
        let tipArr = itemData.displayItem && itemData.displayItem.tags !== null ? itemData.displayItem.tags.slice() : [];
        return tipArr.map((tipItem, index) => {
            return (<View style={[styles.labelBgView, { marginLeft: index === 0 ? 0 : 3 }]}>
                <UIText
                    style={styles.labelTextView}
                    value={tipItem}
                />
            </View>);
        });

    };

    _selectImageClick = (sectionData, rowId) => {
        let [...tempValues] = shopCartStore.data;
        if ((tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 0 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 2 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 3 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].sellStock === 0 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].orderOnProduct === 0) {
            bridge.$toast('此商品不可结算');
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = false;
        } else {
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = !(tempValues[sectionData.sectionIndex].data)[rowId].isSelected;
        }
        shopCartStore.data = tempValues;

    };

    onNumberTextChange = (itemData, text, rowId) => {
        if (itemData.productStatus === 0 || itemData.productStatus === 2) {
            bridge.$toast('此商品已失效');
            return;
        }
        if (itemData.sellStock === 0) {
            bridge.$toast('此商品库存为零不可编辑');
            return;
        }
        if (isNaN(itemData.amount)) {
            itemData.amount = 1;
        }
        if (itemData.amount >= itemData.sellStock) {
            bridge.$toast('已达商品库存最大数');
            itemData.amount = itemData.sellStock;
        }
        if (itemData.amount <= 0) {
            itemData.amount = 1;
        }
        if (itemData.amount > 200) {
            itemData.amount = 200;
            bridge.$toast('单个商品最多200件');
        }
        shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
    };
    /*action*/
    /*减号操作*/
    _reduceProductNum = (itemData, rowId) => {
        if (itemData.productStatus === 0 || itemData.productStatus === 2) {
            return;
        }
        if (itemData.sellStock === 0) {
            bridge.$toast('此商品库存为零不可编辑');
            return;
        }
        if (itemData.amount > 1) {
            itemData.amount--;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        } else if (itemData.amount === 1) {
            bridge.$toast('已达商品最小数量');
        }
    };
    /*加号按钮操作*/
    _addProductNum = (itemData, rowId) => {
        if (itemData.productStatus === 0 || itemData.productStatus === 2) {
            return;
        }
        if (itemData.sellStock === 0) {
            bridge.$toast('此商品库存为零不可编辑');
            return;
        }
        if (itemData.amount >= itemData.sellStock) {
            bridge.$toast('已达商品库存最大数');
        } else {
            itemData.amount++;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }
    };
}
ShopCartCell.propTypes = {
    //cell 数据
    itemData: PropTypes.object.isRequired,
    //section id
    rowMap: PropTypes.number.isRequired,
    //rowid 行数
    rowId: PropTypes.number.isRequired,
    //cell 点击回调函数
    cellClickAction: PropTypes.func,
    //section
    sectionData: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: Cell_Height,
        width: ScreenUtils.width - px2dp(30),
        flexDirection: 'row',
        borderRadius: px2dp(5)
    },
    itemSelectImg: { marginLeft: px2dp(10), width: px2dp(18), height: px2dp(18) },
    rectangle: {
        height: px2dp(28),
        width: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
    addOrReduceBtnStyle: {
        height: px2dp(22),
        width: px2dp(22),
        fontSize: px2dp(15),
        marginTop: px2dp(-2)
    },
    validProductImg: {
        width: px2dp(80),
        height: px2dp(80),
        borderRadius: px2dp(5),
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },
    textInputBgView: {
        width: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(22)
    },
    TextInputStyle: {
        height: px2dp(22),
        fontSize: px2dp(10),
        color: DesignRule.textColor_mainTitle,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 0
    },
    validContextContainer: {
        flex: 1,
        height: px2dp(130),
        justifyContent: 'space-between',
        paddingRight: px2dp(15)
    },
    labelBgView: {
        paddingLeft: px2dp(2),
        paddingRight: px2dp(2),
        backgroundColor: 'rgba(241, 217, 232, 1)',
        marginTop: px2dp(2)
    },
    labelTextView: {
        fontSize: px2dp(10),
        color: DesignRule.mainColor
    },
    priceBgView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusImg: {
        position: 'absolute',
        marginLeft: px2dp(50),
        width: px2dp(60),
        height: px2dp(60),
        marginTop: px2dp(30)
    },
    productName: {
        fontSize: px2dp(13),
        lineHeight: px2dp(18),
        marginTop: px2dp(-3),
        color: DesignRule.textColor_mainTitle
    },
    specifyContent: { fontSize: px2dp(10), lineHeight: px2dp(14), color: DesignRule.textColor_instruction },
    topTipString: { fontSize: px2dp(10), color: DesignRule.mainColor },
    priceText: { fontSize: px2dp(17), fontWeight: '400', color: DesignRule.mainColor }
});


