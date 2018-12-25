import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';

export class XpDetailSelectListView extends Component {
    render() {
        const { listData } = this.props;
        return (
            <View>
                <FlatList data={listData || []} renderItem={this._renderItem} />
            </View>
        );
    }
}

export default XpDetailSelectListView;
