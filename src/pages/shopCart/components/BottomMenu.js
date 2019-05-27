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
import DesignRule from "../../../constants/DesignRule";
import ScreenUtils from "../../../utils/ScreenUtils";
import res from "../res";
import shopCartStore from "../model/ShopCartStore";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { UIText } from "../../../components/ui/index";
import PropTypes from "prop-types";
import user from "../../../model/user";
import RouterMap from "../../../navigation/RouterMap";
import bridge from "../../../utils/bridge";
import LinearGradient from "react-native-linear-gradient";
import { TrackApi } from '../../../utils/SensorsTrack';

const dismissKeyboard = require('dismissKeyboard');
const { px2dp } = ScreenUtils;


export default class BottomMenu extends Component {

    static propTypes = {
        hideLeft: PropTypes.bool,
        navigate: PropTypes.func.isRequired
    };
    //默认属性
    static defaultProps = {
        hideLeft: true
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { hideLeft } = this.props;

        return (
            <View
                style={[styles.mainBgView, (!hideLeft && ScreenUtils.tabBarHeight > 49)
                    ?
                    { height: 83 }
                    :
                    null
                ]}>
                <View style={styles.CartBottomContainer}>
                    <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => this._selectAll()}
                    >
                        <Image
                            source={shopCartStore.computedSelect ? res.button.selected_circle_red : res.button.unselected_circle}
                            style={{ width: 22, height: 22 }}/>
                        <UIText
                            value={'全选'}
                            style={styles.selectText}/>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: px2dp(10) }}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <UIText
                                    value={'合计:'}
                                    style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>
                                <UIText
                                    value={'¥' + shopCartStore.getTotalMoney}
                                    style={styles.totalPrice}/>
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginRight: px2dp(10) }}>
                                <UIText
                                    value={'不含运费'}
                                    style={styles.shippingText}/>
                            </View>

                        </View>


                        <TouchableOpacity onPress={() => this._toBuyImmediately()}>
                            <LinearGradient colors={['rgba(255, 0, 80, 1)', 'rgba(252, 93, 57, 1)']}
                                            style={styles.selectGoodsNum}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}>
                                <UIText
                                    value={`去结算(${shopCartStore.getTotalSelectGoodsNum})`}
                                    style={{ color: 'white', fontSize: 16 }}
                                />

                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 1, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
            </View>
        );
    }

    _selectAll = () => {
        shopCartStore.isSelectAllItem(!shopCartStore.computedSelect);
    };
    _toBuyImmediately = () => {
        dismissKeyboard();
        const { navigate } = this.props;
        TrackApi.CartCheckoutClick();
        if (!user.isLogin) {
            navigate(RouterMap.LoginPage);
            return;
        }
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            bridge.$toast('请先选择结算商品~');
            return;
        }
        let isCanSettlement = true;
        let haveNaNGood = false;
        let tempArr = [];
        selectArr.map(good => {
            if (good.amount > good.sellStock) {
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
            bridge.$toast('存在选中商品数量为空,或存在正在编辑的商品,请确认~');
            return;
        }
        if (!isCanSettlement) {
            bridge.$toast('商品库存不足请确认~');
            return;
        }
        if (isCanSettlement && !haveNaNGood) {
            let buyGoodsArr = [];
            tempArr.map((goods) => {
                buyGoodsArr.push({
                    skuCode: goods.skuCode,
                    quantity: goods.amount,
                    productCode: goods.spuCode,
                    batchNo: '1',
                    shoppingCartId: goods.id,
                    activityCode: goods.activityCode
                });
            });
            navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: buyGoodsArr,
                    source: 1
                }
            });
        }
    };
}

const styles = StyleSheet.create({
    mainBgView: {
        height: 49,
        width: ScreenUtils.width,
        backgroundColor: 'white',
        zIndex: 20
    },
    totalPrice: {
        fontSize: px2dp(13),
        color: DesignRule.mainColor,
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },
    touchableOpacity:{ flexDirection: 'row', paddingLeft: 19, alignItems: 'center' },
    selectImg:{ width: px2dp(22), height: px2dp(22) },
    selectText:{ fontSize: px2dp(13), color: DesignRule.textColor_instruction, marginLeft: px2dp(10)  },
    selectGoodsNum: {
        width: px2dp(110),
        height: px2dp(34),
        borderRadius: px2dp(17),
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    CartBottomContainer: {
        width: ScreenUtils.width,
        height: px2dp(47.5),
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    shippingText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(10)
    }

});
