import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import ScreenUtils from '../../../utils/ScreenUtils';

class LoginTopViewModel {
    /*0代表验证码登陆 1代表密码登陆*/
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

    @action
    savePhoneNumber(phoneNmber) {
        if (StringUtils.isEmpty(phoneNmber)) {
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (StringUtils.isEmpty(password)) {
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (StringUtils.isEmpty(vertifyCode)) {
            return;
        }
        this.vertifyCode = vertifyCode;
    }

    @computed
    get isCanClick() {
        if (this.phoneNumber.length < 11) {
            return false;
        }
        if (this.selectIndex === 0) {
            if (this.vertifyCode.length > 0) {
                return true;
            }
        } else {
            if (this.password.length > 0) {
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

    }

    render() {
        return (
            <View style={Styles.containViewStyle}>
                <View style={Styles.switchBgStyle}>
                    <TouchableOpacity onPress={() => {
                        this.switchBtnClick(0);
                    }}>
                        <Text style={Styles.switchBtnStyle}>
                            验证码登陆
                        </Text>
                        <View
                            style={this.LoginModel.selectIndex ? Styles.btnBottomLineNonStyle : Styles.btnBottomLineStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.switchBtnClick(1);
                    }}>
                        <Text style={Styles.switchBtnStyle}>
                            密码登陆
                        </Text>
                        <View
                            style={this.LoginModel.selectIndex ? Styles.btnBottomLineStyle : Styles.btnBottomLineNonStyle}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.phoneNumber}
                        onChangeText={text => this.LoginModel.savePhoneNumber(text)}
                        placeholder='请输入手机号'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
                {this.LoginModel.selectIndex ? this.renderPasswordLogin() : this.renderCodeLogin()}
                <View style={[Styles.loginBtnStyle, this.LoginModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }]}>
                    <TouchableOpacity onPress={this.clickLoginBtn}>
                        <Text style={[Styles.loginBtnTextStyle,
                            this.LoginModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }]}>
                            登录
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.oldUserLoginBgStyle}>
                    <TouchableOpacity onPress={this.props.oldUserLoginClick}>
                        <Text style={Styles.oldUserLoginBtn}>
                            老用户激活
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    switchBtnClick = (index) => {
        this.LoginModel.selectIndex = index;
    };
    renderCodeLogin = () => {
        return (
            <View>
                <View style={Styles.textBgViewStyle}>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.vertifyCode}
                        onChangeText={text => this.LoginModel.saveVertifyCode(text)}
                        placeholder='请输入验证码'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                    />
                    <TouchableOpacity>
                        <Text style={[Styles.codeTextStyle, { marginLeft: 20 }]}>
                            获取验证码
                        </Text>
                    </TouchableOpacity>
                </View>
                <CommSpaceLine style={Styles.lineStyle}/>
            </View>
        );
    };
    renderPasswordLogin = () => {
        return (
            <View>
                <View style={Styles.textBgViewStyle}>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.password}
                        onChangeText={text => this.LoginModel.savePassword(text)}
                        placeholder='请输入密码'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                        secureTextEntry={this.LoginModel.isSecuret}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            this.LoginModel.isSecuret = !this.LoginModel.isSecuret;
                        }}>
                            <Image style={Styles.seePasswordImageStyle}
                                   source={this.LoginModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}/>
                        </TouchableOpacity>
                        <CommSpaceLine style={{ marginLeft: 8, width: 1, marginTop: 33, height: 20 }}/>
                        <TouchableOpacity>
                            <Text style={Styles.codeTextStyle}>
                                忘记密码
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <CommSpaceLine style={Styles.lineStyle}/>
            </View>
        );
    };
    /*
    * 获取验证码*/
    getCodeFun = () => {

    };
    clickLoginBtn = () => {
        if (StringUtils.checkPhone(this.LoginModel.phoneNumber)) {
            if (this.LoginModel.selectIndex === 0) {

            } else {
                if (StringUtils.checkPassword(this.LoginModel.password)) {

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
            height: 330,
            backgroundColor: '#fff'
        },
        switchBgStyle: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        switchBtnStyle: {
            fontSize: 18,
            color: ColorUtil.mainRedColor,
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: '600'
        },
        btnBottomLineStyle: {
            height: 2,
            backgroundColor: ColorUtil.mainRedColor,
            margin: 10
        },
        btnBottomLineNonStyle: {
            height: 0
        },
        inputTextStyle: {
            marginTop: 30,
            marginLeft: 20,
            width: 120,
            height: 40,
            backgroundColor: 'white',
            fontSize: 14,
            fontWeight: '600'
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
            width: 80,
            color: ColorUtil.mainRedColor,
            marginTop: 40
        },
        loginBtnStyle: {
            marginTop: 10,
            marginLeft: 0,
            height: 50,
            width: ScreenUtils.width - 40,
            borderRadius: 5,
            backgroundColor: ColorUtil.mainRedColor
        },
        loginBtnTextStyle: {
            paddingTop: 18,
            color: '#fff',
            height: 48,
            margin: 0,
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 14
        },
        oldUserLoginBgStyle: {
            flexDirection: 'row-reverse'
        },
        oldUserLoginBtn: {
            width: 100,
            marginTop: 8,
            height: 35,
            color: ColorUtil.ligtGray,
            textAlign: 'center',
            marginRight: 0
        },
        seePasswordImageStyle: {
            width: 20,
            height: 15,
            marginLeft: 5,
            marginTop: 40
        }
    }
);

