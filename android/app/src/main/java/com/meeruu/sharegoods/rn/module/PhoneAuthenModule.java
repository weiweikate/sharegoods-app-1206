package com.meeruu.sharegoods.rn.module;

import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.commonlib.utils.ToastUtils;
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
        if (!TextUtils.isEmpty(hostJson)) {
            JSONObject object = JSON.parseObject(hostJson);
            contractUrl = object.getString("h5") + "/static/protocol/service.html";
        }
        JVerifyUIConfig.Builder builder = new JVerifyUIConfig.Builder();

        builder.setNavReturnImgPath("ic_go_back")
                .setNavColor(mContext.getResources().getColor(R.color.white))
                .setNavText("")
                .setNavTextColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setNumberColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setSloganTextColor(mContext.getResources().getColor(R.color.app_ccc_text_color))
                .setAppPrivacyColor(mContext.getResources().getColor(R.color.app_666_text_color),
                        mContext.getResources().getColor(R.color.app_main_color));
        if (!TextUtils.isEmpty(contractUrl)) {
            builder.setAppPrivacyOne("《秀购用户协议》", contractUrl);
        }
        JVerificationInterface.setCustomUIWithConfig(builder.build());
        boolean isVerifyEnable = JVerificationInterface.checkVerifyEnable(getCurrentActivity());
        callback.resolve(isVerifyEnable);
    }

    @ReactMethod
    public void startLoginAuth(final Promise callback) {
        JVerificationInterface.loginAuth(getCurrentActivity(), new VerifyListener() {
            @Override
            public void onResult(int code, String token, String operator) {
                if (code == 6000) {
                    callback.resolve(token);
                } else {
                    ToastUtils.showToast("一键登录认证失败！");
                }
            }
        });
    }
}


