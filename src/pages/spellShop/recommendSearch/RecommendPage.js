/*
* 店铺推荐页面
* */
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    SectionList,
    TouchableOpacity
} from 'react-native';

//source
import ShopItemLogo from './src/dp_03.png';
import SearchItemLogo from './src/pdss_03.png';

import ScreenUtils from '../../../utils/ScreenUtils';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/RecommendSegmentView';
import BasePage from '../../../BasePage';
import SpellStatusModel from '../model/SpellStatusModel';
import ViewPager from '../../../components/ui/ViewPager';
import UIImage from '../../../components/ui/UIImage';
import SpellShopApi from '../api/SpellShopApi';
import storeModel from '../model/StoreModel';

export default class RecommendPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            segmentIndex: '1',
            dataList: [],
            adList: []
        };
    }

    $navigationBarOptions = {
        title: '拼店',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        const showShopItem =  SpellStatusModel.canCreateStore;
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

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {

        SpellShopApi.queryHomeStore({
            page: 1,
            size: 10,
            type: this.state.segmentIndex
        }).then((data) => {
            let dataTemp = data.data || {};
            this.setState({
                dataList: dataTemp.data || []//data.data.data
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });

        storeModel.getById();
    };

    // 点击开启店铺页面
    _clickOpenShopItem = () => {
        if (storeModel.status === 1) {
            this.$navigate('spellShop/myShop/MyShopPage');
        } else if (storeModel.status === 2) {
            this.$navigate('spellShop/shopSetting/SetShopNamePage');
        } else if (storeModel.status === 3) {
            this.$navigate('spellShop/shopRecruit/ShopRecruitPage');
        } else if (SpellStatusModel.canCreateStore) {
            this.$navigate('spellShop/openShop/OpenShopExplainPage');
        }
    };

    // 点击搜索店铺
    _clickSearchItem = () => {
        this.$navigate('spellShop/recommendSearch/SearchPage');
    };

    // 点击查看某个店铺
    _RecommendRowOnPress = (id) => {
        this.$navigate('spellShop/myShop/MyShopPage',{storeId: id});
    };

    // 点击轮播图广告
    _clickItem = (item) => {
    };

    _segmentPressAtIndex = (index) => {
        this.state.segmentIndex = index;
        this._loadPageData();
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
            />);
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
        return (<SegementHeaderView segmentPressAtIndex={this._segmentPressAtIndex}/>);
    };

    _renderItem = ({ item }) => {
        return (<RecommendRow RecommendRowItem={item} RecommendRowOnPress={this._RecommendRowOnPress}/>);
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
        )
            ;
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

    ViewPager: {
        height: ScreenUtils.autoSizeWidth(230),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: ScreenUtils.width
    }

});
