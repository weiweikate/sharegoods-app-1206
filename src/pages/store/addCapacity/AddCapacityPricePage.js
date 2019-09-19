import React from 'react';
import { View, FlatList } from 'react-native';
import BasePage from '../../../BasePage';
import { AddCapacityPriceItem, PriceBottomView } from './components/AddCapacityPriceItem';
import { AddCapacityPriceModel } from './AddCapacityPriceModel';
import { observer } from 'mobx-react';

@observer
export class AddCapacityPricePage extends BasePage {
    addCapacityPriceModel = new AddCapacityPriceModel();

    $navigationBarOptions = {
        title: '我的扩容'
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.addCapacityPriceModel.loadingState
        };
    };

    componentDidMount() {
        this.addCapacityPriceModel.requestList();
    }

    _renderItem = ({ item }) => {
        return <AddCapacityPriceItem itemData={item}/>;
    };

    _keyExtractor = (item, index) => {
        return index + item.id + '';
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.addCapacityPriceModel.dataList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <PriceBottomView addCapacityPriceModel={this.addCapacityPriceModel}/>
            </View>
        );
    }
}

export default AddCapacityPricePage;
