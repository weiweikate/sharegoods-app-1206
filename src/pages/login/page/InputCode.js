/**
 验证码输入页面
 **/
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
import bridge from "../../../utils/bridge";
import StringUtils from "../../../utils/StringUtils";
import VerifyCode from "../components/VerifyCodeInput";
import RouterMap from "../../../navigation/RouterMap";
import { netStatusTool } from "../../../api/network/NetStatusTool";
import { TimeDownUtils } from "../../../utils/TimeDownUtils";

const { px2dp } = ScreenUtils;
const {
    other: {
        // tongyong_logo_nor
    }
} = res;

export default class InputCode extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            downTime: 0
        };
    }

    $navigationBarOptions = {
        title: "输入手机号",
        show: true


    };


    _render() {
        const { phoneNum } = this.params;
        return (
            <View
                style={Styles.bgContent}
            >
                <View
                    style={
                        {
                            marginTop: 84,
                            alignItems: "center"
                        }
                    }
                >
                    <Text
                        style={Styles.topTitleStyle}
                    >
                        请输入短信验证码
                    </Text>
                    <Text
                        style={Styles.topTipTitleStyle}
                    >
                        我们已发送短信验证码到你的手机
                    </Text>

                    <Text
                        style={{ marginTop: 10 }}
                    >
                        {StringUtils.encryptPhone(phoneNum)}
                    </Text>

                    <View
                        style={{
                            alignItems: "center"
                        }}
                    >
                        <VerifyCode onChangeText={
                            (text) => {
                                this._finshInputCode(text);
                            }
                        } verifyCodeLength={4}
                        />

                        <View
                            style={
                                {
                                    marginTop: px2dp(10),
                                    flexDirection: "row"
                                }}

                        >
                            {this.state.downTime > 0 ?
                                <Text
                                    style={Styles.authHaveSendCodeBtnStyle}
                                >
                                    {this.state.downTime}s后可点击
                                </Text> :
                                null
                            }
                            <TouchableOpacity
                                style={{
                                    marginLeft: px2dp(5),
                                    alignItems: "center"
                                }}
                                onPress={() => {
                                    this._reSendClickAction();
                                }}
                            >
                                <Text
                                    style={this.state.downTime > 0 ?
                                        [Styles.authHaveSendCodeBtnStyle, {textDecorationLine: 'underline'}]
                                        : [Styles.authReSendCodeStyle]}
                                >
                                    重新发送
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * 重新发送验证码
     * @private
     */
    _reSendClickAction = () => {
        const { downTime } = this.state;
        // const { phoneNum } = this.params;
        if (downTime > 0) {
            return;
        }
        if (!netStatusTool.isConnected) {
            bridge.$toast("请检查网络是否连接");
            return;
        }
        bridge.$toast("验证码发送成功,注意查收");
        (new TimeDownUtils()).startDown((time) => {
            this.setState({
                downTime: time
            });
            // loginModel.dowTime = time;
        });

    };

    _finshInputCode = (text) => {
        if (text.length === 4) {
            this.$navigate(RouterMap.InviteCodePage);
        }
    };

}
