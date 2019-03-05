package com.meeruu.sharegoods.rn.module;
import com.alicom.phonenumberauthsdk.gatewayauth.AlicomAuthHelper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class PhoneAuthenModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "PhoneAuthenModule";

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public PhoneAuthenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
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

    /**
     * 初始化sdk
     *
     * @param promise
     */
    @ReactMethod
    public void isCanPhoneAuthen(Promise promise) {
//        AlicomAuthHelper
        WritableMap map = Arguments.createMap();
        map.putInt("isCanAuthen", 1);
        promise.resolve(map);
        AlicomAuthHelper.getVersion();
//        AlicomAuthHelper
    }
}


