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
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import RefreshFlatList from '../../../comm/components/RefreshFlatList';

const {
    afterSaleService: {
        icon_refund,
        icon_return_goods,
        icon_exchange
    },
    search
} = res;

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
        title: this.params.type === 'search' ? '搜索结果' : '售后退款',
        show: true// false则隐藏导航

    };

    $isMonitorNetworkStatus() {
        return true;
    }

    $NavBarRenderRightItem = () => {
        if (this.params.type === 'search') {
            return null;
        } else {
            return (
                <TouchableOpacity onPress={this.gotoSearchPage}>
                    <Image source={search}/>
                </TouchableOpacity>);
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

    $refreshData() {
        // alert(this.list)
        //  this.list._onRefresh && this.list._onRefresh();
    }

    renderItem({ item }) {
        return (
            <View style={{ height: 160, marginBottom: 10 }}>
                <GoodsGrayItem
                    uri={item.specImg}
                    goodsName={item.productName}
                    salePrice={StringUtils.formatMoneyString(item.unitPrice)}
                    category={item.spec}
                    goodsNum={item.quantity}
                    style={{ backgroundColor: DesignRule.white }}
                    // onPress={() => this.jumpToProductDetailPage()}
                />
                <View style={{
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderTopWidth: 0.5,
                    borderTopColor: DesignRule.textColor_placeholder
                }}>
                    <UIImage source={[icon_refund, icon_return_goods, icon_exchange][item.type - 1]}
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
                            serviceNo: item.serviceNo
                        });
                    }} style={styles.btnContainer}>
                        <UIText value={'查看详情'}
                                style={styles.btnText}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 10 }}/>
            </View>
        );
    }

    getStatusText(item) {//1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭|否|
        let typeStr = ['仅退款', '退货退款', '换货'][item.type - 1];
        switch (item.status) {
            case 1:
            case 2:
            case 3:
            case 4:
                return typeStr + '中';
            case 5:
                return typeStr + '完成';
            case 6:
                return typeStr + '失败';
            default:
                return typeStr + '失败';
        }
    }

    _render() {
        let params = {};
        if (this.params.type === 'search') {
            params = { searchKey: this.params.condition };
        } else {
            params = {};
        }

        return (
            <View style={styles.container}>
                <RefreshFlatList
                    style={styles.container}
                    url={orderApi.afterSaleList}
                    renderItem={this.renderItem}
                    params={params}
                    totalPageNum={(result) => {
                        return result.data.isMore ? 10 : 0;
                    }}
                    handleRequestResult={(result) => {
                        return result.data.list;
                    }}
                    // ref={(ref) => {this.list = ref}}
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
        color: DesignRule.mainColor,
        fontSize: 13
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 80,
        borderWidth: 0.5,
        borderColor: DesignRule.lineColor_inGrayBg,
        borderRadius: 15,
        marginRight: 15
    },
    btnText: {
        color: DesignRule.textColor_secondTitle,
        fontSize: 13
    },
    image: {
        height: 20,
        width: 20,
        marginLeft: 15,
        marginRight: 5
    }
});
