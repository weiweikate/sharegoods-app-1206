import React from 'react';
import LoginTopView from '../components/LoginTopView';
import UserModel from '../../../model/user';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    BackAndroid
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginAndRegistRes from '../res/LoginAndRegistRes';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import bridge from '../../../utils/bridge';
import LoginAPI from '../api/LoginApi';
import { NavigationActions } from 'react-navigation';

export default class LoginPage extends BasePage {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

        console.log(this.props.navigation.state)
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        this.$NavBarLeftPressed();
        return true;
    };

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    // 导航配置
    $navigationBarOptions = {
        title: '登录',
        gesturesEnabled: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };
    $NavBarLeftPressed = () => {
        if (UserModel.isLogin) {
            this.$navigateBack();
        } else {
            if (this.params.callback){
                let resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            } else {
                this.$navigateBack();
            }
        }
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
            console.log(data);
            LoginAPI.appWechatLogin({
                device: data.device,
                encryptedData: '',
                headImg: '',
                iv: '',
                nickname: data.nickName,
                openid: data.openid,
                systemVersion: data.systemVersion,
                wechatVersion: ''
            }).then((res) => {
                if (res.code === 34005) {
                    this.$navigate('login/login/RegistPage', data);
                } else if (res.code === 10000) {
                    UserModel.saveUserInfo(res.data);
                    bridge.$toast('登陆成功');
                    this.$navigateBack();
                }
            }).catch((error) => {
                if (error.code === 34005) {
                    this.$navigate('login/login/RegistPage', data);
                }
                // bridge.$toast(data.msg);
            });
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
        this.$loadingShow();
        if (loginType === 0) {
            LoginAPI.codeLogin({
                authcode: '22',
                code: '微信code',
                device: '设备名称',
                password: LoginParam.password,
                phone: LoginParam.phoneNumber,
                systemVersion: '44',
                username: '',
                wechatCode: '',
                wechatVersion: ''
            }).then((data) => {
                this.$loadingDismiss();
                // console.log(data);
                UserModel.saveUserInfo(data.data);
                bridge.$toast('登陆成功');
                this.params.callback && this.params.callback();
                this.$navigateBack();
            }).catch((data) => {
                this.$loadingDismiss();
                bridge.$toast(data.msg);
                /*未注册*/
                if (data.code === 34005) {
                    this.registBtnClick();
                }
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
            }).then((data) => {
                this.$loadingDismiss();
                console.log(data);
                UserModel.saveUserInfo(data.data);
                bridge.$toast('登陆成功');
                this.params.callback && this.params.callback();
                this.$navigateBack();
            }).catch((data) => {
                this.$loadingDismiss();
                console.warn(data);
                bridge.$toast(data.msg);
            });

        }
    };
};

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

