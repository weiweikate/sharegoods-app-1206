/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/19.
 *
 */

"use strict";
import React from "react";
import {
    StyleSheet,
    View
} from "react-native";
import BasePage from "../../../BasePage";
import UIText from "../../../comm/components/UIText";
import ScreenUtils from "../../../utils/ScreenUtils";

const { px2dp } = ScreenUtils;

const rules = ["每天可签到一次", "连续签到秀豆会叠加一个数量", "如果签到中途断了，只能重新开始签到累计", "签到的秀豆没有时效性"];
type Props = {};
export default class SignRulePage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: "签到规则",
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

    /****************************viewPart************************************/

    _rulesRender() {
        let rulesView = rules.map((item, index) => {
            let line = index !== rules.length - 1 ? <View style={styles.lineStyle}/> : null;
            return (
                <View style={styles.itemWrapper}>
                    <View style={styles.itemLeftWrapper}>
                        <View style={styles.countWrapper}>
                            <UIText value={index} style={styles.countTextStyle}/>
                        </View>
                        {line}
                    </View>
                    <UIText value={item} style={styles.ruleTextStyle}/>
                </View>
            );
        });

        return (
            <View style={styles.rulesWrapper}>
                {rulesView}
            </View>
        );

    }

    _render() {
        return (
            <View style={styles.container}>
                <UIText value={"签到规则说明"} style={styles.titleStyle}/>
                {this._rulesRender()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7"
    },
    titleStyle: {
        color: "#000000",
        fontSize: px2dp(17),
        alignSelf: "center",
        marginTop: px2dp(40)
    },
    countTextStyle: {
        fontSize: px2dp(12),
        color: "white"
    },
    countWrapper: {
        width: px2dp(18),
        height: px2dp(18),
        borderRadius: px2dp(9),
        backgroundColor: "#D51243",
        justifyContent: "center",
        alignItems: "center"
    },
    lineStyle: {
        backgroundColor: "#D51243",
        height: px2dp(32),
        width: px2dp(2)
    },
    itemWrapper: {
        flexDirection: "row"
    },
    itemLeftWrapper: {
        alignItems: "center"
    },
    ruleTextStyle: {
        color: "#222222",
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
    },
    rulesWrapper: {
        marginTop: px2dp(30),
        marginHorizontal: px2dp(30)
    }


});
