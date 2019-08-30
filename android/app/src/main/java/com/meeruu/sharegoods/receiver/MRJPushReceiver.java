package com.meeruu.sharegoods.receiver;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.TableLayout;

import com.meeruu.commonlib.event.Event;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLEncoder;

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
    private static final String LINk_KEY = "linkUrl";
    private static final String LINK_NATIVE_URL = "linkNativeUrl";
    private static final String PAGE_KEY = "pageType";
    private static final String PARAMS_KEY = "params";
    private static final String BIZ_ID = "bizId";
    private static final String BIZ_TYPE = "bizType";
    private static final String APP_OPENN_OTIFICATION = "AppOpenNotification";

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
        trackPush(notificationMessage);
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
        if (objExtra != null && objExtra.has(LINk_KEY)) {
            String link = "";
            try {
                link = objExtra.getString(LINk_KEY);
                link = URLEncoder.encode(link, "utf-8");
            } catch (Exception e) {
            }
            String uri = "meeruu://path/HtmlPage/" + link;
            deepLink(uri, context);
        } else if (objExtra != null && objExtra.has(LINK_NATIVE_URL)) {
            String link = "";
            try {
                link = objExtra.getString(LINk_KEY);
            } catch (Exception e) {
            }
            String uri = "meeruu://path/" + link;
            deepLink(uri, context);
        } else {
            startApp(context);
        }
    }

    /**
     * 推送消息神策埋点
     *
     * @param notificationMessage
     */
    private void trackPush(NotificationMessage notificationMessage) {
        try {
            JSONObject objExtra = new JSONObject(notificationMessage.notificationExtras);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("msg_id", notificationMessage.msgId);
            jsonObject.put("msg_title", notificationMessage.notificationTitle);
            if (objExtra != null && objExtra.has(BIZ_ID)) {
                String id = objExtra.getString(BIZ_ID);
                jsonObject.put(BIZ_ID, id);
            }

            if(objExtra != null && objExtra.has(BIZ_TYPE)){
                String type = objExtra.getString(BIZ_TYPE);
                jsonObject.put(type, type);
            }

            SensorsUtils.trackCustomeEvent(APP_OPENN_OTIFICATION, jsonObject);
        } catch (Exception e) {
        }
    }

    private void startApp(Context context) {
        if (!AppUtils.isAppOnForeground(context)) {
            AppUtils.startAPP(context, PACKAGENAME);
        }
    }

    private void deepLink(String uri, Context context) {
        Uri realUri = Uri.parse(uri);
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        intent.setData(realUri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

}
