package com.meeruu.sharegoods;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.soloader.SoLoader;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.horcrux.svg.SvgPackage;
import com.meeruu.RNDeviceInfo.RNDeviceInfo;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.rn.QiyuImageLoader;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.sharegoods.rn.MainReactPackage;
import com.meeruu.sharegoods.rn.RNMRPackage;
import com.meeruu.sharegoods.rn.lottie.LottiePackage;
import com.meituan.android.walle.WalleChannelReader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.qiyukf.unicorn.api.Unicorn;
import com.reactlibrary.RNGeolocationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.request.MRNetStatePackage;
import com.sensorsdata.analytics.RNSensorsAnalyticsPackage;
import com.squareup.leakcanary.LeakCanary;
import com.taobao.sophix.PatchStatus;
import com.taobao.sophix.SophixManager;
import com.taobao.sophix.listener.PatchLoadStatusListener;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import cn.jpush.android.api.JPushInterface;
import cn.reactnative.modules.update.UpdateContext;
import cn.reactnative.modules.update.UpdatePackage;

import static com.meeruu.commonlib.config.QiyuConfig.options;

/**
 * @author louis
 * @date on 2018/9/3
 * @describe 应用application类
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class MainApplication extends BaseApplication implements ReactApplication {

    private String packageName = "";
    private WeakHandler mHandler;
    private int patchStatus;

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        if (TextUtils.isEmpty(packageName)) {
            packageName = AppUtils.getProcessName(this);
            mHandler = new WeakHandler(new Handler.Callback() {
                @Override
                public boolean handleMessage(Message msg) {
                    switch (msg.what) {
                        case ParameterUtils.EMPTY_WHAT_DELAY:
                            initCallback();
                            performInit();
                            break;
                        default:
                            break;
                    }
                    return false;
                }
            });
        }
    }

    @Override
    public void onCreate() {
        if (packageName.equals(getPackageName())) {
            super.onCreate();
            Fresco.initialize(getApplicationContext(),
                    FrescoImagePipelineConfig.getDefaultImagePipelineConfig(getApplicationContext()));
            // 延迟三方sdk初始化
            mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT_DELAY, 2000);
            // 检测内存泄漏
            LeakCanary.install(this);
        }
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return UpdateContext.getBundleUrl(MainApplication.this);
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
                    new VectorIconsPackage(),
                    new UpdatePackage(),
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
                    new RNCWebViewPackage()
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

    private void initCallback() {
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
    }

    /**
     * .
     * do you init action here
     */
    private void performInit() {
        SoLoader.init(getApplicationContext(), /* native exopackage */ false);
        // umeng初始化
        String channel = WalleChannelReader.getChannel(getApplicationContext(), "guanwang");
        // 友盟统计
        UApp.init(getApplicationContext(), ParameterUtils.UM_KEY, channel);
        // 初始化分享
        UShare.init(getApplicationContext(), ParameterUtils.UM_KEY);
        // 初始化极光
        JPushInterface.init(getApplicationContext());
        if (Utils.isApkInDebug()) {
            // 初始化 Sensors SDK
            SensorsUtils.initDebugMode(getApplicationContext(), channel);
            // jpush debug
            JPushInterface.setDebugMode(true);
            // umeng debug
            UApp.debug();
            // 禁止极光捕获crash
            JPushInterface.stopCrashHandler(getApplicationContext());
        } else {
            JPushInterface.setDebugMode(false);
            JPushInterface.initCrashHandler(getApplicationContext());
            JPushInterface.setChannel(getApplicationContext(), channel);
            // 捕获闪退日志
            CrashHandler.getInstance().init(getApplicationContext());
            // 初始化 Sensors SDK
            SensorsUtils.initReleaseMode(getApplicationContext(), channel);
        }
        // 七鱼初始化
        Unicorn.init(getApplicationContext(), "b87fd67831699ca494a9d3de266cd3b0", options(),
                new QiyuImageLoader(getApplicationContext()));
    }
}
