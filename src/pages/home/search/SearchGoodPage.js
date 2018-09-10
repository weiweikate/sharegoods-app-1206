import React from 'react';
import {
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import SearchInput from './components/SearchInput';

export default class SearchGoodPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '我是标题',
        show: false // false则隐藏导航
    };

    _render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'red' }}>
                <SearchInput

                />
            </View>
        );
    }

    renderHeader() {

    }

    renderRecentSearch() {

    }

    renderHotSearch() {

    }

}
