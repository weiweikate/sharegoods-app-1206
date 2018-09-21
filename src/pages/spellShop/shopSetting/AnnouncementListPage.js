//添加公告为空页面
import React from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import BasePage from '../../../BasePage';
import AnnouncementRow from './components/AnnouncementRow';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import storeModel from '../model/StoreModel';
import { observer } from 'mobx-react/native';

const DefaultPageSize = 10;
// 是否显示删除按钮

@observer
export default class AnnouncementListPage extends BasePage {

    $navigationBarOptions = {
        title: '公告详情',
        rightNavTitle: '发布公告'
    };

    $NavBarRightPressed = () => {
        this.$navigate('spellShop/shopSetting/AnnouncementPublishPage', {
            publishSuccess: this.loadPageData.bind(this)
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            list: [{},{},{}],
            refreshing: false,
            loadingMore: false,
            loadingMoreError: null,
            noMore: false
        };
        this.numebr = 1;
    }

    // 加载首页数据
    loadPageData(numebr = 1) {
        // SpellShopApi.queryStoreNoticeList({
        //     page: numebr,
        //     pageSize: DefaultPageSize,
        //     storeId: storeModel.storeId
        // }).then((response) => {
        //     if (response.ok) {
        //         this.setState({
        //             list: response.data || [],
        //             refreshing: false,
        //             loadingMore: false,
        //             loadingMoreError: null
        //         });
        //     } else {
        //         this.setState({
        //             refreshing: false
        //         }, () => {
        //             Toast.toast(response.msg);
        //         });
        //     }
        // });
    }

    loadPageDataMore = () => {
        if (this.onEndReached) {
            return;
        }
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            // SpellShopApi.queryStoreNoticeList({
            //     page: this.numebr + 1,
            //     pageSize: DefaultPageSize,
            //     storeId: storeModel.storeId
            // }).then((response) => {
            //     this.numebr++;
            //     this.onEndReached = false;
            //     if (response.ok) {
            //         this.setState({
            //             list: this.state.list.concat(response.data || []),
            //             loadingMore: false,
            //             loadingMoreError: false,
            //             noMore: response.data && response.data.length === 0
            //         });
            //     } else {
            //         this.setState({
            //             loadingMore: false,
            //             loadingMoreError: response
            //         });
            //     }
            // });
        });
    };

    _delItem = ({ id }) => {
        id && this.refs['delAlert'] && this.refs['delAlert'].show({
            title: '确定要删除此条公告？',
            confirmCallBack: () => {
                // SpellShopApi.deleteStoreNotice({ id }).then((response) => {
                //     if (response.ok) {
                //         Toast.toast('删除成功');
                //         this.loadPageData();
                //     } else {
                //         Toast.toast(response.msg);
                //     }
                // });
            }
        });
    };

    _clickRow = (info) => {
        this.props.navigation.navigate('spellShop/shopSetting/AnnouncementDetailPage', info);
    };


    // 渲染行
    _renderItem = ({ item }) => {
        return (<AnnouncementRow canDelete={storeModel.isYourStore}
                                 onPress={this._clickRow}
                                 onPressDelete={this._delItem} {...item} />);
    };

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData);
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
        this.loadPageDataMore();
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
