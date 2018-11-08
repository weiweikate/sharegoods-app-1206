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

import SearchBar from '../../../components/ui/searchBar/SearchBar';
import SearchSegmentView from './components/SearchSegmentView';
import SearchRecruitingRow from './components/SearchRecruitingRow';
import SearchAllRow from './components/SearchAllRow';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import DesignRule from 'DesignRule';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';


export default class SearchPage extends BasePage {


    // 导航配置
    $navigationBarOptions = {
        title: '搜索店铺'
    };

    constructor(props) {
        super(props);
        this.state = {
            //刷新
            refreshing: false,//是否显示下拉的菊花
            noMore: false,//没有了
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1,
            pageSize: 5,

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            selIndex: 0,
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
            status: this.state.selIndex === 0 ? 1 : 3,
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
                status: this.state.selIndex === 0 ? 1 : 3,
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

    _onChangeText = (keyword) => {
        this.setState({ keyword }, this._loadPageData);
    };

    _onPressAtIndex = (index) => {
        this.setState({
            dataList: [{}],
            loadingState: PageLoadingState.loading,
            selIndex: index
        }, () => {
            this._loadPageData();
        });
    };

    _clickShopAtRow = (item) => {
        this.$navigate('spellShop/MyShop_RecruitPage', { storeId: item.id });
    };

    _renderListHeader = () => {
        return <SearchBar onChangeText={this._onChangeText}
                          title={this.state.keyword}
                          placeholder={'可通过搜索店铺/ID进行查找'}/>;
    };

    _renderHeader = () => {
        return <SearchSegmentView onPressAtIndex={this._onPressAtIndex}/>;
    };

    // 渲染行
    _renderItem = (item) => {
        if (this.state.loadingState === PageLoadingState.success) {
            if (this.state.selIndex === 0) {
                return (<SearchAllRow RecommendRowOnPress={this._clickShopAtRow} RecommendRowItem={item.item}/>);
            } else {
                return (<SearchRecruitingRow onPress={this._clickShopAtRow} item={item.item}/>);
            }
        } else {
            return <View style={{ height: 300 }}>
                {renderViewByLoadingState(this._getPageStateOptions(), null)}
            </View>;
        }
    };

    _renderSeparatorComponent = () => {
        return (<View style={{ height: StyleSheet.hairlineWidth, marginLeft: 15, backgroundColor: '#eee' }}/>);
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
            }
        };
    };

    _render() {
        return (
            <View style={styles.container}>
                <SectionList keyExtractor={(item, index) => `${index}`}
                             style={{ backgroundColor: DesignRule.bgColor }}
                             refreshControl={
                                 <RefreshControl
                                     refreshing={this.state.refreshing}
                                     onRefresh={this._refreshing.bind(this)}
                                     title="下拉刷新"
                                     tintColor="#999"
                                     titleColor="#999"/>}
                             onEndReached={this._onEndReached.bind(this)}
                             onEndReachedThreshold={0.1}
                             ListFooterComponent={this._ListFooterComponent}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderHeader}
                             renderItem={this._renderItem}
                             ItemSeparatorComponent={this._renderSeparatorComponent}
                             sections={[{ data: this.state.dataList }]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
