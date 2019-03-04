package com.meeruu.commonlib.service;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.soloader.SoLoader;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.rn.QiyuImageLoader;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meituan.android.walle.WalleChannelReader;
import com.qiyukf.unicorn.api.Unicorn;

import cn.jpush.android.api.JPushInterface;

import static com.meeruu.commonlib.config.QiyuConfig.options;

public class InitializeService extends IntentService {
    private static final String ACTION_INIT_WHEN_APP_CREATE = "com.meeruu.sharegoods";

    public InitializeService() {
        super("InitializeService");
    }

    public static void init(Context context) {
        Intent intent = new Intent(context, InitializeService.class);
        intent.setAction(ACTION_INIT_WHEN_APP_CREATE);
        context.startService(intent);

    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            final String action = intent.getAction();
            if (ACTION_INIT_WHEN_APP_CREATE.equals(action)) {
                performInit();
            }
        }
    }

    /**
     * .
     * do you init action here
     */
    private void performInit() {
        Fresco.initialize(this, FrescoImagePipelineConfig.getDefaultImagePipelineConfig(this));
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
            // 初始化 Sensors SDK
            SensorsUtils.initDebugMode(this, channel);
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
            // 捕获闪退日志
            CrashHandler.getInstance().init(this);
            // 初始化 Sensors SDK
            SensorsUtils.initReleaseMode(this, channel);
        }
        // 七鱼初始化
        Unicorn.init(this, "b87fd67831699ca494a9d3de266cd3b0", options(), new QiyuImageLoader(this));
    }
}
