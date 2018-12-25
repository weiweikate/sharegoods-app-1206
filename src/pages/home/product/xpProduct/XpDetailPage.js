import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import BasePage from '../../../../BasePage';
import XpDetailProductView from './components/XpDetailProductView';
import XpDetailModel from './XpDetailModel';
import { observer } from 'mobx-react';
import DesignRule from '../../../../constants/DesignRule';

@observer
export class XpDetailPage extends BasePage {

    model = new XpDetailModel();

    $navigationBarOptions = {
        tittle: '经验值专区'
    };

    _render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <XpDetailProductView xpDetailModel={this.model}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerView: {
        backgroundColor: DesignRule.white
    }
});

export default XpDetailPage;
