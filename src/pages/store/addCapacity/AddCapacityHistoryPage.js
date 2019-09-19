import React from 'react';
import { Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import SpellShopApi from '../api/SpellShopApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import EmptyView from '../../../components/pageDecorator/BaseView/EmptyView';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';

export class AddCapacityHistoryPage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isMore: true,//是否能加载更多
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1,

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            dataList: []
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    this.loadPageData();
                }
            }
        };
    };

    componentDidMount() {
        this.loadPageData();
    }

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.loadPageData();
        });
    };

    loadPageData = () => {
        this.state.page = 1;
        SpellShopApi.expand_recordList({
            page: this.state.page,
            size: 10
        }).then((data) => {
            this.state.page++;
            const dataTemp = data.data || {};
            const dataArrTemp = dataTemp.data || [];
            this.setState({
                refreshing: false,
                isMore: dataTemp.isMore,
                dataList: dataArrTemp,
                loadingState: PageLoadingState.success
            });
        }).catch((e) => {
            this.setState({
                refreshing: false,
                loadingState: PageLoadingState.fail,
                netFailedInfo: e
            });
        });
    };

    _loadPageDataMore = () => {
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.expand_recordList({
                page: this.state.page,
                size: 10
            }).then((data) => {
                this.state.page++;
                const dataTemp = data.data || {};
                const dataArrTemp = dataTemp.data || [];
                this.setState({
                    isMore: dataTemp.isMore,
                    dataList: this.state.dataList.concat(dataArrTemp),
                    loadingMore: false,
                    loadingMoreError: null
                });
            }).catch((e) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: e.msg
                });
            });
        });
    };

    _ListFooterComponent = () => {
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.state.loadingState !== PageLoadingState.success || !this.state.isMore || this.state.loadingMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _renderItem = ({ item }) => {
        const { expandDeadline, originalVolume, volume } = item;
        return (
            <View style={styles.itemView}>
                <View style={styles.itemLeft}>
                    <Text style={styles.originalText}>扩容后坐席总数{StringUtils.add(originalVolume, volume)}人</Text>
                    <Text
                        style={styles.dateText}>失效时间：{expandDeadline}</Text>
                </View>
                <Text style={styles.numText}>扩容{volume}人</Text>
            </View>
        );
    };
    _ListEmptyComponent = () => {
        return <EmptyView style={{ marginTop: 70 }} description='暂无扩容记录'/>;
    };
    _keyExtractor = (item, index) => {
        return index + item.orderNo + '';
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.dataList}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.refreshing}
                                  onRefresh={this._refreshing.bind(this)}
                                  title="下拉刷新"
                                  tintColor={DesignRule.textColor_instruction}
                                  titleColor={DesignRule.textColor_instruction}
                                  colors={[DesignRule.mainColor]}/>}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          onEndReached={this._onEndReached}
                          onEndReachedThreshold={0.3}
                          ListFooterComponent={this._ListFooterComponent}
                          ListEmptyComponent={this._ListEmptyComponent}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemView: {
        justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',
        marginTop: 10, marginHorizontal: 15,
        height: 76, borderRadius: 5, backgroundColor: DesignRule.white
    },
    itemLeft: {
        marginLeft: 15
    },
    originalText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    dateText: {
        marginTop: 11,
        fontSize: 11, color: DesignRule.textColor_instruction
    },
    numText: {
        marginRight: 15,
        fontSize: 13, color: DesignRule.textColor_redWarn, fontWeight: '500'
    }
});


export default AddCapacityHistoryPage;
