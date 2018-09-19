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

    constructor(props) {
        super(props);
        this.state = {
            list: [{data:[{}]},{data:[{}]},{data:[{}]},{data:[{}]}],
            searchText: '',
            refreshing: false,
            pageLoading: true,
            netFailedInfo: null
        };
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
        // const keyword = this.state.searchText || '';
        // SpellShopApi.getMemberList({ keyword }).then((response) => {
        //     if (response.ok) {
        //         response.data = (response.data && typeof response.data === 'object') ? response.data : {};
        //         const list = this._transformList(response.data);
        //         this.setState({
        //             refreshing: false,
        //             list,
        //             pageLoading: false,
        //             netFailedInfo: null
        //         });
        //     } else {
        //         this.setState({
        //             refreshing: false,
        //             list: [],
        //             pageLoading: false,
        //             netFailedInfo: response
        //         }, () => {
        //             Toast.toast(response.ok ? '数据异常' : response.msg);
        //         });
        //     }
        // });
    }

    // 店员详情
    _clickAssistantDetail = (id) => {
        this.props.navigation.navigate('spellShop/myShop/ShopAssistantDetailPage', { id });
    };

    _componentWillUnmount() {
        this.params.reloadCallBack && this.params.reloadCallBack();
    }

    // 删除具体店员
    _clickDeleteAssistant = (dealerId) => {
        // SpellShopApi.removeMember({ dealerId }).then(response => {
        //     if (response.ok) {
        //         this.params.reloadCallBack && this.params.reloadCallBack();
        //         this.loadPageData();
        //     } else {
        //         Toast.toast(response.msg);
        //     }
        // });
    };

    _onChangeText = (searchText) => {
        this.setState({ searchText }, this.loadPageData);
    };

    // 渲染行
    _renderItem = ({ item, index }) => {
        if (item.roleType === 0) {//0店主
            return <MasterRow item={item} onPress={this._clickAssistantDetail}/>;
        } else {//1店员
            return (<AssistantRow item={item}
                                  isYourStore={this.params.isYourStore}
                                  onPress={this._clickAssistantDetail}
                                  onPressDelete={this._clickDeleteAssistant}/>);
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
                color: '#999999'
            }}>{title} ({data.length}人）</Text>
        </View>);
    };

    _renderHeaderComponent = () => {
        return <View style={styles.headerBg}>
            <SearchBar placeholder={'搜索用户名和授权码'}
                       style={{ marginBottom: 10 }}
                       onChangeText={this._onChangeText}
                       title={this.state.searchText}/>
        </View>;
    };

    _keyExtractor = (item, index) => `${index}`;

    _renderList = () => {
        //ListHeaderComponent={this._renderHeaderComponent}
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

    _reloadData = () => {
        this.setState({
            refreshing: false,
            pageLoading: true,
            netFailedInfo: null
        }, this.loadPageData);
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderList()}
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
