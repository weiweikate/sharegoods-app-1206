import React from "react";
import LoginTopView from "../components/LoginTopView";
// import UserModel from "../../../model/user";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import { MRText as Text } from "../../../components/ui";
import CommSpaceLine from "../../../comm/components/CommSpaceLine";
import BasePage from "../../../BasePage";
import LoginAPI from "../api/LoginApi";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import res from "../res";
import { track, trackEvent } from "../../../utils/SensorsTrack";
import oldUserLoginSingleModel from "../../../model/oldUserLoginModel";
import RouterMap from "../../../navigation/RouterMap";
import { wxLoginAction, codeLoginAction, pwdLoginAction } from "../model/LoginActionModel";
import ProtocolView from "../components/Login.protocol.view";
import loginModel from "../model/LoginModel";

const {
    share: {
        weiXin
    },
    other: {
        close_X
    }
} = res;

const rendOtherLoginView = (isShow, wxLoginClick, protocolClick) => {
    return (isShow
            ?
            <View style={Styles.otherLoginBgStyle}>
                <View style={Styles.lineBgStyle}>
                    <CommSpaceLine style={{ width: 80 }}/>
                    <Text style={Styles.otherLoginTextStyle}>
                        其他登录方式
                    </Text>
                    <CommSpaceLine style={{ width: 80, marginLeft: 5 }}/>
                </View>
                <View style={Styles.wxImageBgStyle}>
                    <TouchableOpacity onPress={() => {
                        wxLoginClick && wxLoginClick();
                    }}>
                        <Image style={{ width: 50, height: 50 }} source={weiXin}/>
                    </TouchableOpacity>
                </View>
                <ProtocolView
                    textClick={(htmlUrl) => {
                        protocolClick && protocolClick({
                            title: "用户协议内容",
                            uri: htmlUrl
                        });
                    }}
                    selectImageClick={(isSelect) => {
                        loginModel.saveIsSelectProtocol(isSelect);
                    }}
                />
            </View>
            :
            <View style={Styles.otherLoginBgStyle}>
                <ProtocolView
                    textClick={(htmlUrl) => {
                        this.navigate(RouterMap.HtmlPage, {
                            title: "用户协议内容",
                            uri: htmlUrl
                        });
                    }
                    }
                    selectImageClick={(isSelect) => {
                        loginModel.saveIsSelectProtocol(isSelect);
                    }}
                />
            </View>
    );
};
/**
 * @author huyufeng
 * @date on 2018/9/7
 * @describe 登录页
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
export default class LoginPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            showWxLoginBtn: false,
            isCanClick: true
        };
    }

    $navigationBarOptions = {
        leftNavItemHidden: true,
        title: ""
    };
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={() => {
                this.$navigateBack();
            }}>
                <Image
                    style={{ paddingRight: 5 }}
                    source={close_X}
                />
            </TouchableOpacity>
        );
    };

    $isMonitorNetworkStatus() {
        return false;
    }

    componentDidMount() {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log("是还是非-------", res);
            this.setState({
                showWxLoginBtn: res.data
            });
        }).catch((error) => {

        });
        oldUserLoginSingleModel.checkIsShowOrNot(false);
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <LoginTopView
                    oldUserLoginClick={this.oldUserLoginClick.bind(this)}
                    forgetPasswordClick={this.forgetPasswordClick}
                    loginClick={(loginType, LoginParam) => {
                        this.$loadingShow();
                        setTimeout(() => {
                            this.loginClick(loginType, LoginParam);
                        }, 0);
                    }}
                    showOldLogin={this.state.showWxLoginBtn}
                />

                {
                    rendOtherLoginView(oldUserLoginSingleModel.isShowReg, () => {
                        this.weChatLoginClick();
                    }, (htmlParams) => {
                        this.$navigate("HtmlPage", htmlParams);
                    })
                }

            </View>
        );
    }

    /*忘记密码*/
    forgetPasswordClick = () => {
        this.$navigate("login/login/ForgetPasswordPage");
    };
    /*微信登陆*/
    weChatLoginClick = () => {
        track(trackEvent.login, { loginMethod: "微信登录用" });
        oldUserLoginSingleModel.isCanLoginWithWx((flag) => {
            if (flag) {
                wxLoginAction((code, data) => {
                    if (code == 10000) {
                        this.params.callback && this.params.callBack();
                        this.$navigateBack(-2);
                    } else if (code === 34005) {
                        this.$navigate(RouterMap.InputPhoneNum, data);
                    }
                });
            }
        });
    };
    /*老用户登陆*/
    oldUserLoginClick = () => {
        oldUserLoginSingleModel.JumpToLogin(RouterMap.OldUserLoginPage);
    };
    /*注册*/
    registBtnClick = () => {
        oldUserLoginSingleModel.isCanTopRegist(RouterMap.RegistPage);
    };
    /*登陆*/
    loginClick = (loginType, LoginParam) => {
        if (loginType === 0) {
            track(trackEvent.login, { loginMethod: "验证码登录" });
            codeLoginAction(LoginParam, (data) => {
                if (data.code == 10000) {
                    this.$toastShow("登录成功");
                    this.params.callback && this.params.callback();
                    this.$loadingDismiss();
                    this.$navigateBack(-2);

                } else {
                    this.$loadingDismiss();
                    this.$toastShow(data.msg);
                }
            });
        } else {
            track(trackEvent.login, { loginMethod: "密码登录" });
            pwdLoginAction(LoginParam, (data) => {
                if (data.code == 10000) {
                    this.$toastShow("登录成功");
                    this.params.callback && this.params.callback();
                    this.$loadingDismiss();
                    // this.$navigateBack(-2);
                    this.$navigate(RouterMap.InviteCodePage);
                } else {
                    this.$loadingDismiss();
                    this.$toastShow(data.msg);
                }
            });
        }
    };
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: "#fff",
            justifyContent: "space-between"
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
        },
        otherLoginBgStyle: {
            width: ScreenUtils.width,
            // position: "absolute",
            bottom: 10,
            height: 170,
            justifyContent: "center",
            alignItems: "center"
        },
        lineBgStyle: {
            width: ScreenUtils.width,
            flexDirection: "row",
            height: 30,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center"
        },
        otherLoginTextStyle: {
            color: DesignRule.textColor_secondTitle,
            marginLeft: 5
        },
        wxImageBgStyle: {
            marginTop: 15,
            marginLeft: 0,
            marginRight: 0,
            justifyContent: "center",
            backgroundColor: "#fff",
            alignItems: "center"
        }
    }
);

