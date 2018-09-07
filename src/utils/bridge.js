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
    }
}
;
