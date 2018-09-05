import React, { Component } from 'react';
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
import { observable } from 'mobx';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import ScreenUtils from '../../../utils/ScreenUtils';

class SetPasswordModel {
    @observable
    phoneNumber;
    @observable
    password;
    @observable
    isSecuret = true;

}

@observer
export default class SetPasswordPage extends Component {
    setPasswordModel = new SetPasswordModel();
    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: '设置账号及密码',
            show: true
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };

    render() {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                    <View style={{ marginLeft: 30, marginRight: 30, marginTop: 60, flexDirection: 'row' }}>
                        <Text style={{ marginRight: 20 }}>
                            新手机号
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.setPasswordModel.phoneNumber}
                            // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
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
                                    value={this.setPasswordModel.phoneNumber}
                                    // onChangeText={text => {this..phoneNumber = text}})}
                                    placeholder='请输入密码'
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='default'
                                    secureTextEntry={this.setPasswordModel.isSecuret}
                                />
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.setPasswordModel.isSecuret = !this.setPasswordModel.isSecuret;
                            }}>
                                <Text>
                                    获取验证码
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
                        <Text style={{ marginRight: 20, marginLeft: 30, marginRight: 30, marginTop: 18 }}>
                            新密码
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.setPasswordModel.phoneNumber}
                            // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
                            placeholder='支持数字,字母,特殊符号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />
                    </View>

                    <TouchableOpacity onPress={() => {
                        this.setPasswordModel.isSecuret = !this.setPasswordModel.isSecuret;
                    }}>
                        <Image
                            source={this.setPasswordModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}
                            style={{ marginRight: 30, marginTop: 18 }}/>

                    </TouchableOpacity>

                </View>

                <View style={{ marginRight: 30, marginLeft: 30, marginTop: 40, height: 45 }}>
                    <TouchableOpacity onPress={this.loginClick}>
                        <Text style={{
                            backgroundColor: ColorUtil.mainRedColor,
                            textAlign: 'center',
                            height: 45,
                            alignItems: 'center',
                            fontsize: 14,
                            color: '#fff',
                            paddingTop: 15,
                            fontWeight: '600'
                        }}>
                            登陆
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    loginClick = () => {

        this.setPasswordModel.phoneNumber = '333';
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
        }
    }
);

