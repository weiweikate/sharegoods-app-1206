import React, {} from "react";
import {
    View,
    Image,
    Platform
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import { createBottomButton, createLoginButton, loginBtnType } from "../components/Login.button.view";
import res from "../res";
import RouterMap from "../../../navigation/RouterMap";
import { isCanPhoneAuthen } from "../model/PhoneAuthenAction";
import { wxLoginAction } from "../model/LoginActionModel";
import ProtocolView from "../components/Login.protocol.view";
// import loginModel from "../model/LoginModel";
// const { px2dp } = ScreenUtils;
const {
    other: {
        tongyong_logo_nor
    }
} = res;


export default class Login extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            canPhoneAuthen: true,//是否可以本地号码一键登录 默认不可以
            isSelectProtocol: true
        };
    }
    // 导航配置
    $navigationBarOptions = {
        // title: '登录',
        gesturesEnabled: false
    };
    $isMonitorNetworkStatus() {
        return false;
    }
    componentDidMount() {
        if (Platform.OS === "android") {
            this.$loadingShow();
            isCanPhoneAuthen().then(result => {
                this.$loadingDismiss();
                if (
                    result.isCanAuthen === 1
                    && result.phoneNum.length > 0
                ) {
                    this.setState({
                        canPhoneAuthen: true,
                        tempPhone: result.phoneNum || "",
                        authenToken: result.data || ""
                    });
                } else {
                    this.setState({
                        canPhoneAuthen: false
                    });
                }
            }).catch(res => {
                this.$loadingDismiss();
            });
        } else {
            //ios平台主动开启
            this.setState({
                canPhoneAuthen: true
            })
        }
    }

    _render() {
        const bottomBtnTitleArr = this.state.canPhoneAuthen ? ["注册新账号", "其他登录方式"] : ["注册新账号"];
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
                    {createLoginButton(loginBtnType.wxLoginBtnType, "微信登录", () => {
                        this._clickAction(loginBtnType.wxLoginBtnType);
                    })}

                    {
                        this.state.canPhoneAuthen ?
                            createLoginButton(loginBtnType.localPhoneNumLoginType, "本机号码一键登录", () => {
                                this._clickAction(loginBtnType.localPhoneNumLoginType);
                            }) :
                            createLoginButton(loginBtnType.otherLoginBtnType, "其他登录方式", () => {
                                this._clickAction(loginBtnType.otherLoginBtnType);
                            })
                    }
                </View>

                {/*下部分视图*/}
                <View
                    style={Styles.bottomBgContent}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {
                            createBottomButton(bottomBtnTitleArr, (text) => {
                                if (text === "注册新账号") {
                                    this.$navigate(RouterMap.InputPhoneNum);
                                } else {
                                    this.$navigate(RouterMap.OtherLoginPage);
                                }
                            })
                        }
                    </View>
                    <ProtocolView
                        textClick={(htmlUrl) => {
                            this.$navigate("HtmlPage", {
                                title: "用户协议内容",
                                uri: htmlUrl
                            });
                        }}
                        selectImageClick={(isSelect) => {
                            this.setState({
                                isSelectProtocol: isSelect
                            });
                        }}
                    />
                </View>
            </View>
        );
    }

    _clickAction = (btnType) => {
        console.log("执行了");
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
            } else if(code === 34005) {
                //绑定手机号
                this.$navigate(RouterMap.InputPhoneNum, data);
            }
        });
    };
}
