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
  //1.售前仅退款 2.退货退款 3.换货
    renderItem({ item }) {
        let {status,
            specImg,
            productName,
            unitPrice,
            spec,
            refundNum,
            type,
            serviceNo,
            productOrderNo
        } = item;
        return (
            <View style={{ height: 160, marginBottom: 10 }}>
                <GoodsGrayItem
                    uri={specImg}
                    goodsName={productName}
                    salePrice={StringUtils.formatMoneyString(unitPrice)}
                    category={spec}
                    goodsNum={refundNum}
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
                    <UIImage source={[icon_refund, icon_return_goods, icon_exchange][type - 1]}
                             style={styles.image}
                    />
                    <UIText value={['仅退款', '退货退款', '换货'][type - 1]}
                            style={styles.text}
                    />
                    <UIText value={this.getStatusText(item)}
                            style={[styles.text, { marginLeft: 35, flex: 1 }]}
                    />
                    <TouchableOpacity onPress={() => {
                        if (status === 2) {
                            this.$navigate('order/afterSaleService/FillReturnLogisticsPage', {
                                pageData: {
                                    serviceNo,
                                    productOrderNo
                                },
                                callBack: () => {
                                    this.list&&this.list.onRefresh();
                                }
                            });
                            return;
                        }
                        this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                            serviceNo: serviceNo
                        });
                    }} style={[styles.btnContainer,{borderColor: status === 2? DesignRule.mainColor: DesignRule.lineColor_inGrayBg}]}>
                        <UIText value={status === 2 ? '填写物流' : '查看详情'}
                                style={[styles.btnText, {color: status === 2? DesignRule.mainColor: DesignRule.textColor_instruction}]}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 10 }}/>
            </View>
        );
    }

    getStatusText(item) {//1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭|否| 7, "待商家取消发货"
        let typeStr = ['仅退款', '退货退款', '换货'][item.type - 1];
        switch (item.status) {
            case 1:
            case 7://在c端，7、1都是待审核
                return '待审核';
            case 2:
                return '待寄回';
            case 3:
                return '待平台确认';
            case 4:
                return '待平台处理';
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
                        return result.data.data;
                    }}
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
        color: DesignRule.textColor_placeholder,
        fontSize: 13
    },
    image: {
        height: 20,
        width: 20,
        marginLeft: 15,
        marginRight: 5
    }
});
