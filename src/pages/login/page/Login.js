import React, {
} from "react";
import {
    View,
    Image
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import { createLoginButton,loginBtnType} from '../components/Login.button.view'
import res from '../res';
const {
    other: {
        tongyong_logo_nor
    }
} = res;



export default class Login extends BasePage {

    constructor(props) {
        super(props);
    }

    // 导航配置
    $navigationBarOptions = {
        // title: '登录',
        gesturesEnabled: false
    };

    $isMonitorNetworkStatus() {

        return false;
    }

    _render() {
        return (
            <View
                style={Styles.bgContent}
            >
                {/*上部分视图*/}
                <View
                    style={Styles.topBgContent}
                >
                    <View
                    style={Styles.topImageBgView}
                    >
                        <Image
                            style={Styles.topImageView}
                            source={tongyong_logo_nor}
                        />
                    </View>
                </View>

                {/*中部视图*/}
                <View
                    style={Styles.middleBgContent}
                >
                    {createLoginButton(loginBtnType.wxLoginBtnType,'微信登录',()=>{})}
                    {createLoginButton(loginBtnType.localPhoneNumLoginType,'本机号码一键登录',()=>{})}
                </View>

                {/*下部分视图*/}
                <View
                    style={Styles.bottomBgContent}
                >

                </View>
            </View>
        );
    }
}
