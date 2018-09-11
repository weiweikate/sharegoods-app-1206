package com.meeruu.sharegoods;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.meeruu.commonlib.BaseApplication;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends BaseApplication implements ReactApplication {

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

}