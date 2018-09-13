import React from 'react';
import {
    View,
    StyleSheet,
    SectionList
} from 'react-native';

import BasePage from '../../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';

export default class ProductDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _renderListHeader = () => {
        return (<DetailHeaderView/>);
    };

    _renderSectionHeader = () => {
    };

    _renderItem = ({ item }) => {
    };

    _render() {
        return (
            <View style={styles.container}>
                <SectionList ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: [] }]}/>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

