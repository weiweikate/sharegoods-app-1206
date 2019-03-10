import {
    StyleSheet
} from "react-native";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";

const { px2dp, width } = ScreenUtils;
const styles = StyleSheet.create(
    {
        bgContent: {
            marginTop: ScreenUtils.px2dp(-2),
            flex: 1,
            backgroundColor: DesignRule.color_fff
        },
        topTitleStyle: {
            marginTop: px2dp(15),
            fontSize: 23,
            color: DesignRule.textColor_mainTitle
        },
        topTipTitleStyle: {
            marginTop: px2dp(15),
            fontSize: px2dp(15),
            color: DesignRule.textColor_secondTitle
        },
        textInputStyle: {
            width: width - px2dp(80),
            height: px2dp(38)
        },
        btnCanClickBgStyle: {
            marginTop: px2dp(64),
            width: width - px2dp(80),
            borderRadius: 20,
            backgroundColor: DesignRule.bgColor_btnSelect,
            height: px2dp(40),
            justifyContent: "center",
            alignItems: "center"
        },
        btnNoCanClickBgStyle: {
            marginTop: px2dp(64),
            width: width - px2dp(80),
            borderRadius: 20,
            backgroundColor: DesignRule.bgColor_grayHeader,
            height: px2dp(40),
            justifyContent: "center",
            alignItems: "center"
        },
        authReSendCodeStyle: {
            marginTop: px2dp(15),
            fontSize: px2dp(15),
            color: "#4A90E2"
        },
        authHaveSendCodeStyle: {
            marginTop: px2dp(15),
            fontSize: px2dp(15),
            color: DesignRule.textColor_secondTitle
        },
        authHaveSendCodeBtnStyle: {
            marginTop: px2dp(15),
            fontSize: px2dp(15),
            color: DesignRule.textColor_secondTitle
        },
        btnTitleStyle: {
            fontSize: px2dp(17),
            color: DesignRule.color_fff
        }

    }
);
export default styles;
