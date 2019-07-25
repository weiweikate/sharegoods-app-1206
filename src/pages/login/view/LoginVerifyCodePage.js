import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, MRTextInput as TextInput, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { netStatusTool } from '../../../api/network/NetStatusTool';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import SMSTool from '../../../utils/SMSTool';
import bridge from '../../../utils/bridge';
import { codeLoginAction } from '../model/LoginActionModel';
import RouterMap from '../../../navigation/RouterMap';
import { mediatorCallFunc } from '../../../SGMediator';
import { TrackApi } from '../../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;
export default class LoginVerifyCodePage extends BasePage {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.state = {
            downTime: 60,
            code: ''
        };
        this.getVerifyCode();
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    getVerifyCode = () => {
        if (this.params.phoneNum) {
            // 获取验证码
            if (!netStatusTool.isConnected) {
                bridge.$toast('网络走神，请检查网络连接后重试');
                return;
            }
            bridge.$toast('验证码发送中，请稍后...');
            SMSTool.sendVerificationCode(0, this.params.phoneNum)
                .then((resp) => {
                    bridge.$toast('验证码已发送,请注意查收');
                })
                .catch(error => {
                    this.$toastShow(error.msg);
                });
        }
    };

    toLogin = () => {
        let loginParams = {
            campaignType: this.params.campaignType || '',
            spm: this.params.spm || '',
            code: this.state.code,
            phoneNumber: this.params.phoneNum, password: ''
        };
        if (this.params.wxData) {
            loginParams.nickname = this.params.wxData.nickName;
            loginParams.headImg = this.params.wxData.headerImg;
            loginParams.appOpenid = this.params.wxData.appOpenid;
            loginParams.unionid = this.params.wxData.unionid;
        }

        codeLoginAction(loginParams, (data) => {
            if (data.code === 10000) {
                if (data.data.newUser) {
                    this.$toastShow('注册成功');
                    this.$navigate(RouterMap.InviteCodePage);
                    TrackApi.phoneSignUpSuccess({ 'signUpPhone': this.params.phoneNum });
                    mediatorCallFunc('Home_RequestNoviceGift');
                } else {
                    this.$toastShow('登录成功');
                    TrackApi.codeLoginSuccess();
                }
                this.params.callback && this.params.callback();
                this.$loadingDismiss();
                //走了注册
                if (data.data.withRegister) {
                    mediatorCallFunc('Home_RequestNoviceGift');
                    this.$navigate(RouterMap.InviteCodePage);
                    // TrackApi.phoneSignUpSuccess({ 'signUpPhone': phoneNum });
                } else {
                    this.$navigateBack(3);
                }
            } else {
                this.$loadingDismiss();
                this.$toastShow(data.msg);
            }
        });
    };

    componentDidMount() {
        (new TimeDownUtils()).startDown((time) => {
            this.setState({
                downTime: time
            });
        });
    }

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10 },
        headerStyle: { borderBottomWidth: 0 }
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={res.login_logo}/>
                <View style={{ flex: 1, justifyContent: 'center', marginTop: px2dp(-80) }}>
                    <UIText style={{
                        fontSize: px2dp(12),
                        height: px2dp(20),
                        marginLeft: px2dp(16),
                        color: DesignRule.textColor_instruction,
                        marginBottom: px2dp(10)
                    }} value={'短信验证码已发送至 ' + this.params.phoneNum}/>
                    <View style={{
                        backgroundColor: DesignRule.bgColor,
                        borderRadius: px2dp(22),
                        paddingLeft: px2dp(16),
                        paddingRight: px2dp(8),
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: ScreenUtils.width - px2dp(60)
                    }}>
                        <TextInput
                            allowFontScaling={false}
                            value={this.state.code}
                            style={Styles.phoneNumberInputStyle}
                            onChangeText={text => {
                                this.setState({
                                    code: text
                                }, () => {
                                    if (this.state.code.length >= 4) {
                                        // 登录
                                        this.toLogin();
                                    }
                                });
                            }}
                            placeholder='请输入验证码'
                            placeholderTextColor={DesignRule.textColor_instruction}
                            keyboardType='numeric'
                            autoFocus={true}
                            maxLength={11}/>
                        <View style={{ height: px2dp(25), width: 1, backgroundColor: DesignRule.mainColor }}/>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                          onPress={() => {
                                              if (this.state.downTime === 0) {
                                                  this.getVerifyCode();
                                              } else {
                                                  bridge.$toast('验证码发送中，请稍后');
                                              }
                                          }}>
                            <UIText style={{
                                fontSize: px2dp(14),
                                color: this.state.downTime === 0 ? DesignRule.mainColor : DesignRule.textColor_instruction
                            }} value={this.state.downTime === 0 ? '重新获取' : '重新获取(' + this.state.downTime + 's)'}/>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.loginButton}/>
                    <View style={{ height: px2dp(35), justifyContent: 'center' }}>
                        <UIText style={{
                            fontSize: px2dp(12)
                        }}/>
                    </View>
                </View>
                <View>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ width: 0 }}/>
                        <Text style={Styles.otherLoginTextStyle}/>
                        <CommSpaceLine style={{ width: 0 }}/>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: px2dp(30), marginTop: px2dp(20) }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={null}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_mainTitle
                            }}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={null}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_mainTitle
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginTop: px2dp(15),
                        height: px2dp(21),
                        marginBottom: px2dp(12)
                    }}/>
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
            fontSize: px2dp(13),
            height: px2dp(25)
        },
        touchableStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        loginButton: {
            height: px2dp(42),
            borderRadius: px2dp(22),
            width: px2dp(100),
            marginTop: px2dp(15)
        },
        loginInput: {
            flex: 1,
            height: px2dp(42),
            fontSize: px2dp(19),
            color: DesignRule.textColor_mainTitle
        },
        phoneNumberInputStyle: {
            width: ScreenUtils.width - px2dp(200),
            height: px2dp(42),
            fontSize: px2dp(14),
            marginRight: px2dp(10)
        }
    }
);
