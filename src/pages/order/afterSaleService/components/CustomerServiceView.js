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


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    NativeModules
} from 'react-native';

import {
    UIText,
    UIImage
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import BusinessUtils from '../../../mine/components/BusinessUtils';
// import QYChatUtil from "../../../mine/page/helper/QYChatModel";
import { track, trackEvent } from '../../../../utils/SensorsTrack';
import {  QYChatTool } from '../../../../utils/QYModule/QYChatTool';

const {
    afterSaleService: {
        applyRefundMessage,
        applyRefundPhone
    }
} = res;

export default class CustomerServiceView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    /** 打电话*/
    callPhone = () => {
        track(trackEvent.ClickPhoneCustomerService, {customerServiceModuleSource: 4});
        if ('400-9696-365') {
            BusinessUtils.callPhone('4009696365');
        } else {
            NativeModules.commModule.toast('电话号码不存在');
        }
    };
    /** 七鱼客服*/
    contactSeller = () => {
        track(trackEvent.ClickOnlineCustomerService, {customerServiceModuleSource: 4});
         //QYChatUtil.qiYUChat();
        // QYChatTool.beginQYChat({
        //     routePath: '',
        //     urlString: '',
        //     title: '平台客服',
        //     shopId: '',
        //     chatType: beginChatType.BEGIN_FROM_ORDER,
        //     data: {
        //
        //     }
        // })
        QYChatTool.beginQYChat();
    };

    render() {
        let data = [
            {
                name: '在线客服',
                image: applyRefundMessage,
                time: '9:00-22:00',
                onPress: this.contactSeller
            },
            {
                name: '客服电话',
                image: applyRefundPhone,
                time: '9:00-22:00',
                onPress: this.callPhone
            }
        ];
        return (
            <View style={styles.container}>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={item.onPress}
                            key={index}>
                            <UIImage
                                source={item.image}
                                style={styles.image}/>
                            <View>
                                <UIText
                                    value={item.name}
                                    style={styles.name}/>
                                <UIText
                                    value={item.time}
                                    style={styles.time}/>
                            </View>
                        </TouchableOpacity>
                    );
                })}
                <View style={styles.line}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: DesignRule.white,
        flexDirection: 'row',
        height: DesignRule.autoSizeWidth(70),
        marginBottom: DesignRule.safeBottom
    },
    button: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    image: {
        marginLeft: DesignRule.autoSizeWidth(40),
        marginRight: DesignRule.autoSizeWidth(7),
        height: DesignRule.autoSizeWidth(25),
        width: DesignRule.autoSizeWidth(25)
    },
    name: {
        fontSize: DesignRule.fontSize_secondTitle,
        color: DesignRule.textColor_mainTitle
    },
    time: {
        fontSize: DesignRule.fontSize_24,
        color: DesignRule.textColor_placeholder,
        marginTop: DesignRule.autoSizeWidth(4)
    },
    line: {
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        width: DesignRule.lineHeight,
        height: DesignRule.autoSizeWidth(30),
        position: 'absolute',
        top: DesignRule.autoSizeWidth(20),
        left: DesignRule.width / 2
    }
});
