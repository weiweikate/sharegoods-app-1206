/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/10.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import {
    MRText
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import { AfterStatus } from '../AfterType';
import {navigate} from '../../../../navigation/RouterMap'
const {
    STATUS_SEND_BACK           //待寄回
} = AfterStatus;

@observer
export default class FillAddressView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
    }

    onPress = ()=> {
        let afterSaleDetailModel = this.props.afterSaleDetailModel;
        navigate('order/afterSaleService/FillReturnLogisticsPage', {
            pageData:{
                productOrderNo:afterSaleDetailModel.pageData.product.productOrderNo,
                serviceNo:afterSaleDetailModel.pageData.service.serviceNo},
            callBack: () => {
                afterSaleDetailModel.loadPageData();
            }
        })
    }


    render() {
        let status = this.props.status;
        if (status !== STATUS_SEND_BACK){
            return null;
        }
        return (
            <View style={styles.container}>
                <MRText style={styles.title}>售后申请已通过，请尽快寄回商品并提交物流信息</MRText>
                <MRText style={styles.detail}>
                    剩余
                    <MRText style={styles.timerStr}>
                        {this.props.afterSaleDetailModel.timeString}
                    </MRText>
                    ，逾期为填写售后信息将自动关闭
                </MRText>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={this.onPress}
                                      style={styles.borderButton}
                    >
                        <MRText style={styles.btnText}>填写寄回物流</MRText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 15,
        marginTop: 10
    },
    detail: {
        fontSize: 13,
        color: DesignRule.textColor_instruction,
        marginLeft: 15,
        marginTop: 3
    },
    timerStr: {
        color: DesignRule.mainColor,
    },
    bottomContainer: {
        height: 44,
        borderTopWidth: 1,
        borderTopColor: DesignRule.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    borderButton: {
        borderWidth: 0.5,
        borderColor: DesignRule.mainColor,
        borderRadius: 14,
        height: 28,
        width: 105,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: DesignRule.mainColor,
        fontSize: 12,
    }
});
