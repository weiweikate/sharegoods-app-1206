package com.meeruu.commonlib;

import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.support.annotation.Nullable;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.text.TextUtils;

import com.facebook.soloader.SoLoader;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.umeng.RNUMConfigure;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnicornImageLoader;
import com.qiyukf.unicorn.api.YSFOptions;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import java.util.List;

public class BaseApplication extends MultiDexApplication {

    private static BaseApplication instance;
    public static Context appContext;


    public static BaseApplication getInstance() {
        if (null == instance) {
            synchronized (BaseApplication.class) {
                if (null == instance) {
                    instance = new BaseApplication();
                }
            }
        }
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        appContext = this;
        // activity生命周期，onCreate之后
        ForegroundCallbacks.init(this);
        if (getProcessName(this).equals(getPackageName())) {
            // 捕获闪退日志
//            CrashHandler.getInstance().init(this);
            SoLoader.init(this, /* native exopackage */ false);
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
            RNUMConfigure.init(this, "5b7663a3f29d9830cb0000d8"
                    , "umeng", UMConfigure.DEVICE_TYPE_PHONE, null);//58edcfeb310c93091c000be2 5965ee00734be40b580001a0
            PlatformConfig.setWeixin("wxf5ab8d9143aa38e9", "3252881956221212770d73a7995d057d");
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    // 如果返回值为null，则全部使用默认参数。
    private YSFOptions options() {
        YSFOptions options = new YSFOptions();
        options.statusBarNotificationConfig = new StatusBarNotificationConfig();
        UICustomization uiCustomization = new UICustomization();
        uiCustomization.avatarShape = 0;
        uiCustomization.titleBackgroundColor = 0xFF12CDB0;
        uiCustomization.titleBarStyle = 1;
        uiCustomization.topTipBarBackgroundColor = 0xFF666666;
        uiCustomization.titleCenter = true;
        uiCustomization.topTipBarTextColor = 0xFFFFFFFF;
        options.categoryDialogStyle = 0;
        options.uiCustomization = uiCustomization;
        return options;
    }

    /**
     * 获取进程名。
     * 由于app是一个多进程应用，因此每个进程被os创建时，
     * onCreate()方法均会被执行一次，
     * 进行辨别初始化，针对特定进程进行相应初始化工作，
     * 此方法可以提高一半启动时间。
     *
     * @param context 上下文环境对象
     * @return 获取此进程的进程名
     */
    private String getProcessName(Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningAppProcesses = am.getRunningAppProcesses();
        if (runningAppProcesses == null) {
            return "";
        }

        for (ActivityManager.RunningAppProcessInfo runningAppProcess : runningAppProcesses) {
            if (runningAppProcess.pid == android.os.Process.myPid()
                    && !TextUtils.isEmpty(runningAppProcess.processName)) {
                return runningAppProcess.processName;
            }
        }
        return "";
    }
}