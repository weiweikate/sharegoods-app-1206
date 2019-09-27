import React from 'react';
import {
    View,
    FlatList,
    StyleSheet, RefreshControl, Alert
} from 'react-native';
import SearchBar from '../../../components/ui/searchBar/SearchBar';
import AssistantRow, { ExplainView } from './components/AssistantRow';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import DesignRule from '../../../constants/DesignRule';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';

export default class AssistantListPage extends BasePage {

    $navigationBarOptions = {
        title: '店员管理',
        rightNavTitle: ''
    };

    $NavBarRightPressed = () => {
        this.$navigate('store/addCapacity/AddCapacityPage');
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            isMore: true,
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            pageSize: 10,

            list: [],
            searchText: '',
            showActivityImage: false
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
        SpellShopApi.expand_expandInfo().then((data) => {
            const dataTemp = data.data || {};
            const { expandDone } = dataTemp;
            if (expandDone) {
                this.$NavigationBarResetRightTitle('我要扩容');
            }
        });
        SpellShopApi.package_identification().then((data) => {
            this.setState({
                showActivityImage: data.data
            });
        });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData);
    };

    loadPageData() {
        this.state.page = 1;
        const { storeCode } = this.params.storeData;
        SpellShopApi.user_list({
            keywords: this.state.searchText,
            page: this.state.page,
            pageSize: this.state.pageSize,
            storeCode: storeCode
        }).then((data) => {
            this.state.page++;
            const tempData = data.data || {};
            this.setState({
                isMore: tempData.isMore,
                refreshing: false,
                list: tempData.data || [],
                loadingState: PageLoadingState.success,
                netFailedInfo: null
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,
                list: [],
                loadingState: PageLoadingState.fail,
                netFailedInfo: error
            }, () => {
                this.$toastShow(error.msg);
            });
        });
    }

    _loadPageDataMore = () => {
        const { storeCode } = this.params.storeData;
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.user_list({
                keywords: this.state.searchText,
                page: this.state.page,
                pageSize: this.state.pageSize,
                storeCode: storeCode
            }).then((data) => {
                this.state.page++;
                let dataTemp = data.data || {};
                this.setState({
                    isMore: dataTemp.isMore,
                    loadingMore: false,
                    loadingMoreError: null,
                    list: this.state.list.concat(dataTemp.data || [])//data.data.data
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });

    };

    _onChangeText = (searchText) => {
        this.setState({ searchText }, this.loadPageData);
    };

    // 店员详情
    _clickAssistantDetail = (userCode) => {
        const { roleType, storeCode } = this.params.storeData;
        if (roleType === 0) {
            this.$navigate('store/myShop/ShopAssistantDetailPage', { userCode, storeCode });
        }
    };

    // 删除具体店员
    _clickDeleteAssistant = (userCode) => {
        userCode && Alert.alert('提示', '确定要将此用户移除?',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        SpellShopApi.storeUserRemove({ otherUserCode: userCode }).then(() => {
                            this.loadPageData();
                        }).catch((error) => {
                            this.$toastShow(error.msg);
                        });
                    }
                }
            ]
        );
    };

    // 渲染行
    _renderItem = ({ item }) => {
        return (<AssistantRow item={item}
                              showActivityImage={this.state.showActivityImage}
                              onPress={this._clickAssistantDetail}
                              onPressDelete={this._clickDeleteAssistant}/>);


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
        if (this.state.loadingMore || this.state.loadingState !== PageLoadingState.success || !this.state.isMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _render() {
        return (
            <View style={styles.container}>
                <SearchBar placeholder={'搜索用户名'}
                           style={{ marginBottom: 10 }}
                           onChangeText={this._onChangeText}
                           title={this.state.searchText}/>
                <ExplainView/>
                <FlatList data={this.state.list}
                          renderItem={this._renderItem}
                          keyExtractor={(item, index) => `${index}`}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.refreshing}
                                  onRefresh={this._onRefresh}
                                  colors={[DesignRule.mainColor]}/>}
                          onEndReached={this._onEndReached.bind(this)}
                          onEndReachedThreshold={0.1}
                          ListFooterComponent={this._ListFooterComponent}
                          showsVerticalScrollIndicator={false}/>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
