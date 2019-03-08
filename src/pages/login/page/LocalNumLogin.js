import React, {} from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    Platform
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/Login.style";
import InputStyle from "../style/InputPhoneNum.Style";
import res from "../res";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import StringUtils from "../../../utils/StringUtils";
import { MRTextInput } from "../../../components/ui";
import ProtocolView from "../components/Login.protocol.view";
import { startPhoneAuthen } from "../model/PhoneAuthenAction";
import { oneClickLoginValidation } from "../model/LoginActionModel";

const { px2dp } = ScreenUtils;
const {
    other: {
        tongyong_logo_nor
    }
} = res;


export default class LocalNumLogin extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: this.params.tempPhone || "",
            authenToken: this.params.authenToken || ""
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

    _render() {
        return (
            <View
                style={Styles.bgContent}
            >
                {/*上部分视图*/}
                <View style={Styles.topBgContent}>
                    <View style={Styles.topImageBgView}>
                        <Image style={Styles.topImageView} source={tongyong_logo_nor}/>
                    </View>
                </View>

                {/*中部视图*/}
                <View style={localNumberLoginStyles.middleBgViewStyle}>
                    <MRTextInput
                        style={InputStyle.textInputStyle}
                        value={StringUtils.encryptPhone(this.state.phoneNumber)}
                        onChangeText={text => this.setState({
                            phoneNumber: text
                        })}
                        placeholder='请输入手机号'
                        keyboardType='numeric'
                        maxLength={11}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <View style={localNumberLoginStyles.middleLineStyle}/>
                    <TouchableOpacity onPress={() => {
                        this._clickAction();
                    }}>
                        <View style={localNumberLoginStyles.btnBgStyle}>
                            <Text style={localNumberLoginStyles.btnTextStyle}>
                                本机号码一键登录
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/*下部分视图*/}
                <View style={Styles.bottomBgContent}>
                    <ProtocolView
                        selectImageClick={(isSelect) => {
                            this.setState({
                                isSelectProtocol: isSelect
                            });
                        }}
                        textClick={(htmlUrl) => {
                            this.$navigate("HtmlPage", {
                                title: "用户协议内容",
                                uri: htmlUrl
                            });
                        }}
                    />
                </View>
            </View>
        );
    }

    _clickAction = () => {
        if (StringUtils.checkPhone(this.state.phoneNumber)) {
            this.$loadingShow();
            setTimeout(() => {
                this.$loadingDismiss();
                Alert.alert(
                    this.state.phoneNumber,
                    "如果您是双卡手机，请确保填写的号码是默认上网的手机号码",
                    [
                        { text: "从新填写", onPress: () => console.log("Ask me later pressed") },

                        {
                            text: "确定", onPress: () => {
                                this._sureClick();
                            }
                        }
                    ],
                    { cancelable: false }
                );
            });
        } else {
            this.$toastShow("请输入正确手机号");
        }
    };

    _sureClick = () => {
        this.$loadingShow();
        if (Platform.OS === "android") {
            if (this.state.authenToken.length > 0) {
                this.$loadingDismiss();
                this._beginAuthen(this.state.phoneNumber, this.state.authenToken);
            } else {
                this.$toastShow("本地号码一键登录失败，请尝试其他登录方式");
            }
        } else {
            startPhoneAuthen(this.state.phoneNumber).then(res => {
                    this.$loadingDismiss();
                    if (res.resultCode === "6666") {
                        // this.state.phoneNumber 6666代表拿到了token
                        // res.accessCode
                        this._beginAuthen(this.state.phoneNumber, res.accessCode);
                        console.log(res);
                    } else {
                        this.$toastShow("本地号码一键登录失败，请尝试其他登录方式");
                    }
                }
            );
        }
    };
    /**
     * 开始认证函数
     * @param phone
     * @param authenToken
     * @private
     */
    _beginAuthen = (phone, authenToken = "") => {
        // alert(authenToken);
        let { navigation } = this.props;
        oneClickLoginValidation(phone, authenToken, navigation);
    };
}

const localNumberLoginStyles = StyleSheet.create(
    {
        btnBgStyle: {
            marginTop: px2dp(46),
            backgroundColor: DesignRule.mainColor,
            height: px2dp(40),
            borderRadius: px2dp(20),
            alignItems: "center",
            justifyContent: "center",
            width: ScreenUtils.width - px2dp(80)
        },
        btnTextStyle: {
            color: DesignRule.color_fff,
            fontSize: px2dp(17)
        },
        middleBgViewStyle: {
            flex: 1,
            alignItems: "center"
        },
        middleLineStyle: {
            marginTop: ScreenUtils.px2dp(3),
            height: 1,
            width: ScreenUtils.width - ScreenUtils.px2dp(80),
            backgroundColor: DesignRule.imgBg_color
        }
    }
);
