import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import RouterMap from '../../../navigation/RouterMap';

export class AddCapacityPage extends BasePage {
    $navigationBarOptions = {
        title: '我要扩容'
    };

    _addBtnAction = () => {
        this.$navigate(RouterMap.AddCapacityPricePage);
    };

    _render() {
        return (
            <ScrollView>
                <View style={styles.numView}>
                    <Text style={styles.leftText}>店铺成员数：</Text>
                    <Text style={styles.rightText}>199/200 人</Text>
                </View>
                <NoMoreClick style={styles.addBtn} onPress={this._addBtnAction}>
                    <Text style={styles.addText}>立即扩容</Text>
                </NoMoreClick>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    numView: {
        marginHorizontal: 15,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        backgroundColor: DesignRule.white,
        height: 64
    },
    leftText: {
        marginLeft: 15,
        color: DesignRule.textColor_secondTitle, fontSize: 14
    },
    rightText: {
        marginRight: 15,
        color: DesignRule.textColor_1f2d3d, fontSize: 16
    },

    addBtn: {
        justifyContent: 'center', alignItems: 'center', marginTop: 20, marginHorizontal: 30,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    addText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});

export default AddCapacityPage;
