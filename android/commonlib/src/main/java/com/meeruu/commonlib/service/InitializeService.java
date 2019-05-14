package com.meeruu.commonlib.service;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;

import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meituan.android.walle.WalleChannelReader;
import com.taobao.sophix.PatchStatus;
import com.taobao.sophix.SophixManager;
import com.taobao.sophix.listener.PatchLoadStatusListener;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jpush.android.api.JPushInterface;

public class InitializeService extends IntentService {

    private int patchStatus;

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground();
    }

    @Override
    public int onStartCommand(@Nullable Intent intent, int flags, int startId) {
        startForeground();
        return super.onStartCommand(intent, flags, startId);
    }

    public InitializeService() {
        super("InitializeService");
    }

    public static void init(Context context) {
        Intent intent = new Intent();
        intent.setClass(context, InitializeService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            try {
                context.startService(intent);
            } catch (Exception e) {
            }
        }
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            initCallback();
            initDelay();
        }
    }

    private void initDelay() {
        try {
            // 延迟2s执行
            Thread.sleep(2000);
        } catch (InterruptedException e) {
        }
        // umeng初始化
        String channel = WalleChannelReader.getChannel(getApplicationContext(), "guanwang");
        // 友盟统计
        UApp.init(getApplicationContext(), ParameterUtils.UM_KEY, channel);
        // 初始化分享
        UShare.init(getApplicationContext(), ParameterUtils.UM_KEY);
        // 初始化极光
        JPushInterface.init(getApplicationContext());
        // 初始化一键登录
        JVerificationInterface.init(getApplicationContext());
        if (Utils.isApkInDebug()) {
            // jpush debug
            JPushInterface.setDebugMode(true);
            // umeng debug
            UApp.debug();
            // 禁止极光捕获crash
            JPushInterface.stopCrashHandler(getApplicationContext());
            // 一键登录debug
            JVerificationInterface.setDebugMode(true);
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

    private void startForeground() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(ParameterUtils.MR_NOTIFY_CHANNEL_ID, ParameterUtils.MR_NOTIFY_CHANNEL_NAME, NotificationManager.IMPORTANCE_LOW);
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null)
                return;
            manager.createNotificationChannel(channel);
            Notification notification = new NotificationCompat.Builder(this, ParameterUtils.MR_NOTIFY_CHANNEL_ID)
                    .setAutoCancel(true)
                    .setCategory(Notification.CATEGORY_SERVICE)
                    .setOngoing(true)
                    .setPriority(NotificationManager.IMPORTANCE_LOW)
                    .build();
            startForeground(ParameterUtils.NOTIFY_ID_APP_INIT, notification);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopForeground(true);
    }
}
