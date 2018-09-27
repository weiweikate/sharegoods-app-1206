//拼店消息页面
import React from 'react';
import {
    StyleSheet,
    InteractionManager,
    DeviceEventEmitter
} from 'react-native';
import RefreshList from '../../components/ui/RefreshList';
import BasePage from '../../BasePage';
import HomeApi from '../home/api/HomeAPI';
import Toast from '../../utils/bridge';
import SpellShopApi from '../../utils/bridge';
import ShopMessageRow from './components/ShopMessageRow';
import { PageLoadingState } from '../../components/pageDecorator/PageState';

export default class ShopMessagePage extends BasePage {

    $navigationBarOptions: {
        title: '消息',
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.loadPageData
            },
            emptyProps: {
                isScrollViewContainer: true,
                description: '暂无拼店消息'
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: null,
            viewData: [],
            isEmpty: false,
            currentPage: 1
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(this.loadPageData);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('contentViewed');
    }

    loadPageData = () => {

        HomeApi.queryStoreMessageList({
            page: this.state.currentPage,
            pageSize: this.state.currentPage === 1 ? 20 : 10
        }).then(res => {

            if (res.ok && typeof res.data === 'object') {
                let arrData = this.state.currentPage === 1 ? [] : this.state.viewData;
                let tempArr = res.data.data || [];
                tempArr.map((item, index) => {
                    let title = '';
                    switch (item.type) {
                        case 1://邀请入店
                        case 7://店铺申请同意
                        case 8://店铺申请拒绝
                            title = '邀请提醒';
                            break;
                        case 2://申请加入
                            title = '申请加入店铺';
                            break;
                        case 3://请出消息
                            title = '请出通知';
                            break;
                        case 4://招募消息
                            title = '招募通知';
                            break;
                        case 5://拼店成功
                            title = '拼店成功';
                            break;
                        case 6://拼店失败
                            title = '拼店失败';
                            break;
                    }
                    arrData.push({
                        title,
                        content: item.content,
                        createTime: item.createTime,
                        dealStatus: item.dealStatus,
                        dealer_id: item.dealer_id,//用户id
                        id: item.id,
                        initiator: item.initiator,//发起人
                        pushId: item.pushId,
                        storeId: item.storeId,//店铺id
                        type: item.type,//类型
                        storeName: item.storeName,//店铺名称
                        initiatorName: item.initiatorName//执行人名称
                    });
                });
                this.setState({
                    viewData: arrData,
                    loadingState: arrData.length ? PageLoadingState.success : PageLoadingState.empty,
                    netFailedInfo: null
                });
            } else {

                this.setState({
                    loadingState: this.state.viewData.length ? PageLoadingState.success : PageLoadingState.fail,
                    netFailedInfo: res,
                    currentPage: this.state.currentPage > 1 ? this.state.currentPage - 1 : 1
                });
                if (this.state.viewData.length) {
                    Toast.toast(res.msg);
                }
            }
        });
    };

    onRefresh = () => {
        this.setState({
            currentPage: 1
        }, this.loadPageData);
    };

    //下拉加载更多
    onLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        }, this.loadPageData);
    };

    //拒绝
    _rejectAction = (item) => {
        //type  1:邀请入店 2:申请加入 3:请出消息 4:招募消息 5:拼店成功 6:拼店失败 7:店铺申请同意  8:店铺申请拒绝

        const {
            id,//拼店消息自增id
            type,//类型
            pushId,//推送消息id
            storeId,//店铺id
            dealer_id,//用户id
            dealStatus,//处理状态1：未处理2：已同意3：已拒绝4：开启5：暂不开启'
            initiator//发起人
        } = item;
        if (type === 1) {//拒绝去storeId
            SpellShopApi.disagreeJoin({
                storeId,
                messageId: id
            }).then((response) => {
                if (response.ok) {
                    Toast.toast('已拒绝');
                    this.loadPageData();
                } else {
                    Toast.toast(response.msg);
                }
            });
        } else if (type === 2) {//拒绝initiator的申请
            SpellShopApi.disagreeMemberJoin({
                id: initiator,//用户id
                messageId: id
            }).then((response) => {
                if (response.ok) {
                    Toast.toast('已拒绝');
                    this.loadPageData();
                } else {
                    Toast.toast(response.msg);
                }
            });
        }
    };

    //允许
    _allowAction = (item) => {
        //type  1:邀请入店 2:申请加入 3:请出消息 4:招募消息 5:拼店成功 6:拼店失败 7:店铺申请同意  8:店铺申请拒绝

        const {
            id,//拼店消息自增id
            type,//类型
            pushId,//推送消息id
            storeId,//店铺id
            dealer_id,//用户id
            dealStatus,//处理状态1：未处理2：已同意3：已拒绝4：开启5：暂不开启'
            initiator//发起人
        } = item;
        if (type === 1) {//邀请入店 同意去storeId
            SpellShopApi.agreeJoin({
                storeId,
                messageId: id
            }).then((response) => {
                if (response.ok) {
                    Toast.toast('已同意');
                    this.loadPageData();
                } else {
                    Toast.toast(response.msg);
                }
            });
        } else if (type === 2) {//申请加入 同意initiator的申请
            SpellShopApi.agreeMemberJoin({
                id: initiator,//用户id
                messageId: id
            }).then((response) => {
                if (response.ok) {
                    Toast.toast('已同意');
                    this.loadPageData();
                } else {
                    Toast.toast(response.msg);
                }
            });
        }
    };

    //跳转到详情
    _pushShop = (item) => {
        if (!item) {
            return;
        }
        const {
            type,
            storeId,
            dealer_id
        } = item;
        if (!type) {
            return;
        }
        // 不同数据，点击跳转的详情不同。
        switch (type) {
            // case 2://申请加入 跳转这个人的详细数据
            //     this.jr_navigate('spellShop/assistant/AssistantDetailPage',{id:dealer_id});
            //     break;
            case 1://邀请入店
            case 4://招募消息
                this.$navigate('spellShop/openShop/ShopDetailPage', {
                    id: storeId
                });
                break;
            case 3://请出消息
            case 5://拼店成功
            case 6://拼店失败
            case 7://店铺申请同意
            case 8://店铺申请拒绝 具体的店铺信息
            default:
                break;

        }
    };

    renderItem = ({ item, index }) => {
        return <ShopMessageRow
            item={item}
            pushShop={this._pushShop}
            allowAction={this._allowAction}
            rejectAction={this._rejectAction}/>;
    };

    _render() {
        return (
            <RefreshList
                data={this.state.viewData}
                renderItem={this.renderItem}
                onRefresh={this.onRefresh}
                onLoadMore={this.onLoadMore}
                extraData={this.state}
                isEmpty={this.state.isEmpty}
            />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
});
