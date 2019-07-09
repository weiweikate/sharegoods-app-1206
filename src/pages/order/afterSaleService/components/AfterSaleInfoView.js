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
    View,
    TouchableOpacity, Clipboard
} from 'react-native';
import {
    UIText,
    MRText
} from "../../../../components/ui";
import DesignRule from '../../../../constants/DesignRule';
import EmptyUtils from "../../../../utils/EmptyUtils";
import ImageLoader from '@mr/image-placeholder';
import { PageType } from '../AfterType';
import DateUtils from '../../../../utils/DateUtils';
import bridge from '../../../../utils/bridge';
import { routePush } from '../../../../navigation/RouterMap';
import RouterMap from '../../../../navigation/RouterMap';
const {
    PAGE_AREFUND,
    PAGE_EXCHANGE
} = PageType;


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
                    <TouchableOpacity onPress={()=> {this.imgClick(imgList,i)}}>
                        <ImageLoader source={{ uri: imgList[i] }}
                                     style={{
                                         height: 83,
                                         width: 83,
                                         marginLeft: 15,
                                         marginTop: 10
                                     }}/>
                    </TouchableOpacity>
                );
            }
        }
        return arr;
    };

    render() {
        let { afterSaleInfo, pageType } = this.props;

        if (EmptyUtils.isEmpty(afterSaleInfo) === true) {
            return null;
        }

        let strRefundPrice = '退款金额：¥' +  (afterSaleInfo.refundPrice || "");
        let strNum =  '申请数量：' + (afterSaleInfo.quantity || "");
        return (
            <View style={{ backgroundColor: "white" , marginBottom: 10}}>
                <View style={{
                    height: 1,
                    backgroundColor: DesignRule.lineColor_inColorBg
                }}/>
                <UIText value={"申请售后原因：" + afterSaleInfo.reason}
                        style={styles.refundReason}/>
                {
                    pageType !== PAGE_AREFUND?  <UIText value={strNum}
                                                        style={styles.refundReason}/> :null
                }
                {
                    pageType !== PAGE_EXCHANGE?  <UIText value={strRefundPrice}
                                                         style={styles.refundReason}/> :null
                }

                <UIText value={ ['退款','退货','换货'][pageType - 1] + "说明：" + (afterSaleInfo.description || "")}
                        style={styles.refundReason}/>
                <UIText value={"申请时间：" + DateUtils.formatDate(afterSaleInfo.createTime|| '')}
                        style={styles.refundReason}/>
                <View style={{flexDirection: 'row'}}>
                    <UIText value={"订单号：" + afterSaleInfo.merchantOrderNo}
                            style={styles.refundReason}/>
                    <TouchableOpacity style={styles.copyBtn}
                                      onPress={()=>{this.copyText(afterSaleInfo.merchantOrderNo)}}>
                        <MRText style={styles.copyBtnText}>复制</MRText>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <UIText value={"申请单号：" + afterSaleInfo.serviceNo}
                            style={styles.refundReason}/>
                    <TouchableOpacity style={styles.copyBtn}
                                      onPress={()=>{this.copyText(afterSaleInfo.serviceNo)}}>
                        <MRText style={styles.copyBtnText}>复制</MRText>
                    </TouchableOpacity>
                </View>
                <UIText value={"凭证图片："}
                        style={styles.refundReason}/>
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingRight: 15,
                    marginBottom: 15
                }}>

                    {this.renderCertificateImage(afterSaleInfo.imgList)}

                </View>
            </View>
        );
    }

    copyText(str){
        if (str){
            Clipboard.setString(str);
            bridge.$toast('复制成功')
        }
    }

    imgClick(imageUrls, index){
        routePush(RouterMap.CheckBigImagesView,{imageUrls, index})
    }
}

const styles = StyleSheet.create({
    refundReason: {
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        marginLeft: 17,
        marginTop: 10
    },
    copyBtn: {
        marginTop: 9,
        justifyContent: 'center',
        width: 40,
        marginLeft: 10
    },
    copyBtnText: {
        fontSize: 12,
        color: DesignRule.mainColor,
    }
});
