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

class OldUserLoginModel {
    @observable
    phoneNumber;
    @observable
    password;
    @observable
    isSecuret = true;

}

@observer
export default class LoginPage extends Component {
    oldUserLoginModel = new OldUserLoginModel();
    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: '老用户激活',
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
            <View style={{ backgroundColor: '#fff' }}>
                <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 79, height: 79 }} source={LoginAndRegistRes.logoImage}>
                    </Image>
                </View>

                <View style={{ marginLeft: 30, marginRight: 30, marginTop: 60 }}>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.oldUserLoginModel.phoneNumber}
                        // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
                        placeholder='请输入手机号'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
                <View style={{ marginLeft: 30, marginRight: 30, marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.oldUserLoginModel.phoneNumber}
                            // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
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

        // this.oldUserLoginModel.phoneNumber = '333'
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
        }
    }
);

