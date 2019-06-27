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
    View,
    TouchableOpacity,
    NativeModules,
    Image
} from "react-native";

import {
    MRText as Text,
} from "../../../../components/ui";
import DesignRule from '../../../../constants/DesignRule';
import res from "../../res";
import BusinessUtils from "../../../mine/components/BusinessUtils";
import orderApi from '../../api/orderApi';
// import QYChatUtil from "../../../mine/page/helper/QYChatModel";
import { track, trackEvent } from '../../../../utils/SensorsTrack';
import { beginChatType, QYChatTool } from '../../../../utils/QYModule/QYChatTool';
import bridge from '../../../../utils/bridge';
import ScreenUtils from '../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';

const  icon_kefu = res.button.icon_kefu;

export default class CustomerServiceView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.data=null;
    }

    /** 打电话*/
    callPhone = () => {
        track(trackEvent.ClickPhoneCustomerService, {customerServiceModuleSource: 4});
        if ("400-9696-365") {
            BusinessUtils.callPhone("4009696365");
        } else {
            NativeModules.commModule.toast("电话号码不存在");
        }
    };
    /** 七鱼客服*/
    contactSeller = () => {
        let pageData = this.props.pageData;
        track(trackEvent.ClickOnlineCustomerService, {customerServiceModuleSource: 4});
        let supplierCode = pageData.supplierCode	|| '';
        if (this.data){
            QYChatTool.beginQYChat({
                routePath: '',
                urlString: '',
                title: this.data.title,
                shopId:this.data.shopId,
                chatType: beginChatType.BEGIN_FROM_ORDER,
                data: {
                    title: pageData.warehouseOrderNo,
                    desc: pageData.productName,
                    pictureUrlString: pageData.specImg,
                    urlString:'',
                    note:'',
                }}
            )
        } else {
            orderApi.getProductShopInfoBySupplierCode({ supplierCode }).then((data) => {
                    this.data = data.data;
                    QYChatTool.beginQYChat({
                            routePath: '',
                            urlString: '',
                            title: this.data.title,
                            shopId: this.data.shopId,
                            chatType: beginChatType.BEGIN_FROM_ORDER,
                            data: {
                                title: pageData.warehouseOrderNo,
                                desc: pageData.productName,
                                pictureUrlString: pageData.specImg,
                                urlString: '',
                                note: '',
                            }
                        }
                    )
                }
            ).catch((e) => {
                bridge.$toast(e.msg)
            })
        }
    };

    render() {

        return (
                <View style={{alignItems: 'center', paddingBottom: ScreenUtils.safeBottom, marginTop: 20}}>
                    <View style={{
                        width: ScreenUtils.width,
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                    }}>

                        <TouchableOpacity style={{
                            height:  ScreenUtils.autoSizeWidth(40),
                            borderRadius:  ScreenUtils.autoSizeWidth(20),
                            overflow: 'hidden'
                        }}
                                     onPress={() => this.contactSeller()}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            TouchableOpacity   colors={['#FC5D39', '#FF0050']}
                                            style={{ alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                flex: 1}}
                            >
                                <Image source={icon_kefu} style={{ height: 23, width: 23 }} resizeMode={"contain"}/>

                                <Text style={{
                                    fontFamily: "PingFangSC-Regular",
                                    fontSize: 13,
                                    color: 'white',
                                    marginLeft: 4
                                }} allowFontScaling={false}>在线客服</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 10, color: DesignRule.textColor_secondTitle, marginVertical: 5}}>服务时间：9:00-22:00</Text>
                </View>
        );
    }
}
