package com.meeruu.commonlib;

import android.app.ActivityManager;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.text.TextUtils;

import com.facebook.soloader.SoLoader;
import com.meeruu.commonlib.umeng.RNUMConfigure;
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
        if (getProcessName(this).equals(getPackageName())) {
            // 捕获闪退日志
//            CrashHandler.getInstance().init(this);
            SoLoader.init(this, /* native exopackage */ false);
            // umeng初始化
            RNUMConfigure.init(this, "5b7663a3f29d9830cb0000d8"
                    , "umeng", UMConfigure.DEVICE_TYPE_PHONE, null);//58edcfeb310c93091c000be2 5965ee00734be40b580001a0
            PlatformConfig.setWeixin("wx401bc973f010eece", "405dede82bb1c57e0b63056c8d2274c1");
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
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
    public String getProcessName(Context context) {
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