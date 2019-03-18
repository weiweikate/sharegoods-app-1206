package com.meeruu.commonlib.base;

import android.content.ComponentCallbacks2;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.service.InitializeService;
import com.meeruu.commonlib.utils.AppUtils;

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
        ForegroundCallbacks.init(this);
        InitializeService.init(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
        // 修复部分手机GC超时
        AppUtils.daemonsFix();
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        try {
            if (level >= ComponentCallbacks2.TRIM_MEMORY_MODERATE) {
                ImagePipelineFactory.getInstance().getImagePipeline().clearMemoryCaches();
            }
        } catch (Exception e) {
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        try {
            ImagePipelineFactory.getInstance().getImagePipeline().clearMemoryCaches();
        } catch (Exception e) {
        }
    }
}
