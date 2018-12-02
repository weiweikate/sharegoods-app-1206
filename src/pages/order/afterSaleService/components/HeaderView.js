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
    View
} from "react-native";

import {
    UIText, UIImage
} from "../../../../components/ui";
// import DesignRule from 'DesignRule';
import ScreenUtils from "../../../../utils/ScreenUtils";
// import DateUtils from '../../../../utils/DateUtils';
import res from "../../res";

const {
    afterSaleService: {
        exchangeGoodsDetailBg
    }
} = res;

export default class HeaderView extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }


    render() {
        let { status, pageType } = this.props;
        let titleCommpent = () => {
        };
        // let detialCommpent = () => {
        // };
        let timerCommpent = () => {
        };
        let textContaner_marginLeft = 15;
        if (pageType === 0) {//退款详情

            let titles = ["商家审核中", "*-商家同意退款", "商家拒绝退款", "*-发货中", "*-云仓库发货中", "退款成功", "已关闭", "超时关闭", "商家拒绝退款"];
            titleCommpent = () => {
                return <UIText value={titles[status - 1]} style={styles.header_title}/>;
            };
            if (status === 3) {//拒绝
                // textContaner_marginLeft = 10;
                //  imageCommpent = () => {
                //      return <UIImage source={refusa_icon} style={styles.header_image}/>;
                //  };
                // detialCommpent = () => {
                //     return <UIText value={pageData.refusalReason} style={styles.header_detail}/>;
                // };
            } else if (status === 6) {//已完成
                // detialCommpent = () => {
                //     let orderReturnAmounts = pageData.orderReturnAmounts || {};
                //     return <UIText
                //         value={DateUtils.getFormatDate(orderReturnAmounts.refundTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //         style={styles.header_detail}/>;
                // };
            } else if (status === 1) {//申请中 applyTime	Long	1539250433000
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.applyTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            }
        } else if (pageType === 1) {//退货详情
            let titles = ["商家审核中", "请退货给商家", "商家拒绝退货申请", "等待商家确认", "等待商家确认", "退货退款成功", "已关闭", "退货退款超时关闭", "商家拒绝退货"];
            titleCommpent = () => {
                return <UIText value={titles[status - 1]} style={styles.header_title}/>;
            };
            if (status === 3 || status === 9) {//拒绝
                // textContaner_marginLeft = 10;
                //  imageCommpent = () => {
                //      return <UIImage source={refusa_icon} style={styles.header_image}/>;
                //  };
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.refuseTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            } else if (status === 6) {//已完成
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.payTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            } else if (status === 1) {//申请中
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.applyTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            } else if (status === 2) {//同意申请
                timerCommpent = () => {
                    return <UIText value={this.state.timeStr} style={styles.header_detail}/>;
                };
            }
        } else if (pageType === 2) {//换货详情
            let titles = ["商家处理中", "商家已同意", "商家拒绝换货申请", "等待商家确认", "云仓库发货中", "换货完成", "已关闭", "超时关闭", "商家拒绝换货", "等待买家确认"];
            titleCommpent = () => {
                return <UIText value={titles[status - 1]} style={styles.header_title}/>;
            };
            if (status === 3 || status === 9) {//拒绝
                // textContaner_marginLeft = 10;
                //  imageCommpent = () => {
                //      return <UIImage source={refusa_icon} style={styles.header_image}/>;
                //  };
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.refuseTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            } else if (status === 6) {//已完成
                // detialCommpent = () => {
                //     return <UIText
                //         value={DateUtils.getFormatDate(pageData.backsendTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //         style={styles.header_detail}/>;
                // };
            } else if (status === 1) {//申请中 applyTime	Long	1539250433000
                // detialCommpent = () => {
                //     return <UIText value={DateUtils.getFormatDate(pageData.applyTime / 1000, 'yyyy年MM月dd日  hh:mm:ss')}
                //                    style={styles.header_detail}/>;
                // };
            } else if (status === 2) {//同意申请
                // detialCommpent = () => {
                //     return <UIText value={'7天退货，请退货给商家'} style={styles.header_detail}/>;
                // };
                timerCommpent = () => {
                    return <UIText value={this.state.timeStr} style={styles.header_detail}/>;
                };
            }
        }
        return (
            <View>
                <View style={{ position: "absolute", height: 100, width: ScreenUtils.width }}>
                    <UIImage source={exchangeGoodsDetailBg} style={{ height: 100, width: ScreenUtils.width }}/>
                </View>
                <View style={{
                    height: 100,
                    alignItems: "center",
                    flexDirection: "row",
                    width: ScreenUtils.width
                }}>
                    {/*{imageCommpent()}*/}
                    <View style={{ marginLeft: textContaner_marginLeft }}>
                        {titleCommpent()}
                        {timerCommpent()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header_title: {
        fontSize: 18,
        color: "white"
    },
    header_detail: {
        fontSize: 12,
        color: "white",
        marginTop: 3
    }
});
