import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import BasePage from '../../../BasePage';
import HotSearchView from './components/HotSearchView';
import RecentSearchView from './components/RecentSearchView';
import SearchNav from './components/SearchNav';


export default class SearchPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            recentData: ['花盆', '花露水', '置物盒', '秀购超级购物日', '花盆', '花露水', '置物盒', '秀购超级购物日', '花盆', '花露水', '置物盒', '秀购超级购物日'],
            hotData: ['花盆', '花露水', '置物盒', '秀购超级购物日', '花盆', '花露水', '置物盒', '秀购超级购物日', '花盆', '花露水', '置物盒', '秀购超级购物日']
        };
    }

    loadPageData() {
        this.getRecentSearch();
        this.getHotWordsListActive();
    }

    //从本地拿到最近搜索记录
    getRecentSearch = () => {

    };
    //清除本地
    _clearHistory = () => {
        this.setState({
            recentData: []
        });
    };

    //热门数据
    getHotWordsListActive = () => {

    };

    //取消
    _cancel = () => {
        this.$navigateBack();
    };
    //提交搜索
    _onSubmitEditing = (text) => {
        this._clickItemAction(text);
    };
    //跳转
    _clickItemAction = (text) => {
        this.$navigate('home/search/SearchResultPage');
    };


    _render() {
        return (
            <View style={styles.container}>
                <SearchNav placeholder={'请输入关键词搜索'} onSubmitEditing={this._onSubmitEditing} cancel={this._cancel}/>
                <RecentSearchView listData={this.state.recentData} clickItemAction={this._clickItemAction}
                                  clearHistory={this._clearHistory}/>
                <HotSearchView listData={this.state.hotData} clickItemAction={this._clickItemAction}/>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

