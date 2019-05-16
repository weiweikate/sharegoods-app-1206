package com.meeruu.commonlib.utils;

import android.content.Context;
import android.text.TextUtils;
import android.webkit.WebView;

import com.meituan.android.walle.WalleChannelReader;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @author louis
 * @date on 2018/5/3
 * @describe SensorsData
 * @org xxd.smartstudy.com
 * @email luoyongming@innobuddy.com
 */
public class SensorsUtils {

    public static void init(Context context) {
        String channel = WalleChannelReader.getChannel(context, "guanwang");
        if (Utils.isApkInDebug()) {
            // 初始化 Sensors SDK
            SensorsUtils.initDebugMode(context, channel);
        } else {
            // 初始化 Sensors SDK
            SensorsUtils.initReleaseMode(context, channel);
        }
    }

    private static void initDebugMode(Context context, String channel) {
        SensorsDataAPI.sharedInstance(context, "https://track.sharegoodsmall.com/sa?project=default",
                SensorsDataAPI.DebugMode.DEBUG_OFF);
        //开启调试日志（ true 表示开启调试日志）
        SensorsDataAPI.sharedInstance().enableLog(false);
        initConfig(context, channel);
    }

    private static void initReleaseMode(Context context, String channel) {
        // 初始化
        SensorsDataAPI.sharedInstance(context, "https://track.sharegoodsmall.com/sa?project=production");
        initConfig(context, channel);
    }

    private static void initConfig(Context context, String channel) {
        // 设置匿名ID
        String deviceId = DeviceUtils.getUniquePsuedoID(context);
        if (!TextUtils.isEmpty(deviceId)) {
            SensorsDataAPI.sharedInstance().identify(deviceId);
        }
        try {
            // 初始化SDK后，获取应用名称设置为公共属性
            JSONObject obj_super = new JSONObject();
            obj_super.put("platform", "AndroidApp");
            obj_super.put("platformType", "Android");
            obj_super.put("product", AppUtils.getAppName() + "-APP");
//            obj_super.put("$latest_utm_source", channelInfo.getName());
//            obj_super.put("$latest_utm_medium", channelInfo.getMedium());
//            obj_super.put("$latest_utm_term", channelInfo.getTerm());
//            obj_super.put("$latest_utm_content", channelInfo.getContent());
//            obj_super.put("$latest_utm_campaign", channelInfo.getCampaign());
            SensorsDataAPI.sharedInstance().registerSuperProperties(obj_super);
            // 初始化我们SDK后 调用这段代码，用于记录安装事件、渠道追踪。
            JSONObject installation = new JSONObject();
            // 这里的 DownloadChannel 负责记录下载商店的渠道。
            installation.put("DownloadChannel", channel);
            // 这里安装事件取名为 AppInstall。
            // 注意 由于要追踪不同渠道链接中投放的推广渠道，所以 Manifest 中不能按照“方案一”神策meta-data方式定制渠道信息，代码中也不能传入 $utm_ 开头的渠道字段！！！
            SensorsDataAPI.sharedInstance(context).trackInstallation("AppInstall", installation);
            // 忽略单个页面，java反射拿到rn容器activity
            SensorsDataAPI.sharedInstance().ignoreAutoTrackActivity(Class.forName("com.meeruu.sharegoods.ui.activity.MainRNActivity"));
            // 打开自动采集, 并指定追踪哪些 AutoTrack 事件
            List<SensorsDataAPI.AutoTrackEventType> eventTypeList = new ArrayList<>();
            // $AppStart
            eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_START);
            // $AppEnd
            eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_END);
            // $AppViewScreen，目前只有rn页面，不需要自动采集原生页面
//            eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_VIEW_SCREEN);
            // $AppClick
//            eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_CLICK);
            SensorsDataAPI.sharedInstance().enableAutoTrack(eventTypeList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // rn
        SensorsDataAPI.sharedInstance().enableReactNativeAutoTrack();
        // crash
        SensorsDataAPI.sharedInstance().trackAppCrash();
    }

    public static void trackLogin(String userId) {
        SensorsDataAPI.sharedInstance().login(userId);
    }

    public static void trackLogout() {
        SensorsDataAPI.sharedInstance().logout();
    }

    public static void trackWebView(WebView webView) {
        SensorsDataAPI.sharedInstance().showUpWebView(webView, true);
    }

    public static void trackCustomeEvent(String event, JSONObject object) {
        SensorsDataAPI.sharedInstance().track(event, object);
    }

    public static void trackCustomeEvent(String event) {
        SensorsDataAPI.sharedInstance().track(event);
    }

    public static void tackAppView(String name) {
        try {
            JSONObject properties = new JSONObject();
            properties.put("$screen_name", name);
            SensorsDataAPI.sharedInstance().trackViewScreen(null, properties);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
