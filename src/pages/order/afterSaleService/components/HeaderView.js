/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/27.
 *
 */
"use strict";

import React from "react";

import {
    StyleSheet,
    View,
    ImageBackground
} from "react-native";

import {
    UIImage, MRText
} from "../../../../components/ui";
import ScreenUtils from "../../../../utils/ScreenUtils";
import res from "../../res";
const  autoSizeWidth = ScreenUtils.autoSizeWidth;
import {AfterStatus, SubStatus, PageType, isRefundFail} from '../AfterType'

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
    REFUSE_REVOKED , //用户自己关闭
    REFUSE_OVERTIME, //超时
    REFUSE_APPLY   , //拒绝售后申请
    REFUSE_AFTER   , //拒绝售后
} = SubStatus;


const {
    afterSaleService: {
        exchangeGoodsDetailBg,
        white_triangular
    }
} = res;

export default class HeaderView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let { status, pageType, subStatus, refundStatus} = this.props;
        return (
            <ImageBackground source={exchangeGoodsDetailBg} style={styles.container}>
                <View style={{marginHorizontal: autoSizeWidth(34), height: 55, marginBottom: autoSizeWidth(20)}}>
                    {this.renderTimerLine(status, pageType, subStatus, refundStatus)}
                </View>
            </ImageBackground>
        );
    }

    /**
     * 画进度线
     * @param status  1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
     * @param pageType 0 退款详情  1 退货详情   2 换货详情
     */
    renderTimerLine(status, pageType, subStatus, refundStatus){
        switch (pageType) {
            case PAGE_AREFUND:
                return this.renderArefundTimerLine(status, subStatus, refundStatus);
                break
            case PAGE_SALES_RETURN:
                return this.renderReturnSalesTimerLine(status, subStatus, refundStatus);
                break
            case PAGE_EXCHANGE:
                return this.renderExchangeTimerLine(status, subStatus, refundStatus);
                break
            default:
                break;

        }

    }
    /**
     *  退款
     */
    renderArefundTimerLine(status,subStatus,refundStatus) {
        switch (status) {
            case STATUS_IN_REVIEW:
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(3,'待平台审核','')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','完成退款')}
                    </View>
                )
                break

            // 待寄回
            // 待仓库确认
            // 待平台处理  这种状态退款情况是不存在
            case STATUS_SUCCESS:
                //订单状态的成功,获取退款是否成功
                if (isRefundFail(refundStatus)){
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','退款失败')}
                        </View>
                    )
                }

                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','完成退款')}
                    </View>
                )
                break
            case STATUS_FAIL://售后关闭
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','售后关闭','yellow')}
                    </View>
                )
                break
            default:
                break;
        }
    }

    /**
     *  退货
     */
    renderReturnSalesTimerLine(status, subStatus) {
        switch (status) {
            case STATUS_IN_REVIEW:
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(3,'待平台审核','')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','寄回商品')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','完成退款')}
                    </View>
                )
                break
            case STATUS_SEND_BACK://待寄回
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','完成退款')}
                    </View>
                )
                break
            case STATUS_WAREHOUSE_CONFIRMED://待仓库确认
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={[styles.solidLine, {flex: 2}]}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(3,'待平台审核','')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','完成退款')}
                    </View>
                )
                break
            case STATUS_PLATFORM_PROCESSING://待平台处理
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','平台确认')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','完成退款')}
                    </View>
                )
                break
            case STATUS_SUCCESS:
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','平台确认')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','完成退款')}
                    </View>
                )
                break
            case STATUS_FAIL://售后关闭
                if (subStatus === REFUSE_REVOKED || subStatus === REFUSE_APPLY) {
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={[styles.solidLine, {borderColor: 'yellow'}]}/>
                            {this.renderItem(1,'','售后关闭', 'yellow')}
                        </View>
                    )
                }

                if (subStatus === REFUSE_OVERTIME || subStatus === REFUSE_AFTER) {
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','寄回商品')}
                            <View style={[styles.solidLine, {borderColor: 'yellow'}]}/>
                            {this.renderItem(1,'','售后关闭', 'yellow')}
                        </View>
                    )
                }
                break
            default:
                break;
        }
    }

    /**
     *  换货
     */
    renderExchangeTimerLine(status, subStatus) {
        switch (status) {
            case STATUS_IN_REVIEW:
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(3,'待平台审核','')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','寄回商品')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','完成换货')}
                    </View>
                )
                break
            case STATUS_SEND_BACK://待寄回
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','完成换货')}
                    </View>
                )
                break
            case STATUS_WAREHOUSE_CONFIRMED://待仓库确认
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={[styles.solidLine, {flex: 2}]}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(3,'待平台审核','')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','平台确认')}
                        <View style={[styles.dashedLine, {flex: 2}]}/>
                        {this.renderItem(2,'','完成换货')}
                    </View>
                )
                break
            case STATUS_PLATFORM_PROCESSING://待平台处理
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','平台确认')}
                        <View style={styles.dashedLine}/>
                        {this.renderItem(2,'','完成换货')}
                    </View>
                )
                break
            case STATUS_SUCCESS:
                return(
                    <View style={styles.timerLine}>
                        {this.renderItem(1,'','填写申请')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','寄回商品')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','平台确认')}
                        <View style={styles.solidLine}/>
                        {this.renderItem(1,'','完成换货')}
                    </View>
                )
                break
            case STATUS_FAIL://售后关闭
                if (subStatus === REFUSE_REVOKED || subStatus === REFUSE_APPLY) {
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','待平台审核')}
                            <View style={[styles.solidLine, {borderColor: 'yellow'}]}/>
                            {this.renderItem(1,'','售后关闭', 'yellow')}
                        </View>
                    )
                }

                if (subStatus === REFUSE_OVERTIME) {
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','待平台审核')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','寄回商品')}
                            <View style={[styles.solidLine, {borderColor: 'yellow'}]}/>
                            {this.renderItem(1,'','售后关闭', 'yellow')}
                        </View>
                    )
                }
                if (subStatus === REFUSE_AFTER) {
                    return(
                        <View style={styles.timerLine}>
                            {this.renderItem(1,'','填写申请')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','寄回商品')}
                            <View style={styles.solidLine}/>
                            {this.renderItem(1,'','平台确认')}
                            <View style={[styles.solidLine, {borderColor: 'yellow'}]}/>
                            {this.renderItem(1,'','换货失败', 'yellow')}
                        </View>
                    )
                }
                break
            default:
                break;
        }
    }

    // type: 1、实心的圆 2、空心的圆 3、三角型
    renderItem(type = 1, topText = '', bottomText = '', color = 'white'){
        let width = type === 3 ? 6: 10;
        let middleView = () => {};
        if (type === 1){
            middleView = () => {return(
                <View style={{height:10 ,width:10 ,backgroundColor: color, borderRadius: 5, overflow: 'hidden'}}>
                </View>
            )};
        } else if (type === 2){
            middleView = () => {return(
                <View style={{height:10 ,width:10 ,borderColor: color, borderRadius: 5, overflow: 'hidden', borderWidth: 1}}>
                </View>
            )};

        }else if (type === 3){
            middleView = () => {return(
                <UIImage source={white_triangular} style={{height:8 ,width:8 }}/>
            )};

        }
        return (
            <View style={{height: 55, width, alignItems: 'center'}}>
                <MRText style={{width: 88, height: 20, textAlign:'center', fontSize: autoSizeWidth(11), color: color}}>
                    {topText}
                </MRText>
                <View style={{flex: 1}}/>
                {middleView()}
                <View style={{flex: 1}}/>
                <MRText style={{width: 88, height: 20, textAlign:'center', fontSize: autoSizeWidth(11), color: color}}>
                    {bottomText}
                </MRText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: autoSizeWidth(152),
        width: autoSizeWidth(375),
        justifyContent: 'flex-end',
    },
    timerLine: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    solidLine: {
        flex: 1,
        height:0,
        borderWidth:0.5,
        borderColor: 'white'
    },
    dashedLine: {
        flex: 1,
        height:0,
        borderWidth:0.5,
        borderColor: 'white',
        borderStyle:'dashed'
    }
});
