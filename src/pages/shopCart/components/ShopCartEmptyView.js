/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huyufeng on 2019/1/3.
 *
 */


'use strict';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import PropTypes from 'prop-types';
import ScreenUtils from '../../../utils/ScreenUtils';
import { EmptyViewTypes, shopCartEmptyModel } from '../model/ShopCartEmptyModel';
import { MRText } from '../../../components/ui';
import ShopCartEmptyCell from './ShopCartEmptyCell';
import res from '../res';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import RouterMap from '../../../navigation/RouterMap';
import HeaderLoading from '../../../comm/components/lottieheader/ListHeaderLoading';

const { px2dp } = ScreenUtils;
const { shopCartNoGoods } = res;

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
}}>
    <ActivityIndicator style={{ marginRight: 6 }} animating={errorMsg ? false : (isEnd ? false : true)} size={'small'}
                       color={DesignRule.mainColor}/>
    <Text style={{
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24
    }}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的~' : (isFetching ? '加载中...' : '加载更多中...'))}</Text>
</View>;

@observer
export default class ShopCartEmptyView extends Component {
    st = 0;
    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });
    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i).type || 0;
    }, (type, dim) => {
        if (type === EmptyViewTypes.topEmptyItem) {
            dim.width = ScreenUtils.width;
            dim.height = px2dp(350);
        } else {
            dim.width = (ScreenUtils.width - px2dp(25)) / 2;
            dim.height = px2dp(248 + 5);
        }
    });

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        shopCartEmptyModel.getRecommendProducts(true);
    }

    _renderItem = (type, itemData, index) => {
        const { navigateToHome } = this.props;
        if (type === EmptyViewTypes.topEmptyItem) {
            return this._renderHeaderView();
        } else {
            return <ShopCartEmptyCell selectedIndex={index} recommendScene={1} itemData={itemData} onClick={() => {
                navigateToHome(RouterMap.ProductDetailPage, { productCode: itemData.prodCode, trackType: 4 });
            }}/>;
        }
    };
    _onRefresh = () => {
        shopCartEmptyModel.getRecommendProducts(true,true);
    };
    _onEndReached = () => {
        shopCartEmptyModel.getRecommendProducts(false);
    };
    _keyExtractor = (dataItem) => {
        return dataItem.id;
    };
    refreshing = () => {

    };
    _renderHeaderView = () => {
        return (
            <View style={{ width: ScreenUtils.width - px2dp(30), height: px2dp(350) }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={shopCartNoGoods} style={{ width: px2dp(244), height: px2dp(140) }}/>
                    <MRText style={{
                        fontSize: px2dp(13),
                        color: 'rgba(153, 153, 153, 1)',
                        marginTop: px2dp(5)
                    }}>购物车竟然是空的</MRText>
                </View>
                <View
                    style={{ width: ScreenUtils.width, height: px2dp(40), flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        width: px2dp(2),
                        height: px2dp(8),
                        borderRadius: px2dp(1),
                        backgroundColor: '#FF0050'
                    }}/>
                    <MRText style={{ marginLeft: px2dp(5), fontSize: px2dp(16), fontWeight: '600' }}>为你推荐</MRText>
                </View>
            </View>
        );
    };

    render() {
        const { emptyViewList } = shopCartEmptyModel;
        this.dataProvider = this.dataProvider.cloneWithRows(emptyViewList);
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <RecyclerListView
                    style={{
                        minHeight: ScreenUtils.headerHeight,
                        minWidth: 1
                    }}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        marginLeft: px2dp(15),
                        marginRight: px2dp(15)
                    }}
                    refreshControl={<HeaderLoading
                        isRefreshing={shopCartEmptyModel.isRefreshing}
                        onRefresh={()=>{this._onRefresh()}}
                    />}
                    onEndReachedThreshold={ScreenUtils.height / 3}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    showsVerticalScrollIndicator={false}
                    renderFooter={() => <Footer
                        isFetching={shopCartEmptyModel.isFetching}
                        errorMsg={shopCartEmptyModel.errorMsg}
                        isEnd={shopCartEmptyModel.isEnd}/>
                    }
                />
            </View>
        );
    }
}
ShopCartEmptyView.propTypes = {
    //去逛逛
    navigateToHome: PropTypes.func.isRequired
};
