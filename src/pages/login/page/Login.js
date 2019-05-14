import React, {} from "react";
import {
    View,
    Image,
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import { createLoginButton, loginBtnType } from "../components/Login.button.view";
import res from "../res";
import RouterMap from "../../../navigation/RouterMap";
import { oneClickLoginValidation, wxLoginAction } from '../model/LoginActionModel';
import { TrackApi } from "../../../utils/SensorsTrack";
import { startLoginAuth } from "../model/PhoneAuthenAction";
import { observer } from "mobx-react";
import loginModel from "../model/LoginModel";

const {
    other: {
        tongyong_logo_nor
    }
} = res;

@observer
export default class Login extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            canPhoneAuthen: false,//是否可以本地号码一键登录 默认不可以
            isSelectProtocol: true,
            tempPhone:"",
            authenToken: ""
        };
        TrackApi.loginPage();
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
                </View>
                {/*中部视图*/}
                {
                    loginModel.authPhone ? <View style={Styles.middleBgContent}>
                        {
                            createLoginButton(loginBtnType.localPhoneNumLoginType, "本机号码一键登录", () => {
                                this._clickAction(loginBtnType.localPhoneNumLoginType);
                            },true)
                        }
                    </View> : <View style={Styles.middleBgContent}>
                        {
                            createLoginButton(loginBtnType.wxLoginBtnType, "微信授权登录", () => {
                                this._clickAction(loginBtnType.wxLoginBtnType);
                            },true)
                        }
                    </View>

                }
                {/*下部分视图*/}
                <View style={Styles.bottomBgContent}>
                    {

                        loginModel.authPhone ?  createLoginButton(loginBtnType.wxLoginBtnType, "微信登录", () => {
                            this._clickAction(loginBtnType.wxLoginBtnType);
                        }) : null
                    }
                    {
                        createLoginButton(loginBtnType.registerBtnType, "注册新账号", () => {
                            // this._clickAction(loginBtnType.otherLoginBtnType);
                            this.$navigate(RouterMap.InputPhoneNum);

                            // if (text === "手动注册新账号") {
                            //     this.$navigate(RouterMap.InputPhoneNum);
                            // } else {
                            //     this.$navigate(RouterMap.OtherLoginPage);
                            // }
                        })
                    }
                    {
                        createLoginButton(loginBtnType.otherLoginBtnType, "其他登录方式", () => {
                            this._clickAction(loginBtnType.otherLoginBtnType);
                        })
                    }
                </View>
            </View>
        );
    }

    _clickAction = (btnType) => {
        if (!this.state.isSelectProtocol) {
            this.$toastShow("请先勾选用户协议");
            return;
        }
        if (btnType === loginBtnType.wxLoginBtnType) {
            this._wxLogin();
        } else if (btnType === loginBtnType.localPhoneNumLoginType) {
            startLoginAuth().then((data)=>{
                let { navigation } = this.props;
                oneClickLoginValidation(loginModel.authPhone, data, navigation);
            }).catch((error)=>{
                this.$toastShow("认证失败,请选择其他登录方式");
            })
        } else {
            this.$navigate(RouterMap.OtherLoginPage);
        }
    };
    _wxLogin = () => {
        wxLoginAction((code, data) => {
            if (code === 10000) {
                this.$navigateBack(-1);
                this.params.callback &&  this.params.callback();
            } else if (code === 34005) {
                //绑定手机号
                this.$navigate(RouterMap.InputPhoneNum, data);
            }
        });
    };
}
