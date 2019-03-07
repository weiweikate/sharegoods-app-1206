import React, {} from "react";
import {
    View,
    TouchableOpacity,
    Text
} from "react-native";
import BasePage from "../../../BasePage";
import Styles from "../style/InputPhoneNum.Style";
import res from "../res";
import ScreenUtils from "../../../utils/ScreenUtils";
import { MRTextInput } from "../../../components/ui";
import DesignRule from "../../../constants/DesignRule";
import StringUtils from "../../../utils/StringUtils";
import RouterMap from "../../../navigation/RouterMap";
import ProtocolView from "../components/Login.protocol.view";
import SMSTool from "../../../utils/SMSTool";
// import { startPhoneAuthen } from "../model/PhoneAuthenAction";

const { px2dp } = ScreenUtils;
const {
    other: {}
} = res;

export default class InputPhoneNum extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isSelectProtocol: true,
            phoneNum: ""
        };
    }

    $navigationBarOptions = {
        title: "",
        show: true,
        leftNavTitle: "取消"
    };

    _render() {
        return (
            <View style={Styles.bgContent}>
                <View style={{ marginTop: px2dp(84), alignItems: "center" }}>
                    <Text style={Styles.topTitleStyle}>
                        请输入手机号
                    </Text>
                    <View style={{ marginTop: px2dp(23) }}>
                        <MRTextInput
                            style={Styles.textInputStyle}
                            value={this.state.phoneNum}
                            onChangeText={text => this.setState({
                                phoneNum: text
                            })}
                            placeholder='请输入手机号'
                            keyboardType='numeric'
                            maxLength={11}
                            onEndEditing={() => {
                            }}
                            placeholderTextColor={DesignRule.textColor_placeholder}
                        />
                        <View
                            style={{
                                // marginTop: ScreenUtils.px2dp(5),
                                height: 1,
                                width: ScreenUtils.width - ScreenUtils.px2dp(80),
                                backgroundColor: DesignRule.imgBg_color
                            }}
                        />
                        <TouchableOpacity onPress={() => {
                            this._btnClickAction();
                        }}>
                            <View style={
                                this.state.phoneNum.length === 11 && this.state.isSelectProtocol ?
                                    Styles.btnCanClickBgStyle :
                                    Styles.btnNoCanClickBgStyle
                            }>
                                <Text style={Styles.btnTitleStyle}>
                                    获取验证码
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <ProtocolView selectImageClick={(isSelectProtocol) => {
                        this.setState({
                            isSelectProtocol: isSelectProtocol
                        });
                    }} textClick={(htmlUrl) => {
                        this.$navigate("HtmlPage", {
                            title: "用户协议内容",
                            uri: htmlUrl
                        });
                    }}/>
                </View>
            </View>
        );
    }

    _btnClickAction = () => {
        if (StringUtils.isEmpty(this.state.phoneNum.trim())) {
            this.$toastShow("请输入手机号");
        } else {
            if (StringUtils.checkPhone(this.state.phoneNum)) {
                if (!this.state.isSelectProtocol) {
                    this.$toastShow("请勾选用户协议");
                } else {
                   this._sendAutherCode();
                }
            } else {
                this.$toastShow("您输入的手机号有误，请重新输入");
            }
        }
    };
    /**
     * 发送验证码
     * @private
     */
    _sendAutherCode = () => {
        //发送验证码
        SMSTool.sendVerificationCode(1, this.state.phoneNum);
        let params = {
            ...this.params,
            phoneNum:this.state.phoneNum
        }
        this.$navigate(RouterMap.InputCode, params);
    };

}
