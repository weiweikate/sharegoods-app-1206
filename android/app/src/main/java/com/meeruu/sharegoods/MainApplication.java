package com.meeruu.sharegoods;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.horcrux.svg.SvgPackage;
import com.meeruu.RNDeviceInfo.RNDeviceInfo;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.utils.ImagePipelineConfigUtils;
import com.meeruu.sharegoods.rn.MainReactPackage;
import com.meeruu.sharegoods.rn.RNMRPackage;
import com.meeruu.sharegoods.rn.lottie.LottiePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactlibrary.RNGeolocationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.request.MRNetStatePackage;
import com.sensorsdata.analytics.RNSensorsAnalyticsPackage;
import com.squareup.leakcanary.LeakCanary;
import com.taobao.sophix.PatchStatus;
import com.taobao.sophix.SophixManager;
import com.taobao.sophix.listener.PatchLoadStatusListener;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
//import cn.reactnative.modules.update.UpdateContext;
//import cn.reactnative.modules.update.UpdatePackage;

/**
 * @author louis
 * @date on 2018/9/3
 * @describe 应用application类
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class MainApplication extends BaseApplication implements ReactApplication {

    private int patchStatus;

    @Override
    public void onCreate() {
        super.onCreate();
        final SophixManager instance = SophixManager.getInstance();
        instance.setPatchLoadStatusStub(new PatchLoadStatusListener() {
            @Override
            public void onLoad(final int mode, final int code, final String info, final int handlePatchVersion) {
                patchStatus = code;
            }
        });
        // activity生命周期，onCreate之后
        ForegroundCallbacks.init(this);
        ForegroundCallbacks.get().addListener(new ForegroundCallbacks.Listener() {
            @Override
            public void onBecameForeground() {
                // 启动到前台时检测是否有新补丁
                instance.queryAndLoadNewPatch();
            }

            @Override
            public void onBecameBackground() {
                // 应用处于后台，如果补丁存在应用结束掉，重启
                if (patchStatus == PatchStatus.CODE_LOAD_RELAUNCH) {
                    // 应用处于后台时结束程序
                    if (ForegroundCallbacks.get().isBackground()) {
                        instance.killProcessSafely();
                    }
                }
            }
        });
        // 检测内存泄漏
        if (LeakCanary.isInAnalyzerProcess(this)) {
            return;
        }
        LeakCanary.install(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
//            return UpdateContext.getBundleUrl(MainApplication.this);
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            MainPackageConfig.Builder builder = new MainPackageConfig.Builder();
            builder.setFrescoConfig(ImagePipelineConfigUtils.getDefaultImagePipelineConfig(BaseApplication.appContext));
            return Arrays.<ReactPackage>asList(
                    new RNMRPackage(),
                    new MainReactPackage(builder.build()),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
//                    new UpdatePackage(),
                    new SvgPackage(),
                    new RNDeviceInfo(),
                    new RNGeolocationPackage(),
                    new LinearGradientPackage(),
                    new RNFetchBlobPackage(),
                    new CookieManagerPackage(),
                    new WebViewBridgePackage(),
                    new LottiePackage(),
                    new MRNetStatePackage(),
                    new RNSensorsAnalyticsPackage(),
                    new PickerPackage(),
                    new ExtraDimensionsPackage(),
                    new CodePush("WU671PqR4MNz7Gs9Rn-KAPuSjJJN4619a06a-47ab-4a6f-a3b6-7acb423467c6",MainApplication.this,BuildConfig.DEBUG)
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
