/**
 * @author huyufeng
 * @date on 2019/3/1
 * @describe 登录相关action
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
import { Alert, DeviceEventEmitter } from 'react-native';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import UserModel from '../../../model/user';
import { login, TrackApi } from '../../../utils/SensorsTrack';
import JPushUtils from '../../../utils/JPushUtils';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import RouterMap, { routeNavigate, routePop } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';

/**
 * 回调code 和 数据 34005 需要去绑定手机号 10000 登录成功
 * @param callBack
 */
const wxLoginAction = (params, okCallBack, failCallBack) => {
    TrackApi.LoginButtonClick({ 'loginMethod': 1 });
    LoginAPI.appWechatLogin(params).then((res) => {
        // 登录成功处理
        let resData = res.data || {};
        handleLoginData(params, resData, res.code, okCallBack, failCallBack);
        // 数据埋点
        TrackApi.wxLoginSuccess();
    }).catch((error) => {
        failCallBack && failCallBack();
        bridge.$toast(error.msg);
    });
};

/**
 * 登录
 * @param params  请求参数
 * @param successCallBack  请求成功
 * @param failCallBack  请求失败
 * @param popNumbers  返回页面步数
 */
const memberLogin = (params, successCallBack, failCallBack, popNumbers) => {
    params.device = DeviceInfo.getDeviceName();
    params.systemVersion = (DeviceInfo.getSystemVersion() + '').length > 0 ? DeviceInfo.getSystemVersion() : '暂无';
    LoginAPI.memberLogin(params).then((res) => {
        let data = res.data || {};
        // 登录流程处理
        handleLoginData(params, data, res.code, successCallBack, failCallBack, popNumbers);
    }).catch((error) => {
        failCallBack && failCallBack(error.code);
        bridge.$toast(error.msg);
    });
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
        if (data.withRegister) {
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

const handleLoginData = (params, data, code, successCallBack, failCallBack, popNumber) => {
    if (data.weChatBindingStatus) {
        // 登录成功
        if (StringUtils.isNoEmpty(data.code)) {
            routePop(popNumber || 1);
            // 数据存储
            loginDataInit(data);
            // 登录成功
            successCallBack && successCallBack(data);
            // 绑定微信
            if (StringUtils.isEmpty(data.unionid)) {
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
            // 前往绑定手机号
            failCallBack && failCallBack(code, data);
            bridge.$toast('请绑定手机号');
            routeNavigate(RouterMap.PhoneLoginPage, {
                needBottom: false,
                weChatCode: data.wechatCode || params.weChatCode
            });
        }
    } else {
        // 走微信异常路径
        failCallBack && failCallBack(code, data);
        Alert.alert('账号异常', '请验证绑定该微信号的手机号', [{
            text: '验证',
            onPress: () => {
                // 验证微信手机号
                routeNavigate(RouterMap.VerifyWXCodePage,
                    { weChatCode: data.wechatCode || params.weChatCode });
            }
        }]);
    }
};

const weChatUnusual = (params, successCallBack, failCallBack, popNumbers) => {
    LoginAPI.weChatUnusual(params).then((res) => {
        let data = res.data || {};
        // 登录流程处理
        handleLoginData(params, data, res.code, successCallBack, failCallBack, popNumbers);
    }).catch((err) => {
        failCallBack && failCallBack(err.code);
        bridge.$toast(err.msg);
    });
};

/**
 * 登录成功
 * @param data response data
 */
const loginDataInit = (data) => {
    UserModel.saveToken(data.token);
    UserModel.saveUserInfo(data);
    bridge.setCookies(data);
    DeviceEventEmitter.emit('homePage_message', null);
    DeviceEventEmitter.emit('contentViewed', null);
    // homeModule.loadHomeList();
    // 更新推送
    JPushUtils.updatePushTags();
    JPushUtils.updatePushAlias();
    // 埋点登录成功
    login(data.code);
};

export {
    getWxUserInfo,
    wxLoginAction,
    phoneBindWx,
    memberLogin,
    loginDataInit,
    handleLoginData,
    weChatUnusual
};
