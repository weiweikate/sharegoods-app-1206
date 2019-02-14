import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import BasePage from '../../../../BasePage';
import P_ScoreListItemView from './components/P_ScoreListItemView';
import DetailBottomView from '../components/DetailBottomView';

export default class P_ScoreListPage extends BasePage {
    _renderItem = ({ item }) => {
        return <P_ScoreListItemView item={item}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _render() {
        const { pData } = this.params;
        return (
            <View style={styles.container}>
                <FlatList data={['', '', '', '', '', '', '', '']}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <DetailBottomView bottomViewAction={this._bottomViewAction}
                                  pData={pData}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 }
});
