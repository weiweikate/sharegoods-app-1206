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
import { login, track, TrackApi } from '../../../utils/SensorsTrack';
import JPushUtils from '../../../utils/JPushUtils';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import { DeviceEventEmitter } from 'react-native';
import RouterMap, { routePop, routePush } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';

/**
 * @param phone 一键登录
 * @param athenToken  ali 返回的校验token
 * @param navigation  导航器
 * @param successCallBack 登录成功后的回调
 * hyf 后期更改去掉phone
 */
const oneClickLoginValidation = (authenToken, localPhone, navigation, successCallBack, failCallBack) => {
    TrackApi.LoginButtonClick({ 'loginMethod': 4 });
    let params = { token: authenToken };
    if (StringUtils.isNoEmpty(localPhone)) {
        params.phone = localPhone;
    }
    LoginAPI.oneClickLoginValidation(params)
        .then(result => {
            UserModel.saveToken(result.data.token);
            UserModel.saveUserInfo(result.data);
            homeModule.loadHomeList();
            bridge.setCookies(result.data);
            successCallBack && successCallBack();
            loginJump(result.data);
            if (StringUtils.isEmpty(result.data.unionid)) {
                //未绑定微信
                setTimeout(() => {
                    getWxUserInfo((wxInfo) => {
                        if (wxInfo && wxInfo.unionid) {
                            phoneBindWx(wxInfo, result);
                        }
                    });
                }, 265);
            }
            TrackApi.localPhoneNumLogin({ 'loginMethod': 4 });
        })
        .catch(error => {
            failCallBack && failCallBack();
            bridge.$toast(error.msg);
        });
};

const loginJump = (data) => {
    if (data.regNow) {
        // 新用户，跳转到上级页面
        routePush(RouterMap.InviteCodePage, {});
    } else {
        // 老用户
        routePop(1);
    }
};

/**
 * 绑定微信
 */
