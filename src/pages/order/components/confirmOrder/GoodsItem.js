import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
    UIText, MRText as Text
} from "../../../../components/ui";
import UIImage from "@mr/image-placeholder";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
function _renderTips(tips){
    if (tips&&tips.length>0 ) {
        return(
            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginLeft: 10}}>
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
const GoodsItem = props => {
    let {
        uri = "",
        goodsName = "",
        salePrice = "",
        // originalPrice='',
        category = "",
        goodsNum = "",
        onPress,
        activityCodes = []
    } = props;
    if (salePrice && salePrice.length > 0 && salePrice.indexOf('¥') !== -1){
        salePrice = salePrice.slice(1);
    }
    // MIAO_SHA(10, "新秒杀"),
    //     TAO_CAN(20, "套餐"),
    //     ZHI_JIANG(30, "直降"),
    //     MAN_JIAN(40, "满减"),
    //     MAN_ZHE(50, "满折"),
    let tips = [];
    let datas = ["秒杀", "降价拍", "升级礼包", "普通礼包", "经验专区"];
    if (activityCodes){
        activityCodes.forEach((item)=> {
            let types = item && item.orderType || 0;
            if (0<types && types<6) {
                tips.push(datas[types-1]);
            }
            if (types === 10){
                tips.push('秒杀');
            }
            if (types === 20){
                tips.push('套餐');
            }
            if (types === 30){
                tips.push('直降');
            }
            if (types === 40){
                tips.push('满减');
            }
            if (types === 50){
                tips.push('满折');
            }
        })
    }


    return (
        <TouchableOpacity style={{
            flexDirection: "row",
            minHeight: 100,
            paddingVertical: 10,
            width: ScreenUtils.width,
            backgroundColor: "white"
        }} onPress={() => onPress()}>
            <View style={{ height: 80, width: 80, marginLeft: 15 }}>
                <UIImage style={{ height: 80, width: 80 }} source={{ uri: uri }}/>
            </View>
            <View style={{ justifyContent: "space-between", flex: 1 }}>
                <View style={{ height: 30, justifyContent: "center" }}>
                    <Text style={{
                        flexWrap: "wrap",
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 13,
                        marginLeft: 10,
                    }} numberOfLines={2} allowFontScaling={false}>{goodsName}</Text>
                </View>
                <View style={{
                    marginTop: 5,
                    marginLeft: 10,
                    marginRight: 20,
                    flexDirection: "row",
                    justifyContent: "space-between" }}>
                    <UIText value={`${category}`}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginRight: 20 }}/>
                    <UIText value={goodsNum} style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                </View>
                { _renderTips(tips)}
                <View style={{
                    marginLeft: 10,
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: 'flex-end'
                }}>
                    <Text style={{ color: DesignRule.mainColor, fontSize: 18, fontWeight: '600' }}>
                        <Text style={{ color: DesignRule.mainColor, fontSize: 13 ,marginBottom: 3}}>
                            {'¥'}
                        </Text>
                        {salePrice}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default GoodsItem;
