package com.meeruu.sharegoods.receiver;

import android.content.Context;

import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.event.Event;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

/**
 * 自定义接收器
 * <p>
 * 如果不定义这个 Receiver，则：
 * 1) 默认用户会打开主界面
 * 2) 接收不到自定义消息
 */
public class MRJPushReceiver extends JPushMessageReceiver {

    private static final String PACKAGENAME = "com.meeruu.sharegoods";

    // 注册回调
    @Override
    public void onRegister(Context context, String regId) {
        super.onRegister(context, regId);
        // 将推送 ID 保存到用户表中
        SensorsDataAPI.sharedInstance().profilePushId("jgId", regId);
    }

    // 通知被打开
    @Override
    public void onNotifyMessageOpened(Context context, NotificationMessage notificationMessage) {
        super.onNotifyMessageOpened(context, notificationMessage);
        try {
            JSONObject objExtra = new JSONObject(notificationMessage.notificationExtras);
            notifyOpened(context, objExtra);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    // 自定义消息
    @Override
    public void onMessage(Context context, CustomMessage customMessage) {
        super.onMessage(context, customMessage);
        try {
            JSONObject objExtra = new JSONObject(customMessage.extra);
            receiveMsg(context, customMessage.message, customMessage.contentType, objExtra);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    // 通知消息
    @Override
    public void onNotifyMessageArrived(Context context, NotificationMessage notificationMessage) {
        super.onNotifyMessageArrived(context, notificationMessage);
        try {
            JSONObject objExtra = new JSONObject(notificationMessage.notificationExtras);
            receiveNotify(objExtra);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void receiveMsg(Context context, String content, String type, JSONObject objExtra) {
        LogUtils.d("======" + content + "======" + type + "======" + objExtra);
        switch (type) {
            case "HomeRefresh":
                // 刷新首页
                try {
                    JSONObject object = new JSONObject(content);
                    if (object != null) {
                        EventBus.getDefault().post(new Event.MRHomeRefreshEvent(object.getInt("homeType")));
                    }
                } catch (JSONException e) {
                }
                break;
            case "ActivitySkip":
                // 跳标
                EventBus.getDefault().post(new Event.MRNativeTagEvent(content));
                break;
            case "sendTipsTagEvent":
                EventBus.getDefault().post(new Event.MRMineMsgEvent(content));
                break;
            default:
                break;
        }
    }

    //接收到通知
    private void receiveNotify(JSONObject objExtra) {
    }

    //用户点击了通知
    private void notifyOpened(final Context context, JSONObject objExtra) {
        if (!AppUtils.isAppOnForeground(context)) {
            AppUtils.startAPP(context, PACKAGENAME);
        }
    }

}
