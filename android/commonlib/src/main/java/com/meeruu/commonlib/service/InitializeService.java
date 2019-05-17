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

import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meituan.android.walle.WalleChannelReader;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jpush.android.api.JPushInterface;

public class InitializeService extends IntentService {

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
        if (Utils.isApkInDebug()) {
            // jpush debug
            JPushInterface.setDebugMode(true);
            // umeng debug
            UApp.debug();
            // 禁止极光捕获crash
            JPushInterface.stopCrashHandler(getApplicationContext());
            // 一键登录debug
            JVerificationInterface.setDebugMode(true);
            // 神策
            SensorsDataAPI.sharedInstance().enableLog(true);
        } else {
            JPushInterface.setDebugMode(false);
            JPushInterface.initCrashHandler(getApplicationContext());
            JPushInterface.setChannel(getApplicationContext(), channel);
            // 捕获闪退日志
            CrashHandler.getInstance().init(getApplicationContext());
        }

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
