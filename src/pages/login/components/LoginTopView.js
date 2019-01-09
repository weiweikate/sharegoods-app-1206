import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import ScreenUtils from '../../../utils/ScreenUtils';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import SMSTool from '../../../utils/SMSTool';
import { netStatusTool } from '../../../api/network/NetStatusTool';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import UIText from '../../../components/ui/UIText';
import { MRTextInput as TextInput } from '../../../components/ui';
import loginModel from '../model/LoginModel';

const {
    close_eye,
    open_eye
} = res;
const dismissKeyboard = require('dismissKeyboard');

@observer
export default class LoginTopView extends Component {
    LoginModel = loginModel;

    constructor(props) {
        super(props);
    }

    render() {
        const { showOldLogin } = this.props;
        return (
            <View style={Styles.containViewStyle}>
                <View style={Styles.switchBgStyle}>
                    <TouchableOpacity onPress={() => {
                        this.switchBtnClick(0);
                    }}>
                        <UIText
                            value={'验证码登录'}
                            style={[Styles.switchBtnStyle, loginModel.selectIndex ? { color: DesignRule.textColor_secondTitle } : { color: DesignRule.mainColor }]}>
                        </UIText>
                        <View
                            style={loginModel.selectIndex ? Styles.btnBottomLineNonStyle : Styles.btnBottomLineStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.switchBtnClick(1);
                    }}>
                        <UIText
                            value={'密码登录'}
                            style={[Styles.switchBtnStyle, loginModel.selectIndex ? { color: DesignRule.mainColor } : { color: DesignRule.textColor_secondTitle }]}>

                        </UIText>
                        <View
                            style={loginModel.selectIndex ? Styles.btnBottomLineStyle : Styles.btnBottomLineNonStyle}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <TextInput
                        allowFontScaling={false}
                        style={Styles.phoneNumberInputStyle}
                        value={loginModel.phoneNumber}
                        onChangeText={text => loginModel.savePhoneNumber(text)}
                        placeholder='请输入手机号'
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
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
                {loginModel.selectIndex ? this.renderPasswordLogin() : this.renderCodeLogin()}
                <TouchableOpacity
                    onPress={this.clickLoginBtn}
                    activeOpacity={loginModel.isCanClick ? 0.6 : 1}
                >
                    <View
                        style={[Styles.loginBtnStyle, loginModel.isCanClick ? { backgroundColor: DesignRule.mainColor } : { backgroundColor: DesignRule.bgColor_grayHeader }]}>

                        <UIText style={Styles.loginBtnTextStyle}
                                value={'登录'}
                        >

                        </UIText>

                    </View>
                </TouchableOpacity>
                {
                    showOldLogin ?
                        <View style={Styles.oldUserLoginBgStyle}>
                            <TouchableOpacity onPress={this.props.oldUserLoginClick}>
                                {/*<UIText*/}
                                {/*style={Styles.oldUserLoginBtn}*/}
                                {/*value={' 老用户激活>>'}*/}
                                {/*>*/}
                                {/*</UIText>*/}
                                <Image
                                    source={res.oldLoginBanner}
                                    style={{
                                        width: ScreenUtils.width - 40,
                                        height: ScreenUtils.width / 750 * 245
                                    }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {/*<UIText*/}
                {/*value={}*/}
                {/*/>*/}

            </View>
        );
    }

    switchBtnClick = (index) => {
        // dismissKeyboard();
        loginModel.selectIndex = index;
    };
    renderCodeLogin = () => {
        return (
            <View>
                <View style={Styles.textBgViewStyle}>
                    <TextInput
                        allowFontScaling={false}
                        style={Styles.inputTextStyle}
                        value={loginModel.vertifyCode}
                        onChangeText={text => loginModel.saveVertifyCode(text)}
                        placeholder='请输入验证码'
                        keyboardType='numeric'
                        multiline={false}
                        secureTextEntry={false}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <TouchableOpacity
                        onPress={this.getVertifyCode}
                        activeOpacity={1}
                    >
                        <UIText style={Styles.codeTextStyle}
                                value={loginModel.dowTime > 0 ? `${loginModel.dowTime}秒后重新获取` : '获取验证码'}
                        >
                        </UIText>
                    </TouchableOpacity>
                </View>
                <CommSpaceLine style={Styles.lineStyle}/>
            </View>
        );
    };
    getVertifyCode = () => {
        if (loginModel.dowTime > 0) {
            return;
        }
        if (!netStatusTool.isConnected) {
            bridge.$toast('请检查网络是否连接');
            return;
        }
        if (StringUtils.isEmpty(loginModel.phoneNumber.trim())) {
            bridge.$toast('请输入手机号');
            return;
        }
        if (StringUtils.checkPhone(loginModel.phoneNumber)) {
            loginModel.dowTime = 60;
            bridge.$toast('验证码发送成功,注意查收');
            (new TimeDownUtils()).startDown((time) => {
                loginModel.dowTime = time;
            });
            SMSTool.sendVerificationCode(0, loginModel.phoneNumber);
        } else {
            bridge.$toast('手机格式不对');
        }
    };
    renderPasswordLogin = () => {
        return (
            <View>
                <View style={Styles.textBgViewStyle}>
                    <TextInput
                        allowFontScaling={false}
                        style={Styles.inputTextStyle}
                        value={loginModel.password}
                        onChangeText={text => loginModel.savePassword(text)}
                        placeholder='请输入密码'
                        multiline={false}
                        secureTextEntry={loginModel.isSecuret}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            dismissKeyboard();
                            loginModel.isSecuret = !loginModel.isSecuret;
                        }}>
                            <Image style={Styles.seePasswordImageStyle}
                                   source={loginModel.isSecuret ? close_eye : open_eye}/>
                        </TouchableOpacity>
                        <CommSpaceLine style={{ marginLeft: 10, width: 1, marginTop: 35, height: 20 }}/>
                        <TouchableOpacity onPress={this.props.forgetPasswordClick}>
                            <UIText style={Styles.codeTextStyle}
                                    value={'忘记密码'}
                            >
                            </UIText>
                        </TouchableOpacity>
                    </View>
                </View>
                <CommSpaceLine style={Styles.lineStyle}/>
            </View>
        );
    };

    clickLoginBtn = () => {
        if (!loginModel.isCanClick) {
            return;
        }
        if (StringUtils.checkPhone(loginModel.phoneNumber)) {
            if (loginModel.selectIndex === 0) {
                this.props.loginClick(0, {
                    phoneNumber: loginModel.phoneNumber,
                    code: loginModel.vertifyCode,
                    password: loginModel.password
                });
            } else {
                if (StringUtils.checkPassword(loginModel.password)) {
                    this.props.loginClick(1, {
                        phoneNumber: loginModel.phoneNumber,
                        code: loginModel.vertifyCode,
                        password: loginModel.password
                    });
                } else {
                    bridge.$toast('需数字、字母组合');
                }
            }
        } else {
            bridge.$toast('手机格式不对');
        }

    };
}

