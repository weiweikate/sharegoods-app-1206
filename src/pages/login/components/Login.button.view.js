import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import LinearGradient from "react-native-linear-gradient";

const { px2dp, width } = ScreenUtils;

const Styles = StyleSheet.create(
    {
        wxLoginBgView: {
            marginLeft: px2dp(30),
            width: width - px2dp(60),
            height: px2dp(40),
            backgroundColor: DesignRule.color_fff,
            borderRadius: px2dp(20),
            borderWidth: px2dp(0.5),
            borderColor: DesignRule.textColor_instruction
        },
        wxTextView: {
            color: DesignRule.textColor_instruction,
            fontSize: px2dp(17)
        },
        localTextView: {
            color: DesignRule.color_fff,
            fontSize: px2dp(17)
        },
        otherTextView: {
            color: DesignRule.textColor_instruction,
            fontSize: px2dp(17)
        },
        registerTextView: {
            color: DesignRule.textColor_instruction,
            fontSize: px2dp(17)
        },
        otherLoginBgView: {
            marginTop: px2dp(20),
            marginLeft: px2dp(30),
            width: width - px2dp(60),
            height: px2dp(40),
            backgroundColor: DesignRule.color_fff,
            borderRadius: px2dp(20),
            borderWidth: px2dp(0.5),
            borderColor: DesignRule.textColor_instruction
        },
        registerBgView: {
            marginTop: px2dp(20),
            marginLeft: px2dp(30),
            width: width - px2dp(60),
            height: px2dp(40),
            backgroundColor: DesignRule.color_fff,
            borderRadius: px2dp(20),
            borderWidth: px2dp(0.5),
            borderColor: DesignRule.textColor_instruction
        },
        localLoginBtnBgView: {
            marginTop: px2dp(24),
            marginLeft: px2dp(30),
            width: width - px2dp(60),
            height: px2dp(40),
            backgroundColor: DesignRule.mainColor,
            borderRadius: px2dp(20),
            borderWidth: px2dp(0.5),
            borderColor: DesignRule.mainColor
        },
        touchableStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        bottomTipBtnBgStyle: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: px2dp(40),
            marginTop: px2dp(15)
        },
        bottomTipBtnStyle: {
            color: DesignRule.textColor_instruction,
            fontSize: px2dp(12)
        },
        bottomLineStyle: {
            height: 10,
            width: 1,
            backgroundColor: DesignRule.textColor_instruction,
            margin: 5
        }
    }
);
const loginBtnType = {
    wxLoginBtnType: 0,
    localPhoneNumLoginType: 1,
    otherLoginBtnType: 2,
    registerBtnType: 3
};
const getLoginBtnBgStyle = {
    [loginBtnType.wxLoginBtnType]: Styles.wxLoginBgView,
    [loginBtnType.localPhoneNumLoginType]: Styles.localLoginBtnBgView,
    [loginBtnType.otherLoginBtnType]: Styles.otherLoginBgView,
    [loginBtnType.registerBtnType]: Styles.registerBgView
};
const getTextStyle = {
    [loginBtnType.wxLoginBtnType]: Styles.wxTextView,
    [loginBtnType.localPhoneNumLoginType]: Styles.localTextView,
    [loginBtnType.otherLoginBtnType]: Styles.otherTextView,
    [loginBtnType.registerBtnType]: Styles.registerTextView

};

const getLoginBtn = (btnStyle, btnText, btnClick, isC = true) => (<View style={[getLoginBtnBgStyle[btnStyle],isC?{borderWidth:0}:null]}>
        {
            isC ?
                <LinearGradient colors={["#FF1C89", "#FD0129"]}
                                style={{ flex: 1 , borderRadius: px2dp(20),}}
                >
                    <TouchableOpacity
                        style={Styles.touchableStyle}
                        onPress={() => {
                            btnClick && btnClick();
                        }}
                    >
                        <Text
                            style={[getTextStyle[btnStyle],isC?{color:'white'}:null]}
                        >
                            {btnText}
                        </Text>
                    </TouchableOpacity>

                </LinearGradient>
                :
                <TouchableOpacity
                    style={Styles.touchableStyle}
                    onPress={() => {
                        btnClick && btnClick();
                    }}
                >
                    <Text
                        style={getTextStyle[btnStyle]}
                    >
                        {btnText}
                    </Text>
                </TouchableOpacity>
        }
    </View>
);
const createBottomButton = (textArr, clickAction) => {
    if (textArr.length === 2) {
        return (
            <View style={Styles.bottomTipBtnBgStyle}>
                <TouchableOpacity
                    onPress={() => {
                        clickAction && clickAction(textArr[0]);
                    }}
                >
                    <Text style={Styles.bottomTipBtnStyle}>
                        {textArr[0]}
                    </Text>
                </TouchableOpacity>

                <View style={Styles.bottomLineStyle}/>

                <TouchableOpacity
                    onPress={() => {
                        clickAction && clickAction(textArr[1]);
                    }}
                >
                    <Text style={Styles.bottomTipBtnStyle}>
                        {textArr[1]}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View
                style={Styles.bottomTipBtnBgStyle}
            >
                <TouchableOpacity
                    onPress={() => {
                        clickAction && clickAction(textArr[0]);
                    }}
                >
                    <Text style={Styles.bottomTipBtnStyle}>
                        {textArr[0]}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }


};


const createLoginButton = (btnType, btnText, btnClick,isC=false) => {
    if (btnType === loginBtnType.wxLoginBtnType) {
        return getLoginBtn(btnType, btnText, btnClick,isC);
    } else if (btnType === loginBtnType.localPhoneNumLoginType) {
        return getLoginBtn(btnType, btnText, btnClick,isC);
    } else {
        return getLoginBtn(btnType, btnText, btnClick,isC);
    }
};

export { createLoginButton, loginBtnType, createBottomButton } ;



