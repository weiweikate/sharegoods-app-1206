import React, {} from "react";
import {
    View,
    Image,
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import { createBottomButton, createLoginButton, loginBtnType } from "../components/Login.button.view";
import res from "../res";
import RouterMap from "../../../navigation/RouterMap";
// import { isCanPhoneAuthen } from "../model/PhoneAuthenAction";
import { wxLoginAction } from "../model/LoginActionModel";
// import CommNavigation from "../../../comm/components/CommNavigation";
// import { MRText } from "../../../components/ui";

const {
    other: {
        tongyong_logo_nor
    }
} = res;


export default class Login extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            canPhoneAuthen: false,//是否可以本地号码一键登录 默认不可以
            isSelectProtocol: true,
            tempPhone:"",
            authenToken: ""
        };
    }

    // 导航配置
    $navigationBarOptions = {
        gesturesEnabled: false
    };

    $isMonitorNetworkStatus() {
        return false;
    }

    componentDidMount() {
            //ios平台主动开启
            this.setState({
                canPhoneAuthen: true
            });
    }

    _render() {
        return (
            <View style={Styles.bgContent}>
                {/*上部分视图*/}
                <View style={Styles.topBgContent}>
                    <View style={Styles.topImageBgView}>
                        <Image
                            style={Styles.topImageView}
                            source={tongyong_logo_nor}
                        />
                    </View>
                    {/*<CommNavigation>*/}
                    {/*<MRText>*/}
                    {/*value 1*/}
                    {/*</MRText>*/}
                    {/*<MRText>*/}
                    {/*value 2*/}
                    {/*</MRText>*/}

                    {/*</CommNavigation>*/}
                </View>

                {/*中部视图*/}
                <View style={Styles.middleBgContent}>
                    {
                        createLoginButton(loginBtnType.localPhoneNumLoginType, "本机号码一键登录", () => {
                            this._clickAction(loginBtnType.localPhoneNumLoginType);
                        })
                    }
                </View>

                {/*下部分视图*/}
                <View style={Styles.bottomBgContent}>
                    {

                        createLoginButton(loginBtnType.wxLoginBtnType, "微信授权登录", () => {
                            this._clickAction(loginBtnType.wxLoginBtnType);
                        })}
                    {
                        createLoginButton(loginBtnType.otherLoginBtnType, "其他登录方式", () => {
                            this._clickAction(loginBtnType.otherLoginBtnType);
                        })
                    }
                    {
                        createBottomButton(["手动注册新账号"], (text) => {
                            if (text === "手动注册新账号") {
                                this.$navigate(RouterMap.InputPhoneNum);
                            } else {
                                this.$navigate(RouterMap.OtherLoginPage);
                            }
                        })
                    }
                </View>
            </View>
        );
    }

    _clickAction = (btnType) => {
        if (!this.state.isSelectProtocol) {
            this.$toastShow("清先勾选用户协议");
            return;
        }
        if (btnType === loginBtnType.wxLoginBtnType) {
            this._wxLogin();
        } else if (btnType === loginBtnType.localPhoneNumLoginType) {
            this.$navigate(RouterMap.LocalNumLogin, {
                tempPhone: this.state.tempPhone,
                authenToken: this.state.authenToken
            });
        } else {
            this.$navigate(RouterMap.OtherLoginPage);
        }
    };
    _wxLogin = () => {
        wxLoginAction((code, data) => {
            if (code === 10000) {
                this.$navigateBack(-1);
                this.params.callback && this.params.callBack();
            } else if (code === 34005) {
                //绑定手机号
                this.$navigate(RouterMap.InputPhoneNum, data);
            }
        });
    };
}
