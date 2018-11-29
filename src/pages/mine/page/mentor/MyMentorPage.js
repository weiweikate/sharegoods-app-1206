import BasePage from "../../../../BasePage";
import React from "react";

import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    Image,
    TouchableWithoutFeedback
} from "react-native";
import ScreenUtils from "../../../../utils/ScreenUtils";

const { px2dp } = ScreenUtils;
import res from "../../../spellShop/res";
import DesignRule from "../../../../constants/DesignRule";

const HeaderBarBgImg = res.myShop.txbg_03;
const white_back = res.button.white_back;

const headerHeight = ScreenUtils.statusBarHeight + 44;

export default class MyMentorPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    _render() {
        const str = "彦宏，百度公司创始人、董事长兼首席执行官，全面负责百度公司的战略规划和运营管理。 1991年，李彦宏毕业于北京大学信息管理专业，随后前往美国布法罗纽约州立大学完成计算机科学硕士学位，先后担任道·琼斯公司高级顾问...";
        return (
            <View style={styles.container}>
                {this._headerRender()}
                {this._itemRender("名称", "杨紫")}
                {this._lineRender()}
                {this._itemRender("职称", "白金品鉴官")}
                {this._lineRender()}
                {this._itemRender("授权号", "123456")}
                {this._lineRender()}
                {this._itemRender("手机号", "1577777777")}
                {this._profileRender(str)}
                {this._navRender()}
            </View>
        );
    }

    _navRender() {
        return (
            <View
                style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: px2dp(15),
                    height: headerHeight,
                    paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <View style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.$navigateBack()}>
                            <Image source={white_back} style={{ width: 10, height: 20 }}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        导师详情
                    </Text>
                    <View style={{
                        flex: 1
                    }}/>
                </View>
            </View>
        );
    }


    _headerRender = () => {
        return (
            <ImageBackground source={HeaderBarBgImg} style={styles.headerWrapper}>
                <View style={styles.headerIconStyle}/>
            </ImageBackground>
        );
    };

    _itemRender = (key, value) => {
        return (
            <View style={styles.itemWrapper}>
                <Text style={styles.itemTextStyle}>
                    {`${key}:  `}
                </Text>
                <Text style={styles.itemTextStyle}>
                    {value}
                </Text>
            </View>
        );
    };

    _lineRender = () => {
        return (
            <View style={styles.lineStyle}/>
        );
    };

    _profileRender = (profile) => {
        return (
            <View style={styles.profileWrapper}>
                <Text style={styles.profileTitleStyle}>
                    简介
                </Text>
                <Text style={styles.profileTextStyle}>
                    {profile}
                </Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerWrapper: {
        width: ScreenUtils.width,
        height: px2dp(200),
        alignItems: "center",
    },
    headerIconStyle: {
        height: px2dp(80),
        width: px2dp(80),
        borderRadius: px2dp(40),
        backgroundColor: "white",
        marginTop:headerHeight+20
    },
    itemWrapper: {
        height: px2dp(40),
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: DesignRule.margin_page
    },
    itemTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        includeFontPadding: false
    },
    lineStyle: {
        height: ScreenUtils.onePixel,
        width: ScreenUtils.width,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    profileWrapper: {
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white,
        marginTop: 7,
        padding: DesignRule.margin_page
    },
    profileTitleStyle: {
        includeFontPadding: false,
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    profileTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_24,
        marginTop: px2dp(10)
    }
});
