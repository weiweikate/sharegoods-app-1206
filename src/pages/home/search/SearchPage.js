import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import HotSearchView from './components/HotSearchView';
import RecentSearchView from './components/RecentSearchView';
import SearchNav from './components/SearchNav';
import RouterMap from '../../../navigation/RouterMap';
import HomeAPI from '../api/HomeAPI';
import Storage from '../../../utils/storage';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import {MRText as Text} from '../../../components/ui';
const recentDataKey = 'recentDataKey';
export default class SearchPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            //搜索关键词后返回的关键词
            keywordsArr: [],
            //最近搜索
            recentData: [],
            //热门搜索
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
        HomeAPI.queryHotName().then((data) => {
            this.setState({
                hotData: data.data || []
            });
        }).catch((error) => {
        });
    };

    //getKeywords数据
    _onChangeText = (text) => {
        this.state.inputText = text;
        HomeAPI.getKeywords({ keyword: text }).then((data) => {
            this.setState({
                keywordsArr: data.data || []
            });
        }).catch((data) => {
            this.$toastShow(data.msg);
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
    _clickItemAction = (text, index, hotWordId) => {
        this.$navigate(RouterMap.XpDetailPage)
        return;
        if (StringUtils.isEmpty(text)) {
            this.$toastShow('搜索内容不能为空');
            return;
        }
        if (StringUtils.isNoEmpty(text)) {
            if (!this.state.recentData.includes(text)) {
                this.state.recentData.unshift(text);
            } else {
                //热词的index需要重新赋值 变成recentData中的index
                if (hotWordId) {
                    index = this.state.recentData.indexOf(text);
                }
                //操作位置
                if (index) {
                    this.state.recentData.splice(index, 1);
                    this.state.recentData.unshift(text);
                }
            }
            if (this.state.recentData.length > 10) {
                this.state.recentData = this.state.recentData.slice(0, 10);
            }
            Storage.set(recentDataKey, this.state.recentData);
            this.forceUpdate();
        }

        this.$navigate(RouterMap.SearchResultPage, {
            keywords: text,
            hotWordId: hotWordId,
            isHistory: index !== undefined && !hotWordId
        });
    };

    //components
    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._clickItemAction(item);
            }}>
                <View>
                    <Text style={{
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 16,
                        paddingVertical: 15,
                        paddingRight:16
                    }} allowFontScaling={false}>{item}</Text>
                    <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg, marginLeft: 16 }}/>
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
                        data={this.state.keywordsArr}/>}

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
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});