const Styles = StyleSheet.create(
    {
        containViewStyle: {
            margin: 50,
            marginRight: 20,
            marginLeft: 20,
            // height: 400,
            backgroundColor: '#fff'
        },
        switchBgStyle: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        switchBtnStyle: {
            fontSize: 18,
            color: DesignRule.mainColor,
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: '600'
        },
        btnBottomLineStyle: {
            height: 2,
            backgroundColor: DesignRule.mainColor,
            margin: 10
        },
        btnBottomLineNonStyle: {
            height: 0
        },
        phoneNumberInputStyle: {
            marginTop: 30,
            marginLeft: 20,
            width: ScreenUtils.width - 40,
            height: 40,
            fontSize: 14,
            fontWeight: '400'
        },
        inputTextStyle: {
            flex: 1,
            marginTop: 30,
            marginLeft: 20,
            height: 40,
            fontSize: 14,
            fontWeight: '400'
        },
        lineStyle: {
            marginLeft: 20,
            marginRight: 20,
            marginTop: 6
        },
        textBgViewStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        codeTextStyle: {
            textAlign: 'center',
            color: DesignRule.mainColor,
            marginTop: 40,
            marginRight: 20,
            marginLeft: 10,
            fontSize: 13
        },
        loginBtnStyle: {
            marginTop: 20,
            marginLeft: 15,
            height: 50,
            width: ScreenUtils.width - 70,
            borderRadius: 25,
            backgroundColor: DesignRule.mainColor,
            justifyContent: 'center',
            alignItems: 'center'
        },
        loginBtnTextStyle: {
            // paddingTop: 16,
            color: '#fff',
            // height:,
            margin: 0,
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 17
        },
        oldUserLoginBgStyle: {
            marginTop: 30,
            // flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center'
            // height:200,
        },
        oldUserLoginBtn: {
            width: 100,
            marginTop: 8,
            height: 35,
            color: DesignRule.textColor_mainTitle,
            textAlign: 'center',
            marginRight: 0,
            fontSize: 13
        },
        seePasswordImageStyle: {
            width: 20,
            height: 15,
            marginLeft: 5,
            marginTop: 42
        }
    }
);

