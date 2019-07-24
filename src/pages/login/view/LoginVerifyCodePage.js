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

const { px2dp } = ScreenUtils;
export default class LoginVerifyCodePage extends BasePage {

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
                <UIText style={{ fontSize: px2dp(12), color: DesignRule.textColor_instruction }} value={'短信验证码已发送至 '}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: ScreenUtils.width - px2dp(60) }}>
                        <View style={{
                            backgroundColor: DesignRule.bgColor,
                            borderRadius: px2dp(22),
                            paddingHorizontal: px2dp(16),
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                allowFontScaling={false}
                                style={Styles.phoneNumberInputStyle}
                                onChangeText={text => loginModel.savePhoneNumber(text)}
                                placeholder='请输入验证码'
                                placeholderTextColor={DesignRule.textColor_instruction}
                                keyboardType='numeric'
                                maxLength={11}/>
                            <View style={{ height: px2dp(30), width: 1, backgroundColor: DesignRule.mainColor }}/>
                            <UIText style={{ fontSize: px2dp(14), color: DesignRule.textColor_instruction }}
                                    value={'重新获取'}/>
                        </View>
                        <View style={{ height: px2dp(42), marginTop: px2dp(15) }}/>
                        <UIText style={{
                            paddingVertical: px2dp(8),
                            fontSize: px2dp(12)
                        }}/>
                    </View>
                    <View style={Styles.loginButton}>
                    </View>
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
                            // 微信登录
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.share.weiXin}/>
                            <UIText style={{ fontSize: px2dp(13), color: DesignRule.textColor_mainTitle }}
                                    value={'微信登录'}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            // 密码
                            routeNavigate(RouterMap.PwdLoginPage);
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.login_pwd}/>
                            <UIText style={{ fontSize: px2dp(13), color: DesignRule.textColor_mainTitle }}
                                    value={'密码登录'}/>
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
