import React from "react";
import {
    View,
    TouchableOpacity
} from 'react-native';
// import { color } from '../../../constants/Theme';
import {
    UIText, UIImage
} from "../../../components/ui";
import DesignRule from '../../../constants/DesignRule';

// status,//账单状态：0出账中，1待支付，2已支付，3逾期
const LogisticsDetailItem = props => {
    const {
        time,
        middleImage,
        title,
        content1,
        isTop,
        isBottom
    } = props;

    this.renderLine = () => {
        return (
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginTop: 10,
                marginBottom: 10,
                alignItems: "center",
                marginLeft: 20,
                marginRight: 20
            }}/>
        );
    };
    this.renderLine2 = () => {
        return (
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginTop: 10,
                marginBottom: 10,
                alignItems: "center"
            }}/>
        );
    };
    this.renderMiddleImage = () => {
        return (!middleImage ?
                <UIText value={"·"} style={{ fontSize: 40, marginLeft: 40, marginTop: -15 }}/> :
                <UIImage source={middleImage} style={{ width: 28, height: 28, marginLeft: 30, opacity: 1 }}/>
        );
    };
    this.renderMiddleLine = () => {
        return (!isBottom ?
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: isTop ? 21 : 0
                }}/> :
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: isTop ? 21 : 0,
                    height: 30
                }}/>
        );
    };
    this.renderTitle = () => {
        return (title && title !== "" ?
            <UIText value={title} style={{ fontSize: 14, color: DesignRule.textColor_mainTitle_222, marginLeft: 15 }}/>
            : null);
    };
    return (
        <TouchableOpacity style={{ paddingLeft: 16, paddingRight: 16, flexDirection: "row" }}>
            <View style={{width: 40, marginTop: 20}}>
                <UIText value={time.substr(5,5)} style={{ fontSize: 14, color: DesignRule.textColor_mainTitle_222,textAlign:'right'}}/>
            <UIText value={time.substr(10,6)} style={{ fontSize: 11, color: DesignRule.textColor_mainTitle_222,marginTop:-10 ,textAlign:'right' }}/>
            </View>
            {this.renderMiddleLine()}
            <View style={{ marginTop: 25 }}>
                {this.renderTitle()}
                <View style={{ flex: 1, flexDirection: "row", paddingLeft: 15, paddingRight: 48, flexWrap: "wrap" }}>
                    <UIText value={content1} style={{ fontSize: 12, color: DesignRule.textColor_mainTitle_222 }}/>
                </View>
            </View>
            <View style={{ position: "absolute", marginLeft: 16, marginTop: 20 }}>
                {this.renderMiddleImage()}
            </View>
        </TouchableOpacity>

    );
};

export default LogisticsDetailItem;
