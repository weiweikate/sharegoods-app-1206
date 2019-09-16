/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/6/11.
 *
 */


'use strict';

import React from 'react';

import { ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { UIText } from '../../../../components/ui';
import CommModal from '../../../../comm/components/CommModal';
import OrderApi from '../../api/orderApi';
import bridge from '../../../../utils/bridge';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import UIImage from '@mr/image-placeholder';

export default class CancelProdectsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: []
        };
        this.platformOrderNo = '';
    }


    open(platformOrderNo, callBack, isPay) {
        this.isPay = isPay;
        this.callBack = callBack;
        if (this.platformOrderNo === platformOrderNo) {
            this.openOrNext(this.state.data);
            this.platformOrderNo = platformOrderNo;
            return;
        }
        this.platformOrderNo = platformOrderNo;
        bridge.showLoading();
        OrderApi.getAllProductOrder({ platformOrderNo: platformOrderNo }).then((data) => {
            bridge.hiddenLoading();
            (data.data || []).map(item => {
                if (item.couponAmount > 0) {
                    this.isCoupon = true;
                }
            });
            this.setState({ data: data.data || [] });
            this.openOrNext(data.data);

        }).catch((err) => {
            bridge.$toast(err.msg);
            bridge.hiddenLoading();
            this.platformOrderNo = '';
        });

    }

    close() {
        this.setState({ visible: false });
    }

    openOrNext = (data) => {
        if (data && data.length > 1) {//商品数量大于1
            let merchantOrderNo = data[0].merchantOrderNo;
            let visible = false;
            for (let i = 1; i < data.length; i++) {
                if (merchantOrderNo !== data[i].merchantOrderNo) {//有两个以上的商家
                    visible = true;
                }
            }
            if (visible) {
                //显示要一起取消的商品modal
                this.setState({ visible: true });
                return;
            }
        }
        //直接去下一步选择取消理由modal
        this.clickSure();
    };

    clickSure = () => {
        this.callBack && this.callBack();
        this.close();
    };

    renderItems() {
        return this.state.data.map((item, index) => {
            let { specImg, quantity, productName, unitPrice } = item;
            return (
                <View key={'CancelProdectsModal' + index} style={{
                    height: 100,
                    paddingTop: 10,
                    flexDirection: 'row',
                    width: ScreenUtils.width,
                    paddingRight: 15
                }}>
                    <UIImage style={{ width: 80, height: 80, marginLeft: 15 }} source={{ uri: specImg }}/>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <UIText value={productName} style={{ fontSize: 14, color: '#333333' }}/>
                        <View style={{ marginTop: 5, flexDirection: 'row' }}>
                            <UIText value={'¥' + unitPrice} style={{ fontSize: 14, color: '#666666' }}/>
                            <View style={{ flex: 1 }}/>
                            <UIText value={'x' + quantity} style={{ fontSize: 12, color: '#999999' }}/>
                        </View>
                    </View>
                </View>
            );
        });
    }

    render() {
        let title = this.isPay ? '支付' : '取消';
        let coupon = this.isCoupon ? '共享优惠' : '';
        return (
            <CommModal visible={this.state.visible}
                       ref={(ref) => {
                           this.modal = ref;
                       }}
                       onRequestClose={() => {
                           this.close();
                       }}
            >
                <TouchableWithoutFeedback onPress={() => this.close()}>
                    <View style={{ flex: 1 }}/>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <View style={{
                        marginTop: 10,
                        alignItems: 'center'
                    }}>
                        <UIText value={title + '订单'} style={{ fontSize: 16, fontWeight: '600' }}/>
                        <UIText value={'由于以下商品' + coupon + '，需要一起' + title} style={{ fontSize: 12, color: '#666666' }}/>
                    </View>
                    <ScrollView style={{ marginTop: 20 }}>
                        {this.renderItems()}
                    </ScrollView>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: DesignRule.mainColor
                        }}
                        onPress={() => {
                            this.clickSure();
                        }}>
                        <UIText value={title + '订单'} style={{ color: 'white', fontSize: 16 }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ right: 15, width: 50, top: 0, height: 50, position: 'absolute' }}
                        onPress={() => {
                            this.close();
                        }}>
                        <UIText value={'x'}
                                style={{ color: DesignRule.textColor_hint, fontSize: 24, textAlign: 'right' }}/>
                    </TouchableOpacity>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.height / 3 * 2,
        width: ScreenUtils.width,
        backgroundColor: 'white',
        paddingBottom: ScreenUtils.safeBottom
    }
});
