/**
 * Created by yuanxiao on 2017/8/09.
 * 支付工具。包含支付宝，微信支付
 * @providesModule PayUtil
 */

import {
    NativeModules,
    Platform
} from 'react-native';
const {PayTool} = NativeModules;

export default {


    // app支付宝支付
    appAliPay(payString){
        return PayTool.appAliPay(payString).then((response)=>{
            /**
             * response object 支付结果   0成功 1 失败 2 未安装 3 无回调
             * 数据格式如下
             * code
             * msg
             * sdkCode
             * aliPayResult
             */
            return Platform.OS === 'ios' ? response : JSON.parse(response);
        });
    },


    // app微信支付
    // payInfo《object》包含如下参数
    //  appid
    //  partnerid
    //  prepayid
    //  noncestr
    //  timestamp number
    //  package
    //  sign
    appWXPay(payInfo){
        if(Platform.OS !== 'ios'){
            payInfo = JSON.stringify(payInfo)
        }
        return PayTool.appWXPay(payInfo).then((response)=>{
            //response 出错的时候，做统一的业务自动打点
            console.log(response);
            /**
             * response object 支付结果   0成功 1 失败 2 未安装 3 无回调
             * 数据格式如下
             * code
             * msg
             * sdkCode
             */
            return Platform.OS === 'ios' ? response : JSON.parse(response);
        });
    },
}
