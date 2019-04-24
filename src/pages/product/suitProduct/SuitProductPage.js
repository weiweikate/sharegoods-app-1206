import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { AmountItemView, MainProductView, SubProductView } from './components/SuitProductItemView';
import SuitProductModel from './SuitProductModel';
import { observer } from 'mobx-react';
import SelectionPage, { sourceType } from '../SelectionPage';
import SuitProductBottomView from './components/SuitProductBottomView';
import RouterMap from '../../../navigation/RouterMap';

@observer
export default class SuitProductPage extends BasePage {

    suitProductModel = new SuitProductModel();

    $navigationBarOptions = {
        title: '优惠套装'
    };

    constructor(props) {
        super(props);
        const { productDetailModel } = this.params;
        this.suitProductModel.setSubProductArr(productDetailModel);
    }

    _renderItem = ({ item }) => {
        return <SubProductView item={item}
                               suitProductModel={this.suitProductModel}
                               chooseSku={() => this._chooseSku(item, true)}/>;
    };

    _chooseSku = (productItem, isPromotion) => {
        this.suitProductModel.selectItem = productItem;
        const { changeItem } = this.suitProductModel;
        if (productItem.isSelected) {
            changeItem();
            return;
        }
        this.SelectionPage.show(productItem, (amount, skuCode, skuItem) => {
            changeItem(skuItem, isPromotion);
        }, { needUpdate: true, sourceType: isPromotion ? sourceType.promotion : null, unShowAmount: true });
    };

    _bottomAction = () => {
        const { groupCode, selectedAmount, mainSkuItem } = this.suitProductModel;
        let orderProductList = this.suitProductModel.selectedItems.map((item) => {
            const { prodCode, skuCode } = item;
            return {
                activityCode: groupCode,
                batchNo: 1,
                productCode: prodCode,
                skuCode: skuCode,
                quantity: selectedAmount
            };
        });
        const { prodCode, skuCode } = mainSkuItem;
        if (!prodCode) {
            this.$toastShow('请选择主商品规格');
            return;
        }
        if (orderProductList.length === 0) {
            this.$toastShow('请选择一个套餐商品');
            return;
        }
        this.$navigate(RouterMap.ConfirOrderPage, {
            orderParamVO: {
                orderType: 1,
                source: 2,
                orderProducts: [{
                    activityCode: groupCode,
                    batchNo: 1,
                    productCode: prodCode,
                    skuCode: skuCode,
                    quantity: selectedAmount
                }, ...orderProductList]
            }
        });
    };

    _render() {
        const { subProductArr, mainProduct } = this.suitProductModel;
        return <View style={{ flex: 1 }}>
            <AmountItemView suitProductModel={this.suitProductModel}/>
            <MainProductView suitProductModel={this.suitProductModel}
                             chooseSku={() => this._chooseSku(mainProduct)}/>
            <FlatList data={subProductArr}
                      keyExtractor={(item, index) => item + index}
                      renderItem={this._renderItem}
                      initialNumToRender={5}
            />
            <SuitProductBottomView suitProductModel={this.suitProductModel} bottomAction={this._bottomAction}/>
            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
        </View>;
    }
}
