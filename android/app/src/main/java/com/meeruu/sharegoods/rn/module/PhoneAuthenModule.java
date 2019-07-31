package com.meeruu.sharegoods.rn.module;

import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.sharegoods.R;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jiguang.verifysdk.api.JVerifyUIConfig;
import cn.jiguang.verifysdk.api.VerifyListener;

public class PhoneAuthenModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;

    public PhoneAuthenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
    public String getName() {
        return "PhoneAuthenModule";
    }

    @ReactMethod
    public void checkInitResult(Promise callback) {
        String hostJson = (String) SPCacheUtils.get(ParameterUtils.API_SERVER, "");
        String contractUrl = "";
        String h5Url = "";
        if (!TextUtils.isEmpty(hostJson)) {
            JSONObject object = JSON.parseObject(hostJson);
            h5Url = object.getString("h5");
            if (TextUtils.isEmpty(h5Url)) {
                h5Url = "https://h5.sharegoodsmall.com";
            }
            contractUrl = h5Url + "/static/protocol/service.html";
        }
        JVerifyUIConfig.Builder builder = new JVerifyUIConfig.Builder();

        builder.setNavReturnImgPath("ic_go_back")
                .setNavColor(mContext.getResources().getColor(R.color.white))
                .setNavText("")
                .setNavTextColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setNumberColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setSloganTextColor(mContext.getResources().getColor(R.color.app_ccc_text_color))
                .setAppPrivacyColor(mContext.getResources().getColor(R.color.app_666_text_color),
                        mContext.getResources().getColor(R.color.app_main_color))
                .setPrivacyState(true);
        if (!TextUtils.isEmpty(contractUrl)) {
            builder.setAppPrivacyOne("《秀购用户协议》", contractUrl);
        }
        JVerificationInterface.setCustomUIWithConfig(builder.build());
        boolean isVerifyEnable = JVerificationInterface.checkVerifyEnable(getCurrentActivity());
        callback.resolve(isVerifyEnable);
    }

    @ReactMethod
    public void preLogin() {
        JVerificationInterface.preLogin(mContext, 5000, null);
    }

    @ReactMethod
    public void closeAuth() {
        JVerificationInterface.dismissLoginAuthActivity();
    }

    @ReactMethod
    public void getVerifyToken(final Promise callback) {
        JVerificationInterface.getToken(mContext, 5000, new VerifyListener() {
            @Override
            public void onResult(int i, String s, String s1) {
                if (i == 2000) {
                    callback.resolve(s);
                } else {
                    callback.reject(s, s1);
                }
            }
        });
    }

    @ReactMethod
    public void startLoginAuth(final Promise callback) {
        JVerificationInterface.loginAuth(getCurrentActivity(), new VerifyListener() {
            @Override
            public void onResult(int code, String token, String operator) {
                LogUtils.d("login=====" + code);
                if (code == 6000) {
                    callback.resolve(token);
                } else if (code == 6002) {
                    callback.reject("555", "取消授权");
                } else {
                    callback.reject("556", "一键登录失败");
                }
            }
        });
    }
}


