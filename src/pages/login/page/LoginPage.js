import React from 'react';
import LoginTopView from '../components/LoginTopView';
import UserModel from '../../../model/user'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginAndRegistRes from '../res/LoginAndRegistRes';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import bridge from '../../../utils/bridge';
import LoginAPI from '../api/LoginApi';

export default class LoginPage extends BasePage {
    constructor() {
        super();
    }

    // 导航配置
    $navigationBarOptions = {
        title: '登录'
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <LoginTopView
                    oldUserLoginClick={this.oldUserLoginClick.bind(this)}
                    forgetPasswordClick={this.forgetPasswordClick}
                    loginClick={(loginType, LoginParam) => this.loginClick(loginType, LoginParam)}
                />
                <View style={Styles.otherLoginBgStyle}>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            其他登陆方式
                        </Text>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                    </View>
                    <View style={{
                        marginLeft: 0,
                        marginRight: 0,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={this.weChatLoginClick}>
                            <Image style={{ width: 50, height: 50 }} source={loginAndRegistRes.weixinImage}/>
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
            </View>
        );
    }

    /*忘记密码*/
    forgetPasswordClick = () => {
        this.$navigate('login/login/ForgetPasswordPage');
    };
    /*微信登陆*/
    weChatLoginClick = () => {
        bridge.$loginWx((data) => {

        });
    };
    /*老用户登陆*/
    oldUserLoginClick = () => {
        this.props.navigation.navigate('login/login/OldUserLoginPage');
    };
    /*注册*/
    registBtnClick = () => {
        this.$navigate('login/login/RegistPage');
    };
    /*登陆*/
    loginClick = (loginType, LoginParam) => {

        if (loginType === 0) {
            LoginAPI.codeLogin({
                authcode: '22',
                code: '333',
                device: '44',
                password: LoginParam.password,
                phone: LoginParam.phoneNumber,
                systemVersion: '44',
                username: '',
                wechatCode: '',
                wechatVersion: ''
            }).then((data) => {
                console.log(data);
                UserModel.saveUserInfo(data.data);
                bridge.$toast('登陆成功')
                // this.$navigateBack('Tab')
                this.$navigateBack()
            }).catch((data) => {
                console.warn(data);
                bridge.$toast(data.msg)
            });
        } else {
            LoginAPI.passwordLogin({
                authcode: '22',
                code: LoginParam.code,
                device: '44',
                password: LoginParam.password,
                phone: LoginParam.phoneNumber,
                systemVersion: '44',
                username: '',
                wechatCode: '',
                wechatVersion: ''
            }).then((data)=>{
                console.log(data);
                UserModel.saveUserInfo(data.data);
                bridge.$toast('登陆成功')
                this.$navigateBack()
            }).catch((data)=>{
                console.warn(data);
                bridge.$toast(data.msg)
            });

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
            left: 30,
            position: 'absolute',
            bottom: 10,
            height: 170

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        otherLoginTextStyle: {
            color: ColorUtil.Color_666666
        }
    }
);

