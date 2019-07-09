package com.meeruu.sharegoods.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.event.Event;
import com.meeruu.sharegoods.ui.activity.MainRNActivity;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLEncoder;
import java.util.Map;

import cn.jpush.android.api.JPushInterface;

/**
 * 自定义接收器
 * <p>
 * 如果不定义这个 Receiver，则：
 * 1) 默认用户会打开主界面
 * 2) 接收不到自定义消息
 */
public class MRJPushReceiver extends BroadcastReceiver {

    private static final String TAG = "JPush";
    private static final String PACKAGENAME = "com.meeruu.sharegoods";
    private static final String LINk_KEY = "linkUrl";
    private static final String PAGE_KEY = "pageType";
    private static final String PARAMS_KEY = "params";

    @Override
    public void onReceive(final Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        JSONObject objExtra = null;
        try {
            String extra = bundle.getString(JPushInterface.EXTRA_EXTRA);
            if (extra != null) {
                objExtra = new JSONObject(extra);
            }
        } catch (JSONException e) {
        }

        if (JPushInterface.ACTION_REGISTRATION_ID.equals(intent.getAction())) {
            final String regId = bundle.getString(JPushInterface.EXTRA_REGISTRATION_ID);
            // 将推送 ID 保存到用户表中
            SensorsDataAPI.sharedInstance().profilePushId("jgId", regId);
            Log.d(TAG, "[MyReceiver] 接收Registration Id : " + regId);
        } else if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(intent.getAction())) {
            Log.d(TAG, "[MyReceiver] 接收到推送下来的自定义消息: " + bundle.getString(JPushInterface.EXTRA_MESSAGE));
            String content = bundle.getString(JPushInterface.EXTRA_MESSAGE);
            String type = bundle.getString(JPushInterface.EXTRA_CONTENT_TYPE);
            receiveMsg(context, content, type, objExtra);
        } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(intent.getAction())) {
            Log.d(TAG, "[MyReceiver] 接收到推送下来的通知" + bundle.toString());
            int notifactionId = bundle.getInt(JPushInterface.EXTRA_NOTIFICATION_ID);
            Log.d(TAG, "[MyReceiver] 接收到推送下来的通知的ID: " + notifactionId);
            receiveNotify(objExtra);
        } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())) {
            Log.d(TAG, "[MyReceiver] 用户点击打开了通知");
            notifyOpened(context, objExtra);
        } else if (JPushInterface.ACTION_RICHPUSH_CALLBACK.equals(intent.getAction())) {
            Log.d(TAG, "[MyReceiver] 用户收到到RICH PUSH CALLBACK: " + bundle.getString(JPushInterface.EXTRA_EXTRA));
            //在这里根据 JPushInterface.EXTRA_EXTRA 的内容处理代码，比如打开新的Activity， 打开一个网页等..

        } else if (JPushInterface.ACTION_CONNECTION_CHANGE.equals(intent.getAction())) {
            boolean connected = intent.getBooleanExtra(JPushInterface.EXTRA_CONNECTION_CHANGE, false);
            Log.w(TAG, "[MyReceiver]" + intent.getAction() + " connected state change to " + connected);
        } else {
            Log.d(TAG, "[MyReceiver] Unhandled intent - " + intent.getAction());
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
        if(objExtra != null && objExtra.has(LINk_KEY)){
            String link = "";
            try {
                link = objExtra.getString(LINk_KEY);
                link = URLEncoder.encode(link,"utf-8");
            }catch (Exception e){
            }
            String uri = "meeruu://path/HtmlPage/"+link;
            deepLink(uri,context);
        }else if(objExtra != null && objExtra.has(PAGE_KEY)){
            try {
                int pageType = objExtra.getInt(PAGE_KEY);
                //暂时type 100跳转到账户余额页面
                if(pageType == 100){
                    String params = objExtra.getString(PARAMS_KEY);
                    Map map = com.alibaba.fastjson.JSONObject.parseObject(params);
                    String uri = "meeruu://path/MyCashAccountPage/"+map.get("index");
                    deepLink(uri,context);
                }else {
                    startApp(context);
                }
            }catch (Exception e){
                startApp(context);
            }
        }else {
          startApp(context);
        }
    }

    private void startApp(Context context){
        if (!AppUtils.isAppOnForeground(context)) {
            AppUtils.startAPP(context, PACKAGENAME);
        }
    }

    private void deepLink(String uri,Context context){
        Uri realUri = Uri.parse(uri);
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        intent.setData(realUri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

}
