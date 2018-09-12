import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, NativeModules, InteractionManager } from 'react-native';
import BasePage from '../../../BasePage';
import { HotSearch, RecentSearch, SearchInput } from './../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';

const dismissKeyboard = require('dismissKeyboard');
//全局变量，历史搜索记录,因为是递加的
let array = [];
// import ProductApi from 'ProductApi';
// import Toast from '../../../utils/bridge';

class SearchPage extends BasePage {
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
            * */
            //  pageType: this.params.pageType ? this.params.pageType : 0,
            pageType: 1,
            saveString: ['input', 'orderInput'],
            searchString: ['搜索', '搜订单']
        };
    }

    $navigationBarOptions = {
        show: false// false则隐藏导航
    };

    loadPageData() {
        this.getRecentSearch();
        switch (this.state.pageType) {
            case 0:
                this.getHotWordsListActive();
                break;
            case 1:
                break;
        }

    }

    getHotWordsListActive = () => {
        // Toast.showLoading()
        // ProductApi.getHotWordsListActive({}).then((response)=>{
        //     Toast.hiddenLoading()
        //     if(response.ok ){
        //         let data=response.data
        //         let hotData=[]
        //         data.map((item, index)=> {
        //             hotData.push(item.wordName)
        //         })
        //         this.setState({
        //             hotData: hotData,
        //         })
        //     } else {
        //         NativeModules.commModule.toast(response.msg)
        //     }
        // }).catch(e=>{
        //     NativeModules.commModule.toast(e)
        // });
    };
    onChangeText = (inputText) => {
        this.setState({ inputText: inputText });
    };

    _render() {
        // console.log("从上个页面传过来的inputText=" + this.params.inputText)
        return (
            <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                <View style={styles.container}>
                    {/*页面展示内容*/}
                    <SearchInput
                        ref={'searchInput'}
                        placeHolder={'请输入关键词'}
                        inputText={this.state.inputText}
                        onSubmitEditing={(inputText) => {
                            this.setState({ inputText: inputText }), this.startSearch(inputText);
                        }}
                        buttonNavigateBack={() => {
                            this.$navigateBack();
                        }}
                        onChangeText={(inputText) => this.onChangeText(inputText)}
                        finish={() => {
                            this.startSearch(this.state.inputText);
                        }}
                        searchString={this.state.searchString[this.state.pageType]}
                    />
                    <View style={{ height: 1 }}/>
                    {this.renderRecentSearch()}
                    {this.renderHotSearch()}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    cancel = () => {
        dismissKeyboard();
        // this.navigateBack()
        InteractionManager.runAfterInteractions(() => {
            this.$navigateBack();
            // setTimeout(() => {
            //     this.navigateBack()
            // }, 200)
        });
    };

    //从本地拿到最近搜索记录
    getRecentSearch = () => {
        NativeModules.commModule.getNativeStore(this.state.saveString[this.state.pageType], (data) => {
            if (data.length > 0) {
                array = JSON.parse(data);
                // console.log('从本地拿到最近搜索记录=' + array)
                this.setState({ recentData: array });
            } else {

            }
        });
    };
    //根据是否有历史搜索数据展示历史搜索布局
    renderRecentSearch = () => {
        if (this.state.recentData.length > 0) {
            // console.log('最近搜索记录=' + this.state.recentData)
            return (
                <RecentSearch recentData={this.state.recentData} clearHistory={() => {
                    this.setState({ recentData: [] });
                    array = [];
                }}/>
            );
        }
    };

    renderHotSearch = () => {
        switch (this.state.pageType) {
            case 0:
                return (
                    <HotSearch recentData={this.state.hotData} clearHistory={() => {
                        this.setState({ hotData: [] });
                        array = [];
                    }}/>
                );
                break;
            case 1:
                break;
        }
    };

    //开始进行搜索要把这次搜索的历史记录保存
    startSearch = (inputText) => {
        if (inputText.length == 0) {
            NativeModules.commModule.toast('请输入搜索内容');
            return;
        }

        //把搜索框里的值存起来
        if (StringUtils.isNoEmpty(inputText)) {
            if (array.indexOf(inputText) == -1) {//数组去重
                if (array.length < 10) {
                    array.push(inputText);
                } else {
                    array.shift(array);
                    array.push(inputText);
                }
            }
            console.log('最近搜索记录=' + array);
            let data = JSON.stringify(array);
            NativeModules.commModule.putNativeStore(this.state.saveString[this.state.pageType], data);
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
                    this.$navigate('product/SearchResultPage', {
                        keyWord: inputText, callBack: () => {
                            this.getRecentSearch();
                        }
                    });
                    break;
                case 1:
                    this.$navigate('order/order/OrderSearchResultPage', {
                        keyWord: inputText, callBack: () => {
                            this.getRecentSearch();
                        }
                    });
                    break;
            }
        }
    };
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: color.white
    },
    item: {
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 15,
        height: 20
    }
});
export default SearchPage;
