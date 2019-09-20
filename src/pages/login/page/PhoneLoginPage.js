import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, MRTextInput as TextInput, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginModel from '../model/LoginModel';
import ProtocolView from '../components/Login.protocol.view';
import RouterMap, { replaceRoute, routeNavigate } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import LinearGradient from 'react-native-linear-gradient';
import store from '@mr/rn-store';
import { getWxUserInfo, memberLogin, wxLoginAction } from '../model/LoginActionModel';
import { getVerifyToken } from '../model/PhoneAuthenAction';
import res from '../../../comm/res';
import resLogin from '../res';
import { TrackApi } from '../../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;
const btnWidth = ScreenUtils.width - px2dp(60);
export default class PhoneLoginPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: '',
            redBtnBg: false
        };
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    componentDidMount() {
        loginModel.saveIsSelectProtocol(true);
        if (StringUtils.isNoEmpty(loginModel.phoneNumber)) {
            this.setState({
                phoneNum: loginModel.phoneNumber,
                redBtnBg: true
            });
        } else {
            store.get('@mr/localPhone').then((phone) => {
                this.setState({
                    phoneNum: phone || ''
                });
            });
        }
    }

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10, width: 20, height: 20 },
        headerStyle: { borderBottomWidth: 0 }
    };

    /**
     * 下一步校验
     */
    judgePhoneNumber() {
        if (!loginModel.isSelectProtocol) {
            this.$toastShow('请先勾选用户协议');
            return false;
        }
        if (StringUtils.isEmpty(this.state.phoneNum.trim())) {
            bridge.$toast('请输入手机号');
            return false;
        } else {
            if (!StringUtils.checkPhone(this.state.phoneNum)) {
                bridge.$toast('请输入正确的手机号');
                return false;
            }
        }
        return true;
    }

    /**
     * 号码校验，失败则跳转到验证码页面
     */
    verifyPhone = () => {
        if (this.judgePhoneNumber()) {
            // 号码认证
            this.$loadingShow();
            if (loginModel.authPhone) {
                // 回退步数2
                let popNumber = 2;
                getVerifyToken().then((data => {
                    // token去服务端号码认证，认证通过登录成功
                    let params = { token: data };
                    memberLogin(params, () => {
                        // 号码认证登录成功
                        TrackApi.localPhoneNumLogin({ 'loginMethod': 4 });
                        this.$loadingDismiss();
                        bridge.$toast('登录成功');
                    }, (code) => {
                        // 认证失败，
                        if (code === 34014) {
                            /*微信号已经其他手机号绑定*/
                            return;
                        }
                        this.goCodeVerifyPage();
                    }, popNumber);
                })).catch(e => {
                    // 认证失败，
                    this.goCodeVerifyPage();
                });
            } else {
                this.goCodeVerifyPage();
            }
        }
    };

    /**
     * 跳转到验证码页面
     */
    goCodeVerifyPage() {
        this.$loadingDismiss();
        TrackApi.localPhoneNumLogin({ 'loginMethod': 2 });
        // 保存本次输入的手机号
        loginModel.savePhoneNumber(this.state.phoneNum);
        let params = { ...this.params, phoneNum: this.state.phoneNum };
        if (StringUtils.isNoEmpty(this.params.weChatCode)) {
            params.weChatCode = this.params.weChatCode;
        }
        // 跳转到验证码页面
        routeNavigate(RouterMap.LoginVerifyCodePage, params);
    }

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={resLogin.login_logo}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: px2dp(-50) }}>
                    <View style={{
                        backgroundColor: DesignRule.bgColor,
                        borderRadius: px2dp(22),
                        paddingHorizontal: px2dp(16),
                        width: btnWidth,
                        flexDirection: 'row'
                    }}>
                        <TextInput
                            allowFontScaling={false}
                            style={Styles.phoneNumberInputStyle}
                            value={this.state.phoneNum}
                            onChangeText={text => {
                                this.setState({
                                    phoneNum: text || ''
                                }, () => {
                                    if (this.state.phoneNum.trim().length === 11) {
                                        loginModel.savePhoneNumber(this.state.phoneNum);
                                        this.setState({
                                            redBtnBg: true
                                        });
                                    } else {
                                        if (this.state.redBtnBg) {
                                            this.setState({
                                                redBtnBg: false
                                            });
                                        }
                                    }
                                });
                            }}
                            placeholder='请输入手机号'
                            placeholderTextColor={DesignRule.textColor_instruction}
                            keyboardType='numeric'
                            maxLength={11}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ justifyContent: 'center', width: px2dp(30) }} onPress={() => {
                            if (this.state.phoneNum.length > 0) {
                                this.setState({
                                    phoneNum: ''
                                });
                            }
                        }}>
                            <Image style={[Styles.seePasswordImageStyle, { padding: 1.5 }]}
                                   source={this.state.phoneNum.length > 0 ? res.button.inputtext_clear : null}/>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.redBtnBg ?
                            <LinearGradient colors={['#FF1C89', '#FD0129']}
                                            style={[Styles.loginButton, {
                                                marginTop: px2dp(15)
                                            }]}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={Styles.touchableStyle}
                                    onPress={() => {
                                        // 发送验证码，跳转到验证码页面
                                        this.verifyPhone();
                                    }}>
                                    <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'下一步'}/>
                                </TouchableOpacity>
                            </LinearGradient> :
                            <View style={[Styles.loginButton, {
                                backgroundColor: DesignRule.bgColor_grayHeader,
                                marginTop: px2dp(15),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}>
                                <UIText style={{
                                    color: 'white',
                                    fontSize: px2dp(17)
                                }} value={'下一步'}/>
                            </View>
                    }

                    <View style={{ height: px2dp(35), justifyContent: 'center' }}>
                        <UIText style={{
                            fontSize: px2dp(12)
                        }}/>
                    </View>
                </View>
                <View>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ width: this.params.needBottom ? px2dp(102) : 0 }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            {this.params.needBottom ? '其他登录方式' : ''}
                        </Text>
                        <CommSpaceLine style={{ width: this.params.needBottom ? px2dp(102) : 0 }}/>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: px2dp(30), marginTop: px2dp(20) }}>
                        <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            // 微信登录
                            if (!loginModel.isSelectProtocol) {
                                this.$toastShow('请先勾选用户协议');
                                return;
                            }
                            // 微信授权
                            getWxUserInfo((wxData) => {
                                this.$loadingShow('加载中');
                                if (!wxData) {
                                    this.$loadingDismiss();
                                    this.$toastShow('微信授权失败！');
                                    return;
                                }
                                // 微信登录
                                wxLoginAction(wxData, () => {
                                    bridge.$toast('登录成功');
                                    this.$loadingDismiss();
                                    this.$navigateBack();
                                    this.params.callback && this.params.callback();
                                }, () => {
                                    this.$loadingDismiss();
                                });
                            });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={this.params.needBottom ? res.share.weiXin : null}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_instruction
                            }} value={this.params.needBottom ? '微信登录' : ''}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            // 密码
                            replaceRoute(RouterMap.PwdLoginPage, { ...this.params });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={this.params.needBottom ? resLogin.login_pwd : null}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_instruction
                            }} value={this.params.needBottom ? '密码登录' : ''}/>
                        </TouchableOpacity>
                    </View>
                    {this.params.needBottom ? <ProtocolView
                        textClick={(htmlUrl) => {
                            this.$navigate(RouterMap.HtmlPage, {
                                title: '用户协议内容',
                                uri: htmlUrl
                            });
                        }}
                        selectImageClick={(isSelect) => {
                            loginModel.saveIsSelectProtocol(isSelect);
                        }}
                    /> : <View style={{
                        marginTop: px2dp(15),
                        height: px2dp(21),
                        marginBottom: px2dp(12)
                    }}/>}
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
            width: btnWidth
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
