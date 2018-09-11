import React from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import BasePage from '../../../BasePage';
import HotSearchView from './components/HotSearchView';
import RecentSearchView from './components/RecentSearchView';
import SearchInput from './components/SearchInput';


class SearchPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            recentData: ['1', '1', '1', '1', '1', '1'],
            hotData: ['1', '1', '1', '1', '1', '1']
        };
    }

    loadPageData() {
        this.getRecentSearch();
        this.getHotWordsListActive();
    }

    //从本地拿到最近搜索记录
    getRecentSearch = () => {

    };

    getHotWordsListActive = () => {

    };


    _cancel = () => {
        this.$navigateBack();
    };

    _onSubmitEditing = (text) => {
        this.setState({
            inputText: text
        });
    };

    _render() {
        // console.log("从上个页面传过来的inputText=" + this.params.inputText)
        return (
            <View style={styles.container}>
                <SearchInput placeholder={'请输入关键词搜索'} onSubmitEditing={this._onSubmitEditing} cancel={this._cancel}/>
                <RecentSearchView recentData={this.state.recentData} clearHistory={() => {
                    this.setState({ recentData: [] });
                }}/>
                <HotSearchView recentData={this.state.hotData}/>
            </View>
        );
    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }

});
export default SearchPage;
