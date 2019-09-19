import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import resLogin from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRTextInput as TextInput, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import loginModel from '../model/LoginModel';
import StringUtils from '../../../utils/StringUtils';
import LinearGradient from 'react-native-linear-gradient';
import bridge from '../../../utils/bridge';
import res from '../../../comm/res';
import { netStatusTool } from '../../../api/network/NetStatusTool';
import SMSTool from '../../../utils/SMSTool';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import { weChatUnusual } from '../model/LoginActionModel';
import RouterMap, { routeNavigate } from '../../../navigation/RouterMap';

const { px2dp } = ScreenUtils;
export default class VerifyWXCodePage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: StringUtils.isNoEmpty(loginModel.phoneNumber) ? loginModel.phoneNumber : '',
            downTime: 0,
            code: ''
        };
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10, width: 20, height: 20 },
        headerStyle: { borderBottomWidth: 0 }
    };

    /**
     * 获取验证码
     */
    getVerifyCode = () => {
        // 获取验证码
        if (!netStatusTool.isConnected) {
            bridge.$toast('网络走神，请检查网络连接后重试');
            return;
        }
        if (StringUtils.isEmpty(this.state.phoneNum.trim())) {
            bridge.$toast('请输入手机号');
            return;
        } else {
            if (!StringUtils.checkPhone(this.state.phoneNum)) {
                bridge.$toast('请输入正确的手机号');
                return;
            }
        }
        this.setState({
            downTime: 60
        }, () => {
            this.timeDown();
        });
        bridge.$toast('验证码发送中，请稍后...');
        SMSTool.sendVerificationCode(0, this.state.phoneNum)
            .then((resp) => {
                bridge.$toast('验证码已发送,请注意查收');
            })
            .catch(error => {
                this.$toastShow(error.msg);
            });
    };

    /**
     * 校验输入的数据
     */
    judgeData = () => {
        if (StringUtils.isEmpty(this.state.phoneNum.trim())) {
            bridge.$toast('请输入手机号');
            return false;
        } else {
            if (!StringUtils.checkPhone(this.state.phoneNum)) {
                bridge.$toast('请输入正确的手机号');
                return false;
            }
        }
        if (StringUtils.isEmpty(this.state.code.trim())) {
            bridge.$toast('请输入验证码');
            return false;
        }
        return true;
    };

    /**
     * 开始倒计时
     */
    timeDown = () => {
        (new TimeDownUtils()).startDown((time) => {
            this.setState({
                downTime: time
            });
        });
    };

    /**
     * 验证手机号
     */
    verifyPhone = () => {
        if (this.judgeData()) {
            this.$loadingShow();
            let params = {
                weChatCode: this.params.weChatCode,
                phone: this.state.phoneNum,
                smsCode: this.state.code
            };
            weChatUnusual(params, () => {
                this.$loadingDismiss();
            }, () => {
                this.$loadingDismiss();
                // 跳转到结果页
                routeNavigate(RouterMap.VerifyResultPage);
            }, 2);
        }
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={resLogin.login_logo}/>
                <View style={{
                    width: ScreenUtils.width - px2dp(60),
                    borderRadius: 10,
                    borderColor: DesignRule.mainColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,0,80,0.1)',
                    marginTop: 25
                }}>
                    <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <Image source={resLogin.verify_phone} style={{ width: 24, height: 24 }}/>
                        <UIText
                            value={'账号异常'}
                            style={{ fontSize: 14, color: DesignRule.mainColor, fontWeight: 'bold', marginLeft: 7 }}/>
                    </View>
                    <UIText value={'请验证绑定该微信号的手机号'}
                            style={{ fontSize: 12, color: DesignRule.mainColor, marginBottom: 10, marginTop: 5 }}/>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: ScreenUtils.width - px2dp(60), marginTop: px2dp(20) }}>
                        <View style={{
                            backgroundColor: DesignRule.bgColor,
                            borderRadius: px2dp(22),
                            paddingHorizontal: px2dp(16),
                            flexDirection: 'row'
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                style={Styles.phoneNumberInputStyle}
                                value={this.state.phoneNum}
                                onChangeText={text => {
                                    this.setState({ phoneNum: text || '' }, () => {
                                        if (this.state.phoneNum.trim().length === 11) {
                                            loginModel.savePhoneNumber(this.state.phoneNum);
                                        }
                                    });
                                }}
                                autoFocus={true}
                                placeholder='请输入手机号'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}
                            />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={{ justifyContent: 'center', width: px2dp(30) }} onPress={() => {
                                this.setState({
                                    phoneNum: ''
                                });
                            }}>
                                <Image style={[Styles.seePasswordImageStyle, { padding: 1.5 }]}
                                       source={this.state.phoneNum.length > 0 ? res.button.inputtext_clear : null}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            backgroundColor: DesignRule.bgColor,
                            borderRadius: px2dp(22),
                            paddingLeft: px2dp(16),
                            paddingRight: px2dp(8),
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: ScreenUtils.width - px2dp(60),
                            marginTop: px2dp(15)
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                value={this.state.code}
                                style={{
                                    width: ScreenUtils.width - px2dp(200),
                                    height: px2dp(42),
                                    fontSize: px2dp(14),
                                    marginRight: px2dp(10)
                                }}
                                onChangeText={text => {
                                    this.setState({
                                        code: text
                                    });
                                }}
                                placeholder='请输入验证码'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}/>
                            <View style={{ height: px2dp(25), width: 1, backgroundColor: DesignRule.mainColor }}/>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    if (this.state.downTime === 0) {
                                        this.getVerifyCode();
                                    }
                                }}>
                                <UIText style={{
                                    fontSize: px2dp(14),
                                    color: this.state.downTime === 0 ? DesignRule.mainColor : DesignRule.textColor_instruction
                                }} value={this.state.downTime === 0 ? '获取验证码' : '重新获取(' + this.state.downTime + 's)'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <LinearGradient colors={['#FF1C89', '#FD0129']}
                                    style={[Styles.loginButton, { marginTop: px2dp(48) }]}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={Styles.touchableStyle}
                            onPress={() => {
                                // 密码登录
                                this.verifyPhone();
                            }}>
                            <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'验证'}/>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginLogo: {
        width: px2dp(62),
        height: px2dp(45),
        marginTop: px2dp(48)
    },
    touchableStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        height: px2dp(42),
        borderRadius: px2dp(22),
        width: ScreenUtils.width - px2dp(60),
        marginTop: px2dp(50)
    },
    phoneNumberInputStyle: {
        width: ScreenUtils.width - px2dp(110),
        height: px2dp(42),
        fontSize: px2dp(14)
    },
    seePasswordImageStyle: {
        width: 20,
        height: 20,
        marginLeft: 5
    }
});
