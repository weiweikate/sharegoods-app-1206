package com.meeruu.commonlib.service;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;

import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.rn.QiyuImageLoader;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meituan.android.walle.WalleChannelReader;
import com.qiyukf.unicorn.api.Unicorn;
import com.taobao.sophix.PatchStatus;
import com.taobao.sophix.SophixManager;
import com.taobao.sophix.listener.PatchLoadStatusListener;

import cn.jpush.android.api.JPushInterface;

import static com.meeruu.commonlib.config.QiyuConfig.options;

public class InitializeService extends IntentService {

    private int patchStatus;
    private static final String ACTION_INIT_WHEN_APP_CREATE = "com.meeruu.sharegoods.init";

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
                // 延迟三方sdk初始化
                initNow();
                initCallback();
                initDelay();
            }
        }
    }

    private void initNow() {
        // 七鱼初始化
        Unicorn.init(getApplicationContext(), "b87fd67831699ca494a9d3de266cd3b0", options(),
                new QiyuImageLoader(getApplicationContext()));
    }

    private void initDelay() {
        try {
            // 延迟2s执行
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // umeng初始化
        String channel = WalleChannelReader.getChannel(getApplicationContext(), "guanwang");
        // 友盟统计
        UApp.init(getApplicationContext(), ParameterUtils.UM_KEY, channel);
        // 初始化分享
        UShare.init(getApplicationContext(), ParameterUtils.UM_KEY);
        // 初始化极光
        JPushInterface.init(getApplicationContext());
        if (Utils.isApkInDebug()) {
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
        }

    }

    private void initCallback() {
        final SophixManager instance = SophixManager.getInstance();
        instance.setPatchLoadStatusStub(new PatchLoadStatusListener() {
            @Override
            public void onLoad(final int mode, final int code, final String info, final int handlePatchVersion) {
                patchStatus = code;
            }
        });
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
}
