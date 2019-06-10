//添加公告为空页面
import React from 'react';
import {
    View,
    FlatList, RefreshControl , Alert
} from 'react-native';
import BasePage from '../../../BasePage';
import AnnouncementRow from './components/AnnouncementRow';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import { observer } from 'mobx-react/native';
import SpellShopApi from '../api/SpellShopApi';
import bridge from '../../../utils/bridge';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import DesignRule from '../../../constants/DesignRule';
// 是否显示删除按钮

@observer
export default class AnnouncementListPage extends BasePage {

    $navigationBarOptions = {
        title: '公告列表',
        rightNavTitle: '发布公告',
        rightNavItemHidden: !this.params.storeData.myStore
    };

    $NavBarRightPressed = () => {
        this.$navigate('spellShop/shopSetting/AnnouncementPublishPage', {
            publishSuccess: () => {
                this.loadPageData();
            },
            storeData: this.params.storeData
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            list: [],

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            //刷新
            refreshing: false,//是否显示下拉的菊花
            noMore: false,//是否能加载更多
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1
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

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData());
    };

    loadPageData = () => {
        this.state.page = 1;
        const { storeData } = this.params;
        SpellShopApi.queryByStoreId({
            page: this.state.page,
            pageSize: 10,
            storeCode: storeData.storeNumber
        }).then((data) => {
            this.state.page++;
            let dateTemp = data.data || {};
            let tempArr = dateTemp.data || [];
            this.setState({
                refreshing: false,
                loadingState: tempArr.length === 0 ? PageLoadingState.empty : PageLoadingState.success,
                list: tempArr,
                noMore: dateTemp.isMore === 0
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,
                loadingState: PageLoadingState.fail,
                netFailedInfo: error
            });
        });
    };

    loadPageDataMore = () => {
        const { storeData } = this.params;
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.queryByStoreId({
                page: this.state.page,
                pageSize: 10,
                storeCode: storeData.storeNumber
            }).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                let dateTemp = data.data || {};
                let tempArr = dateTemp.data || [];
                this.setState({
                    list: this.state.list.concat(tempArr),
                    loadingMore: false,
                    loadingMoreError: false,
                    noMore: dateTemp.isMore === 0
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error
                });
            });
        });
    };

    _delItem = ({ id }) => {
        // id && this.refs.delAlert && this.refs.delAlert.show({
        //     title: '确定要删除此条公告？',
        //     confirmCallBack: () => {
        //         SpellShopApi.deleteById({ id: id }).then(() => {
        //             this.loadPageData();
        //             bridge.$toast('删除成功');
        //         }).catch((error) => {
        //             this.$toastShow(error.msg);
        //         });
        //     }
        // });

        id &&  Alert.alert('提示', '确定要删除此条公告',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        SpellShopApi.deleteById({ id: id }).then(() => {
                            this.loadPageData();
                            bridge.$toast('删除成功');
                        }).catch((error) => {
                            this.$toastShow(error.msg);
                        });
                    }
                }
            ]
        );
    };

    _clickRow = (info) => {
        this.$navigate('spellShop/shopSetting/AnnouncementDetailPage', info);
    };

    // 列表触底
    _onEndReached = () => {
        if (this.onEndReached || this.state.loadingState !== PageLoadingState.success || this.state.noMore) {
            return;
        }
        this.loadPageDataMore();
    };

    _ListFooterComponent = () => {
        if (this.state.loadingState !== PageLoadingState.success) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };

    // 渲染行
    _renderItem = ({ item }) => {
        return (<AnnouncementRow canDelete={this.params.storeData.myStore}
                                 onPress={this._clickRow}
                                 onPressDelete={this._delItem} {...item} />);
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.list}
                          renderItem={this._renderItem}
                          onEndReached={this._onEndReached}
                          onEndReachedThreshold={0.1}
                          keyExtractor={this._keyExtractor}
                          ListFooterComponent={this._ListFooterComponent}
                          refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                          onRefresh={this._onRefresh}
                                                          colors={[DesignRule.mainColor]}/>}/>
                <ConfirmAlert ref="delAlert"/>
            </View>
        );
    }

    _keyExtractor = (item, index) => `${index}`;

}
