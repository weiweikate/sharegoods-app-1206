import React, { Component } from "react";
import {
    StyleSheet,
    View,
    NativeModules,
    TouchableOpacity
} from "react-native";
import {
    UIText, MRText as Text, NoMoreClick, UIImage
} from "../../../../components/ui";
import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DateUtils from "../../../../utils/DateUtils";
import DesignRule from "../../../../constants/DesignRule";
import { orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from "mobx-react";
import {QYChatTool, beginChatType} from '../../../../utils/QYModule/QYChatTool'

const { px2dp } = ScreenUtils;
import res from '../../res'
import orderApi from '../../api/orderApi';
import bridge from '../../../../utils/bridge';
const kefu_icon = res.button.kefu_icon;

@observer
export default class OrderDetailTimeView extends Component {

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: px2dp(10), backgroundColor: DesignRule.bgColor }}/>
        );
    };

    copyOrderNumToClipboard = () => {
        StringUtils.clipboardSetString(orderDetailModel.merchantOrderNo);
        NativeModules.commModule.toast("订单号已经复制到剪切板");
    };

    concactKeFu(){
        let supplierCode = orderDetailModel.merchantOrder.merchantCode || '';
        let desc = ''
        let pictureUrlString = '';
        let num = ''
        if (orderDetailModel.productsList().length > 0){
            let item = orderDetailModel.productsList()[0];
                desc = item.productName || '';
                pictureUrlString = item.specImg || '';
                num = '共'+item.quantity +'件商品';

        }
        if (this.data){
            QYChatTool.beginQYChat({
                routePath: '',
                urlString: '',
                title:this.data.title || '',
                shopId:this.data.shopId || '',
                chatType: beginChatType.BEGIN_FROM_ORDER,
                data: {
                    title: '订单号:'+orderDetailModel.merchantOrderNo,
                    desc,
                    pictureUrlString,
                    urlString:'/'+orderDetailModel.merchantOrderNo,
                    note: num,
                }}
            )
        } else {
            orderApi.getProductShopInfoBySupplierCode({supplierCode}).then((data)=> {
                this.data = data.data;
                QYChatTool.beginQYChat({
                    routePath: '',
                    urlString: '',
                    title: this.data.title || '',
                    shopId: this.data.shopId || '',
                    chatType: beginChatType.BEGIN_FROM_ORDER,
                    data: {
                        title: orderDetailModel.merchantOrderNo,
                        desc,
                        pictureUrlString,
                        urlString:'/'+orderDetailModel.merchantOrderNo,
                        note: num,
                    }}
                )
            }).catch((e) => {
                bridge.$toast(e.msg)
            })
        }

    }

    render() {
        let {userMessage, orderTime, payTime, cancelTime,receiveTime, deliverTime, finishTime} = orderDetailModel.baseInfo
        let {subStatus, status} = orderDetailModel.merchantOrder;
        return (
            <View style={{ backgroundColor: "white", paddingTop: px2dp(10), marginTop: 10 }}>
                {userMessage&&userMessage.length > 0? <View style={{  flexDirection: "row"}}>
                    <UIText value={"订单备注："}
                            style={[styles.textGoodsDownStyle]}/>
                    <View style={{flex: 1, marginRight: 10}}>
                        <UIText value={userMessage}
                                style={[styles.textGoodsDownStyle,{marginLeft: 0}]}/>
                    </View>
                </View>: null}
                <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center",marginBottom: 10}}>
                    <UIText value={"订单编号：" + `${orderDetailModel.merchantOrderNo}`}
                            style={[styles.textGoodsDownStyle,{marginBottom: 0}]}/>
                    <NoMoreClick style={styles.clipStyle} onPress={() => this.copyOrderNumToClipboard()}>
                        <Text style={{ fontSize: px2dp(13), color: DesignRule.mainColor}}
                              allowFontScaling={false}>复制</Text>
                    </NoMoreClick>
                </View>
                <UIText
                    value={"创建时间：" + DateUtils.getFormatDate(orderTime / 1000)}
                    style={styles.textGoodsDownStyle}/>
                {StringUtils.isNoEmpty(payTime)?
                    <UIText
                        value={"付款时间：" + DateUtils.getFormatDate(payTime / 1000)}
                        style={styles.textGoodsDownStyle}/> : null}
                {status === 5 ?
                    <UIText
                        value={"关闭时间：" + DateUtils.getFormatDate(subStatus < 4 ? cancelTime / 1000 : finishTime / 1000)}
                        style={styles.textGoodsDownStyle}/> : null}
                {StringUtils.isNoEmpty(deliverTime)  ?
                    <UIText
                        value={"发货时间：" + DateUtils.getFormatDate(deliverTime / 1000)}
                        style={styles.textOrderDownStyle}/> : null }
                {receiveTime && receiveTime < (new Date()).getTime()?
                    <UIText
                        value={"完成时间：" + DateUtils.getFormatDate(receiveTime / 1000)}
                        style={styles.textOrderDownStyle}/> : null}
                <TouchableOpacity style={styles.kefuContainer}
                                  onPress={()=>{this.concactKeFu()}}
                >
                    <UIImage source={kefu_icon} style={styles.kefuIcon}/>
                    <Text style={styles.kefuText}>联系客服</Text>
                </TouchableOpacity>
                {this.renderWideLine()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textOrderDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: px2dp(10)
    },
    textGoodsDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: 10
    },
    clipStyle: {
        marginRight: px2dp(10),

    },
    couponsIconStyle: {
        width: px2dp(15),
        height: px2dp(12),
        position: "absolute",
        left: px2dp(15),
        top: px2dp(12)
    },
    couponsOuterStyle: {
        height: px2dp(34),
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: px2dp(36)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        alignSelf: "center"
    },
    couponsLineStyle: {
        marginLeft: px2dp(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: "100%"
    },
    kefuContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderTopColor: DesignRule.bgColor,
        borderTopWidth: 1
    },
    kefuIcon: {
        height: 20,
        width: 20,
        marginRight: 5
    },
    kefuText: {
        fontSize: 13,
        color: DesignRule.textColor_instruction
    }
});
