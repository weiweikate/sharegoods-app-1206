/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/16.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BasePage from '../../../BasePage';
import orderApi from '../api/orderApi';
import GoodsGrayItem from '../components/GoodsGrayItem';
import StringUtils from '../../../utils/StringUtils';
import {
    UIText, UIImage
} from '../../../components/ui';
import changeGoods from '../res/shouhou_icon_huanhuo_nor.png';
import refuseGoodsAndMoney from '../res/shouhou_icon_tuihuo_nor.png';
import refuseMoney from '../res/shouhou_icon_tuikuan_nor.png';
import RefreshLargeList from 'RefreshLargeList';
import search from '../res/search.png';

type Props = {};
export default class AfterSaleListPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            data: 1
        };
        this.page = 1;
        this._bind();
    }

    $navigationBarOptions = {
        title: this.params.type === 'search'? '搜索结果':'售后退款',
        show: true// false则隐藏导航

    };

    $NavBarRenderRightItem = () => {
        if (this.params.type === 'search'){
            return null
        } else {
            return(
                <TouchableOpacity onPress={this.gotoSearchPage}>
                <Image source={search}/>
            </TouchableOpacity>)
        }
    };

    gotoSearchPage = () => {
        this.$navigate('order/order/SearchPage', { pageType: 2 });
    };

    _bind() {
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {

    }

    $refreshData(){
        // alert(this.list)
      //  this.list._onRefresh && this.list._onRefresh();
    }
    renderItem({ item }) {
        return (
            <View>
                <View style={{ height: 10 }}/>
                <GoodsGrayItem
                    uri={item.specImg}
                    goodsName={item.productName}
                    salePrice={StringUtils.formatMoneyString(item.price)}
                    category={item.spec}
                    goodsNum={item.num}
                    // onPress={() => this.jumpToProductDetailPage()}
                />
                <View style={{
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderTopWidth: 0.5,
                    borderTopColor: '#CCCCCC'
                }}>
                    <UIImage source={[refuseMoney, refuseGoodsAndMoney, changeGoods][item.type - 1]}
                             style={styles.image}
                    />
                    <UIText value={['仅退款', '退货退款', '换货'][item.type - 1]}
                            style={styles.text}
                    />
                    <UIText value={this.getStatusText(item)}
                            style={[styles.text, { marginLeft: 35, flex: 1 }]}
                    />
                    <TouchableOpacity onPress={() => {
                        this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                            returnProductId: item.returnProductId,
                            pageType: item.type - 1
                        });
                    }} style={styles.btnContainer}>
                        <UIText value={'查看详情'}
                                style={styles.btnText}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    getStatusText(item) {
        let typeStr = ['仅退款', '退货退款', '换货'][item.type - 1];
        switch (item.status) {
            case 1:
            case 2:
            case 4:
            case 5:
                return typeStr + '中';
            case 6:
                return typeStr + '完成';
            case 3:
            case 7:
            case 8:
                return typeStr + '失败';
            default:
                return typeStr + '失败';
        }
    }

    _render() {
        let params = {};
        if (this.params.type === 'search') {
            params = { orderNum: this.params.orderNum };
        } else {
            params = { status: 0 };
        }
        return (
            <View style={styles.container}>
                <RefreshLargeList
                    style={styles.container}
                    url={orderApi.queryAftermarketOrderList}
                    renderItem={this.renderItem}
                    params={params}
                    heightForCell={() => 160}
                    ref={(ref) => {this.list = ref}}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        color: '#D51243',
        fontSize: 13
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 80,
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 15,
        marginRight: 15
    },
    btnText: {
        color: '#666666',
        fontSize: 13
    },
    image: {
        height: 20,
        width: 20,
        marginLeft: 15,
        marginRight: 5
    }
});
