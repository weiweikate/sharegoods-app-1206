import React from 'react';
import LoginTopView from '../components/LoginTopView';
import UserModel from '../../../model/user';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image, DeviceEventEmitter
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import BasePage from '../../../BasePage';
import bridge from '../../../utils/bridge';
import LoginAPI from '../api/LoginApi';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { homeModule } from '../../home/Modules'
import res from '../res';
import JPushUtils from '../../../utils/JPushUtils';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const {
    share: {
        weiXin
    }
} = res;

/**
 * @author huyufeng
 * @date on 2018/9/7
 * @describe 登录页
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
export default class LoginPage extends BasePage {
    constructor(props) {
        super(props);

    }
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
    $isMonitorNetworkStatus() {
        return false;
    }

    $NavBarLeftPressed = () => {
        if (UserModel.isLogin) {
            this.$navigateBack();
        } else {
            if (this.params.callback) {
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
                        <CommSpaceLine style={{ width: 80 }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            其他登录方式
                        </Text>
                        <CommSpaceLine style={{ width: 80 ,marginLeft:5}}/>
                    </View>
                    <View style={{
                        marginTop: 15,
                        marginLeft: 0,
                        marginRight: 0,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={this.weChatLoginClick}>
                            <Image style={{ width: 50, height: 50 }} source={weiXin}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }


    /*忘记密码*/
    forgetPasswordClick = () => {
        this.$navigate('login/login/ForgetPasswordPage');
    };
    /*微信登陆*/
    weChatLoginClick = () => {
        track(trackEvent.login,{loginMethod:'微信登录用'})
        bridge.$loginWx((data) => {
            console.log(data);
            LoginAPI.appWechatLogin({
                device: data.device,
                encryptedData: '',
                headImg: data.headerImg,
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
                    UserModel.saveToken(res.data.token);
                    bridge.$toast('登录成功');
                    console.log(UserModel);
                    homeModule.loadHomeList()
                    bridge.setCookies(res.data);
                    this.$navigateBack();
                }
            }).catch((error) => {
                if (error.code === 34005) {
                    this.$navigate('login/login/RegistPage', data);
                }
                bridge.$toast(data.msg);
            });
        });
    };

    /*老用户登陆*/
    oldUserLoginClick = () => {
        this.$navigate('login/login/OldUserLoginPage')
    };
    /*注册*/
    registBtnClick = () => {
        this.$navigate('login/login/RegistPage');
    };

    /*登陆*/
    loginClick = (loginType, LoginParam) => {
        this.$loadingShow();
        if (loginType === 0) {
            track(trackEvent.login,{loginMethod:'验证码登录'})
            LoginAPI.codeLogin({
                authcode: '',
                code: LoginParam.code,
                device: '设备名称',
                password: LoginParam.password,
                phone: LoginParam.phoneNumber,
                systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() : '暂无',
                username: '',
                wechatCode: '',
                wechatVersion: ''
            }).then((data) => {
                this.$loadingDismiss();
                UserModel.saveUserInfo(data.data);
                UserModel.saveToken(data.data.token);
                DeviceEventEmitter.emit('homePage_message',null);
                DeviceEventEmitter.emit('contentViewed',null);
                bridge.$toast('登录成功');
                homeModule.loadHomeList()
                bridge.setCookies(data.data);
                console.log(UserModel)

                if (this.params.callback) {
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

                //推送
                JPushUtils.updatePushTags(); JPushUtils.updatePushAlias();
                /**/
            }).catch((data) => {
                this.$loadingDismiss();
                bridge.$toast(data.msg);
                /*未注册*/
                if (data.code === 34001) {
                    this.$navigate('login/login/RegistPage', { phone: LoginParam.phoneNumber });
                }
            });
        } else {
            // this.$loadingShow();
            track(trackEvent.login,{loginMethod:'密码登录'})
            LoginAPI.passwordLogin({
                authcode: '22',
                code: LoginParam.code,
                device: '44',
                password: LoginParam.password,
                phone: LoginParam.phoneNumber,
                systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() + '' : '22',
                username: '',
                wechatCode: '11',
                wechatVersion: '11'
            }).then((data) => {
                this.$loadingDismiss();
                UserModel.saveUserInfo(data.data);
                UserModel.saveToken(data.data.token);
                DeviceEventEmitter.emit('homePage_message',null);
                DeviceEventEmitter.emit('contentViewed',null);
                bridge.$toast('登录成功');
                homeModule.loadHomeList()
                bridge.setCookies(data.data);
                this.params.callback && this.params.callback();
                // /**
                //  * 跳转导师选择页面
                //  */
                // this.$navigate('login/login/SelectMentorPage');
                // return;
                if (this.params.callback) {
                  this.$navigateBackToHome();
                } else {
                    this.$navigateBack();
                }

            }).catch((data) => {
                console.log(data);
                this.$loadingDismiss();
                bridge.$toast(data.msg);
                if (data.code === 34001) {
                    this.$navigate('login/login/RegistPage', { phone: LoginParam.phoneNumber });
                }
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
            color: DesignRule.textColor_secondTitle
        },
        otherLoginBgStyle: {
            // left: 30,
            width: ScreenUtils.width,
            position: 'absolute',
            bottom: 10,
            height: 170,
            justifyContent: 'center',
            alignItems: 'center'
        },
        lineBgStyle: {
            width: ScreenUtils.width,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
        },
        otherLoginTextStyle: {
            color: DesignRule.textColor_secondTitle,
            marginLeft:5,
        }
    }
);

