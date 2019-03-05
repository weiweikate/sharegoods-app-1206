import React, {} from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert
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
            phoneNumber: ""
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
                    style={{
                        flex: 1,
                        alignItems: "center"
                    }}
                >
                    <MRTextInput
                        style={InputStyle.textInputStyle}
                        value={this.state.phoneNumber}
                        onChangeText={text => this.setState({
                            phoneNumber: text
                        })}
                        placeholder='请输入手机号'
                        keyboardType='numeric'
                        maxLength={11}
                        onEndEditing={() => {
                            // if (StringUtils.isEmpty(loginModel.phoneNumber.trim())) {
                            //     bridge.$toast("请输入手机号");
                            // } else {
                            //     if (!StringUtils.checkPhone(loginModel.phoneNumber)) {
                            //         bridge.$toast("手机号格式不对");
                            //     }
                            // }
                        }}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <View
                        style={{
                            marginTop: ScreenUtils.px2dp(10),
                            height: 1,
                            width: ScreenUtils.width - ScreenUtils.px2dp(80),
                            backgroundColor: DesignRule.imgBg_color
                        }}
                    />
                    <View
                        style={localNumberLoginStyles.btnBgStyle}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this._clickAction();
                            }}
                        >
                            <Text
                                style={localNumberLoginStyles.btnTextStyle}
                            >
                                本机号码一键登录
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*下部分视图*/}
                <View
                    style={Styles.bottomBgContent}
                >
                    <ProtocolView
                        selectImageClick={() => {}}
                        textClick={() => {

                        }}
                    />
                </View>
            </View>
        );
    }

    _clickAction = () => {
        if (StringUtils.checkPhone(this.state.phoneNumber)) {

            Alert.alert(
                '18768435263',
                '如果您是双卡手机，请确保填写的号码是默认上网的手机号码',
                [
                    {text: '从新填写', onPress: () => console.log('Ask me later pressed')},

                    {text: '确定', onPress: () => console.log('Cancel Pressed')},
                ],
                { cancelable: false }
            )

        } else {
            this.$toastShow("请输入正确手机号");
        }
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
        }
    }
);
