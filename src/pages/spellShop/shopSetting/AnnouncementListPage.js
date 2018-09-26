//添加公告为空页面
import React from 'react';
import {
    View,
    FlatList
} from 'react-native';
import BasePage from '../../../BasePage';
import AnnouncementRow from './components/AnnouncementRow';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import { observer } from 'mobx-react/native';
import SpellShopApi from '../api/SpellShopApi';

const DefaultPageSize = 10;
// 是否显示删除按钮

@observer
export default class AnnouncementListPage extends BasePage {

    $navigationBarOptions = {
        title: '公告详情',
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
            refreshing: false,
            loadingMore: false,
            loadingMoreError: null,
            noMore: false
        };
        this.numebr = 1;
    }
    componentDidMount() {
        this.loadPageData();
    }

    // 加载首页数据
    loadPageData = () => {
        const { storeData } = this.params;
        SpellShopApi.queryByStoreId({
            page: 1,
            pageSize: 10,
            storeId: storeData.id
        }).then((data) => {
            let dateTemp = data.data || {};
            this.setState({
                list: dateTemp.data || [],
                refreshing: false,
                loadingMore: false,
                loadingMoreError: null
            });
        }).catch((error) => {
            this.setState({
                refreshing: false
            }, () => {
                this.$toastShow(error.msg);
            });
        });
    };

    loadPageDataMore = () => {
        const { storeData } = this.params;
        if (this.onEndReached) {
            return;
        }
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.queryByStoreId({
                page: this.numebr + 1,
                pageSize: 10,
                storeId: storeData.id
            }).then((data) => {
                this.numebr++;
                this.onEndReached = false;
                let dateTemp = data.data || {};
                this.setState({
                    list: dateTemp.data || [],
                    loadingMore: false,
                    loadingMoreError: false,
                    noMore: data.data && data.data.length === 0
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
        id && this.refs['delAlert'] && this.refs['delAlert'].show({
            title: '确定要删除此条公告？',
            confirmCallBack: () => {
                SpellShopApi.deleteById({ id: id }).then(() => {
                    this.$toastShow('删除成功');
                }).catch((error) => {
                    this.$toastShow(error.msg);
                });
            }
        });
    };

    _clickRow = (info) => {
        this.$navigate('spellShop/shopSetting/AnnouncementDetailPage', info);
    };


    // 渲染行
    _renderItem = ({ item }) => {
        return (<AnnouncementRow canDelete={this.params.storeData.myStore}
                                 onPress={this._clickRow}
                                 onPressDelete={this._delItem} {...item} />);
    };

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData());
    };


    // 列表触底
    _onEndReached = () => {
        if (!this.state.list) {
            return;
        }
        if (this.state.list.length < DefaultPageSize) {
            return;
        }
        if (this.state.noMore) {
            return;
        }
        // this.loadPageDataMore();
    };

    //下拉加载更多
    //已经到低啦
    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.list}
                          renderItem={this._renderItem}
                          onRefresh={this._onRefresh}
                          refreshing={this.state.refreshing}
                          onEndReached={this._onEndReached}
                          onEndReachedThreshold={0.1}
                          keyExtractor={this._keyExtractor}/>
                <ConfirmAlert ref="delAlert"/>
            </View>
        );
    }

    _keyExtractor = (item, index) => `${index}`;

}
