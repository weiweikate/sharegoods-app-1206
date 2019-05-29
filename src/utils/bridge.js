// 原生桥接接口函数请使用'$'开头
import {
    NativeModules,
    Platform
} from 'react-native';
import ScreenUtils from './ScreenUtils';
import StringUtils from './StringUtils';
import TimerMixin from 'react-timer-mixin';
import { setCookieToken, setCookies, clearCookies } from '@mr/webview';
import apiEnvironment from '../api/ApiEnvironment';

export default {
    $checkIsCanComment(){
        if(Platform.OS === 'ios'){
            NativeModules.commModule.checkIsCanComment();
        }
    },

    $toast(msg) {
        if (!StringUtils.isEmpty(msg)) {
            NativeModules.commModule.toast(msg);
        }
    },

    /*微信登陆
    * 回调参数实例
    *   @"device":@"iphone 6s"
    *   @"openid":@"ojoMs1M5csUdHkt8RFu2Ab6l41zM"
    *   @"systemVersion" : @"11.4.1"
    * */

    $loginWx(callBack) {
        NativeModules.LoginAndShareModule.loginWX((data) => {
            if (!ScreenUtils.isIOS) {
                data = JSON.parse(data);
                callBack && callBack(data);
            } else {
                callBack && callBack(data);
            }

        });
    },
    /**
     * showLoading      加载中loading
     * @param message   加载中提示语
     * @param timeout   加载中最长展示时间(提示语展示时间)。单位秒。默认为0秒，无限loading。
     * Prompt:          loading是全局的，尽量慎用，在合适的场景中使用。
     */
    showLoading(message, timeout = 0, callback = () => {
    }) {
        NativeModules.commModule.showLoadingDialog(message);
        if (timeout > 0) {
            TimerMixin.setTimeout(() => {
                // 检测版本更新
                NativeModules.commModule.hideLoadingDialog();
                callback();
            }, timeout);
        }
    },
    /**
     * hiddenLoading  隐藏全局loading
     */
    hiddenLoading(callback = () => {
    }) {
        callback();
        NativeModules.commModule.hideLoadingDialog();
    },
    /**
     * 生成分享的图片
     * @param jsonParam
     * {
         imageUrlStr: 'http//：xxxx.png',
            titleStr: '商品标题',
            priceStr: '¥100.00',
           retailPrice: '¥90.00',
           spellPrice: '¥80.00',
           QRCodeStr: '分享的链接',
           imageType: 'web'
 }
     * @param onSuccess(path)apkExist
     * @param onError(errorStr)
     */
    creatShareImage(jsonParam, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.creatShareImage(jsonParam, onSuccess, onError);
    },
    creatShowShareImage(jsonParam, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.creatShowShareImage(jsonParam, onSuccess, onError);
    },
    createPromotionShareImage(qrString, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.createPromotionShareImage(qrString, onSuccess, onError);
    },
    /**
     * @param jsonParam
     <<<<<<<<<<<<< 共同 <<<<<<<<<<<<<<
     shareType : 0图片分享 1 图文链接分享
     pplatformType:0 微信好友 1朋友圈 2qq好友 3qq空间 4微博

     <<<<<<<<< shareType : 1 图文链接分享 <<<<<<<
     title:分享标题(当为图文分享时候使用)
     dec:内容(当为图文分享时候使用)
     linkUrl:(图文分享下的链接)
     thumImage:(分享图标小图图文分享使用)
     支持 1.本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）

     <<<<<<<<<<<  shareType : 0图片分享 <<<<<<<<<<<<<<
     shareImage:分享的大图(本地URL)图片分享使用

     <<<<<<<<<<<  shareType : 2小程序分享 <<<<<<<<<<<<<<
     title
     dec
     thumImage
     linkUrl"兼容微信低版本网页地址";
     userName //"小程序username，如 gh_3ac2059ac66f";
     miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";
     * @param onSuccess()
     * @param onError(errorStr)
     */
    share(jsonParam, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.share(jsonParam, onSuccess, onError);
    },
    saveImage(path) {
        NativeModules.LoginAndShareModule.saveImage(path);
    },
    creatQRCodeImage(QRCodeStr, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.creatQRCodeImage(QRCodeStr, onSuccess, onError);
    },
    createQRToAlbum(info){
        return NativeModules.LoginAndShareModule.createQRToAlbum(info);
    },
    saveInviteFriendsImage(QRString, logoStr, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.saveInviteFriendsImage(QRString, logoStr, onSuccess, onError);
    },

    //{headerImg,shopName,shopId,shopPerson,codeString,wxTip}
    saveShopInviteFriendsImage(jsonParam, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.saveShopInviteFriendsImage(jsonParam, onSuccess, onError);
    },

    /**
     * 保存当前页面到相册
     * {
     * width: number
     * heigh: number
     * left: number
     * top: number
     * allScreen: bool
     * }
     */
    saveScreen(jsonParam, onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.LoginAndShareModule.saveScreen(jsonParam || { allScreen: true }, onSuccess, onError);
    },
    scanQRCode(onSuccess, onError = (errorStr) => {
    }) {
        NativeModules.QRCodeModule.scanQRCode(onSuccess, onError);
    },

    // getTotalCacheSize(callback = () => {
    // }) {
    //     NativeModules.commModule.getTotalCacheSize(callback);
    // },
//
//     CachesModule && CachesModule.getCachesSize((allSize) => {
//     let temp = getSizeFromat(allSize);
//     this.setState({
//         memorySize: temp
//     });
// });
    getTotalCacheSize(callback = () => {
    }) {
        NativeModules.commModule.getTotalCacheSize(callback);
    },

    clearAllCache(callback = () => {
    }) {
        NativeModules.commModule.clearAllCache(callback);
    },

    removeLaunch: () => NativeModules.commModule.removeLaunch(),

    stopPush: () => NativeModules.commModule.stopPush(),
    resumePush: () => NativeModules.commModule.resumePush(),
    isPushStopped: (callback = () => {
    }) => NativeModules.commModule.isPushStopped(callback),
    setCookies: (data) => {
        // setCookieToken(data.token,'172.16.10.117');
        // setCookies("userData", {id: data.id},'172.16.10.117');
        let host = apiEnvironment.getCurrentH5Url() || '';
        host = host.replace(/(http)s?(:\/\/)/g, '');
        host = host.replace(/\/\w*/g, '');
        setCookieToken(data.token, host);
        setCookies('userData', { userCode: data.code }, host);
        // alert(data.token + host + data.code);
    },
    clearCookies: () => {

        clearCookies();
        let data = { userData: {}, token: '' };
        let host = apiEnvironment.getCurrentH5Url() || '';
        host = host.replace(/(http)s?(:\/\/)/g, '');
        host = host.replace(/\/\w*/g, '');
        setCookieToken(data.token, host);
        setCookies('userData', { userCode: data.code }, host);
    },

    //背景风格
    setDarkMode: () => {
        NativeModules.commModule.setDarkMode();
    },
    //背景风格
    setLightMode: () => {
        NativeModules.commModule.setLightMode();
    },
    isApkExist: (version) => {
        return NativeModules.commModule.apkExist(version);
    },
    getAPKChannel: NativeModules.commModule.getAPKChannel
};
