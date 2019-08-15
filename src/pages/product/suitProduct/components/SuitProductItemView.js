import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../../utils/ScreenUtils';
import UIImage from '@mr/image-placeholder';
import res from '../../res/product';
import { observer } from 'mobx-react';
import { routePush } from '../../../../navigation/RouterMap';
import RouterMap from '../../../../navigation/RouterMap';
import StringUtils from '../../../../utils/StringUtils';

const { px2dp } = ScreenUtils;
const { selected, un_selected, selected_sku, suitSaleOut } = res.suitProduct;

@observer
export class SubProductView extends Component {

    _selectSku = (productItem) => {
        const { defaultSkuItem } = productItem;
        const { suitProductModel } = this.props;
        const { changeItemWithSku } = suitProductModel;
        if (defaultSkuItem) {
            changeItemWithSku({ productItem, skuItem: defaultSkuItem });
            return;
        }
        this.props.selectSkuWithSelectionPage(productItem, (amount, skuCode, skuItem) => {
            changeItemWithSku({ productItem, skuItem });
        });
    };

    _unSelectSku = (productItem) => {
        const { isMainProduct } = productItem;
        /*主商品不能重置*/
        if (isMainProduct) {
            return;
        }
        const { suitProductModel } = this.props;
        const { changeItemWithSku } = suitProductModel;
        changeItemWithSku({ productItem });
    };

    render() {
        const { item, suitProductModel } = this.props;
        const { selectedAmount, isSuitFixed } = suitProductModel;
        const { isMainProduct, selectedSkuItem, name, imgUrl, minPrice, prodCode, defaultSkuItem, totalStock } = item;
        const { price, propertyValues } = selectedSkuItem || {};

        const property = defaultSkuItem ? defaultSkuItem.propertyValues : (propertyValues ? StringUtils.trimWithChar(propertyValues, '@') : null);

        const propertyShow = property ? property.replace(/@/g, ',') : '请选择商品规格';
        const priceShow = defaultSkuItem ? defaultSkuItem.price : price;
        return (
            <View style={[mStyles.bgView, { marginHorizontal: 15 }]}>
                {
                    isSuitFixed ?
                        <View style={{ width: 15 }}/>
                        :
                        <NoMoreClick onPress={() => {
                            selectedSkuItem ? this._unSelectSku(item) : this._selectSku(item);
                        }} style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
                            <Image style={mStyles.selectImg}
                                   source={(selectedSkuItem || isMainProduct) ? selected : un_selected}/>
                        </NoMoreClick>
                }
                <NoMoreClick onPress={() => {
                    routePush(RouterMap.ProductDetailPage, { productCode: prodCode });
                }}>
                    <UIImage style={mStyles.productImg} source={{ uri: imgUrl }}>
                        {
                            totalStock < 1 &&
                            <Image source={suitSaleOut} style={{ height: px2dp(60), width: px2dp(60) }}/>
                        }
                    </UIImage>
                </NoMoreClick>
                <NoMoreClick style={mStyles.productView} onPress={() => {
                    if (defaultSkuItem) {
                        return;
                    }
                    this._selectSku(item);
                }}>
                    <View>
                        <MRText style={mStyles.nameText} numberOfLines={2}>{name}</MRText>
                        <View style={mStyles.specView}>
                            <MRText
                                style={[mStyles.specText, !property ? { color: DesignRule.textColor_redWarn } : null]}
                                numberOfLines={2}>{propertyShow}</MRText>
                            {
                                defaultSkuItem ? null : <Image style={mStyles.specImg} source={selected_sku}/>
                            }
                        </View>
                    </View>
                    <View style={mStyles.priceView}>
                        <MRText
                            style={mStyles.priceText}>原价:{`¥${priceShow || `${minPrice}起`}`}</MRText>
                        <MRText style={mStyles.specAmountText}>x{selectedAmount}</MRText>
                    </View>
                </NoMoreClick>
            </View>
        );
    }
}

const mStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: DesignRule.white
    },
    selectImg: {
        marginLeft: 10, marginRight: 5, width: 17, height: 17
    },
    productImg: {
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10, overflow: 'hidden', marginVertical: 10,
        height: px2dp(80), width: px2dp(80), borderRadius: 5
    },

    productView: {
        flex: 1, marginRight: 10, height: px2dp(80), justifyContent: 'space-between'
    },
    nameText: {
        paddingBottom: 5,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    specView: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 5
    },
    specText: {
        color: DesignRule.textColor_instruction, fontSize: 10
    },
    specImg: {
        marginLeft: 5, marginRight: 10, width: 8, height: 8
    },

    priceView: {
        flexDirection: 'row', alignItems: 'center'
    },
    specAmountText: {
        color: DesignRule.textColor_instruction, fontSize: 10
    },
    priceText: {
        flex: 1,
        color: DesignRule.textColor_instruction, fontSize: 12
    }
});

