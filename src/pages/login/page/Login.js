import React, {} from "react";
import {
    View,
    Image,
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import { createBottomButton, createLoginButton, loginBtnType } from "../components/Login.button.view";
import res from "../res";
// import ScreenUtils from "../../../utils/ScreenUtils";
import RouterMap from "../../../navigation/RouterMap";
import { isCanPhoneAuthen } from "../model/PhoneAuthenAction";

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
            canPhoneAuthen: false//是否可以本地号码一键登录 默认不可以
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
        isCanPhoneAuthen().then(result => {
            if (result.isCanAuthen === 1) {
                this.setState({
                    canPhoneAuthen: true
                });
            } else {
                this.setState({
                    canPhoneAuthen: false
                });
            }
        });
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
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 30
                        }}
                    >
                        {
                            createBottomButton(bottomBtnTitleArr, (text) => {
                                if (text === "注册新账号") {
                                    this.$navigate(RouterMap.InputPhoneNum);
                                } else {
                                    this.$navigate(RouterMap.OtherLoginPage);
                                }
                            })}
                    </View>
                </View>
            </View>
        );
    }

    _clickAction = (btnType) => {
        console.log("执行了");
        if (btnType == loginBtnType.wxLoginBtnType) {
            this.$navigate(RouterMap.InputPhoneNum);
        } else if (btnType === loginBtnType.localPhoneNumLoginType) {
            this.$navigate(RouterMap.LocalNumLogin);
        } else {
            this.$navigate(RouterMap.OtherLoginPage);
        }
    };
    _wxLogin = () => {

    };
}
