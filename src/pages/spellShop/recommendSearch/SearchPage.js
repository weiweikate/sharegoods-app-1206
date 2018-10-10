/*
* 搜索店铺
* */
import React from 'react';
import {
    View,
    SectionList,
    StyleSheet
} from 'react-native';

import SearchBar from '../../../components/ui/searchBar/SearchBar';
import SearchSegmentView from './components/SearchSegmentView';
import SearchRecruitingRow from './components/SearchRecruitingRow';
import SearchAllRow from './components/SearchAllRow';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';


export default class SearchPage extends BasePage {


    // 导航配置
    $navigationBarOptions = {
        title: '搜索店铺'
    };

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            loading: true,
            refreshing: false,
            selIndex: 0,
            keyword: ''
        };
    }


    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        SpellShopApi.queryByStatusAndKeyword({
            page: 1,
            size: 10,
            status: this.state.selIndex === 0 ? 1 : 3,
            keyword: this.state.keyword
        }).then((data) => {
            let dataTemp = data.data || {};
            this.setState({
                dataList: dataTemp.data || []//data.data.data
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _onChangeText = (keyword) => {
        this.setState({ keyword }, this._loadPageData);
    };

    _onPressAtIndex = (index) => {
        this.state.selIndex = index;
        this._loadPageData();
    };

    _clickShopAtRow = (item) => {
        this.$navigate('spellShop/MyShop_RecruitPage', { storeId: item.id });
    };

    _renderListHeader = () => {
        return <SearchBar style={{ marginBottom: 10 }}
                          onChangeText={this._onChangeText}
                          title={this.state.keyword}
                          placeholder={'可通过搜索店铺/ID进行查找'}/>;
    };

    _renderHeader = () => {
        return <SearchSegmentView style={{ marginBottom: 10 }} onPressAtIndex={this._onPressAtIndex}/>;
    };

    // 渲染行
    _renderItem = (item) => {
        if (this.state.selIndex === 0) {
            return (<SearchAllRow onPress={this._clickShopAtRow} item={item.item}/>);
        } else {
            return (<SearchRecruitingRow onPress={this._clickShopAtRow} item={item.item}/>);
        }
    };

    _renderSeparatorComponent = () => {
        return (<View style={{ height: StyleSheet.hairlineWidth, marginLeft: 15, backgroundColor: '#eee' }}/>);
    };

    _render() {
        return (
            <View style={styles.container}>
                <SectionList refreshing={this.state.refreshing}
                             onRefresh={this._onRefresh}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderHeader}
                             renderItem={this._renderItem}
                             ItemSeparatorComponent={this._renderSeparatorComponent}
                             keyExtractor={(item, index) => `${index}`}
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
