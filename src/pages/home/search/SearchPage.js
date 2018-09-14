import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import HotSearchView from './components/HotSearchView';
import RecentSearchView from './components/RecentSearchView';
import SearchNav from './components/SearchNav';
import RouterMap from '../../../RouterMap';
import HomeAPI from '../api/HomeAPI';
import Storage from '../../../utils/storage';
import StringUtils from '../../../utils/StringUtils';

const recentDataKey = 'recentDataKey';
export default class SearchPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            keywordsArr: [],
            recentData: [],
            hotData: []
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this.getRecentSearch();
        this.getHotWordsListActive();
    }

    //从本地拿到最近搜索记录;
    getRecentSearch = () => {
        Storage.get(recentDataKey, []).then((value) => {
                this.setState({
                    recentData: value
                });
            }
        );
    };

    //热门数据;
    getHotWordsListActive = () => {
    };

    //getKeywords数据
    _onChangeText = (text) => {
        this.state.inputText = text;
        HomeAPI.getKeywords({ keyword: text }).then((data) => {
            this.setState({
                keywordsArr: data.data
            });
        }).catch((data) => {
            this.$toastShow(data.message);
        });
    };


    //取消
    _cancel = () => {
        this.$navigateBack();
    };

    //清除本地
    _clearHistory = () => {
        this.setState({
            recentData: []
        }, () => {
            Storage.set(recentDataKey, this.state.recentData);
        });
    };
    //提交搜索
    _onSubmitEditing = (text) => {
        this._clickItemAction(text);
    };

    //跳转
    _clickItemAction = (text) => {
        if (!this.state.recentData.includes(text)) {
            this.state.recentData.push(text);
            Storage.set(recentDataKey, this.state.recentData);
            this.forceUpdate();
        }
        this.$navigate(RouterMap.SearchResultPage, { keywords: text });
    };

    //components
    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._clickItemAction(item);
            }}>
                <View>
                    <Text style={{ fontSize: 13, color: '#222222', marginLeft: 16, paddingVertical: 15 }}>{item}</Text>
                    <View style={{ height: 1, backgroundColor: '#DDDDDD', marginLeft: 16 }}/>
                </View>
            </TouchableWithoutFeedback>);
    };

    _renderContainer = () => {
        if (StringUtils.isEmpty(this.state.inputText)) {
            return (<View>
                <RecentSearchView listData={this.state.recentData} clickItemAction={this._clickItemAction}
                                  clearHistory={this._clearHistory}/>
                <HotSearchView listData={this.state.hotData} clickItemAction={this._clickItemAction}/>
            </View>);
        } else {
            return (

                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    {this.state.keywordsArr.length === 0 ? null : <FlatList
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        data={this.state.keywordsArr}>
                    </FlatList>}

                </View>);
        }
    };

    _render() {
        return (
            <View style={styles.container}>
                <SearchNav placeholder={'请输入关键词搜索'} onSubmitEditing={this._onSubmitEditing} cancel={this._cancel}
                           onChangeText={this._onChangeText}/>
                {this._renderContainer()}
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

