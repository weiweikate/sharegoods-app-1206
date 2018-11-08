//成员列表页面
//我的店铺页面
//三种角色身份 普通 店长 店员
//排序分组规则 1.A-Z * 2.单组内部使用加入店铺时间排序

import React from 'react';
import {
    View,
    Text,
    SectionList,
    StyleSheet
} from 'react-native';
import SearchBar from '../../../components/ui/searchBar/SearchBar';

import AssistantRow from './components/AssistantRow';
import MasterRow from './components/MasterRow';

import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import DesignRule from 'DesignRule';

const sectionsArr = [
    'master',
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '*'
];

export default class AssistantListPage extends BasePage {

    $navigationBarOptions = {
        title: '店员管理'
    };
    //contribution/tradeBalance本月收入
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            list: [],
            searchText: '',
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

    // 处理排序
    _transformList = (data) => {
        if (!data) {
            return [];
        }
        const arr = sectionsArr.map(key => {
            const list = data[key];
            if (list && list.length) {
                return {
                    title: key,
                    data: list
                };
            } else {
                return null;
            }
        });
        return arr.filter((item) => !!item);
    };

    loadPageData() {
        const keyword = this.state.searchText || '';
        SpellShopApi.listByKeyword({ keyword: keyword, storeId: this.params.storeData.id }).then((data) => {
            data.data = data.data || {};
            const list = this._transformList(data.data);
            this.setState({
                refreshing: false,
                list,
                loadingState: PageLoadingState.success,
                netFailedInfo: null
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,
                list: [],
                loadingState: PageLoadingState.success,
                netFailedInfo: error
            }, () => {
                this.$toastShow(error.msg);
            });
        });
    }

    // 店员详情
    _clickAssistantDetail = (userId) => {
        this.$navigate('spellShop/myShop/ShopAssistantDetailPage', { userId });
    };

    // 删除具体店员
    _clickDeleteAssistant = (userId) => {
        userId && this.refs.delAlert && this.refs.delAlert.show({
            title: '确定要将此用户移除?',
            confirmCallBack: () => {
                SpellShopApi.storeUserRemove({ otherUserId: userId }).then(() => {
                    this.loadPageData();
                }).catch((error) => {
                    this.$toastShow(error.msg);
                });
            }
        });
    };

    _onChangeText = (searchText) => {
        this.setState({ searchText }, this.loadPageData);
    };

    // 渲染行
    _renderItem = ({ item }) => {
        const {tradeBalance} = this.params.storeData;
        if (item.roleType === 0) {//0店主
            return <MasterRow item={item} onPress={this._clickAssistantDetail} tradeBalance={tradeBalance}/>;
        } else {//1店员
            return (<AssistantRow item={item}
                                  isYourStore={this.params.storeData.myStore}
                                  onPress={this._clickAssistantDetail}
                                  onPressDelete={this._clickDeleteAssistant} tradeBalance={tradeBalance}/>);
        }

    };

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData);
    };

    _renderSectionHeader = ({ section }) => {
        const { title, data } = section || {};
        if (title === 'master' || !title || !data || !data.length) {
            return null;
        }
        return (<View style={{ height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 11 }}>
            <Text style={{
                fontSize: 13,
                color: DesignRule.textColor_instruction
            }}>{title} ({data.length}人）</Text>
        </View>);
    };

    _renderHeaderComponent = () => {
        return <View style={styles.headerBg}>
            <SearchBar placeholder={'搜索用户名'}
                       style={{ marginBottom: 10 }}
                       onChangeText={this._onChangeText}
                       title={this.state.searchText}/>
        </View>;
    };

    _keyExtractor = (item, index) => `${index}`;

    _renderList = () => {
        return <View style={{ flex: 1 }}>
            {this._renderHeaderComponent()}
            <SectionList style={{ flex: 1 }} sections={this.state.list}
                         renderSectionHeader={this._renderSectionHeader}
                         onRefresh={this._onRefresh}
                         stickySectionHeadersEnabled={false}
                         ListFooterComponent={<View style={{ height: 15 }}/>}
                         refreshing={this.state.refreshing}
                         renderItem={this._renderItem}
                         keyExtractor={this._keyExtractor}/>
        </View>;
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderList()}
                <ConfirmAlert ref="delAlert"/>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerBg: {
        backgroundColor: '#F6F6F6'
    }
});
