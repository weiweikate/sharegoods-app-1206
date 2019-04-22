import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../../utils/ScreenUtils';
import UIImage from '@mr/image-placeholder';
import res from '../../res/product';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;
const { suitProduct } = res;
const { selected, default_selected, cant_selected, un_selected, selected_sku } = suitProduct;

@observer
export class AmountItemView extends Component {
    render() {
        const { suitProductModel } = this.props;
        const { canAddAmount, selectedAmount, addAmount, subAmount } = suitProductModel;
        let btnTextColor = canAddAmount ? DesignRule.textColor_mainTitle : DesignRule.textColor_placeholder;
        return (
            <View style={aStyles.bgView}>
                <MRText style={aStyles.leftText}>套餐商品</MRText>
                <View style={aStyles.rightView}>
                    <NoMoreClick style={aStyles.rightBtn} onPress={subAmount}>
                        <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 10 }}>-</MRText>
                    </NoMoreClick>
                    <View style={aStyles.amountView}>
                        <MRText style={aStyles.amountText}>{selectedAmount}</MRText>
                    </View>
                    <NoMoreClick style={aStyles.rightBtn}
                                 disabled={!canAddAmount}
                                 onPress={addAmount}>
                        <MRText style={{ color: btnTextColor, fontSize: 10 }}>+</MRText>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const aStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', justifyContent: 'space-between',
        height: 34, backgroundColor: DesignRule.white
    },
    leftText: {
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },
    rightView: {
        alignItems: 'center', flexDirection: 'row'
    },
    rightBtn: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 3, width: 20, height: 20, backgroundColor: DesignRule.bgColor
    },
    amountView: {
        justifyContent: 'center', alignItems: 'center',
        width: 34
    },
    amountText: {
        color: DesignRule.textColor_mainTitle, fontSize: 10
    }
});

@observer
export class MainProductView extends Component {
    render() {
        return (
            <View style={[mStyles.bgView, { paddingHorizontal: 15 }]}>
                <Image style={mStyles.selectImg} source={default_selected}/>
                <UIImage style={mStyles.productImg}/>
                <View style={mStyles.productView}>
                    <MRText style={mStyles.nameText}>大熊毛绒玩具送女友泰迪熊熊猫公仔抱抱熊2米女生布娃娃</MRText>
                    <View style={mStyles.specView}>
                        <MRText style={mStyles.specText}
                                numberOfLines={2}>规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m</MRText>
                        <Image style={mStyles.specImg} source={selected_sku}/>
                        <MRText style={mStyles.specAmountText}>x1</MRText>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={mStyles.bonusView}>
                            <MRText style={mStyles.bonusText}>立省￥20起111111</MRText>
                        </View>
                    </View>
                    <MRText style={mStyles.priceText}>¥150.00</MRText>
                </View>
            </View>
        );
    }
}

@observer
export class SubProductView extends Component {
    render() {
        const { item, suitProductModel, chooseSku } = this.props;
        const { changeItem, selectedAmount } = suitProductModel;
        const { isSelected, canSelected } = item;
        return (
            <NoMoreClick style={[mStyles.bgView, { marginHorizontal: 15, marginTop: 10, borderRadius: 5 }]}
                         onPress={isSelected ? changeItem : chooseSku}>
                <Image style={mStyles.selectImg}
                       source={canSelected ? (isSelected ? selected : un_selected) : cant_selected}/>
                <UIImage style={mStyles.productImg}/>
                <View style={mStyles.productView}>
                    <MRText style={mStyles.nameText}>大熊毛绒玩具送女友泰迪熊熊猫公仔抱抱熊2米女生布娃娃</MRText>
                    <View style={mStyles.specView}>
                        <MRText style={mStyles.specText}
                                numberOfLines={2}>规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m规格：红色，1.2m，1.2m</MRText>
                        <Image style={mStyles.specImg} source={selected_sku}/>
                        <MRText style={mStyles.specAmountText}>{`x${selectedAmount}`}</MRText>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={mStyles.bonusView}>
                            <MRText style={mStyles.bonusText}>立省￥20起111111</MRText>
                        </View>
                    </View>
                    <MRText style={mStyles.priceText}>¥150.00</MRText>
                </View>
            </NoMoreClick>
        );
    }
}

const mStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: DesignRule.white
    },
    selectImg: {
        marginHorizontal: 10, width: 17, height: 17
    },
    productImg: {
        marginRight: 10,
        height: px2dp(80), width: px2dp(80), borderRadius: 5
    },

    productView: {
        flex: 1, marginRight: 10, marginVertical: 10
    },
    nameText: {
        paddingBottom: 5,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    specView: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 5
    },
    specText: {
        flex: 1,
        color: DesignRule.textColor_instruction, fontSize: 10
    },
    specImg: {
        marginHorizontal: 10, width: 8, height: 8
    },
    specAmountText: {
        color: DesignRule.textColor_instruction, fontSize: 12
    },

    bonusView: {
        marginBottom: 5,
        height: 14, borderRadius: 2, backgroundColor: 'rgba(255,0,80,0.1)'
    },
    bonusText: {
        paddingHorizontal: 4,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },

    priceText: {
        color: DesignRule.textColor_redWarn, fontSize: 13
    }
});
