/**
 * @author 陈阳君
 * @date on 2019/09/18
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import res from '../../res';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import RouterMap, { routePush } from '../../../../navigation/RouterMap';
import SpellShopApi from '../../api/SpellShopApi';
import bridge from '../../../../utils/bridge';

const { selectedImg, unSelectedImg } = res.addCapacity;

@observer
export class AddCapacityPriceItem extends Component {
    render() {
        const { itemData, index } = this.props;
        const { goodsName, goodsImage, specs, salePrice, originPrice, isSelected } = itemData;
        return (
            <View style={[stylesItem.container, index === 0 && { marginTop: 15 }]}>
                <View style={stylesItem.container1}>
                    <NoMoreClick style={stylesItem.selectBtn} onPress={() => {
                        itemData.isSelected = !isSelected;
                    }}>
                        <Image source={isSelected ? selectedImg : unSelectedImg} style={stylesItem.selectImg}/>
                    </NoMoreClick>
                    <UIImage style={stylesItem.productImg} source={{ uri: goodsImage }}/>
                    <View style={stylesItem.rightView}>
                        <View>
                            <MRText style={stylesItem.nameText}>{goodsName || ''}</MRText>
                            <MRText style={stylesItem.specText}>{`规格: ${specs || ''}`}</MRText>
                        </View>
                        <View style={stylesItem.rightBottomView}>
                            <MRText style={stylesItem.priceText}>¥
                                <MRText>{`${salePrice} `}
                                    <MRText style={stylesItem.oPriceText}>¥{originPrice}</MRText>
                                </MRText>
                            </MRText>
                            <AmountView itemData={itemData}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const stylesItem = StyleSheet.create({
    container: {
        borderRadius: 5, marginHorizontal: 15, marginBottom: 10, backgroundColor: 'white'
    },
    container1: {
        flexDirection: 'row', marginVertical: 10
    },
    selectBtn: {
        justifyContent: 'center', alignItems: 'center',
        width: 37
    },
    selectImg: {
        width: 17, height: 17
    },
    productImg: {
        width: 80, height: 80, overflow: 'hidden', borderRadius: 5
    },
    rightView: {
        flex: 1, marginLeft: 10, justifyContent: 'space-between'
    },
    nameText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    specText: {
        fontSize: 10, color: DesignRule.textColor_instruction
    },
    priceText: {
        fontSize: 17, color: DesignRule.textColor_redWarn
    },
    oPriceText: {
        fontSize: 10, color: DesignRule.textColor_instruction, textDecorationLine: 'line-through'
    },
    rightBottomView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 10, justifyContent: 'space-between'
    }
});

@observer
class AmountView extends Component {
    render() {
        const { itemData } = this.props;
        const { amount } = itemData;
        return (
            <View style={stylesAmount.container}>
                <NoMoreClick style={stylesAmount.clickBtn} onPress={() => {
                    itemData.amount > 0 && itemData.amount--;
                }}>
                    <MRText style={{ fontSize: 12, color: DesignRule.textColor_placeholder }}>-</MRText>
                </NoMoreClick>
                <MRText style={stylesAmount.amountText}>{amount}</MRText>
                <NoMoreClick style={stylesAmount.clickBtn} onPress={() => {
                    itemData.amount++;
                }}>
                    <MRText style={{ fontSize: 12, color: DesignRule.textColor_mainTitle }}>+</MRText>
                </NoMoreClick>
            </View>
        );
    }
}

const stylesAmount = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center'
    },
    amountText: {
        fontSize: 10, color: DesignRule.textColor_mainTitle, width: 34, textAlign: 'center'
    },
    clickBtn: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7',
        width: 20, height: 20, borderRadius: 3
    },
    clickText: {
        fontSize: 8
    }
});

const bottomHeight = 54;

@observer
export class PriceBottomView extends Component {

    _bottomAction = () => {
        const { selectedList, totalPerson } = this.props.addCapacityPriceModel;
        SpellShopApi.verifyExpandOrderParams({ buyNum: totalPerson }).then(() => {
            const orderProducts = selectedList.map((item) => {
                const { skuCode, amount, goodsImage, goodsName, salePrice, specs } = item;
                return {
                    skuCode: skuCode,
                    productName: goodsName,
                    specImg: goodsImage,
                    quantity: amount,
                    productType: 3,
                    activityCode: '',
                    batchNo: 1,
                    unitPrice: salePrice,
                    spec: specs
                };
            });
            routePush(RouterMap.ConfirOrderPage, {
                orderParamVO: {
                    orderProducts: orderProducts,
                    source: 2
                }
            });
        }).catch((e) => {
            bridge.$toast(e.msg);
        });
    };

    render() {
        const { addCapacityPriceModel } = this.props;
        const { totalPerson, totalMoney, canBuyExpandGoodsNum, canBuy } = addCapacityPriceModel;
        const leavePerson = canBuyExpandGoodsNum - totalPerson;
        const colors = canBuy ? ['#FC5D39', '#FF0050'] : ['#FFCDDC', '#FFDFD8'];
        return (
            <View style={stylesBottom.bottomView}>
                <View style={stylesBottom.container}>
                    <View>
                        <MRText style={{ fontSize: 12, color: DesignRule.textColor_mainTitle }}>
                            已选扩容{totalPerson}人
                        </MRText>
                        <MRText style={{ fontSize: 13, color: DesignRule.textColor_redWarn }}>
                            {leavePerson > 0 ? `还可扩容${leavePerson}人` : `最高可扩容${canBuyExpandGoodsNum}人`}
                        </MRText>
                    </View>
                    <View style={{ flex: 1 }}/>
                    <MRText style={{ fontSize: 12, color: DesignRule.textColor_mainTitle }}>合计：
                        <MRText style={{ fontSize: 13, color: DesignRule.textColor_redWarn }}>¥{totalMoney}</MRText>
                    </MRText>
                    <NoMoreClick onPress={this._bottomAction} disabled={!canBuy}>
                        <LinearGradient style={stylesBottom.LinearGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={colors}>
                            <MRText style={{ fontSize: 14, color: 'white' }}>
                                立即购买
                            </MRText>
                        </LinearGradient>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const stylesBottom = StyleSheet.create({
    bottomView: {
        height: ScreenUtils.safeBottom + bottomHeight, backgroundColor: 'white'
    },
    container: {
        flexDirection: 'row', alignItems: 'center', height: bottomHeight, marginHorizontal: 15
    },
    LinearGradient: {
        justifyContent: 'center', alignItems: 'center', marginLeft: 10,
        width: 100, height: 34, borderRadius: 17
    }
});
