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
import {  View, Image, RefreshControl ,Text} from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import PropTypes from 'prop-types';
import ScreenUtils from '../../../utils/ScreenUtils';
import { EmptyViewTypes, shopCartEmptyModel } from '../model/ShopCartEmptyModel';
import { MRText } from '../../../components/ui';
import ShopCartEmptyCell from './ShopCartEmptyCell';
import res from '../res';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { homeModule } from '../../home/model/Modules';
import RouterMap from '../../../navigation/RouterMap';

const { px2dp } = ScreenUtils;
const { shopCartNoGoods } = res;

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
}}>
    <Text style={{
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24
    }}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的' : (isFetching ? '加载中...' : '加载更多'))}</Text>
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
        if (type === EmptyViewTypes.topEmptyItem){
            dim.width = ScreenUtils.width;
            dim.height = px2dp(350)
        } else {
            dim.width = ScreenUtils.width / 2;
            dim.height = px2dp(168 + 85)
        }
    });
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        shopCartEmptyModel.getRecommendProducts();
    }
    _renderItem = (type, itemData, index) => {
        const {navigateToHome} = this.props;
        console.log('数据源' + JSON.stringify(itemData));
        if (type === EmptyViewTypes.topEmptyItem) {
            return this._renderHeaderView();
        }else {
           return <ShopCartEmptyCell itemData={itemData} onClick={() => {
               navigateToHome(RouterMap.ProductDetailPage,{ productCode:itemData.prodCode})
                }}/>
        }
    };
    _onRefresh = () => {
      shopCartEmptyModel.getRecommendProducts(true)
    };
    _onEndReached=()=>{
        shopCartEmptyModel.getRecommendProducts(false);
    }
    _keyExtractor = (dataItem) => {
        return dataItem.id;
    };
    refreshing = () => {

    };
    _renderHeaderView = () => {
        return (
            <View style={{ width: ScreenUtils.width, height: 350, paddingLeft: px2dp(15), paddingRight: px2dp(15) }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={shopCartNoGoods} style={{ width: px2dp(244), height: px2dp(140) }} />
                    <MRText style={{
                        fontSize: px2dp(13),
                        color: 'rgba(153, 153, 153, 1)',
                        marginTop: px2dp(5)
                    }}>暂无商品</MRText>
                </View>
                <View
                    style={{ width: ScreenUtils.width, height: px2dp(50), flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: px2dp(2), height: px2dp(8), backgroundColor: '#FF0050' }}/>
                    <MRText style={{ marginLeft: px2dp(5), fontSize: px2dp(16) }}>为你推荐</MRText>
                </View>
            </View>
        );
    };

    render() {
        const {emptyViewList} = shopCartEmptyModel
        this.dataProvider = this.dataProvider.cloneWithRows(emptyViewList);
        return (<RecyclerListView
                ref={(ref) => {
                    this.recyclerListView = ref;
                }}
                style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                onRefresh={this._onRefresh.bind(this)}
                                                colors={[DesignRule.mainColor]}/>}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={ScreenUtils.height / 3}
                dataProvider={this.dataProvider}
                rowRenderer={this._renderItem.bind(this)}
                layoutProvider={this.layoutProvider}
                onScrollBeginDrag={() => {
                    // this.luckyIcon.close();
                }}
                showsVerticalScrollIndicator={false}
                // onScroll={this._onListViewScroll}
                renderFooter={() => <Footer
                    isFetching={shopCartEmptyModel.isFetching}
                    errorMsg={shopCartEmptyModel.errorMsg}
                    isEnd={shopCartEmptyModel.isEnd}/>
                }
            />);
    }
}
ShopCartEmptyView.propTypes = {
    //去逛逛
    navigateToHome: PropTypes.func.isRequired
};

// const styles = StyleSheet.create({
//     bgViewStyle: {
//         backgroundColor: DesignRule.bgColor,
//         flex: 1
//     },
//     imgStyle: {
//         height: 115,
//         width: 115
//     },
//     topTextStyle: {
//         marginTop: 10,
//         fontSize: 15,
//         color: DesignRule.textColor_secondTitle
//     },
//     bottomTextBgViewStyle: {
//         marginTop: 22,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderColor: DesignRule.mainColor,
//         borderWidth: 1,
//         borderRadius: 18,
//         width: 115,
//         height: 36
//     },
//     bottomTextStyle: {
//         color: DesignRule.mainColor,
//         fontSize: 15
//     },
//     addSomethingTipStyle: {
//         marginTop: 10,
//         fontSize: 15,
//         color: DesignRule.textColor_secondTitle
//     }
//
// });
