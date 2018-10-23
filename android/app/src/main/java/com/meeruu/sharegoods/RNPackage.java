package com.meeruu.sharegoods;

import com.BV.LinearGradient.LinearGradientManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.meeruu.PopModal.PopModalManager;
import com.meeruu.commonlib.umeng.LoginAndSharingModule;
import com.meeruu.qiyu.imService.QYChatModule;
import com.meeruu.sharegoods.appPay.AppPayModule;
import com.meeruu.sharegoods.qrCode.QRCodeModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by shangwf on 2017/9/14.
 */

public class RNPackage implements ReactPackage {

    public CommModule mModule;
    public QRCodeModule qrModule;
    public QYChatModule qyChatModule;
    public AppPayModule appPayModule;
    public LoginAndSharingModule loginAndSharingModule;
    public PopModalManager popModalManager;

    /**
     * 创建Native Module
     *
     * @param reactContext
     * @return
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        mModule = new CommModule(reactContext);
        qrModule = new QRCodeModule(reactContext);
        qyChatModule = new QYChatModule(reactContext);
        appPayModule = new AppPayModule(reactContext);
        loginAndSharingModule = new LoginAndSharingModule(reactContext);
        modules.add(mModule);
        modules.add(qrModule);
        modules.add(qyChatModule);
        modules.add(appPayModule);
        modules.add(loginAndSharingModule);
        return modules;
    }


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        popModalManager = new PopModalManager();
        return Arrays.<ViewManager>asList(
                popModalManager);
    }

}
