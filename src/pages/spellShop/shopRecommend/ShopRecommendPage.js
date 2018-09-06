//店铺推荐页面
import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

//source
import ShopItemLogo from './src/dp_03.png';
import SearchItemLogo from './src/pdss_03.png';

import Swiper from 'react-native-swiper';

import ScreenUtils from '../../../utils/ScreenUtils';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar/NavigatorBar';
import RecommendRow from './components/RecommendRow';
import SegementHeaderView from './components/SegementHeaderView';

export default class ShopRecommendPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [{}, {}],
            adList: [{}, {}, {}]
        };
    }

    static $PageOptions = {
        navigationBarOptions: {
            title: '拼店',
            show: false
        }
    };

    // 点击开启店铺页面
    _clickOpenShopItem = () => {
    };

    // 点击搜索店铺
    _clickSearchItem = () => {
    };

    // 点击查看某个店铺
    _clickShopInfoRow = (id) => {
    };

    // 点击轮播图广告
    _clickItem = (item) => {
    };

    _onPressAtIndex = (index) => {

    };

    _renderBarRight = () => {
        // 可以拼店或者自己的店铺处于仅支付保证金状态
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

    _renderListHeader = () => {
        return (
            <Swiper
                autoplay
                horizontal
                autoplayTimeout={3000}
                height={ScreenUtils.autoSizeWidth(150)}
                style={{ backgroundColor: 'red' }}
                loop={this.state.adList.length > 1}
                dot={<View style={styles.dot}/>}
                activeDot={<View style={styles.activeDot}/>}
                paginationStyle={styles.paginationStyle}>
                {this.state.adList.map(this._renderImageItem)}
            </Swiper>);
    };

    _renderImageItem = (item, index) => {
        const { img_url } = item;
        return (
            <View key={index} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => this._clickItem(item)}>
                    <View style={{ flex: 1 }}>
                        {
                            img_url ? <Image
                                style={{ flex: 1, width: ScreenUtils.width, height: ScreenUtils.autoSizeWidth(237) }}
                                resizeMode="stretch"
                                source={{ uri: img_url }}/> : null
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    _renderSectionHeader = () => {
        return (<SegementHeaderView onPressAtIndex={this._onPressAtIndex}/>);
    };

    _renderItem = ({ item }) => {
        return (<RecommendRow item = {item} clickShopInfoRow={this._clickShopInfoRow}/>);
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar navigation={this.props.navigation}
                              title={'拼店'}
                              renderRight={this._renderBarRight}/>

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
