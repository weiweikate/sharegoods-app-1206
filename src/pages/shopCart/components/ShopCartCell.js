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
"use strict";

import React, { Component } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableHighlight
} from "react-native";
import PropTypes from "prop-types";
import {
    UIText,
    UIImage,
    MRTextInput as TextInput
} from "../../../components/ui";
import DesignRule from "../../../constants/DesignRule";
import shopCartStore from "../model/ShopCartStore";
import { getSelectImage, getTipString, statueImage, getSkillIsBegin } from "../model/ShopCartMacro";
import bridge from "../../../utils/bridge";
import ScreenUtils from "../../../utils/ScreenUtils";
import shopCartCacheTool from "../model/ShopCartCacheTool";

const dismissKeyboard = require("dismissKeyboard");

const { px2dp } = ScreenUtils;

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
                marginTop: itemData.topSpace
            }}>
                <TouchableHighlight onPress={() => {
                    cellClickAction(itemData);
                }}
                >
                    <View style={styles.standaloneRowFront}>
                        <UIImage source={getSelectImage(itemData)} style={styles.itemSelectImg}
                                 onPress={() => {
                                     this._selectImageClick(sectionData, rowId);
                                 }}/>
                        <UIImage source={{ uri: itemData.imgUrl ? itemData.imgUrl : "" }}
                                 style={[styles.validProductImg]}/>
                        {/*{*/}
                            {/*getTipString(itemData).needIconText*/}
                                {/*?*/}
                                {/*<View*/}
                                    {/*style={{*/}
                                        {/*position: "absolute",*/}
                                        {/*left: 140,*/}
                                        {/*top: 20,*/}
                                        {/*justifyContent: "center",*/}
                                        {/*alignItems: "center",*/}
                                        {/*borderWidth: 1,*/}
                                        {/*borderRadius: 4,*/}
                                        {/*borderColor: DesignRule.mainColor,*/}
                                        {/*width: 16,*/}
                                        {/*height: 16*/}
                                    {/*}}*/}
                                {/*>*/}
                                    {/*<UIText*/}
                                        {/*value={getTipString(itemData).iconText}*/}
                                        {/*style={{ fontSize: 10, color: DesignRule.mainColor }}*/}
                                    {/*/>*/}
                                {/*</View>*/}
                                {/*: null*/}
                        {/*}*/}
                        {
                            //是否售完
                            itemData.productStatus === 1
                                ?
                                null
                                : <UIImage
                                    source={statueImage[itemData.productStatus]}
                                    style={{
                                        position: "absolute",
                                        marginLeft: 55,
                                        width: 60,
                                        height: 60
                                    }}
                                />
                        }

                        <View style={styles.validContextContainer}>
                            <View style={{}}>
                                <UIText
                                    value={itemData.productName ? itemData.productName : ""}
                                    numberOfLines={2}
                                    style={{
                                        marginTop: 0,
                                        fontSize: 13,
                                        lineHeight: 10,
                                        color: DesignRule.textColor_mainTitle
                                    }}
                                />

                                <UIText
                                    value={itemData.specifyContent ? itemData.specifyContent : ""}
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 13,
                                        color: DesignRule.textColor_instruction
                                    }}/>

                                {
                                    <UIText
                                        value={getTipString(itemData).tipString}
                                        // value={''}
                                        numberOfLines={2}
                                        style={{
                                            fontSize: 11,
                                            color: DesignRule.mainColor
                                        }}/>
                                }

                                <View style={{ flexDirection: "row" }}>
                                    {this._getTipArrView(itemData)}
                                </View>
                            </View>
                            <View style={styles.priceBgView}>
                                <UIText
                                    value={"￥" + itemData.price}
                                    style={{ fontSize: 14, color: DesignRule.mainColor }}/>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._reduceProductNum(itemData, rowId);
                                        }}
                                    >
                                        <UIText
                                            value={"-"}
                                            style={
                                                [styles.addOrReduceBtnStyle,
                                                    (itemData.sellStock === 0 ||
                                                        itemData.productStatus === 0 ||
                                                        itemData.productStatus === 2) ?
                                                        {
                                                            color: DesignRule.textColor_placeholder
                                                        } : null
                                                ]
                                            }
                                        />
                                    </TouchableOpacity>
                                    <View style={[styles.rectangle, {
                                        width: 46,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0
                                    }]}>
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
                                            value={itemData.amount ? "" + itemData.amount : ""}
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
                                                    bridge.$toast("此商品不可编辑");
                                                } else {
                                                    console.log("输入后的值" + text);
                                                    let goodNumber = parseInt(text);
                                                    if (goodNumber === 0) {
                                                        bridge.$toast("不支持0件商品");
                                                        itemData.amount = 1;
                                                    } else if ((goodNumber > 200)) {
                                                        bridge.$toast("单件商品最多购买200件");
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
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._addProductNum(itemData, rowId);
                                        }}>
                                        <UIText
                                            value={"+"}
                                            style={
                                                [styles.addOrReduceBtnStyle,

                                                    (itemData.sellStock === 0 ||
                                                        itemData.productStatus === 0 ||
                                                        itemData.productStatus === 2)
                                                        ?
                                                        {
                                                            color: DesignRule.textColor_placeholder
                                                        }
                                                        : null
                                                ]
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                {/*<View*/}
                {/*style={{*/}
                {/*backgroundColor: DesignRule.bgColor*/}
                {/*}}*/}
                {/*>*/}
                {/*{*/}
                {/*(*/}
                {/*(itemData.activityType === 1 || itemData.activityType === 2) &&*/}
                {/*getSkillIsBegin(itemData) === 1 || getSkillIsBegin(itemData) === 0*/}
                {/*)*/}
                {/*?*/}
                {/*<View*/}
                {/*style={*/}
                {/*[{*/}
                {/*height: 15,*/}
                {/*width: ScreenUtils.width,*/}
                {/*justifyContent: "center",*/}
                {/*alignItems: "center",*/}
                {/*backgroundColor: DesignRule.mainColor*/}

                {/*},*/}
                {/*getSkillIsBegin(itemData) === 0*/}
                {/*?*/}
                {/*{ opacity: 0.5 }*/}
                {/*:*/}
                {/*{ opacity: 1 }*/}
                {/*]*/}
                {/*}*/}
                {/*>*/}
                {/*<UIText style={{*/}
                {/*flex: 1,*/}
                {/*color: "white",*/}
                {/*fontSize: 11*/}
                {/*}}*/}
                {/*value={*/}
                {/*itemData.activityType === 1 ?*/}
                {/*(getSkillIsBegin(itemData) === 0 ? "秒杀活动未开始,暂不可购买~" : "该商品正在进行秒杀活动,快去看看~") :*/}
                {/*"该商品正在进行降价拍活动,快去看看~"*/}
                {/*}*/}
                {/*>*/}

                {/*</UIText>*/}
                {/*</View>*/}
                {/*: null*/}
                {/*}*/}
                {/*<View*/}
                {/*style={{ height: 10, backgroundColor: DesignRule.bgColor, width: ScreenUtils.width }}*/}
                {/*/>*/}
                {/*</View>*/}
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
            (tempValues[sectionData.sectionIndex].data)[rowId].sellStock === 0) {
            bridge.$toast("此商品不可结算");
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = false;
        } else {
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = !(tempValues[sectionData.sectionIndex].data)[rowId].isSelected;
        }
        shopCartStore.data = tempValues;

    };

    onNumberTextChange = (itemData, text, rowId) => {
        if (itemData.productStatus === 0 || itemData.productStatus === 2) {
            bridge.$toast("此商品已失效");
            return;
        }
        if (itemData.sellStock === 0) {
            bridge.$toast("此商品库存为零不可编辑");
            return;
        }
        if (isNaN(itemData.amount)) {
            itemData.amount = 1;
        }
        if (itemData.amount >= itemData.sellStock) {
            bridge.$toast("已达商品库存最大数");
            itemData.amount = itemData.sellStock;
        }
        if (itemData.amount <= 0) {
            itemData.amount = 1;
        }
        if (itemData.amount > 200) {
            itemData.amount = 200;
            bridge.$toast("单个商品最多200件");
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
            bridge.$toast("此商品库存为零不可编辑");
            return;
        }
        if (itemData.amount > 1) {
            itemData.amount--;
            shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        } else if (itemData.amount === 1) {
            bridge.$toast("已达商品最小数量");
        }
    };
    /*加号按钮操作*/
    _addProductNum = (itemData, rowId) => {
        if (itemData.productStatus === 0 || itemData.productStatus === 2) {
            return;
        }
        if (itemData.sellStock === 0) {
            bridge.$toast("此商品库存为零不可编辑");
            return;
        }
        if (itemData.amount >= itemData.sellStock) {
            bridge.$toast("已达商品库存最大数");
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
        alignItems: "center",
        backgroundColor: "#fff",
        height: px2dp(145),
        width: ScreenUtils.width - px2dp(30),
        flexDirection: "row",
        marginRight: 16
    },
    itemSelectImg: { width: px2dp(22), height: px2dp(22), marginLeft: px2dp(10) },
    rectangle: {
        height: px2dp(30),
        width: px2dp(30),
        justifyContent: "center",
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inColorBg,
        alignItems: "center"
    },
    addOrReduceBtnStyle: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    validProductImg: {
        width: px2dp(75),
        height: px2dp(75),
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },
    TextInputStyle: {
        padding: 0,
        paddingTop: 5,
        height: px2dp(30),
        width: px2dp(46),
        fontSize: px2dp(11),
        color: DesignRule.textColor_mainTitle,
        alignSelf: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingVertical: 0
    },
    validContextContainer: {
        flex: 1,
        height: px2dp(120),
        justifyContent: "space-between",
        marginTop: px2dp(3),
        paddingRight: px2dp(15)
    },
    labelBgView: {
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: "rgba(241, 217, 232, 1)"
    },
    labelTextView: {
        fontSize: 10,
        color: DesignRule.mainColor
    },
    priceBgView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 30
    }
});


