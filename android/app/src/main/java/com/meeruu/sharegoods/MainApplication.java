package com.meeruu.sharegoods;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.meeruu.commonlib.BaseApplication;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.qiyu.imService.QiyuImageLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.YSFOptions;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends BaseApplication implements ReactApplication {


    @Override
    public void onCreate() {
        super.onCreate();
        ForegroundCallbacks.init(this);
        if (getProcessName(this).equals(getPackageName())) {
            // 七鱼初始化
            Unicorn.init(this, "aa15b0b8c2a1bc1bf0341e244c049961", options(), new QiyuImageLoader(this));
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new RNPackage(),
                    new MainReactPackage(),
                    new RNDeviceInfo(),
                    new LinearGradientPackage(),
//                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new SvgPackage(),
                    new ImagePickerPackage(),
                    new AutoHeightWebViewPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    // 如果返回值为null，则全部使用默认参数。
    private YSFOptions options() {
        YSFOptions options = new YSFOptions();
        options.statusBarNotificationConfig = new StatusBarNotificationConfig();
        UICustomization uiCustomization = new UICustomization();
        // 头像风格，0为圆形，1为方形
        uiCustomization.avatarShape = 0;
        // 标题栏背景
        uiCustomization.titleBackgroundColor = 0xFFFFFFFF;
        uiCustomization.titleBarStyle = 0;
        uiCustomization.topTipBarBackgroundColor = 0xFF666666;
        uiCustomization.titleCenter = true;
        uiCustomization.topTipBarTextColor = 0xFFFFFFFF;
        options.categoryDialogStyle = 0;
        options.uiCustomization = uiCustomization;
        return options;
    }
}