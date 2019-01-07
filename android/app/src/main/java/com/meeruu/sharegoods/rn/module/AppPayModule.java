package com.meeruu.sharegoods.rn.module;

import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.bean.WXPayBean;
import com.meeruu.sharegoods.event.AppPayEvent;
import com.meeruu.sharegoods.utils.aipay.PayResult;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.util.HashMap;
import java.util.Map;

public class AppPayModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "PayTool";

    private static final String App_ID = "wx401bc973f010eece";
    public IWXAPI api;
    public static Promise wxPayPromise;

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public AppPayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
        api = WXAPIFactory.createWXAPI(reactContext, App_ID);
        api.registerApp(App_ID);
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private static final int SDK_PAY_FLAG = 1;

    private static final int SDK_CHECK_FLAG = 2;


    @ReactMethod
    public void appAliPay(final String str, final Promise promise) {
        final Handler mHandler = new Handler() {
            public void handleMessage(Message msg) {
                AppPayEvent event = new AppPayEvent();
                switch (msg.what) {
                    case SDK_PAY_FLAG: {
                        PayResult payResult = new PayResult((String) msg.obj);

                        // 支付宝返回此次支付结果及加签，建议对支付宝签名信息拿签约时支付宝提供的公钥做验签
                        String resultInfo = payResult.getResult();
                        String resultStatus = payResult.getResultStatus();
                        // 判断resultStatus 为“9000”则代表支付成功，具体状态码代表含义可参考接口文档
                        if (TextUtils.equals(resultStatus, "9000")) {
                            event.setCode(0);
                            event.setMsg("支付成功");
                            event.setSdkCode(9000);
                            event.setAliPayResult(null);
                            promise.resolve(JSON.toJSONString(event));
                        } else {
                            // 判断resultStatus 为非“9000”则代表可能支付失败
                            // “8000”代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
                            if (TextUtils.equals(resultStatus, "8000")) {
                                event.setCode(3);
                                event.setMsg("支付结果确认中");
                                event.setSdkCode(8000);
                                event.setAliPayResult(null);
                                promise.resolve(JSON.toJSONString(event));
                            } else {
                                // 其他值就可以判断为支付失败，包括用户主动取消支付，或者系统返回的错误
                                event.setCode(1);
                                event.setMsg("支付失败");
                                event.setSdkCode(0);
                                event.setAliPayResult(null);
                                promise.resolve(JSON.toJSONString(event));
                            }
                        }
                        break;
                    }
                    case SDK_CHECK_FLAG: {
                        event.setCode(1);
                        event.setMsg(msg.obj + "");
                        event.setSdkCode(0);
                        event.setAliPayResult(null);
                        promise.resolve(JSON.toJSONString(event));
                        break;
                    }
                    default:
                        break;
                }
            }

            ;
        };

        Runnable payRunnable = new Runnable() {
            @Override
            public void run() {
                // 构造PayTask 对象
                PayTask alipay = new PayTask(getCurrentActivity());
                // 调用支付接口，获取支付结果
                String result = alipay.pay(str, true);
                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                mHandler.sendMessage(msg);
            }
        };

        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    @ReactMethod
    public void appWXPay(final String params1, final Promise promise) {
        wxPayPromise = promise;
        if(!api.isWXAppInstalled()){
            //未安装的处理
            Map map = new HashMap();
            map.put("code",4);
            map.put("sdkCode",4);
            map.put("msg","请安装微信后完成支付");
            String json = JSON.toJSONString(map);
            wxPayPromise.resolve(json);
            return;
        }
        //通过WXAPIFactory工厂，获取IWXAPI的实例
//        iwxapi = WXAPIFactory.createWXAPI(mContext, App_ID, true);
        final WXPayBean params = JSON.parseObject(params1, WXPayBean.class);
        //下面是设置必要的参数，也就是前面说的参数,这几个参数从何而来请看上面说明
        //https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_12&index=2
        //将应用的appId注册到微信
//        iwxapi.registerApp(App_ID);
        Runnable payRunnable = new Runnable() {  //这里注意要放在子线程
            @Override
            public void run() {
                PayReq request = new PayReq(); //调起微信APP的对象
                //下面是设置必要的参数，也就是前面说的参数,这几个参数从何而来请看上面说明
                //https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_12&index=2
                request.appId = params.getAppid();//应用ID
                request.partnerId = params.getPartnerid();//商户号
                request.prepayId = params.getPrepayid();//预支付交易会话ID
                request.packageValue = "Sign=WXPay";//扩展字段
                request.nonceStr = params.getNoncestr();//随机字符串
                request.timeStamp = params.getTimestamp();//时间戳
                request.sign = params.getSign();//签名
                api.sendReq(request);//发送调起微信的请求
            }
        };
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }
}
