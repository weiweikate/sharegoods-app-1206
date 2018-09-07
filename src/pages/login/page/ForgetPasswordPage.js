import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image, Alert
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import bridge from '../../../utils/bridge';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';

class ForgetPasswordModel {
    @observable
    phoneNumber = '';
    @observable
    password = '';
    @observable
    vertifyCode = '';
    @observable
    isSecuret = true;
    @observable
    dowTime = 0;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            phoneNmber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (!password) {
            password = '';
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            vertifyCode = '';
            return;
        }
        this.vertifyCode = vertifyCode;
    }

    @computed
    get isCanClick() {
        if (this.phoneNumber.length < 11 && this.vertifyCode.length > 0 && this.password.length >= 6) {
            return true;
        } else {
            return false;
        }
    }
}

@observer
export default class ForgetPasswordPage extends BasePage {
    forgetPasswordModel = new ForgetPasswordModel();
    // 导航配置
    $navigationBarOptions = {
        title: '忘记密码'
    };
    _render() {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                    <View style={{ marginLeft: 30, marginRight: 30, marginTop: 60, flexDirection: 'row' }}>
                        <Text style={{ marginRight: 20 }}>
                            新手机
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.forgetPasswordModel.phoneNumber}
                            onChangeText={text => {
                                this.forgetPasswordModel.savePhoneNumber(text);
                            }}
                            placeholder='请输入手机号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />

                    </View>
                    <CommSpaceLine style={[Styles.lineStyle, { marginLeft: 30, marginRight: 30 }]}/>


                    <View style={{ marginTop: 40, height: 40, marginLeft: 30, marginRight: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginRight: 20 }}>
                                    验证码
                                </Text>
                                <TextInput
                                    style={Styles.inputTextStyle}
                                    value={this.forgetPasswordModel.vertifyCode}
                                    onChangeText={text => {
                                        this.forgetPasswordModel.saveVertifyCode(text);
                                    }}
                                    placeholder='请输入验证码'
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='default'
                                    secureTextEntry={this.forgetPasswordModel.isSecuret}
                                />
                            </View>
                            <TouchableOpacity onPress={this.getVertifyCode}>
                                <Text style={{ color: ColorUtil.mainRedColor }}>
                                    {this.forgetPasswordModel.dowTime > 0 ? `${this.forgetPasswordModel.dowTime}秒后重新获取` : '获取验证码'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*下部输入框*/}
                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    height: 50,
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{marginLeft: 30, marginRight: 30, marginTop: 18 }}>
                            新密码
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.forgetPasswordModel.password}
                            onChangeText={text => {
                                this.forgetPasswordModel.savePassword(text);
                            }}
                            placeholder='支持数字,字母'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />
                    </View>

                    <TouchableOpacity onPress={() => {
                        this.forgetPasswordModel.isSecuret = !this.forgetPasswordModel.isSecuret;
                    }}>
                        <Image
                            source={this.forgetPasswordModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}
                            style={{ marginRight: 30, marginTop: 18 }}/>

                    </TouchableOpacity>

                </View>

                <View style={[{
                    marginLeft: 30,
                    width: ScreenUtils.width - 60,
                    marginTop: 40,
                    height: 45,
                    backgroundColor: ColorUtil.mainRedColor,
                    borderRadius: 5
                },
                    this.forgetPasswordModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }
                ]}>
                    <TouchableOpacity onPress={this.loginClick}>
                        <Text style={{
                            textAlign: 'center',
                            height: 45,
                            alignItems: 'center',
                            fontSize: 14,
                            color: '#fff',
                            paddingTop: 15,
                            fontWeight: '600'
                        }}>
                            完成
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    loginClick = () => {

    };
    /*获取验证码*/
    getVertifyCode = () => {
        if (this.forgetPasswordModel.dowTime > 0) {
            Alert.alert(
                '提示',
                '操作过于频繁稍后重试',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (StringUtils.checkPhone(this.forgetPasswordModel.phoneNumber)) {
            (new TimeDownUtils()).startDown((time) => {
                this.forgetPasswordModel.dowTime = time;
            });
            bridge.$toast('验证码已发送请注意查收');
        } else {
            bridge.$toast('手机格式不对');
        }
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
        lineStyle: {
            marginTop: 5
        },
        inputTextStyle: {
            width: 120
        }
    }
);

