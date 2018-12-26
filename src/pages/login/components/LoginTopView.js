import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
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

const {
    close_eye,
    open_eye
} = res;

const dismissKeyboard = require('dismissKeyboard');

class LoginTopViewModel {
    /*0代表验证码登录 1代表密码登录*/
    @observable
    selectIndex = 0;
    @observable
    phoneNumber = '';
    @observable
    vertifyCode = '';
    @observable
    password = '';
    @observable
    isSecuret = true;
    @observable
    dowTime = 0;
    @observer
    haveClick = false;


    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber || phoneNmber.length === 0) {
            this.phoneNumber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    saveHaveClick(flag){
        this.haveClick = flag;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = '';
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            this.vertifyCode = '';
            return;
        }
        this.vertifyCode = vertifyCode;
    }

    @computed
    get isCanClick() {
        if (this.phoneNumber.length < 11 && !this.haveClick) {
            return false;
        }
        if (this.selectIndex === 0) {
            if (this.vertifyCode.length > 0 && !this.haveClick) {
                return true;
            }
        } else {
            if (this.password.length > 3 && !this.haveClick) {
                return true;
            }
        }
    }

}

@observer
export default class LoginTopView extends Component {
    LoginModel = new LoginTopViewModel();

    constructor(props) {
        super(props);

        this.state = {
            isSecuret: true
        };
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
                            style={[Styles.switchBtnStyle, this.LoginModel.selectIndex ? { color: DesignRule.textColor_secondTitle } : { color: DesignRule.mainColor }]}>
                        </UIText>
                        <View
                            style={this.LoginModel.selectIndex ? Styles.btnBottomLineNonStyle : Styles.btnBottomLineStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.switchBtnClick(1);
                    }}>
                        <UIText
                            value={'密码登录'}
                            style={[Styles.switchBtnStyle, this.LoginModel.selectIndex ? { color: DesignRule.mainColor } : { color: DesignRule.textColor_secondTitle }]}>

                        </UIText>
                        <View
                            style={this.LoginModel.selectIndex ? Styles.btnBottomLineStyle : Styles.btnBottomLineNonStyle}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <TextInput
                        allowFontScaling={false}
                        style={Styles.phoneNumberInputStyle}
                        value={this.LoginModel.phoneNumber}
                        onChangeText={text => this.LoginModel.savePhoneNumber(text)}
                        placeholder='请输入手机号'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        onEndEditing={() => {
                            if (!StringUtils.checkPhone(this.LoginModel.phoneNumber)) {
                                bridge.$toast('手机号格式不对');
                            }
                        }}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
                {this.LoginModel.selectIndex ? this.renderPasswordLogin() : this.renderCodeLogin()}
                <TouchableOpacity
                    onPress={this.clickLoginBtn}
                    activeOpacity={this.LoginModel.isCanClick ? 0.6 : 1}
                >
                    <View
                        style={[Styles.loginBtnStyle, this.LoginModel.isCanClick ? { backgroundColor: DesignRule.mainColor } : { backgroundColor: DesignRule.bgColor_grayHeader }]}>

                        <UIText style={Styles.loginBtnTextStyle}
                                value={'登录'}
                        >

                        </UIText>

                    </View>
                </TouchableOpacity>
                {
                    showOldLogin?
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
                                        height: ScreenUtils.width /750 * 245,
                                    }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        </View>
                        :null
                }
                {/*<UIText*/}
                {/*value={}*/}
                {/*/>*/}

            </View>
        );
    }

    switchBtnClick = (index) => {
        // dismissKeyboard();
        this.LoginModel.selectIndex = index;
    };
    renderCodeLogin = () => {
        return (
            <View>
                <View style={Styles.textBgViewStyle}>
                    <TextInput
                        allowFontScaling={false}
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.vertifyCode}
                        onChangeText={text => this.LoginModel.saveVertifyCode(text)}
                        placeholder='请输入验证码'
                        underlineColorAndroid='transparent'
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
                                value={this.LoginModel.dowTime > 0 ? `${this.LoginModel.dowTime}秒后重新获取` : '获取验证码'}
                        >
                        </UIText>
                    </TouchableOpacity>
                </View>
                <CommSpaceLine style={Styles.lineStyle}/>
            </View>
        );
    };
    getVertifyCode = () => {
        if (this.LoginModel.dowTime > 0) {
            return;
        }
        if (!netStatusTool.isConnected) {
            bridge.$toast('请检查网络是否连接');
            return;
        }

        if (StringUtils.checkPhone(this.LoginModel.phoneNumber)) {
            this.LoginModel.dowTime = 60;
            bridge.$toast('验证码发送成功,注意查收');
            (new TimeDownUtils()).startDown((time) => {
                this.LoginModel.dowTime = time;
            });
            SMSTool.sendVerificationCode(0, this.LoginModel.phoneNumber);
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
                        value={this.LoginModel.password}
                        onChangeText={text => this.LoginModel.savePassword(text)}
                        placeholder='请输入密码'
                        underlineColorAndroid='transparent'
                        multiline={false}
                        secureTextEntry={this.LoginModel.isSecuret}
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            dismissKeyboard();
                            this.LoginModel.isSecuret = !this.LoginModel.isSecuret;
                        }}>
                            <Image style={Styles.seePasswordImageStyle}
                                   source={this.LoginModel.isSecuret ? close_eye : open_eye}/>
                        </TouchableOpacity>
                        <CommSpaceLine style={{ marginLeft: 10, width: 1, marginTop: 35, height: 20 }}/>
                        <TouchableOpacity onPress={this.props.forgetPasswordClick}>
                            <UIText style={[Styles.codeTextStyle, { width: 90 }]}
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
        if (!this.LoginModel.isCanClick) {
            return;
        }
        if (StringUtils.checkPhone(this.LoginModel.phoneNumber)) {
            if (this.LoginModel.selectIndex === 0) {
                this.props.loginClick(0, {
                    phoneNumber: this.LoginModel.phoneNumber,
                    code: this.LoginModel.vertifyCode,
                    password: this.LoginModel.password
                });
            } else {
                if (StringUtils.checkPassword(this.LoginModel.password)) {
                    this.props.loginClick(1, {
                        phoneNumber: this.LoginModel.phoneNumber,
                        code: this.LoginModel.vertifyCode,
                        password: this.LoginModel.password
                    });
                } else {
                    bridge.$toast('密码格式不对');
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
            marginTop: 30,
            marginLeft: 20,
            width: 120,
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
            width: 120,
            color: DesignRule.mainColor,
            marginTop: 40,
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
            justifyContent: 'center',
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

