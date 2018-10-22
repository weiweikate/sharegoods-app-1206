/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/18.
 *
 */
"use strict";
import React from "react";
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";

const { px2dp } = ScreenUtils;

type Props = {};
export default class UserPromotionPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: "我的推广订单",
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


    /**************************viewpart********************************/

    _itemRender() {
        return (
            <View style={{ backgroundColor: "white", marginBottom: px2dp(10) }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: px2dp(15),
                    borderBottomColor: "#DDDDDD",
                    borderBottomWidth: px2dp(0.5)
                }}>
                    <View style={styles.itemInfoWrapper}>
                        <Text style={styles.blackTextStyle}>
                            50元推广试用套餐
                        </Text>
                        <Text style={styles.grayTextStyle}>
                            剩余推广金额￥20.03
                        </Text>
                    </View>
                    <TouchableWithoutFeedback>
                        <View style={styles.grayButtonWrapper}>
                            <Text style={styles.grayTextStyle}>
                                推广详情
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.bottomTextWrapper}>
                    <Text style={styles.bottomTextStyle}>
                        购买时间：2018-09-18 10:38:56
                    </Text>
                </View>
            </View>
        );
    }

    _bottomButtonRender() {
        return (
            <TouchableWithoutFeedback onPress={() => alert("a")}>
                <View style={styles.bottomButtonWrapper}>
                    <Text style={styles.bottomButtonTextStyle}>
                        发起邀请推广
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _render() {
        return (
            <View style={styles.container}>
                {this._itemRender()}
                {this._itemRender()}
                {this._bottomButtonRender()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        paddingTop: px2dp(10),
        paddingBottom: px2dp(48)
    },
    grayButtonWrapper: {
        borderColor: "#DDDDDD",
        borderWidth: px2dp(0.5),
        borderRadius: px2dp(5),
        width: px2dp(80),
        height: px2dp(35),
        justifyContent: "center",
        alignItems: "center"
    },
    redButtonWrapper: {
        borderColor: "#D51243",
        borderWidth: px2dp(1),
        borderRadius: px2dp(5),
        width: px2dp(80),
        height: px2dp(35),
        justifyContent: "center",
        alignItems: "center"
    },
    itemInfoWrapper: {
        justifyContent: "space-between",
        height: px2dp(67),
        paddingVertical: px2dp(15)
    },
    blackTextStyle: {
        color: "#222222",
        fontSize: px2dp(16)
    },
    grayTextStyle: {
        color: "#999999",
        fontSize: px2dp(13)
    },
    bottomTextWrapper: {
        height: px2dp(33),
        justifyContent: "center",
        paddingHorizontal: px2dp(15)
    },
    bottomTextStyle: {
        color: "#999999",
        fontSize: px2dp(13)
    },
    bottomButtonWrapper: {
        height: px2dp(48),
        width: ScreenUtils.width,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        bottom: 0,
        backgroundColor: "#D51243"
    },
    bottomButtonTextStyle: {
        color: "white",
        fontSize: px2dp(13)
    }


});
