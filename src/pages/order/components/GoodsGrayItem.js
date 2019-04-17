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
    TouchableWithoutFeedback
} from "react-native";

import {
    UIText,
    MRText as Text
} from "../../../components/ui";
import UIImage from "@mr/image-placeholder";
import DesignRule from "../../../constants/DesignRule";

export default class GoodsGrayItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    _renderTips(tips){
        if (tips&&tips.length>0 ) {
            return(
                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginBottom: 10}}>
                    {
                        tips.map((item) => {
                            return(
                                <Text style={{
                                    fontSize: 10,
                                    marginRight: 6,
                                    paddingHorizontal: 3,
                                    paddingVertical: 3,
                                    color: DesignRule.mainColor,
                                    marginVertical: 2.5,
                                    backgroundColor: 'rgba(255,0,80,0.1)'
                                }}>
                                    {item}
                                </Text>
                            )
                        })
                    }
                </View>
            )
        }

        return null;
    }

    render() {
        let { uri, goodsName, salePrice, category, goodsNum, onPress } = this.props;
        // let types = activityCodes && activityCodes[0].orderType || 0;
        // const datas = ["", "秒杀", "降价拍", "升级礼包", "普通礼包", "经验专区"];
        let tips = ["秒杀","秒杀", "降价拍", "升级礼包", "普通礼包", "经验专区","秒杀", "降价拍", "升级礼包", "普通礼包", "经验专区"];

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, this.props.style]}>
                    <UIImage source={{ uri: uri }} style={styles.image}/>
                    <View style={{ marginHorizontal: 10, flex: 1, minHeight: 100 }}>
                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                            <View style={{ flex: 1, flexDirection: "row", marginRight: 10}}>
                                <Text numberOfLines={2}>
                                    <Text style={[styles.title]}>{goodsName}</Text>
                                </Text>
                            </View>
                            <UIText value={salePrice} style={[styles.title, { marginRight: 4, marginTop: 0 }]}/>
                        </View>
                        <View style={{ marginTop: 10, marginRight: 5, flexDirection: "row" }}>
                            <View style={{ flex: 1, flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                                <UIText value={category}
                                        style={[styles.detail, { textAlign: "left" }]} numberOfLines={3}/>
                            </View>
                            <UIText value={"x" + goodsNum} style={styles.detail}/>
                        </View>
                        {this._renderTips(tips)}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 100,
        backgroundColor: DesignRule.bgColor,
        flexDirection: "row",
        paddingTop: 10,
    },
    image: {
        height: 80,
        width: 80,
        marginLeft: 15,
    },
    title: {
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: 10,
        color: DesignRule.textColor_instruction,
        textAlign: "right"
    }
});
