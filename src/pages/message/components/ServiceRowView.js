import React, { Component } from "react";

import {
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import {
    UIText
} from "../../../components/ui";
import DesignRule from "../../../constants/DesignRule";
import ScreenUtils from "../../../utils/ScreenUtils";
import res from "../res";

const { px2dp } = ScreenUtils;
const {
    button: {
        arrow_right_black: arrow_right
    }
} = res;
export default class ServiceRowView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { item, index ,beginChat} = this.props;
        return (
            <View key={index} style={{ width: ScreenUtils.width, height: 50, marginTop: 11 }}>
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: DesignRule.margin_page,
                    backgroundColor: "white",
                    flexDirection: "row"
                }} onPress={() => {
                    beginChat(item);
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <Image uri={item.avatarImageUrlString} style={{
                            height: px2dp(35),
                            width: px2dp(35),
                            backgroundColor: DesignRule.lineColor_inColorBg,
                            borderRadius: px2dp(17)
                        }} resizeMode={"contain"}/>

                        {
                            item.unreadCount>0?
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 3.5,
                                        backgroundColor: DesignRule.mainColor,
                                        borderWidth: 1,
                                        borderColor: DesignRule.color_fff,
                                        position: "absolute",
                                        left: 30,
                                        top: 18
                                    }}
                                />:
                                null
                        }

                        <View style={{ flex: 1 }}>
                            <UIText value={item.sessionName}
                                    numberOfLines={1}
                                    style={[{
                                fontSize: DesignRule.fontSize_secondTitle,
                                marginLeft: DesignRule.margin_page,
                                color: DesignRule.textColor_mainTitle,
                                marginTop: 15
                            }]}/>


                            <UIText value={item.lastMessageText}
                                    numberOfLines={1}
                                    style={{
                                fontSize: DesignRule.fontSize_24,
                                marginLeft: DesignRule.margin_page,
                                color: DesignRule.textColor_instruction,
                                height: 40

                            }}/>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", width: 50 }}>
                        <UIText
                            value={
                                this.format(item.lastMessageTimeStamp)
                            }
                            style={{ fontSize: 12, color: DesignRule.textColor_placeholder }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    add0 = (m) => {
        return m < 10 ? "0" + m : m;
    };
    format = (shijianchuo) => {
        let time = new Date(shijianchuo);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();

         let currentTime = new Date();
         let currentY = currentTime.getFullYear();
         let currentM = currentTime.getMonth();
         let currentD = currentTime.getDate();
         let currentH = currentTime.getHours();
         let currentMM = currentTime.getMinutes()

         if (y === currentY && m === currentM && d === currentD){
             if (h === currentH){
                 return currentMM - mm + '分钟前';
             } else {
                 return currentH - h + '小时前';
             }
         } else {
             return ("" + y).substr(y.length - 2, 2) + "/" + this.add0(m) + "/" + this.add0(d);
         }
    };

}
