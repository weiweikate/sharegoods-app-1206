/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/3/15.
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
import RefreshFlatList from '../../../comm/components/RefreshFlatList';
import OrderApi from '../api/orderApi';
import GoodsItem from '../components/GoodsGrayItem';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import res from '../res';


export default class AfterLogisticsListView extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '查看物流',
        show: true// false则隐藏导航
    };

    renderItem = ({ item }) => {
        let { quantity, product, expNO, expName, expressCode } = item;
        let { productName, specImg, payAmount, spec } = product;
        return (
            <View style={{ paddingBottom: 10 }}>
                <TouchableOpacity
                    style={{ height: 40, backgroundColor: DesignRule.white, justifyContent: 'center', marginBottom: 1 }}
                    onPress={() => {
                        this.$navigate('order/logistics/LogisticsDetailsPage', {
                            expressNo: expNO,
                            expressCode: expressCode
                        });
                    }}>
                    <View style={styles.expStyle}>
                        <MRText style={{
                            fontSize: 12,
                            color: DesignRule.textColor_mainTitle
                        }}>{`${expName}: ${expNO}`}</MRText>
                        <Image source={res.button.arrow_right_black}/>
                    </View>
                </TouchableOpacity>
                <GoodsItem
                    uri={specImg}
                    goodsName={productName}
                    salePrice={StringUtils.formatMoneyString(payAmount)}
                    category={spec}
                    goodsNum={quantity}
                    style={{ backgroundColor: DesignRule.white }}
                    onPress={() => {
                        this.$navigate('order/logistics/LogisticsDetailsPage', {
                            expressNo: expNO,
                            expressCode: expressCode
                        });
                    }}
                />
            </View>
        );
    };
    renderHeader = (data) => {
        if (data.length === 0) {
            return <View/>;
        }
        return (
            <View style={{}}>
                <View style={{ backgroundColor: DesignRule.mainColor, alignItems: 'center' }}>
                    <MRText style={{
                        color: 'white',
                        fontSize: 12,
                        paddingHorizontal: 10
                    }}>{data.length + '个包裹已发出'}</MRText>
                </View>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}/>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#D9D9D9' }}/>
                    <MRText style={{
                        color: '#999999',
                        fontSize: 12,
                        paddingHorizontal: 10
                    }}>{'以下商品被拆分成' + data.length + '个包裹'}</MRText>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#D9D9D9' }}/>
                    <View style={{ flex: 1 }}/>
                </View>
            </View>
        );
    };


    _render() {
        return (
            <RefreshFlatList
                url={OrderApi.return_express}
                params={{ serviceNo: this.params.serviceNo }}
                renderItem={this.renderItem}
                renderHeader={this.renderHeader}
                isSupportLoadingMore={false}
                handleRequestResult={(result) => result.data}
            />
        );
    }
}


const styles = StyleSheet.create({
    expStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15
    }

});
