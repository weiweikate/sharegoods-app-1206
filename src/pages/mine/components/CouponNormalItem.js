import React, { Component } from "react";
import {
    ImageBackground,
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import {   MRText as Text,UIText} from "../../../components/ui";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import res from "../res";
const { px2dp } = ScreenUtils;
const unUsedBg = res.couponsImg.youhuiquan_bg_unUsedBg;
const usedBg = res.couponsImg.youhuiquan_bg_usedBg;


export default class CouponNormalItem extends Component{


    render(){
        let {item,index}=this.props;
        return(
            <TouchableOpacity style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5 }}
                              onPress={() => this.props.clickItem(index, item)}>
                <ImageBackground style={{
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(94),
                    margin: 2
                }} source={item.status == 0 ? (item.levelimit ? usedBg : unUsedBg) : usedBg} resizeMode='stretch'>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.itemFirStyle}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {
                                    item.type === 3 || item.type === 4 ||  item.type === 5 || item.type === 12 ? null :
                                        <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                                    marginBottom: 4
                                                }} allowFontScaling={false}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: item.type === 4 ? 20 : (item.value && item.value.length < 3 ? 33 : 26),
                                        color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                    }} allowFontScaling={false}>{item.value}</Text>
                                </View>
                                {
                                    item.type === 3 ?
                                        <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                                    marginBottom: 4
                                                }} allowFontScaling={false}>折</Text>
                                        </View> : null}
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            alignItems: "flex-start",
                            marginLeft: 10,
                            justifyContent: "center",
                            height: px2dp(94)
                        }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: DesignRule.textColor_mainTitle,
                                    marginRight: 10
                                }} allowFontScaling={false}>
                                    {item.name}{item.type !== 99 ? null : <UIText value={"（可叠加使用）"} style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_instruction
                                }}/>}</Text>
                                {item.type === 12 ? <UIText value={"x" + item.number} style={{
                                    fontSize: 15,
                                    color: DesignRule.textColor_mainTitle
                                }}/> : null}
                            </View>
                            {item.timeStr?<Text style={{
                                fontSize: 11,
                                color: DesignRule.textColor_instruction,
                                marginTop: 6
                            }} allowFontScaling={false}>{item.timeStr}</Text>:null}
                            <UIText style={{ fontSize: 11, color: DesignRule.textColor_instruction, marginTop: 6 }}
                                    value={item.limit}/>
                        </View>
                        {item.status === 0 ? (item.levelimit ?
                            <View style={{ marginRight: 15, justifyContent: "center", alignItems: "center" }}>
                                {item.count > 1 ? <UIText value={"x" + item.count}
                                                          style={styles.xNumsStyle}/> : null}
                                <UIText value={"等级受限"}
                                        style={{
                                            fontSize: 13,
                                            color: DesignRule.textColor_instruction,
                                            marginRight: 15
                                        }}/>
                            </View> : (item.count>1?<UIText value={"x" + item.count}
                                                            style={styles.xNumsStyle}/>:null)) :
                            <View style={{ marginRight: 15, justifyContent: "center", alignItems: "center" }}>
                                {item.count > 1 ? <UIText value={"x" + item.count}
                                                          style={styles.xNumsStyle}/> : null}
                                <UIText value={`${item.status === 1 ? "已使用" : (item.status === 2 ? "已失效" : "待激活")}`}
                                        style={{
                                            fontSize: 13,
                                            color: DesignRule.textColor_instruction,
                                            marginRight: 15
                                        }}/>
                            </View>}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    xNumsStyle: {
        marginRight: 15,
        marginBottom: 5,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle_222
    },
    itemFirStyle: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        width: px2dp(80)
    },
})
