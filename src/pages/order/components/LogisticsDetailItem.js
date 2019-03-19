import React from "react";
import {
    View
} from 'react-native';
import ScreenUtils from "../../../utils/ScreenUtils";
import {
    UIText
} from "../../../components/ui";
import DesignRule from '../../../constants/DesignRule';
const {px2dp} = ScreenUtils;
const LogisticsDetailItem = props => {
    const {
        time,
        title,
        content1,
        isTop,
        isBottom
    } = props;

    this.renderMiddleImage = () => {
        return (
                <UIText value={"·"} style={{ fontSize: px2dp(40), marginTop:px2dp(-20)}}/>
        );
    };
    this.renderMiddleLine = () => {
        return (!isBottom ?
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginTop: isTop ? px2dp(26) : px2dp(-19)
                }}/> :
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginTop: isTop ? px2dp(26) : px2dp(-19),
                    height: px2dp(45)
                }}/>
        );
    };
    this.renderTitle = () => {
        return (title && title !== "" ?
            <UIText value={title} style={{ fontSize: px2dp(14), color: DesignRule.textColor_mainTitle_222, marginLeft: px2dp(15) }}/>
            : null);
    };
    return (
        <View style={{marginRight:px2dp(15),marginLeft:px2dp(15),borderTopLeftRadius:isTop?px2dp(10):0,borderTopRightRadius:isTop?px2dp(10):0 ,backgroundColor:'white',
            borderBottomLeftRadius:isBottom?px2dp(10):0,borderBottomRightRadius:isBottom?px2dp(10):0,paddingBottom:px2dp(19),paddingTop:isTop?px2dp(15):0}}>
        <View style={{ flexDirection: "row",paddingLeft: px2dp(15),paddingRight:px2dp(21),}}>
            <View style={{width: px2dp(40), marginTop: px2dp(10),marginRight:px2dp(15)}}>
                <UIText value={time.substr(5,5)} style={{ fontSize: px2dp(14), color: isTop?DesignRule.textColor_mainTitle_222:DesignRule.textColor_instruction,textAlign:'right',marginRight:-1}}/>
            <UIText value={time.substr(10,6)} style={{ fontSize: px2dp(11), color: isTop?DesignRule.textColor_mainTitle_222:DesignRule.textColor_instruction,marginTop:px2dp(-14) ,textAlign:'right' }}/>
            </View>
            {this.renderMiddleLine()}
            <View style={{ position: "absolute", left:ScreenUtils.isIphoneMax?px2dp(60):px2dp(65), top: px2dp(25) }}>
                {this.renderMiddleImage()}
            </View>
            <View style={{ marginTop: px2dp(15) }}>
                <View style={{ flex: 1, flexDirection: "row", paddingLeft: px2dp(25),paddingRight:px2dp(48), flexWrap: "wrap" }}>
                    <UIText value={content1} style={{ fontSize: px2dp(13), color: isTop?DesignRule.textColor_mainTitle_222:DesignRule.textColor_instruction }}/>
                </View>
            </View>
        </View>
        </View>

    );
};


export default LogisticsDetailItem;
