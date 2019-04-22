import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { AmountItemView, MainProductView, SubProductView } from './components/SuitProductItemView';
import SuitProductModel from './SuitProductModel';
import { observer } from 'mobx-react';
import SelectionPage from '../SelectionPage';

@observer
export default class SuitProductPage extends BasePage {

    suitProductModel = new SuitProductModel();

    $navigationBarOptions = {
        title: '优惠套装'
    };

    constructor(props) {
        super(props);
        this.suitProductModel.setSubProductArr([{ stock: 1 }, { stock: 2 }, { stock: 3 }, { stock: 4 }]);
    }

    _renderItem = ({ item }) => {
        return <SubProductView item={item}
                               suitProductModel={this.suitProductModel}
                               chooseSku={() => this._chooseSku(item)}/>;
    };

    _chooseSku = (productItem) => {
        this.SelectionPage.show(productItem, (amount, skuCode, skuItem) => {
            const { changeItem } = this.suitProductModel;
            changeItem(skuItem);
        });
    };

    _render() {
        const { subProductArr } = this.suitProductModel;
        return <View>
            <AmountItemView suitProductModel={this.suitProductModel}/>
            <MainProductView suitProductModel={this.suitProductModel}
                             chooseSku={this._chooseSku}/>
            <FlatList data={subProductArr}
                      keyExtractor={(item, index) => item + index}
                      renderItem={this._renderItem}
                      initialNumToRender={5}
            />

            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
        </View>;
    }
}

const styles = StyleSheet.create({});
