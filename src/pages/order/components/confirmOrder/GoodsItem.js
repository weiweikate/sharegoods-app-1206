import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
    UIText, MRText as Text
} from "../../../../components/ui";
import UIImage from "@mr/image-placeholder";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "DesignRule";

const GoodsItem = props => {
    const {
        uri = "",
        goodsName = "",
        salePrice = "",
        // originalPrice='',
        category = "",
        goodsNum = "",
        onPress
    } = props;

    return (
        <TouchableOpacity style={{
            flexDirection: "row",
            height: 100,
            alignItems: "center",
            width: ScreenUtils.width,
            backgroundColor: "white"
        }} onPress={() => onPress()}>
            <View style={{ height: 80, width: 80, marginLeft: 15 }}>
                <UIImage style={{ height: 80, width: 80 }} source={{ uri: uri }}/>
            </View>
            <View style={{ justifyContent: "space-between", height: 80, flex: 1 }}>
                <View style={{ height: 30, justifyContent: "center" }}>
                    <Text style={{
                        flexWrap: "wrap",
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 13,
                        marginLeft: 10,
                        marginRight: 20
                    }} numberOfLines={2} allowFontScaling={false}>{goodsName}</Text>
                </View>
                <View style={{ marginTop: 5, marginLeft: 10 }}>
                    <UIText value={`规格: ${category}`}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                </View>
                <View style={{
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>

                    <UIText value={salePrice} style={{ color: DesignRule.mainColor, fontSize: 13 }}/>

                    <UIText value={goodsNum} style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>

                </View>
            </View>
        </TouchableOpacity>
    );
};


export default GoodsItem;
