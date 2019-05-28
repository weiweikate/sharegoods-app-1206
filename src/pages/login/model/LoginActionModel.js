/**
 * @author huyufeng
 * @date on 2019/3/1
 * @describe 登录相关action
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import { homeModule } from '../../home/model/Modules';
import UserModel from '../../../model/user';
import { login, TrackApi } from '../../../utils/SensorsTrack';
import JPushUtils from '../../../utils/JPushUtils';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import { DeviceEventEmitter } from 'react-native';
import RouterMap from '../../../navigation/RouterMap';
import { NavigationActions } from 'react-navigation';
import { track } from '../../../utils/SensorsTrack';

/**
 * @param phone 校验手机号
 * @param athenToken  ali 返回的校验token
 * @param navigation  导航器
 * @param successCallBack 登录成功后的回调
 * hyf 后期更改去掉phone
 */
const oneClickLoginValidation = (phone, authenToken, navigation, successCallBack) => {
    TrackApi.LoginButtonClick({'loginMethod':4})
    LoginAPI.oneClickLoginValidation({
        token: authenToken
    }).then(result => {
        successCallBack && successCallBack();
        TrackApi.localPhoneNumLogin({'loginMethod':4})
        if (result.unionid == null) {
            //未绑定微信
            phoneBindWx();
        }
        if (result.data.regNow) {
            //新用户
            navigation.navigate(RouterMap.InviteCodePage);
        } else {
            //老用户
            gobackPage(navigation);
        }

        UserModel.saveUserInfo(result.data);
        UserModel.saveToken(result.data.token);
        homeModule.loadHomeList();
        bridge.setCookies(result.data);
    }).catch(error => {
        bridge.$toast(error.msg);
    });
};
const gobackPage = (navigation) => {
    // //老用户登录成功后直接退出原界面
    try {
        let $routes = global.$routes || [];
        let router = $routes[$routes.length - 1];
        let routerKey = router.key;
        const backAction = NavigationActions.back({ key: routerKey });
        navigation.dispatch(backAction);
    } catch (e) {
        navigation.popToTop();
    }
};
/**
 * 一键登录后未绑定微信去绑定微信
 */
const phoneBindWx = () => {
    getWxUserInfo((wxInfo) => {
        console.log(wxInfo);
        //去绑定微信，成功与否不管
        LoginAPI.phoneBindWx({
            unionId: wxInfo.unionid,
            appOpenid: wxInfo.appOpenid,
            headImg: wxInfo.headerImg,
            nickname: wxInfo.nickName
        }).then(result => {
            // bridge.$toast('微信绑定成功');
        }).catch(error => {
            bridge.$toast(error.msg);
        });
    });
};
/**
 * 获取微信用户信息
 * @param callback
 */
const getWxUserInfo = (callback) => {
    bridge.$loginWx((data) => {
        // appOpenid: "o-gdS1iEksKTwhko1pgSXdi82KUI"
        // device: "iPhone 7 Plus"
        // headerImg: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTItjYTTok0ich165RayY0byaJH5nQZMUmZR6pFch6aBLNH0iaicTO9miaaSSMvTwFvUob1rSJib52WVxow/132"
        // nickName: "腊月雨"
        // systemVersion: "11.4.1"
        // title: "绑定手机号"
        // unionid: "oJCt41Mr5Jk4dDg3x92ZfvXP4F10"
        callback(data);
    });
};
/**
 * 回调code 和 数据 34005 需要去绑定手机号 10000 登录成功
 * @param callBack
 */
