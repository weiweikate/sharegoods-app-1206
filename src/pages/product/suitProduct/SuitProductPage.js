import React from 'react';
import { View, FlatList } from 'react-native';
import BasePage from '../../../BasePage';
import { AmountItemView, MainProductView, SubProductView } from './components/SuitProductItemView';
import SuitProductModel from './SuitProductModel';
import { observer } from 'mobx-react';
import SuitProductBottomView from './components/SuitProductBottomView';
import RouterMap from '../../../navigation/RouterMap';
import user from '../../../model/user';

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
                               suitProductModel={this.suitProductModel}/>;
    };

    _bottomAction = () => {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        const { groupCode, selectedAmount, mainProduct } = this.suitProductModel;
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
        const { prodCode, skuCode } = mainProduct.selectedSkuItem || {};
        if (!prodCode) {
            this.$toastShow('还有商品未选择规格');
            return;
        }
        if (orderProductList.length === 0) {
            this.$toastShow('至少选择一件搭配商品');
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
        const { subProductArr } = this.suitProductModel;
        return <View style={{ flex: 1 }}>
            <AmountItemView suitProductModel={this.suitProductModel}/>
            <MainProductView suitProductModel={this.suitProductModel}/>
            <FlatList data={subProductArr}
                      keyExtractor={(item, index) => item + index}
                      renderItem={this._renderItem}
                      initialNumToRender={5}
            />
            <SuitProductBottomView suitProductModel={this.suitProductModel} bottomAction={this._bottomAction}/>
        </View>;
    }
}
