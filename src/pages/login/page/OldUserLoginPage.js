import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import ScreenUtils from '../../../utils/ScreenUtils';
import loginAndRegistRes from '../res/LoginAndRegistRes';
import BasePage from '../../../BasePage';

class OldUserLoginModel {
    @observable
    phoneNumber = '';
    @observable
    password = '';
    @observable
    isSecuret = true;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            this.phoneNumber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = '';
            return;
        }
        this.password = password;
    }

    @computed
    get isCanClick() {
        if ((this.phoneNumber.length === 11) && (this.password.length >= 6)) {
            return true;
        } else {
            return false;
        }
    }
}

@observer
export default class OldUserLoginPage extends BasePage {
    oldUserLoginModel = new OldUserLoginModel();

    constructor(props) {
        super(props);
    }

    // 导航配置
    $navigationBarOptions = {
        title: '老用户激活'
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };
    /*注册事件*/
    registBtnClick = () => {
        this.$navigate('login/login/RegistPage');

    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 79, height: 79 }} source={LoginAndRegistRes.logoImage}/>
                    </View>

                    <View style={{ marginLeft: 20, marginRight: 30, marginTop: 60 }}>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.oldUserLoginModel.phoneNumber}
                            onChangeText={text => {
                                this.oldUserLoginModel.savePhoneNumber(text);
                            }}
                            placeholder='请输入手机号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />
                        <CommSpaceLine style={Styles.lineStyle}/>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 30, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput
                                style={Styles.inputTextStyle}
                                value={this.oldUserLoginModel.password}
                                onChangeText={text => {
                                    this.oldUserLoginModel.savePassword(text);
                                }}
                                placeholder='请输入密码'
                                underlineColorAndroid={'transparent'}
                                keyboardType='default'
                                secureTextEntry={this.oldUserLoginModel.isSecuret}
                            />
                            <TouchableOpacity onPress={() => {
                                this.oldUserLoginModel.isSecuret = !this.oldUserLoginModel.isSecuret;
                            }}>
                                <Image style={Styles.seePasswordImageStyle}
                                       source={this.oldUserLoginModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}/>
                            </TouchableOpacity>
                        </View>
                        <CommSpaceLine style={Styles.lineStyle}/>
                    </View>
                    <View
                        style={[Styles.oldUserLoginBtnStyle, this.oldUserLoginModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }]}>
                        <TouchableOpacity onPress={this.loginClick}>
                            <Text style={{
                                textAlign: 'center',
                                height: 45,
                                alignItems: 'center',
                                color: '#fff',
                                fontSize: 14,
                                paddingTop: 15,
                                fontWeight: '600'

                            }}>
                                登录
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Image
                    style={{
                        width: ScreenUtils.width,
                        position: 'absolute',
                        bottom: 0,
                        height: 80
                    }}
                    source={loginAndRegistRes.loginBottomImage}
                    resizeMode='cover'/>
                <Text
                    style={{
                        width: ScreenUtils.width,
                        position: 'absolute',
                        bottom: 90,
                        fontSize: 12,
                        color: ColorUtil.Color_666666,
                        textAlign: 'center'
                    }}>
                    客服电话:400-888-8888
                </Text>
            </View>
        );
    }

    /*d点击登录*/
    loginClick = () => {
        this.$navigate('login/login/SetPasswordPage');
    };

}
const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: '#fff'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        otherLoginBgStyle: {
            marginBottom: -20,
            height: 200

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        oldUserLoginBtnStyle: {
            marginLeft: 30,
            width: ScreenUtils.width - 60,
            marginTop: 40,
            height: 45,
            borderRadius: 5,
            backgroundColor: ColorUtil.mainRedColor
        },
        lineStyle: {
            marginTop: 3,
            marginLeft: 10
        }, inputTextStyle: {
            marginLeft: 20,
            width: 120,
            fontSize: 14,
            fontWeight: '400'
        }
    }
);

