package com.meeruu.sharegoods.rn;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.meeruu.sharegoods.rn.loadingview.MRLoadingViewManager;
import com.meeruu.sharegoods.rn.module.PhoneAuthenModule;
import com.meeruu.sharegoods.rn.popmodal.PopModalManager;
import com.meeruu.sharegoods.rn.showground.RecyclerViewHeaderManager;
import com.meeruu.sharegoods.rn.showground.ShowGroundViewManager;
import com.meeruu.sharegoods.rn.waveview.WaveViewManager;
import com.meeruu.commonlib.umeng.AnalyticsModule;
import com.meeruu.commonlib.umeng.LoginAndSharingModule;
import com.meeruu.sharegoods.rn.kefu.QYChatModule;
import com.meeruu.sharegoods.rn.module.AppPayModule;
import com.meeruu.sharegoods.rn.module.CommModule;
import com.meeruu.sharegoods.rn.module.QRCodeModule;
import com.meeruu.sharegoods.rn.viewmanager.MRBannerViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by shangwf on 2017/9/14.
 */

public class RNMRPackage implements ReactPackage {

    public CommModule mModule;
    public QYChatModule qyChatModule;
    public AppPayModule appPayModule;
    public LoginAndSharingModule loginAndSharingModule;
    public QRCodeModule qrCodeModule;
    public AnalyticsModule analyticsModule;
    public PhoneAuthenModule phoneAuthenModule;

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
        qyChatModule = new QYChatModule(reactContext);
        appPayModule = new AppPayModule(reactContext);
        loginAndSharingModule = new LoginAndSharingModule(reactContext);
        qrCodeModule = new QRCodeModule(reactContext);
        analyticsModule = new AnalyticsModule(reactContext);
        phoneAuthenModule = new PhoneAuthenModule(reactContext);


        modules.add(mModule);
        modules.add(qyChatModule);
        modules.add(appPayModule);
        modules.add(loginAndSharingModule);
        modules.add(qrCodeModule);
        modules.add(analyticsModule);
        modules.add(phoneAuthenModule);

        return modules;
    }


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new PopModalManager(),
                new WaveViewManager(),
                new MRLoadingViewManager(),
                new MRBannerViewManager(),
                new RecyclerViewHeaderManager(),
                new ShowGroundViewManager());
    }

}
