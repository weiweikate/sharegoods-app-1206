/*
* 店铺推荐页面
* */
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    SectionList,
    TouchableOpacity,
} from 'react-native';

//source
import ShopItemLogo from './src/dp_03.png';
import SearchItemLogo from './src/pdss_03.png';

import ScreenUtils from '../../../utils/ScreenUtils';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/RecommendSegmentView';
import BasePage from '../../../BasePage';
import StoreModel from '../model/StoreModel';
import SpellStatusModel from '../model/SpellStatusModel';
import ViewPager from '../../../components/ui/ViewPager';
import UIImage from '../../../components/ui/UIImage';

export default class RecommendPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [{}, {}, {}, {}, {}, {}],
            adList: [{}, {}, {}]
        };
    }

    $navigationBarOptions = {
        title: '所有店铺',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        const showShopItem = true;
        return <View style={styles.rightBarItemContainer}>
            {
                showShopItem ? <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickOpenShopItem}>
                    <Image source={ShopItemLogo}/>
                </TouchableOpacity> : null
            }
            <TouchableOpacity style={styles.rightItemBtn} onPress={this._clickSearchItem}>
                <Image source={SearchItemLogo}/>
            </TouchableOpacity>
        </View>;
    };

    // 点击开启店铺页面
    _clickOpenShopItem = () => {
        this.$navigate('spellShop/openShop/OpenShopExplainPage');
    };

    // 点击搜索店铺
    _clickSearchItem = () => {
        this.$navigate('spellShop/recommendSearch/SearchPage');
    };

    // 点击查看某个店铺
    _clickShopInfoRow = (id) => {
    };

    // 点击轮播图广告
    _clickItem = (item) => {
    };

    _onPressAtIndex = (index) => {

    };

    _renderListHeader = () => {
        return (
            <ViewPager style={styles.ViewPager}
                       arrayData={this.state.adList}
                       renderItem={(item) => this._renderViewPageItem(item)}
                       dotStyle={{
                           height: 5,
                           width: 5,
                           borderRadius: 5,
                           backgroundColor: '#eeeeee',
                           opacity: 0.4
                       }}
                       activeDotStyle={{
                           height: 5,
                           width: 30,
                           borderRadius: 5,
                           backgroundColor: '#eeeeee'
                       }}
                       autoplay={true}
                       height={ScreenUtils.autoSizeWidth(150)}/>);
    };

    _renderViewPageItem = (item) => {
        const { originalImg } = item;
        return (
            <UIImage
                source={{ uri: originalImg || '' }}
                style={{ height: ScreenUtils.autoSizeWidth(150), width: ScreenUtils.width }}
                onPress={this._clickItem}
                resizeMode="cover"
            />);
    };

    _renderSectionHeader = () => {
        return (<SegementHeaderView onPressAtIndex={this._onPressAtIndex}/>);
    };

    _renderItem = ({ item }) => {
        return (<RecommendRow item={item} clickShopInfoRow={this._clickShopInfoRow}/>);
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <SectionList refreshing={this.state.refreshing}
                             onRefresh={this._onRefresh}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             stickySectionHeadersEnabled={false}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: this.state.dataList }]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // 顶部条 右边item容器
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightItemBtn: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },

    paginationStyle: {
        bottom: 8,
        left: 0,
        right: 0
    },
    activeDot: {
        backgroundColor: 'white',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    },
    dot: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    }

});
