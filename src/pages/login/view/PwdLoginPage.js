import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import resLogin from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, MRTextInput as TextInput, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginModel from '../model/LoginModel';
import ProtocolView from '../components/Login.protocol.view';
import RouterMap, { replaceRoute, routeNavigate } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';
import LinearGradient from 'react-native-linear-gradient';
import { getWxUserInfo, pwdLoginAction, wxLoginAction } from '../model/LoginActionModel';
import bridge from '../../../utils/bridge';
import res from '../../../comm/res';

const { px2dp } = ScreenUtils;
export default class PwdLoginPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: StringUtils.isNoEmpty(loginModel.phoneNumber) ? loginModel.phoneNumber : '',
            pwd: '',
            isSecret: true
        };
        loginModel.saveIsSelectProtocol(true);
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10 },
        headerStyle: { borderBottomWidth: 0 }
    };

    pwdLogin = () => {
        if (!loginModel.isSelectProtocol) {
            this.$toastShow('请先勾选用户协议');
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
        if (!StringUtils.checkPassword(this.state.pwd)) {
            bridge.$toast('密码需要数字、字母组合');
            return;
        }
        let loginParam = {
            campaignType: this.params.campaignType || '',
            spm: this.params.spm || '',
            phoneNumber: this.state.phoneNum,
            password: this.state.pwd
        };
        pwdLoginAction(loginParam, (data) => {
            if (data.code === 10000) {
                this.$toastShow('登录成功');
                this.params.callback && this.params.callback();
                this.$loadingDismiss();
                this.$navigateBack();
            } else {
                this.$loadingDismiss();
            }
            loginModel.savePhoneNumber(this.state.phoneNum);
        });
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={resLogin.login_logo}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: ScreenUtils.width - px2dp(60), marginTop: px2dp(32) }}>
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
                                placeholder='请输入手机号'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}
                            />
                            <TouchableOpacity
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
                            paddingHorizontal: px2dp(16),
                            marginTop: px2dp(15),
                            flexDirection: 'row'
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                style={Styles.phoneNumberInputStyle}
                                value={this.state.pwd}
                                onChangeText={text => this.setState({ pwd: text })}
                                placeholder='请输入密码'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                secureTextEntry={this.state.isSecret}
                            />
                            <TouchableOpacity
                                style={{ justifyContent: 'center', width: px2dp(30) }} onPress={() => {
                                loginModel.isSecuret = !loginModel.isSecuret;
                                this.setState({
                                    isSecret: !this.state.isSecret
                                });
                            }}>
                                <Image style={Styles.seePasswordImageStyle}
                                       source={this.state.isSecret ? res.button.close_eye : res.button.open_eye}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: ScreenUtils.width - px2dp(60), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ height: px2dp(35), justifyContent: 'center' }}
                                              onPress={() => {
                                                  routeNavigate(RouterMap.ForgetPasswordPage, { phoneNum: loginModel.phoneNumber });
                                              }}>
                                <UIText style={{
                                    fontSize: px2dp(12), marginRight: px2dp(5),
                                    color: DesignRule.textColor_instruction
                                }} value={'忘记密码'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <LinearGradient colors={['#FF1C89', '#FD0129']}
                                style={[Styles.loginButton, { marginTop: 0, marginBottom: px2dp(40) }]}>
                    <TouchableOpacity
                        style={Styles.touchableStyle}
                        onPress={() => {
                            // 密码登录
                            this.pwdLogin();
                        }}>
                        <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'确认'}/>
                    </TouchableOpacity>
                </LinearGradient>
                <View>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ width: px2dp(102) }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            其他登录方式
                        </Text>
                        <CommSpaceLine style={{ width: px2dp(102) }}/>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: px2dp(30), marginTop: px2dp(20) }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            if (!loginModel.isSelectProtocol) {
                                this.$toastShow('请先勾选用户协议');
                                return;
                            }
                            // 微信授权登录
                            getWxUserInfo((wxData) => {
                                this.$loadingShow('加载中');
                                wxLoginAction(wxData, (code, data) => {
                                    this.$loadingDismiss();
                                    if (code === 10000) {
                                        this.$navigateBack();
                                        this.params.callback && this.params.callback();
                                    } else if (code === 34005) {
                                        // 绑定手机
                                        this.$toastShow('请绑定手机号');
                                        routeNavigate(RouterMap.PhoneLoginPage, {
                                            ...this.params,
                                            needBottom: false,
                                            wxData
                                        });
                                    }
                                });
                            });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.share.weiXin}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_mainTitle
                            }} value={'微信登录'}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            replaceRoute(RouterMap.PhoneLoginPage, { ...this.params, needBottom: true });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={resLogin.login_phone}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_mainTitle
                            }}
                                    value={'手机号登录'}/>
                        </TouchableOpacity>
                    </View>
                    <ProtocolView
                        textClick={(htmlUrl) => {
                            this.$navigate(RouterMap.HtmlPage, {
                                title: '用户协议内容',
                                uri: htmlUrl
                            });
                        }}
                        selectImageClick={(isSelect) => {
                            loginModel.saveIsSelectProtocol(isSelect);
                        }}
                    />
                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create(
    {
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
        lineBgStyle: {
            width: ScreenUtils.width,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: px2dp(25)
        },
        otherLoginTextStyle: {
            color: DesignRule.textColor_secondTitle,
            marginHorizontal: px2dp(6),
            fontSize: px2dp(13)
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
        loginInput: {
            flex: 1,
            height: px2dp(42),
            fontSize: px2dp(19),
            color: DesignRule.textColor_mainTitle
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
    }
);
