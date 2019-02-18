/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/16.
 *
 */
"use strict";

import React from "react";

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback, Text,
} from "react-native";

import {
    UIText,
} from "../../../components/ui";
import UIImage from "@mr/image-placeholder";
import DesignRule from '../../../constants/DesignRule';

export default class GoodsGrayItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    render() {
        let { uri, goodsName, salePrice, category, goodsNum, onPress,} = this.props;
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, this.props.style]}>
                    <UIImage source={{ uri: uri }} style={styles.image}/>
                    <View style={{ marginHorizontal: 10, flex: 1, height: 100 }}>
                        <View style={{ flexDirection: "row", marginTop: 0 }}>
                            <View style={{ flex: 1, flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                                <Text style={[styles.title]} numberOfLines={2}>{goodsName}</Text>
                            </View>
                            <UIText value={salePrice} style={[styles.title, { marginRight: 4 }]}/>
                        </View>
                        <View style={{ marginTop: 20, marginRight: 5, flexDirection: "row" }}>
                            <UIText value={category}
                                    style={[styles.detail, { flex: 1, textAlign: "left", marginRight: 10 }]}/>
                            <UIText value={"x" + goodsNum} style={styles.detail}/>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: DesignRule.bgColor,
        flexDirection: "row",
        alignItems: "center"
    },
    image: {
        height: 80,
        width: 80,
        marginLeft: 15
    },
    title: {
        marginTop: 10,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: 13,
        color: DesignRule.textColor_instruction,
        textAlign: "right"
    }
});
