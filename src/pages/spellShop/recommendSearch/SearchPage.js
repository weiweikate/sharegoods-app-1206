/*
* 搜索店铺
* */
import React from 'react';
import {
    View,
    SectionList,
    StyleSheet,
    RefreshControl
} from 'react-native';

import SearchAllRow from './components/SearchAllRow';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import DesignRule from '../../../constants/DesignRule';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import SearchNavView from './components/SearchNavView';
import res from '../res';

export default class SearchPage extends BasePage {


    // 导航配置
    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            showSectionList: true,
            //刷新
            refreshing: false,//是否显示下拉的菊花
            noMore: false,//没有了
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1,
            pageSize: 5,

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            keyword: '',
            dataList: [{}]//默认一行显示状态页面使用 错误页 无数据页面
        };
    }


    componentDidMount() {
        this._loadPageData();
    }

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._loadPageData();
        });
    };
    _loadPageData = () => {
        this.state.page = 1;
        SpellShopApi.queryByStatusAndKeyword({
            page: this.state.page,
            size: this.state.pageSize,
            keyword: this.state.keyword
        }).then((data) => {
            this.state.page++;
            let dataTemp = data.data || {};
            const dataList = dataTemp.data || [];
            //如果是空数据 显示空数据页面需要一个cell
            let isEmpty = dataList.length === 0;
            this.setState({
                refreshing: false,
                noMore: dataList.length < this.state.pageSize,
                dataList: isEmpty ? [{}] : dataList,
                loadingState: isEmpty ? PageLoadingState.empty : PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,
                netFailedInfo: error,
                dataList: [{}],
                loadingState: PageLoadingState.fail
            });
        });
    };

    _loadPageDataMore = () => {
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.queryByStatusAndKeyword({
                page: this.state.page,
                size: this.state.pageSize,
                keyword: this.state.keyword
            }).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                let dataTemp = data.data || {};
                this.setState({
                    noMore: dataTemp.data.length < this.state.pageSize,
                    loadingMore: false,
                    loadingMoreError: null,
                    dataList: this.state.dataList.concat(dataTemp.data || [])//data.data.data
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });

    };

    _clickShopAtRow = (item) => {
        this.$navigate('spellShop/MyShop_RecruitPage', { storeCode: item.storeNumber });
    };

    // 渲染行
    _renderItem = (item) => {
        if (this.state.loadingState === PageLoadingState.success) {
            return (<SearchAllRow RecommendRowOnPress={this._clickShopAtRow} RecommendRowItem={item.item}/>);
        } else {
            return <View style={{ height: 300 }}>
                {renderViewByLoadingState(this._getPageStateOptions(), null)}
            </View>;
        }
    };

    _renderSeparatorComponent = () => {
        return (<View style={{
            height: StyleSheet.hairlineWidth,
            marginLeft: 15,
            backgroundColor: DesignRule.lineColor_inColorBg
        }}/>);
    };

    _ListFooterComponent = () => {
        if (this.state.loadingState !== PageLoadingState.success) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.onEndReached || this.state.loadingState !== PageLoadingState.success || this.state.noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._refreshing
            },
            emptyProps: {
                source: res.recommendSearch.shop_notHave,
                description: '抱歉,没有你想找的拼店',
                subDescription: '请重新确认后查找'
            }
        };
    };

    _onSubmitEditing = (text) => {
        let needUpdate = this.state.keyword !== text;

        let params = { showSectionList: true };
        if (needUpdate) {
            params = {
                showSectionList: true,
                keyword: text,
                dataList: [{}],
                loadingState: PageLoadingState.loading
            };
        }

        this.setState(params, () => {
            if (needUpdate) {
                this._loadPageData();
            }
        });
    };

    _onFocus = (onFocus) => {
        this.setState({
            showSectionList: !onFocus
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <SearchNavView onSubmitEditing={this._onSubmitEditing} onFocus={this._onFocus}
                               navigation={this.props.navigation}/>
                {this.state.showSectionList ? <SectionList keyExtractor={(item, index) => `${index}`}
                                                           style={{ backgroundColor: DesignRule.bgColor }}
                                                           refreshControl={
                                                               <RefreshControl
                                                                   refreshing={this.state.refreshing}
                                                                   onRefresh={this._refreshing.bind(this)}
                                                                   title="下拉刷新"
                                                                   tintColor={DesignRule.textColor_instruction}
                                                                   titleColor={DesignRule.textColor_instruction}
                                                                   colors={[DesignRule.mainColor]}/>}
                                                           onEndReached={this._onEndReached.bind(this)}
                                                           onEndReachedThreshold={0.1}
                                                           ListFooterComponent={this._ListFooterComponent}
                                                           renderItem={this._renderItem}
                                                           ItemSeparatorComponent={this._renderSeparatorComponent}
                                                           sections={[{ data: this.state.dataList }]}/>
                    : <View style={{ flex: 1 }}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
