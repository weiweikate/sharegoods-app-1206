package com.meeruu.sharegoods;

import android.content.Context;
import android.graphics.Bitmap;
import android.support.annotation.Nullable;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.meeruu.commonlib.BaseApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnicornImageLoader;
import com.qiyukf.unicorn.api.YSFOptions;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends BaseApplication implements ReactApplication {
    private static Context context;
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }


    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        context = getApplicationContext();
        Unicorn.init(this, "db5a6f7eb0a3a8542e8ea36957e9122a", options(), new UnicornImageLoader() {
            @Nullable
            @Override
            public Bitmap loadImageSync(String uri, int width, int height) {
                return null;
            }

            @Override
            public void loadImage(String uri, int width, int height, ImageLoaderListener listener) {

            }
        });
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
        UICustomization uiCustomization=new UICustomization();
        uiCustomization.avatarShape=0;
        uiCustomization.titleBackgroundColor=0xFF12CDB0;
        uiCustomization.titleBarStyle=1;
        uiCustomization.topTipBarBackgroundColor=0xFF666666;
        uiCustomization.titleCenter=true;
        uiCustomization.topTipBarTextColor=0xFFFFFFFF;
        options.categoryDialogStyle=0;
        options.uiCustomization=uiCustomization;
        return options;
    }
}