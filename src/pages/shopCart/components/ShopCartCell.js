/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/13.
 *
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import {
    UIText,
    UIImage,
    MRTextInput as TextInput
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import shopCartStore from '../model/ShopCartStore';
import { activityString, getSelectImage, statueImage } from '../model/ShopCartMacro';
import bridge from '../../../utils/bridge';
import ScreenUtils from '../../../utils/ScreenUtils';
import shopCartCacheTool from '../model/ShopCartCacheTool';

const dismissKeyboard = require('dismissKeyboard');

/**
 * 获取秒杀是否开始或者结束
 * @param itemData
 * @private
 * return 0 未开始 1进行中 2已结束
 */
const getSkillIsBegin = (itemData) => {
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
export default class ShopCartCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { itemData, rowMap, rowId, cellClickAction,sectionData } = this.props;

        return (
            <View>
                {
                    this._renderCellView(itemData, rowMap, rowId, cellClickAction,sectionData)
                }
            </View>
        );
    }

    _renderCellView = (itemData, rowMap, rowId, cellClickAction,sectionData) => {
        return (
            <View>
                <TouchableHighlight
                    onPress={() => {
                        rowMap;
                        cellClickAction(itemData);
                    }}
                    style={styles.itemContainer}>
                    <View style={styles.standaloneRowFront}>
                        <UIImage
                            source={getSelectImage(itemData)}
                            style={{ width: 22, height: 22, marginLeft: 10 }}
                            onPress={() => {
                                this._selectImageClick(sectionData,rowId);
                            }}
                        />
                        <UIImage
                            source={{ uri: itemData.imgUrl ? itemData.imgUrl : '' }}
                            style={[styles.validProductImg]}
                        />
                        {
                            activityString[itemData.activityType]
                                ?
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: 140,
                                        top: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        borderColor: DesignRule.mainColor,
                                        width: 16,
                                        height: 16
                                    }}
                                >
                                    <UIText
                                        value={
                                            activityString[itemData.activityType]
                                        }
                                        style={
                                            {
                                                fontSize: 10,
                                                color: DesignRule.mainColor
                                            }
                                        }
                                    />
                                </View>
                                : null
                        }
                        {
                            itemData.productStatus === 1
                                ?
                                null
                                : <UIImage
                                    source={statueImage[itemData.productStatus]}
                                    style={{
                                        // backgroundColor:DesignRule.mainColor,
                                        position: 'absolute',
                                        marginLeft: 55,
                                        width: 60,
                                        height: 60
                                    }}
                                />
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
                                        color: DesignRule.textColor_mainTitle
                                    }}
                                />

                                <UIText
                                    // value={itemData.specString ? itemData.specString : ''}
                                    value={itemData.specTitle?itemData.specTitle:''}
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 13,
                                        color: DesignRule.textColor_instruction
                                    }}/>

                                {
                                    itemData.amount > itemData.sellStock
                                        ?
                                        <UIText
                                            value={'库存不足'}
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 11,
                                                color: DesignRule.mainColor
                                            }}/>
                                        :
                                        null
                                }

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <UIText
                                    value={'￥ ' + itemData.price}
                                    style={{ fontSize: 14, color: DesignRule.mainColor }}/>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={styles.rectangle}
                                        onPress={() => {
                                            this._reduceProductNum(itemData, rowId);
                                        }}
                                    >
                                        <UIText
                                            value={'-'}
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
                                                    itemData.amount = parseInt(text);
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
                                            value={'+'}
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

                <View
                    style={{
                        backgroundColor: DesignRule.bgColor
                    }}
                >
                    {
                        (
                            (itemData.activityType === 1 || itemData.activityType === 2) &&
                            getSkillIsBegin(itemData) === 1 || getSkillIsBegin(itemData) === 0
                        )
                            ?
                            <View
                                style={
                                    [{
                                        height: 15,
                                        width: ScreenUtils.width,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: DesignRule.mainColor

                                    },
                                        getSkillIsBegin(itemData) === 0
                                            ?
                                            { opacity: 0.5 }
                                            :
                                            { opacity: 1 }
                                    ]
                                }
                            >
                                <UIText style={{
                                    flex: 1,
                                    color: 'white',
                                    fontSize: 11
                                }}
                                        value={
                                            itemData.activityType === 1 ?
                                                (getSkillIsBegin(itemData) === 0 ? '秒杀活动未开始,暂不可购买~' : '该商品正在进行秒杀活动,快去看看~') :
                                                '该商品正在进行降价拍活动,快去看看~'
                                        }
                                >

                                </UIText>
                            </View>
                            : null
                    }
                    <View
                        style={{ height: 10, backgroundColor: DesignRule.bgColor, width: ScreenUtils.width }}
                    />
                </View>
            </View>
        );
    };

    _selectImageClick=(sectionData,rowId)=>{
        let [...tempValues] = shopCartStore.data;
        if ((tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 0 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 2 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].productStatus === 3 ||
            (tempValues[sectionData.sectionIndex].data)[rowId].sellStock === 0) {
            bridge.$toast('此商品不可结算');
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = false;
        } else {
            (tempValues[sectionData.sectionIndex].data)[rowId].isSelected = !(tempValues[sectionData.sectionIndex].data)[rowId].isSelected;
        }
        shopCartStore.data = tempValues;

    }

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
            // shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }
        if (itemData.amount >= itemData.sellStock) {
            bridge.$toast('已达商品库存最大数');
            itemData.amount = itemData.sellStock;
            // shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }
        if (itemData.amount <= 0) {
            itemData.amount = 1;
            // shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
        }
        if (itemData.amount > 200) {
            itemData.amount = 200;
            bridge.$toast('单个商品最多200件');
            // shopCartCacheTool.updateShopCartDataLocalOrService(itemData, rowId);
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
    sectionData:PropTypes.object.isRequired,
};

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
        // backgroundColor: DesignRule.mainColor,
        backgroundColor: DesignRule.bgColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
        // padding: 15

    },
    backUITextWhite: {
        // flex:1,
        marginRight: 0,
        color: 'white',
        fontSize: 17
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 130,
        // width: ScreenUtils.width - 100,
        width: ScreenUtils.width,
        flexDirection: 'row',
        marginRight: 16
    },
    rectangle: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inColorBg,
        alignItems: 'center'
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
    // itemContainer: {
    //     height: 40,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
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


