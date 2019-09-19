package com.meeruu.sharegoods.rn.module;

import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.sharegoods.R;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jiguang.verifysdk.api.JVerifyUIConfig;
import cn.jiguang.verifysdk.api.PreLoginListener;
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
    public void checkInitResult(final Promise callback) {
        if (JVerificationInterface.isInitSuccess()) {
            if (JVerificationInterface.checkVerifyEnable(mContext)) {
                JVerificationInterface.preLogin(mContext, 5000, (i, s) -> {
                    if (i == 7000) {
                        callback.resolve(true);
                    } else {
                        callback.reject(i + "", "当前网络不支持号码认证");
                    }
                });
            } else {
                callback.reject("-1", "当前网络不支持号码认证");
            }
        } else {
            callback.reject("-1", "初始化失败");
        }
    }

    private void initUI() {
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
        View bottomView = LayoutInflater.from(mContext).inflate(R.layout.one_login_other, null);
        if (bottomView != null) {
            RelativeLayout.LayoutParams mLayoutParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    DensityUtils.dip2px(170f));
            mLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
            bottomView.setLayoutParams(mLayoutParams);
            bottomView.findViewById(R.id.tv_wechat).setOnClickListener(v -> {
                // 微信登录
                WritableMap wechatMap = new WritableNativeMap();
                wechatMap.putString("login_type", "1");
                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("Event_Login_Type", wechatMap);
                closeAuth();
            });
            bottomView.findViewById(R.id.tv_phone).setOnClickListener(v -> {
                // 手机号登录
                WritableMap wechatMap = new WritableNativeMap();
                wechatMap.putString("login_type", "2");
                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("Event_Login_Type", wechatMap);
                closeAuth();
            });
        }
        builder.setStatusBarColorWithNav(true)
                .setStatusBarDarkMode(true)
                .setNavReturnImgPath("close_x")
                .setNavColor(mContext.getResources().getColor(R.color.white))
                .setNavText("")
                .setNavTextColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setLogoImgPath("login_logo")
                .setLogoHeight(43)
                .setLogoWidth(59)
                .setLogoOffsetY(42)
                .setNumFieldOffsetY(160)
                .setSloganOffsetY(185)
                .setLogBtnOffsetY(200)
                .setNumberColor(mContext.getResources().getColor(R.color.app_main_text_color))
                .setSloganTextColor(mContext.getResources().getColor(R.color.transparent))
                .setAppPrivacyColor(mContext.getResources().getColor(R.color.app_666_text_color),
                        mContext.getResources().getColor(R.color.app_main_color))
                .addCustomView(bottomView, true, null)
                .setPrivacyOffsetY(-1)
                .setPrivacyState(true);
        if (!TextUtils.isEmpty(contractUrl)) {
            builder.setAppPrivacyOne("《秀购用户协议》", contractUrl);
        }
        JVerificationInterface.setCustomUIWithConfig(builder.build());
    }

    @ReactMethod
    public void preLogin(final Promise callback) {
        JVerificationInterface.preLogin(mContext, 5000, (i, s) -> {
            if (i == 7000) {
                callback.resolve(true);
            } else {
                callback.reject(i + "", "一键登录失败");
            }
        });
    }

    @ReactMethod
    public void closeAuth() {
        JVerificationInterface.dismissLoginAuthActivity();
    }

    @ReactMethod
    public void getVerifyToken(final Promise callback) {
        JVerificationInterface.getToken(mContext, 5000, (i, s, s1) -> {
            if (i == 2000) {
                callback.resolve(s);
            } else {
                callback.reject(s, s1);
            }
        });
    }

    @ReactMethod
    public void startLoginAuth(final Promise callback) {
        initUI();
        JVerificationInterface.loginAuth(mContext.getApplicationContext(), true, (code, token, operator) -> {
            LogUtils.d("login=====" + code);
            if (code == 6000) {
                callback.resolve(token);
            } else if (code == 6002) {
                callback.reject("555", "取消授权");
            } else {
                callback.reject("556", "一键登录失败");
            }
        });
    }
}


