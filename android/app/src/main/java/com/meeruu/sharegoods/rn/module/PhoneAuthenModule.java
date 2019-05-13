package com.meeruu.sharegoods.rn.module;

import android.Manifest;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.permissions.Permission;
import com.meeruu.permissions.PermissionUtil;

import java.util.Arrays;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jiguang.verifysdk.api.VerifyListener;

public class PhoneAuthenModule extends ReactContextBaseJavaModule implements LifecycleEventListener {


    private static final int CODE_PERMISSION_GRANTED = 0;
    private static final String MSG_PERMISSION_GRANTED = "Permission is granted";
    private static final int ERR_CODE_PERMISSION = 1;
    private static final String ERR_MSG_PERMISSION = "Permission not granted";

    //"android.permission.READ_PHONE_STATE"
    private static final String[] REQUIRED_PERMISSIONS = new String[]{Manifest.permission.READ_PHONE_STATE};

    private boolean requestPermissionSended;
    private Callback permissionCallback;

    public PhoneAuthenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
    public String getName() {
        return "JVerificationModule";
    }

    @Override
    public void initialize() {
        super.initialize();
    }

    @ReactMethod
    public void requestPermission(Callback permissionCallback) {
        if (PermissionUtil.hasPermissions(getCurrentActivity(), REQUIRED_PERMISSIONS)) {
            doCallback(permissionCallback, CODE_PERMISSION_GRANTED, MSG_PERMISSION_GRANTED);
            return;
        }
        this.permissionCallback = permissionCallback;
        try {
            PermissionUtil.requestPermissions(getCurrentActivity(), Permission.getPermissionContent(Arrays.asList(Permission.PHONE)),
                    ParameterUtils.REQUEST_CODE_PHONE, Permission.PHONE);
            requestPermissionSended = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void isCanPhoneAuthen(Callback callback) {
        boolean isVerifyEnable = JVerificationInterface.checkVerifyEnable(getCurrentActivity());
        WritableMap map = Arguments.createMap();
        map.putBoolean("enable", isVerifyEnable);
        callback.invoke(map);
    }

    @ReactMethod
    public void getToken(final Callback callback) {
        JVerificationInterface.getToken(getCurrentActivity(), new VerifyListener() {
            @Override
            public void onResult(int code, String content, String operator) {
                doCallback(callback, code, content, operator);
            }
        });
    }

    @ReactMethod
    public void startPhoneAuthenWithPhoneNum(ReadableMap map, final Callback callback) {
        String number = map.getString("number");
        String token = map.getString("token");

        JVerificationInterface.verifyNumber(getCurrentActivity(), token, number, new VerifyListener() {
            @Override
            public void onResult(int code, String content, String operator) {
                doCallback(callback, code, content, operator);
            }
        });
    }

    @ReactMethod
    public void loginAuth(final Callback callback) {
        JVerificationInterface.loginAuth(getCurrentActivity(), new VerifyListener() {
            @Override
            public void onResult(int code, String token, String operator) {
                doCallback(callback, code, token, operator);
            }
        });
    }

    @Override
    public void onHostResume() {
        if (requestPermissionSended) {
            if (PermissionUtil.hasPermissions(getCurrentActivity(), REQUIRED_PERMISSIONS)) {
                doCallback(permissionCallback, CODE_PERMISSION_GRANTED, MSG_PERMISSION_GRANTED);
            } else {
                doCallback(permissionCallback, ERR_CODE_PERMISSION, ERR_MSG_PERMISSION);
            }
        }
        requestPermissionSended = false;
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }

    private void doCallback(Callback callback, int code, String content) {
        WritableMap map = Arguments.createMap();
        map.putInt("code", code);
        map.putString("content", content);
        callback.invoke(map);
    }

    private void doCallback(Callback callback, int code, String content, String operator) {
        WritableMap map = Arguments.createMap();
        map.putInt("code", code);
        map.putString("content", content);
        map.putString("operator", operator);
        callback.invoke(map);
    }
}


