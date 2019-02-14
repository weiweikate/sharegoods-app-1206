import React from 'react';
import {
    View,
    StyleSheet,
    InteractionManager,
    DeviceEventEmitter
} from 'react-native';
import BasePage from '../../../BasePage';
import {  RecentSearch} from './../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import Storage from '../../../utils/storage';
import SearchNav from '../../home/search/components/SearchNav';
import DesignRule from '../../../constants/DesignRule';
const dismissKeyboard = require('dismissKeyboard');
//全局变量，历史搜索记录,因为是递加的
let array = [];
const recentDataKey = 'orderRecentDataKey';
export default class SearchPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            //最近搜索
            recentData: [],
            //匹配列表数据
            categoryList: [],
            hotData: [],
            /*
            * 0 :商品搜索
            * 1 :订单搜索
            * 2 :售后
            * */
            //  pageType: this.params.pageType ? this.params.pageType : 0,
            pageType: this.params.pageType || 1,
            saveString: ['input', 'orderInput', 'afterOrder'],
            searchString: ['搜索', '搜订单', '搜索']
        };
    }

    $navigationBarOptions = {
        show: false// false则隐藏导航
    };
    componentDidMount(){
        this.loadPageData();
        DeviceEventEmitter.addListener('inputText', (inputText) => { this.setState({ inputText: inputText }), this.startSearch(inputText)});
    }
    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners('inputText');
    }
    loadPageData() {
        this.getRecentSearch();
    }
    onChangeText = (inputText) => {
        this.setState({ inputText: inputText });
    };
    //取消
    _cancel = () => {
        this.$navigateBack();
    };

    _render() {
        // console.log("从上个页面传过来的inputText=" + this.params.inputText)
        return (
                <View style={styles.container}>
                    <SearchNav placeholder={'请输入关键词搜索'} onSubmitEditing={(inputText) => {
                        this.setState({ inputText: inputText }), this.startSearch(inputText);
                    }} cancel={this._cancel}
                               onChangeText={this.onChangeText}/>
                    <View style={{ height: 1 }}/>
                    {this.renderRecentSearch()}
                </View>
        );
    }

    cancel = () => {
        dismissKeyboard();
        InteractionManager.runAfterInteractions(() => {
            this.$navigateBack();
        });
    };

    //从本地拿到最近搜索记录
    getRecentSearch = () => {
        Storage.get(recentDataKey, []).then((value) => {
                this.setState({
                    recentData: value
                });
            }
        );
    };
    //根据是否有历史搜索数据展示历史搜索布局
    renderRecentSearch = () => {
        if (this.state.recentData.length > 0) {
            // console.log('最近搜索记录=' + this.state.recentData)
            return (
                <RecentSearch recentData={this.state.recentData} clearHistory={() => {
                    this.setState({
                        recentData: []
                    }, () => {
                        Storage.set(recentDataKey, this.state.recentData);
                    });
                }}/>
            );
        }
    };

    //开始进行搜索要把这次搜索的历史记录保存
    startSearch = (inputText) => {
        if (inputText.length === 0) {
            this.$toastShow('请输入搜索内容');
            return;
        }
        //把搜索框里的值存起来
        if (StringUtils.isNoEmpty(inputText)) {
            this.state.recentData.length === 10 ? this.state.recentData.splice(9, 1) : this.state.recentData
            this.state.recentData.unshift(inputText)
            let setArr = new Set(this.state.recentData)
            this.state.recentData = [...setArr]
            console.log('最近搜索记录=' + array);
            Storage.set(recentDataKey, this.state.recentData);
            this.getRecentSearch();
        }
        //
        if (this.params && this.params.finish) {
            this.params.finish(inputText);
            this.$navigateBack();
        } else {
            //跳转到下一个搜索界面
            switch (this.state.pageType) {
                case 0:
                    // this.$navigate('product/SearchResultPage', {
                    //     keyWord: inputText, callBack: () => {
                    //         this.getRecentSearch();
                    //     }
                    // });
                    break;
                case 1:
                    this.$navigate('order/order/OrderSearchResultPage', {
                        keyWord: inputText, callBack: () => {
                            this.getRecentSearch();
                        }
                    });
                    break;
                case 2:
                    this.$navigate('order/afterSaleService/AfterSaleListPage', {
                        condition: inputText,
                        type: 'search'
                    });
                    break;
            }
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    item: {
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 15,
        height: 20
    }
});
