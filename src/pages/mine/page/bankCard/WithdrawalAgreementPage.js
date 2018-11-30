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


"use strict";
import React from "react";
import {
    StyleSheet,
    View,
    WebView,
    Text
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
const {px2dp} = ScreenUtils;
type Props = {};
export default class WithdrawalAgreementPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: "提现协议查看",
        show: true// false则隐藏导航
    };


    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                <WebView source={{ uri: this.state.uri }}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         scalesPageToFit={true}
                         style={styles.webViewWrapper}
                />
                <View style={styles.bottomButtonWrapper}>
                    <Text style={styles.buttonTextStyle}>
                        同意协议
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webViewWrapper:{
        marginBottom:100
    },
    bottomButtonWrapper:{
        height:50,
        width:ScreenUtils.width - px2dp(80),
        alignSelf:'center',
        backgroundColor:DesignRule.mainColor,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonTextStyle:{
        color:DesignRule.white,
        fontSize:DesignRule.fontSize_bigBtnText,
        includeFontPadding:false
    }
});
