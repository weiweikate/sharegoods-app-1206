import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, MRTextInput as TextInput, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginModel from '../model/LoginModel';
import ProtocolView from '../components/Login.protocol.view';
import RouterMap, { routeNavigate } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import LinearGradient from 'react-native-linear-gradient';

const { px2dp } = ScreenUtils;
export default class PwdLoginPage extends BasePage {

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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: ScreenUtils.width - px2dp(60) }}>
                        <View style={{
                            backgroundColor: DesignRule.bgColor,
                            borderRadius: px2dp(22),
                            paddingHorizontal: px2dp(16)
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                style={Styles.phoneNumberInputStyle}
                                value={loginModel.phoneNumber}
                                onChangeText={text => loginModel.savePhoneNumber(text)}
                                placeholder='请输入手机号'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}
                                onEndEditing={() => {
                                    if (StringUtils.isEmpty(loginModel.phoneNumber.trim())) {
                                        bridge.$toast('请输入手机号');
                                    } else {
                                        if (!StringUtils.checkPhone(loginModel.phoneNumber)) {
                                            bridge.$toast('手机号格式不对');
                                        }
                                    }
                                }}
                            />
                        </View>
                        <View style={{
                            backgroundColor: DesignRule.bgColor,
                            borderRadius: px2dp(22),
                            paddingHorizontal: px2dp(16),
                            marginTop: px2dp(15)
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                style={Styles.phoneNumberInputStyle}
                                value={loginModel.phoneNumber}
                                onChangeText={text => loginModel.savePhoneNumber(text)}
                                placeholder='请输入密码'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}
                                onEndEditing={() => {
                                    if (StringUtils.isEmpty(loginModel.phoneNumber.trim())) {
                                        bridge.$toast('请输入手机号');
                                    } else {
                                        if (!StringUtils.checkPhone(loginModel.phoneNumber)) {
                                            bridge.$toast('手机号格式不对');
                                        }
                                    }
                                }}
                            />
                        </View>
                        <TouchableOpacity style={{ width: ScreenUtils.width - px2dp(60), alignItems: 'flex-end' }}
                                          onPress={() => {
                                              routeNavigate(RouterMap.ForgetPasswordPage);
                                          }}>
                            <UIText style={{
                                paddingVertical: px2dp(8),
                                fontSize: px2dp(12), marginRight: px2dp(5),
                                color: DesignRule.textColor_instruction
                            }} value={'忘记密码'}/>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient colors={['#FF1C89', '#FD0129']}
                                    style={Styles.loginButton}>
                        <TouchableOpacity
                            style={Styles.touchableStyle}
                            onPress={() => {
                                // 密码登录
                            }}>
                            <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'确认'}/>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
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

                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.share.weiXin}/>
                            <UIText style={{ fontSize: px2dp(13), color: DesignRule.textColor_mainTitle }}
                                    value={'微信登录'}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            routeNavigate(RouterMap.PhoneLoginPage);
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.login_phone}/>
                            <UIText style={{ fontSize: px2dp(13), color: DesignRule.textColor_mainTitle }}
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
            alignItems: 'center'
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
            width: px2dp(100),
            marginTop: px2dp(50)
        },
        loginInput: {
            flex: 1,
            height: px2dp(42),
            fontSize: px2dp(19),
            color: DesignRule.textColor_mainTitle
        },
        phoneNumberInputStyle: {
            width: ScreenUtils.width - 40,
            height: px2dp(40),
            fontSize: px2dp(14)
        }
    }
);