const wxLoginAction = (callBack) => {
    TrackApi.LoginButtonClick({'loginMethod':1})
    getWxUserInfo((data) => {
        LoginAPI.appWechatLogin({
            device: data.device,
            encryptedData: '',
            headImg: data.headerImg,
            iv: '',
            nickname: data.nickName,
            appOpenid: data.appOpenid,
            systemVersion: data.systemVersion,
            wechatVersion: '',
            unionid: data.unionid
        }).then((res) => {
            if (res.code === 34005) {
                data.title = '绑定手机号';
                callBack && callBack(res.code, data);
                TrackApi.wxSignUpSuccess()
            } else if (res.code === 10000) {
                callBack && callBack(res.code, data);
                UserModel.saveUserInfo(res.data);
                UserModel.saveToken(res.data.token);
                TrackApi.wxLoginSuccess();
                bridge.$toast('登录成功');
                console.log(UserModel);
                homeModule.loadHomeList();
                bridge.setCookies(res.data);
                // 埋点登录成功
                login(data.data.code);
            }
        }).catch((error) => {
            if (error.code === 34005) {
                data.title = '绑定手机号';
                callBack && callBack(error.code, data);
                TrackApi.wxSignUpSuccess();
            }
            bridge.$toast(data.msg);
        });
    });
};
/**
 * 验证码登录
 * @param LoginParam
 * @param callBack
 */
const codeLoginAction = (LoginParam, callBack) => {
    TrackApi.LoginButtonClick({'loginMethod':2})
    LoginAPI.codeLogin({
        authcode: '',
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + '',
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() : '暂无',
        username: '',
        wechatCode: '',
        wechatVersion: ''
    }).then((data) => {
        callBack(data);
        UserModel.saveUserInfo(data.data);
        UserModel.saveToken(data.data.token);
        TrackApi.codeLoginSuccess();
        bridge.setCookies(data.data);
        DeviceEventEmitter.emit('homePage_message', null);
        DeviceEventEmitter.emit('contentViewed', null);
        bridge.$toast('登录成功');
        homeModule.loadHomeList();
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
    }).catch((error) => {
        callBack(error);
        bridge.$toast(error.msg);
    });
};
/**
 * 密码登录
 * @param LoginParam
 * @param callBack
 */
const pwdLoginAction = (LoginParam, callBack) => {
    TrackApi.LoginButtonClick({'loginMethod':3})
    LoginAPI.passwordLogin({
        authcode: '22',
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + '',
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() + '' : '22',
        username: '',
        wechatCode: '11',
        wechatVersion: '11'
    }).then((data) => {
        callBack(data);
        UserModel.saveUserInfo(data.data);
        UserModel.saveToken(data.data.token);
        TrackApi.pwdLoginSuccess();
        bridge.setCookies(data.data);
        DeviceEventEmitter.emit('homePage_message', null);
        DeviceEventEmitter.emit('contentViewed', null);
        homeModule.loadHomeList();
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
    }).catch((error) => {
        callBack(error);
        bridge.$toast(error.msg);
    });
};
/**
 * 注册函数
 * @param params
 * @param callback
 */
const registAction = (params, callback) => {
    LoginAPI.findMemberByPhone({
        ...params,
        device: (this.params && this.params.device) ? this.params.device : '',
        inviteId: '',//邀请id
        appOpenid: (this.params && this.params.appOpenid) ? this.params.appOpenid : '',
        systemVersion: DeviceInfo.getSystemVersion() + '',
        wechatVersion: ''
    }).then((data) => {
        if (data.code === 10000) {
            callback(data);
            //推送
            JPushUtils.updatePushTags();
            JPushUtils.updatePushAlias();
            UserModel.saveUserInfo(data.data);
            UserModel.saveToken(data.data.token);
            homeModule.loadHomeList();
            track('SignUpSuccess', { 'signUpMethod': 2, 'signUpPhone': params.phone, 'signUpPlatform': 1 });
            bridge.setCookies(data.data);
            DeviceEventEmitter.emit('homePage_message', null);
            DeviceEventEmitter.emit('contentViewed', null);
        } else {
            callback(data);
        }
    }).catch((response) => {
        callback(response);
    });

};

export {
    wxLoginAction,
    codeLoginAction,
    pwdLoginAction,
    registAction,
    phoneBindWx,
    oneClickLoginValidation
};
