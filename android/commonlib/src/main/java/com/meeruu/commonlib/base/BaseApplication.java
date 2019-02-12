package com.meeruu.commonlib.base;

import android.app.ActivityManager;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.text.TextUtils;

import com.facebook.soloader.SoLoader;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meituan.android.walle.WalleChannelReader;

import java.util.List;

import cn.jpush.android.api.JPushInterface;

public class BaseApplication extends MultiDexApplication {

    private static BaseApplication instance;
    public static Context appContext;
    private boolean isDownload = false;
    private String downLoadUrl;

    public boolean isDownload() {
        return isDownload;
    }

    public void setDownload(boolean isDownload) {
        this.isDownload = isDownload;
    }

    public String getDownLoadUrl() {
        return downLoadUrl;
    }

    public void setDownLoadUrl(String downLoadUrl) {
        this.downLoadUrl = downLoadUrl;
    }

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
            SoLoader.init(this, /* native exopackage */ false);
            // umeng初始化
            String channel = WalleChannelReader.getChannel(this, "guanwang");
            // 友盟统计
            UApp.init(this, ParameterUtils.UM_KEY, channel);
            // 初始化分享
            UShare.init(this, ParameterUtils.UM_KEY);
            // 初始化极光
            JPushInterface.init(this);
            if (Utils.isApkInDebug()) {
                // jpush debug
                JPushInterface.setDebugMode(true);
                // umeng debug
                UApp.debug();
                // 禁止极光捕获crash
                JPushInterface.stopCrashHandler(this);
            } else {
                JPushInterface.setDebugMode(false);
                JPushInterface.initCrashHandler(this);
                JPushInterface.setChannel(this, channel);
            }
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