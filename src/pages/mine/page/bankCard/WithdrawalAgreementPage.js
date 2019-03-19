/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/11/30.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    WebView,
    TouchableWithoutFeedback,
    NativeModules
} from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import apiEnvironment from '../../../../api/ApiEnvironment';
import MineApi from '../../api/MineApi';

const { px2dp } = ScreenUtils;
type Props = {};
export default class WithdrawalAgreementPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '提现说明',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    _checkUserGongMallResult = () => {
        MineApi.gongmallResult().then((data) => {
            if (!data.data) {
                this._getSignUrl();
            } else {
                this.$navigate('mine/userInformation/WithdrawCashPage');
            }
        }).catch(error => {
            this.$toastShow(error.msg);
        });
    };

    _getSignUrl = () => {
        MineApi.gongmallEnter().then((data) => {
            if (data.data) {
                NativeModules.commModule.goGongmallPage(data.data).then(()=>{
                    this.$navigateBack('mine/userInformation/MyCashAccountPage');
                });
            }
        }).catch(error => {
            this.$toastShow(error.msg);
        });
    };

    _commit = () => {
        // this.$navigate('mine/userInformation/WithdrawCashPage');
        // return;
        this._checkUserGongMallResult();
        // let s = 'https://contract-qa.gongmall.com/url_contract.html?companyId=AVR3eP&positionId=RMQwyV&data=8567o/DnpfCNVY4w+XJZpKA7OWEoP1flChjbrsQazI9K7OeY2hJSk4ua05Jz5wtVcuuuafiJ+xVSjcq7V7Bu+nHTZeBTT/S2XUErK6CNko4TWjTyFlGZ0HtheXRkpTMI05uerC3UcKjlHoP1sN9Av4a6feGVnJx73bdxwH+dO6gQ0dR5zyyh53U93Riuak1dTDPBOCm419nrU6jI721Ce816vlkXP19WVWS48wInPrq6OqiAQcBBMoICrQCkWXP/'
        // NativeModules.commModule.goGongmallPage(s).then(()=>{
        //     alert();
        // });
    };


    _render() {
        return (
            <View style={styles.container}>
                <WebView source={{ uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/withdrawal.html` }}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         scalesPageToFit={true}
                         style={styles.webViewWrapper}
                         showsVerticalScrollIndicator={false}
                />
                <TouchableWithoutFeedback onPress={this._checkUserGongMallResult}>
                    <View style={styles.bottomButtonWrapper}>
                        <Text style={styles.buttonTextStyle}>
                            同意协议
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:DesignRule.white
    },
    webViewWrapper: {
        marginBottom: px2dp(16)
    },
    bottomButtonWrapper: {
        height: 50,
        width: ScreenUtils.width - px2dp(80),
        alignSelf: 'center',
        backgroundColor: DesignRule.white,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: px2dp(34),
        borderColor:DesignRule.mainColor,
        borderWidth:1
    },
    buttonTextStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_bigBtnText,
        includeFontPadding: false
    }
});
