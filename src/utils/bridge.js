// 原生桥接接口函数请使用'$'开头
import {
    NativeModules
} from 'react-native';
import ScreenUtils from './ScreenUtils';

export default {
    $toast(msg) {
        NativeModules.commModule.toast(msg);
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
    showLoading(message,timeout){
        NativeModules.commModule.showLoadingDialog();
    },
    /**
     * hiddenLoading  隐藏全局loading
     */
    hiddenLoading(){
        NativeModules.commModule.hideLoadingDialog();
    }
}
;
