package com.meeruu.sharegoods;

import android.content.Context;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import com.jiasong.refresh.RCTRefreshLayoutPackage;
import com.meeruu.RNDeviceInfo.RNDeviceInfo;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.sharegoods.rn.RNMRPackage;
import com.meeruu.sharegoods.rn.lottie.LottiePackage;
import com.meeruu.sharegoods.rn.reactwebview.RNCWebViewPackage;
import com.meeruu.sharegoods.rn.sensors.RNSensorsAnalyticsPackage;
import com.meeruu.sharegoods.rn.webviewbridge.WebViewBridgePackage;
import com.meeruu.sharegoods.utils.AppInitUtils;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.CodePushUpdateManager;
import com.microsoft.codepush.react.SettingsManager;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactlibrary.RNGeolocationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.request.MRNetStatePackage;
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
        super.onCreate();
        // 获取主域名
        AppInitUtils.getAndSaveHost();
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

            CodePush codePush;
            try {
                codePush = new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(),
                        BuildConfig.DEBUG, ParameterUtils.CODE_PUSH_SERVER);
            } catch (Exception e) {
                // Reset code push update files when update files corrupted.
                // The following code is a mimic of CodePush.clearUpdates()
                // Since we already has exception in CodePush constructor,
                // we breakdown the constructor here and clear all code push
                // related files step by step without read the corrupted file itself.
                Context mContext = getApplicationContext();
                CodePushUpdateManager mUpdateManager = new CodePushUpdateManager(mContext.getFilesDir().getAbsolutePath());
                SettingsManager mSettingsManager = new SettingsManager(mContext);
                mUpdateManager.clearUpdates();
                mSettingsManager.removeFailedUpdates();
                mSettingsManager.removePendingUpdate();
                // After code push update files being removed, we can build a new code push instance safely
                codePush = new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(),
                        BuildConfig.DEBUG, ParameterUtils.CODE_PUSH_SERVER);
            }

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
                    new NetInfoPackage(),
                    new RNSensorsAnalyticsPackage(),
                    new PickerPackage(),
                    new ExtraDimensionsPackage(),
                    codePush,
                    new RNCWebViewPackage(),
                    new AsyncStoragePackage(),
                    new RNGestureHandlerPackage(),
                    new ReactSliderPackage(),
                    new RCTRefreshLayoutPackage(),
                    new ReanimatedPackage(),
                    new RNCViewPagerPackage()
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
