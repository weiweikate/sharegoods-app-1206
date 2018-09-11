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


export default class SearchPage extends BasePage {


    // 导航配置
    $navigationBarOptions = {
        title: '申请店铺'
    };

    constructor(props) {
        super(props);
        this.state = {
            list: [{}, {}, {}, {}],
            loading: true,
            refreshing: false,
            selIndex: 0,
            keyword: ''
        };
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._searchKeyWord);
    };

    _searchKeyWord = () => {
        this.setState({
            loading: true,
            list: [{}, {}, {}, {}]
        }, () => {
        });
    };

    _onChangeText = (keyword) => {
        this.setState({ keyword }, this._searchKeyWord);
    };

    _onPressAtIndex = (index) => {
        this.setState({ selIndex: index, list: [] }, this._searchKeyWord);
    };

    _clickShopAtRow = (storeId) => {
        if (this.state.selIndex === 1){
            this.$navigate('spellShop/shopRecruit/ShopRecruitPage');
        }else {
            this.$navigate('spellShop/shopRecruit/ShopRecruitPage');
        }
    };

    _renderListHeader = () => {
        return <SearchBar style={{ marginBottom: 10 }}
                          onChangeText={this._onChangeText}
                          searchClick={this._clickSearch}
                          title={this.state.keyword}
                          placeholder={'可通过搜索店铺/ID进行查找'}/>;
    };

    _renderHeader = ({ section }) => {
        // const { sectionGroup } = section;
        // if (sectionGroup === 0) {
        return <SearchSegmentView style={{ marginBottom: 10 }} onPressAtIndex={this._onPressAtIndex}/>;
        // } else {
        //     return null;
        // }
    };

    // 渲染行
    _renderItem = (item, section) => {
        // const { sectionGroup } = section;
        // if (sectionGroup === 1) {
        if (this.state.selIndex === 0) {
            return (<SearchAllRow onPress={this._clickShopAtRow} item={item}/>);
        } else {
            return (<SearchRecruitingRow onPress={this._clickShopAtRow} item={item}/>);
        }
        // } else {
        //     return null;
        // }
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
                             sections={[{ data: this.state.list }]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
