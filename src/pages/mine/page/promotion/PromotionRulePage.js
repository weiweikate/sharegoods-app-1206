/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/22.
 *
 */
"use strict";
import React from "react";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from 'DesignRule';

const { px2dp, } = ScreenUtils;

type Props = {};
const rules = '重要提示：\n' +
    '财付通支付科技有限公司（以下简称“本公司”）依据本协议为用户（以下简称“你”）提供微信支付服务。本协议对你和本公司均具有法律约束力。\n' +
    '在使用微信支付服务前，你应当阅读并遵守本协议和《财付通服务协议》。由于微信支付服务是本公司依托微信及微信公众平台提供的服务，你在使用本服务时，还需使用微信软件服务，所以你应阅读并遵守《腾讯微信软件许可及服务协议》，若你需要使用微信公众平台服务，你还应阅读并遵守《微信公众平台服务协议》。本公司在此特别提醒你认真阅读并充分理解前述协议各条款，特别是免除或限制本公司的责任、限制你的权利、规定争议解决方式的相关条款。请你审慎阅读并选择是否接受前述协议，如你对本协议有任何疑问，应向客服咨询。\n' +
    '一、【本服务】\n' +
    '1.1 微信支付服务，指本公司依托微信及微信公众平台为收付款人之间提供的货币资金转移服务。（下称“本服务”）';

export default class PromotionRulePage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: "推广说明",
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <Text style={styles.headerTextStyle}>
                        什么是任务推广？
                    </Text>
                </View>
                <View style={styles.rulesWrapper}>
                    <Text style={styles.rulesTextStyle}>
                        {rules}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:DesignRule.white
    },
    headerWrapper: {
        justifyContent: "center",
        alignItems: "center",
        height:px2dp(75)
    },
    headerTextStyle:{
        color:'#333333',
        fontSize:px2dp(16)
    },
    rulesWrapper:{
        padding:px2dp(15)
    },
    rulesTextStyle:{
        color:'#222222',
        fontSize:px2dp(12)
    }
});
