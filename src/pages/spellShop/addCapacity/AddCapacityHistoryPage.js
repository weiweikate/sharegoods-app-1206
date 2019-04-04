import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap from '../../../navigation/RouterMap';
import SpellShopApi from '../api/SpellShopApi';

export class AddCapacityHistoryPage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    componentDidMount(){
        SpellShopApi.store_record({ storeCode: this.params.storeData.storeNumber }).then((data) => {
            const dataTemp = data.data || {};
        });
    }

    _addBtnAction = () => {
        this.$navigate(RouterMap.AddCapacityPage, { storeData: this.params.storeData });
    };

    _renderItem = ({ item }) => {
        return (
            <View style={styles.itemView}>
                <View style={styles.itemContentView}>
                    <View style={styles.itemVerticalView}>
                        <Text style={styles.contentText}>店铺扩容N人</Text>
                        <Text style={styles.dateText}>2019年03月20日15:59:37</Text>
                    </View>
                    <View style={styles.itemVerticalView}>
                        <Text style={styles.moneyText}>100.00</Text>
                        <Text style={styles.explainText}>交易成功</Text>
                    </View>
                </View>
            </View>
        );
    };
    _keyExtractor = (item, index) => {
        return index + item.id + '';
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={['', '']}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <NoMoreClick style={styles.addBtn} onPress={this._addBtnAction}>
                    <Text style={styles.addText}>继续扩容</Text>
                </NoMoreClick>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemView: {
        marginTop: 20, marginHorizontal: 15,
        height: 76, borderRadius: 5, backgroundColor: DesignRule.white
    },
    itemContentView: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between',
        margin: 15
    },
    itemVerticalView: {
        justifyContent: 'space-between'
    },
    contentText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    dateText: {
        fontSize: 11, color: DesignRule.textColor_instruction
    },
    moneyText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    explainText: {
        fontSize: 13
    },
    addBtn: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom + 10, marginHorizontal: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    addText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});


export default AddCapacityHistoryPage;