const phoneBindWx = (wxInfo, data) => {
    //去绑定微信，成功与否不管，都执行回调
    LoginAPI.phoneBindWx({
        unionId: wxInfo.unionid ? wxInfo.unionid : wxInfo.unionId,
        appOpenid: wxInfo.appOpenid,
        headImg: wxInfo.headerImg ? wxInfo.headerImg : wxInfo.headImg,
        nickname: wxInfo.nickName ? wxInfo.nickName : wxInfo.nickname
    }).then(result => {
        // 微信绑定成功
        UserModel.unionid = wxInfo.unionid ? wxInfo.unionid : wxInfo.unionId;
        UserModel.appOpenid = wxInfo.appOpenid;
        UserModel.wechatName = wxInfo.nickName ? wxInfo.nickName : wxInfo.nickname;
    }).catch(error => {
        if (data.data.withRegister) {
            bridge.$toast(error.msg);
        }
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
const wxLoginAction = (data, callBack) => {
    TrackApi.LoginButtonClick({ 'loginMethod': 1 });
    if (!data) {
        callBack && callBack();
        return;
    }
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
            TrackApi.wxSignUpSuccess();
        } else if (res.code === 10000) {
            callBack && callBack(res.code, data);
            UserModel.saveToken(res.data.token);
            UserModel.saveUserInfo(res.data);
            TrackApi.wxLoginSuccess();
            bridge.$toast('登录成功');
            console.log(UserModel);
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
};
/**
 * 验证码登录
 * @param LoginParam
 * @param callBack
 */
const codeLoginAction = (LoginParam, callBack) => {
    TrackApi.LoginButtonClick({ 'loginMethod': 2 });

    let requestParams = {
        ...LoginParam,
        authcode: '',
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + '',
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() : '暂无',
        username: '',
        wechatCode: '',
        wechatVersion: ''
    };
    // 微信信息存在，传给服务端进行绑定
    if (StringUtils.isNoEmpty(LoginParam.unionid)) {
        requestParams.unionid = LoginParam.unionid;
        requestParams.appOpenid = LoginParam.appOpenid;
        requestParams.headImg = LoginParam.headerImg;
    }

    if (StringUtils.isEmpty(LoginParam.spm) && !StringUtils.isEmpty(LoginParam.campaignType)) {
        requestParams.popupBoxType = 1;//0:全部 1:app 2:h5 3:小程序
    }

    LoginAPI.codeLogin(requestParams).then((data) => {
        console.log('----' + JSON.stringify(data));
        UserModel.saveToken(data.data.token);
        UserModel.saveUserInfo(data.data);
        bridge.setCookies(data.data);
        DeviceEventEmitter.emit('homePage_message', null);
        DeviceEventEmitter.emit('contentViewed', null);
        homeModule.loadHomeList();
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
        // 回调
        callBack(data);
        // 绑定微信
        if (StringUtils.isEmpty(data.data.unionid)) {
            if (StringUtils.isNoEmpty(LoginParam.unionid)) {
                // 直接绑定微信
                phoneBindWx(LoginParam, data);
            } else {
                //未绑定微信
                setTimeout(() => {
                    getWxUserInfo((wxInfo) => {
                        if (wxInfo && wxInfo.unionid) {
                            phoneBindWx(wxInfo, data);
                        }
                    });
                }, 265);
            }
        } else {
            callBack(data);
        }
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
    TrackApi.LoginButtonClick({ 'loginMethod': 3 });
    let requestParams = {
        authcode: '22',
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + '',
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() + '' : '22',
        username: '',
        wechatCode: '11',
        wechatVersion: '11'
    };
    // 微信信息存在，传给服务端进行绑定
    if (StringUtils.isNoEmpty(LoginParam.unionid)) {
        requestParams.unionid = LoginParam.unionid;
        requestParams.appOpenid = LoginParam.appOpenid;
        requestParams.headImg = LoginParam.headerImg;
    }
    LoginAPI.passwordLogin(requestParams).then((data) => {
        UserModel.saveToken(data.data.token);
        UserModel.saveUserInfo(data.data);
        TrackApi.pwdLoginSuccess();
        bridge.setCookies(data.data);
        DeviceEventEmitter.emit('homePage_message', null);
        DeviceEventEmitter.emit('contentViewed', null);
        homeModule.loadHomeList();
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
        // 回调
        callBack(data);
        // 绑定微信
        if (StringUtils.isEmpty(data.data.unionid)) {
            if (StringUtils.isNoEmpty(LoginParam.unionid)) {
                // 直接绑定微信
                phoneBindWx(LoginParam, data);
            } else {
                //未绑定微信
                setTimeout(() => {
                    getWxUserInfo((wxInfo) => {
                        if (wxInfo && wxInfo.unionid) {
                            phoneBindWx(wxInfo, data);
                        }
                    });
                }, 265);
            }
        }
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

    let requestParams = {
        ...params,
        device: (this.params && this.params.device) ? this.params.device : '',
        inviteId: '',//邀请id
        appOpenid: (this.params && this.params.appOpenid) ? this.params.appOpenid : '',
        systemVersion: DeviceInfo.getSystemVersion() + '',
        wechatVersion: ''
    };
    if (StringUtils.isEmpty(params.spm) && StringUtils.isEmpty(params.campaignType)) {
        requestParams.popupBoxType = 1;//0:全部 1:app 2:h5 3:小程序
    }
    LoginAPI.findMemberByPhone(requestParams).then((data) => {
        if (data.code === 10000) {
            callback(data);
            UserModel.saveToken(data.data.token);
            UserModel.saveUserInfo(data.data);
            homeModule.loadHomeList();
            track('SignUpSuccess', { 'signUpMethod': 2, 'signUpPhone': params.phone, 'signUpPlatform': 1 });
            bridge.setCookies(data.data);
            DeviceEventEmitter.emit('homePage_message', null);
            DeviceEventEmitter.emit('contentViewed', null);
            //推送
            JPushUtils.updatePushTags();
            JPushUtils.updatePushAlias();
        } else {
            callback(data);
        }
    }).catch((response) => {
        callback(response);
    });

};

export {
    getWxUserInfo,
    wxLoginAction,
    codeLoginAction,
    pwdLoginAction,
    registAction,
    phoneBindWx,
    oneClickLoginValidation,
    loginJump
};
