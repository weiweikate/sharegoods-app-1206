/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/29.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import {
    UIText,

} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { AfterStatus, SubStatus, PageType, isRefundFail } from '../AfterType';

const {
    PAGE_AREFUND,
    PAGE_SALES_RETURN,
    PAGE_EXCHANGE
} = PageType;

const {
    STATUS_IN_REVIEW ,           //待审核
    STATUS_SEND_BACK,            //待寄回
    STATUS_WAREHOUSE_CONFIRMED,  //待仓库确认
    STATUS_PLATFORM_PROCESSING, //待平台处理
    STATUS_SUCCESS,              //售后完成
    STATUS_FAIL
} = AfterStatus;

const {
    REFUSE_REVOKED, //用户自己关闭
    REFUSE_OVERTIME , //超时
    REFUSE_APPLY, //拒绝售后申请
    REFUSE_AFTER      //拒绝售后
} = SubStatus;



export default class StatusInfoView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { status, pageType, remarks, subStatus, refundStatus} = this.props;

        //获取要显示文案
        let content = this.getContent(pageType, status, subStatus, refundStatus, remarks)
        //文案为null，就不显示该组件
        if (!content) {
            return null;
        }
        const {titleStr, detialStr, remarkStr} = content;
        return (
            <View style={styles.container}>
                <UIText value={titleStr}
                        style={styles.title}/>
                {
                    detialStr?<UIText value={detialStr}
                                      style={styles.detail}/>: null
                }
                {
                    remarkStr?<UIText value={'平台说明：' + remarkStr}
                                      style={styles.detail}/>: null
                }

            </View>
        );
    }


    getContent(pageType, status, subStatus, refundStatus, remarks){
        switch (pageType) {
            case PAGE_AREFUND:
                return this.getArefundContent(status, subStatus, refundStatus, remarks);
            case PAGE_SALES_RETURN:
                return this.getSalesReturnContent(status, subStatus, refundStatus, remarks);
            case PAGE_EXCHANGE:
                return this.getExchangeContent(status, subStatus, refundStatus, remarks);
            default:
                return null;
        }
    }

    getArefundContent(status, subStatus, refundStatus, remarks){
        switch (status) {
            case STATUS_SUCCESS:
                if (isRefundFail(refundStatus)) {
                    return{
                        titleStr: '售后已完成，退款失败',
                        detialStr: '若有疑问请联系客服',
                        remarkStr: remarks,
                    }
                }
                return{
                    titleStr: '售后已完成，退款成功',
                    remarkStr: remarks,
                }
            case STATUS_FAIL: {
                if (subStatus === REFUSE_REVOKED){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '您已经撤销售后申请',
                    }
                }
                if (subStatus === REFUSE_APPLY){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '平台已经拒绝售后申请',
                        remarkStr: remarks,
                    }
                }
            }
            default://待审核 不显 || 退款不存在，待寄回，待仓库确认，待平台处理的状态
                return null;

        }
    }

    getSalesReturnContent(status, subStatus, refundStatus, remarks){
        switch (status) {
            case STATUS_WAREHOUSE_CONFIRMED:
                return{
                    titleStr: '物流信息提交成功，请耐心等待平台处理',
                }
            case STATUS_PLATFORM_PROCESSING:

                return{
                    titleStr: '平台已同意您的售后申请',
                }

            case STATUS_SUCCESS:
                if (isRefundFail(refundStatus)) {
                    return{
                        titleStr: '售后已完成，退款失败',
                        detialStr: '若有疑问请联系客服',
                        remarkStr: remarks,
                    }
                }
                return{
                    titleStr: '售后已完成，退款成功',
                    remarkStr: remarks,
                }
            case STATUS_FAIL: {
                if (subStatus === REFUSE_REVOKED){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '您已经撤销售后申请',
                    }
                }
                if (subStatus === REFUSE_APPLY){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '平台已经拒绝售后申请',
                        remarkStr: remarks,
                    }
                }
                if (subStatus === REFUSE_OVERTIME){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '您未在指定时间提交物流',
                    }
                }

                if (subStatus === REFUSE_AFTER){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '平台已经拒绝售后申请',
                        remarkStr: remarks,
                    }
                }
            }
            default://待审核 待寄回不显
                return null;

        }

    }
    getExchangeContent(status, subStatus, refundStatus, remarks){
        switch (status) {
            case STATUS_WAREHOUSE_CONFIRMED:
                return{
                    titleStr: '物流信息提交成功，请耐心等待平台处理',
                }
            case STATUS_PLATFORM_PROCESSING:

                return{
                    titleStr: '平台已同意您的售后申请',
                }

            case STATUS_SUCCESS:
                if (isRefundFail(refundStatus)) {
                    return{
                        titleStr: '售后已完成，退款失败',
                        detialStr: '若有疑问请联系客服',
                        remarkStr: remarks,
                    }
                }
                return{
                    titleStr: '售后已完成，换货成功',
                    remarkStr: remarks,
                }
            case STATUS_FAIL: {
                if (subStatus === REFUSE_REVOKED){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '您已经撤销售后申请',
                    }
                }
                if (subStatus === REFUSE_APPLY){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '平台已经拒绝售后申请',
                        remarkStr: remarks,
                    }
                }
                if (subStatus === REFUSE_OVERTIME){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '您未在指定时间提交物流',
                    }
                }

                if (subStatus === REFUSE_AFTER){
                    return{
                        titleStr: '售后已关闭',
                        detialStr: '平台已经拒绝售后申请',
                        remarkStr: remarks,
                    }
                }
            }
            default://待审核 待寄回不显
                return null;

        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
    },
    title:{
        color: DesignRule.textColor_mainTitle,
        fontSize: 13,
        fontWeight: '600',
        marginTop: 15
    },
    detail:{
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        marginTop: 4
    }

});
