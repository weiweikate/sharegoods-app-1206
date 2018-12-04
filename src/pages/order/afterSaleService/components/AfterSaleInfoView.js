/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
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
    UIText,
    UIImage
} from "../../../../components/ui";
import DesignRule from "DesignRule";
import EmptyUtils from "../../../../utils/EmptyUtils";
import DateUtils from "../../../../utils/DateUtils";


export default class AfterSaleInfoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /** 图片*/
    renderCertificateImage = (imgList) => {
        let arr = [];
        imgList = imgList || '';
        imgList = imgList.split(',');
        for (let i = 0; i < imgList.length; i++) {
            if (imgList[i].length > 0){
                arr.push(
                    <UIImage source={{ uri: imgList[i] }}
                             style={{
                                 height: 83,
                                 width: 83,
                                 marginLeft: 15,
                                 marginTop: 10
                             }}/>
                );
            }
        }
        return arr;
    };

    render() {
        let { pageData, pageType } = this.props;

        if (EmptyUtils.isEmpty(pageData) === true) {
            return null;
        }

        let typeStr = ["退款", "退货", "换货"][pageType];

        return (
            <View style={{ backgroundColor: "white" }}>
                <View style={{
                    height: 1,
                    backgroundColor: DesignRule.lineColor_inColorBg
                }}/>
                <UIText value={typeStr + "原因：" + pageData.reason}
                        style={styles.refundReason}/>
                <UIText value={typeStr + "说明：" + pageData.description || ""}
                        style={styles.refundReason}/>
                <UIText value={"凭证图片："} style={styles.refundReason}/>
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingRight: 15
                }}>

                    {this.renderCertificateImage(pageData.imgList)}

                </View>
                <UIText value={"申请时间：" + DateUtils.getFormatDate(pageData.createTime / 1000)}
                        style={styles.refundReason}/>
                <UIText value={"订单编号：" + pageData.orderProductNo}
                        style={styles.refundReason}/>
                <UIText value={typeStr + "编号：" + pageData.serviceNo}
                        style={styles.refundReason}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    refundReason: {
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        marginLeft: 17,
        marginTop: 10
    }
});
