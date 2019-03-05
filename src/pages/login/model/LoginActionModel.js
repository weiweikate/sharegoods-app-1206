/**
 * @author huyufeng
 * @date on 2019/3/1
 * @describe 登录相关action
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
import LoginAPI from "../api/LoginApi";
import bridge from "../../../utils/bridge";
import { homeModule } from "../../home/Modules";
import UserModel from "../../../model/user";
import { login } from "../../../utils/SensorsTrack";
import JPushUtils from "../../../utils/JPushUtils";
import DeviceInfo from "react-native-device-info/deviceinfo";
import { DeviceEventEmitter } from "react-native";
/**
 * 回调code 和 数据 34005 需要去绑定手机号 10000 登录成功
 * @param callBack
 */
const wxLoginAction = (callBack) => {
    bridge.$loginWx((data) => {
        console.log(data);
        LoginAPI.appWechatLogin({
            device: data.device,
            encryptedData: "",
            headImg: data.headerImg,
            iv: "",
            nickname: data.nickName,
            appOpenid: data.appOpenid,
            systemVersion: data.systemVersion,
            wechatVersion: "",
            unionid: data.unionid
        }).then((res) => {
            if (res.code === 34005) {
                data.title = "绑定手机号";
                callBack(res.code, data);
            } else if (res.code === 10000) {
                UserModel.saveUserInfo(res.data);
                UserModel.saveToken(res.data.token);
                bridge.$toast("登录成功");
                console.log(UserModel);
                homeModule.loadHomeList();
                bridge.setCookies(res.data);
                // 埋点登录成功
                login(data.data.code);
                callBack(res.code, res.data);
            }
        }).catch((error) => {
            if (error.code === 34005) {
                data.title = "绑定手机号";
                callBack(error.code, data);
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
    LoginAPI.codeLogin({
        authcode: "",
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + "",
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + "").length > 0 ? DeviceInfo.getSystemVersion() : "暂无",
        username: "",
        wechatCode: "",
        wechatVersion: ""
    }).then((data) => {
        UserModel.saveUserInfo(data.data);
        UserModel.saveToken(data.data.token);
        DeviceEventEmitter.emit("homePage_message", null);
        DeviceEventEmitter.emit("contentViewed", null);
        bridge.$toast("登录成功");
        homeModule.loadHomeList();
        bridge.setCookies(data.data);
        login(data.data.code); // 埋点登录成功
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
        callBack(data);
    }).catch((error) => {
        callBack(error);
        bridge.$toast(error.msg)
    });
};
/**
 * 密码登录
 * @param LoginParam
 * @param callBack
 */
const pwdLoginAction = (LoginParam, callBack) => {
    LoginAPI.passwordLogin({
        authcode: "22",
        code: LoginParam.code,
        device: DeviceInfo.getDeviceName() + "",
        password: LoginParam.password,
        phone: LoginParam.phoneNumber,
        systemVersion: (DeviceInfo.getSystemVersion() + "").length > 0 ? DeviceInfo.getSystemVersion() + "" : "22",
        username: "",
        wechatCode: "11",
        wechatVersion: "11"
    }).then((data) => {
        UserModel.saveUserInfo(data.data);
        UserModel.saveToken(data.data.token);
        DeviceEventEmitter.emit("homePage_message", null);
        DeviceEventEmitter.emit("contentViewed", null);
        bridge.$toast("登录成功");
        homeModule.loadHomeList();
        bridge.setCookies(data.data);
        login(data.data.code); // 埋点登录成功
        //推送
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
        callBack(data);
    }).catch((error) => {
        callBack(error);
        bridge.$toast(error.msg);
    });
};

export { wxLoginAction, codeLoginAction, pwdLoginAction };
