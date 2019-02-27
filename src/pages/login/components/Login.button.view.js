import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";

const Styles = StyleSheet.create(
    {
        wxLoginBgView: {
            marginLeft:ScreenUtils.px2dp(30),
            width: ScreenUtils.width - ScreenUtils.px2dp(60),
            height: ScreenUtils.px2dp(50),
            backgroundColor: DesignRule.mainColor,
            borderRadius: ScreenUtils.px2dp(25),
        },
        touchableStyle:{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
        },
        otherLoginBgView:{
            marginTop:ScreenUtils.px2dp(24),
            marginLeft:ScreenUtils.px2dp(30),
            width: ScreenUtils.width - ScreenUtils.px2dp(60),
            height: ScreenUtils.px2dp(50),
            backgroundColor: DesignRule.color_fff,
            borderRadius: ScreenUtils.px2dp(25),
            borderWidth:ScreenUtils.px2dp(2),
            borderColor:DesignRule.mainColor
        }
    }
);
const loginBtnType = {
    wxLoginBtnType: 0,
    localPhoneNumLoginType: 1,
    otherLoginBtnType: 2
};
const getLoginBtnBgStyle={
    [loginBtnType.wxLoginBtnType]:Styles.wxLoginBgView,
    [loginBtnType.localPhoneNumLoginType]:Styles.otherLoginBgView,
    [loginBtnType.otherLoginBtnType]:Styles.otherLoginBgView
}




const getWxLoginBtn = (btnStyle,btnText, btnClick) => (<View style={Styles.wxLoginBgView}>
        <TouchableOpacity
            style={getLoginBtnBgStyle[btnStyle]}
            onPress={() => {
                btnClick && btnClick();
            }}
        >
            <Text>
                {btnText}
            </Text>
        </TouchableOpacity>
    </View>
);
// const getLocalPhoneNumLoginBtn = (btnText, btnClick) => (<View style={Styles.otherLoginBgStyle}>
//         <TouchableOpacity
//             style={}
//             onPress={() => {
//                 btnClick && btnClick();
//             }}
//         >
//             <Text>
//                 {btnText}
//             </Text>
//         </TouchableOpacity>
//     </View>
// );
// const getOtherLoginBtn = (btnText, btnClick) => (<View style={Styles.wxLoginBgView}>
//         <TouchableOpacity
//             style={{ flex: 1 }}
//             onPress={() => {
//                 btnClick && btnClick();
//             }}
//         >
//             <Text>
//                 {btnText}
//             </Text>
//         </TouchableOpacity>
//     </View>
// );
const createLoginButton = (btnType, btnText, btnClick) => {
    if (btnType === loginBtnType.wxLoginBtnType) {
        return getWxLoginBtn(btnType,btnText, btnClick);
    }else if(btnType === loginBtnType.localPhoneNumLoginType) {
        return getWxLoginBtn(btnType,btnText, btnClick);
    }else {
        return getWxLoginBtn(btnType,btnText, btnClick);
    }
};
export { createLoginButton,loginBtnType} ;



