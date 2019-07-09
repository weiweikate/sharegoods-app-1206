package com.meeruu.sharegoods;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import com.meeruu.RNDeviceInfo.RNDeviceInfo;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.sharegoods.rn.RNMRPackage;
import com.meeruu.sharegoods.rn.lottie.LottiePackage;
import com.meeruu.sharegoods.rn.preload.ReactNativePreLoader;
import com.meeruu.sharegoods.rn.reactwebview.RNCWebViewPackage;
import com.meeruu.sharegoods.rn.sensors.RNSensorsAnalyticsPackage;
import com.meeruu.sharegoods.rn.webviewbridge.WebViewBridgePackage;
import com.microsoft.codepush.react.CodePush;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactlibrary.RNGeolocationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.request.MRNetStatePackage;
import com.squareup.leakcanary.LeakCanary;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;

/**
 * @author louis
 * @date on 2018/9/3
 * @describe 应用application类
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class MainApplication extends BaseApplication implements ReactApplication {

    @Override
    public void onCreate() {
        // 预加载rn
        ReactNativePreLoader.preLoad(this, ParameterUtils.RN_MAIN_NAME);
        super.onCreate();
        // 检测内存泄漏
        LeakCanary.install(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            MainPackageConfig.Builder builder = new MainPackageConfig.Builder();
            builder.setFrescoConfig(FrescoImagePipelineConfig.getDefaultImagePipelineConfig(getApplicationContext()));

            return Arrays.<ReactPackage>asList(
                    new RNMRPackage(),
                    new MainReactPackage(builder.build()),
                    new ReactVideoPackage(),
                    new RNGeolocationPackage(),
                    new LinearGradientPackage(),
                    new RNDeviceInfo(),
                    new RNFetchBlobPackage(),
                    new CookieManagerPackage(),
                    new WebViewBridgePackage(),
                    new LottiePackage(),
                    new MRNetStatePackage(),
                    new RNSensorsAnalyticsPackage(),
                    new PickerPackage(),
                    new ExtraDimensionsPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this,
                            BuildConfig.DEBUG, ParameterUtils.CODE_PUSH_SERVER),
                    new RNCWebViewPackage(),
                    new AsyncStoragePackage(),
                    new RNGestureHandlerPackage()
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
