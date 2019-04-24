package com.meeruu.sharegoods.rn.kefu;

import android.content.Context;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.commonlib.service.QiyuUrlEvent;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.event.LoadingDialogEvent;
import com.meeruu.sharegoods.utils.LoadingDialog;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.ProductDetail;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnreadCountChangeListener;
import com.qiyukf.unicorn.api.YSFUserInfo;
import com.qiyukf.unicorn.api.msg.ProductReslectOnclickListener;
import com.qiyukf.unicorn.api.msg.UnicornMessage;
import com.qiyukf.unicorn.api.pop.POPManager;
import com.qiyukf.unicorn.api.pop.Session;
import com.qiyukf.unicorn.api.pop.ShopInfo;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.List;

public class QYChatModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "JRQYService";
    public static final int BEGIN_FROM_OTHER = 0;//从我的地方发起客服 会直接对接平台客服
    public static final int BEGIN_FROM_PRODUCT = 1;//从产品详情发起客服
    public static final int BEGIN_FROM_ORDER = 2;//从订单发起客服
    public static final int BEGIN_FROM_MESSAGE = 3;//从消息列表发起客服

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public QYChatModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    // 添加未读数变化监听，add 为 true 是添加，为 false 是撤销监听。
    // 退出界面时，必须撤销，以免造成资源泄露
    private UnreadCountChangeListener listener = new UnreadCountChangeListener() {
        // 声明一个成员变量
        @Override
        public void onUnreadCountChange(int count) {
            sendEvent2RN(count);
        }
    };

    private void sendEvent2RN(int count) {
        /**
         * 获取最近联系商家列表
         *
         * @return 最近联系商家列表
         */
        List<Session> sessionList = POPManager.getSessionList();
        WritableArray sessionListData = Arguments.createArray();
        for (int len = sessionList.size(), i = len - 1; i >= 0; i--) {
            Session session = sessionList.get(i);
            UnicornMessage msg;
            if (TextUtils.isEmpty(session.getContactId())) {
                msg = Unicorn.queryLastMessage();
            } else {
                msg = POPManager.queryLastMessage(session.getContactId());
            }
            ShopInfo shopInfo = POPManager.getShopInfo(session.getContactId());
            WritableMap sessionData = Arguments.createMap();
            sessionData.putString("hasTrashWords", "");
            sessionData.putString("lastMessageText", session.getContent());
            if (msg != null) {
                sessionData.putString("lastMessageType", msg.getMsgType() + "");
            }
            sessionData.putInt("unreadCount", session.getUnreadCount());
            sessionData.putString("status", session.getMsgStatus() + "");
            sessionData.putDouble("lastMessageTimeStamp", session.getTime());
            sessionData.putString("shopId", session.getContactId());
            if (shopInfo != null) {
                sessionData.putString("avatarImageUrlString", shopInfo.getAvatar());
                sessionData.putString("sessionName", shopInfo.getName());
            }
            sessionListData.pushMap(sessionData);
        }
        WritableMap params = Arguments.createMap();
        params.putInt("unreadCount", count);
        params.putArray("sessionListData", sessionListData);
        sendEvent(mContext, "QY_MSG_CHANGE", params);
    }

    private void addUnreadCountChangeListener(boolean add) {
        Unicorn.addUnreadCountChangeListener(listener, add);
    }

    @ReactMethod
    public void initQYChat(ReadableMap params) {
        YSFUserInfo userInfo = new YSFUserInfo();
        // APP 的用户 ID
        if (params.hasKey("userId")) {
            userInfo.userId = params.getString("userId");
        }
        // CRM 扩展字段
        JSONArray arr = new JSONArray();
        if (params.hasKey("nickName")) {
            JSONObject name = new JSONObject();
            name.put("key", "real_name");
            name.put("value", params.getString("nickName"));
            arr.add(name);
        }
        if (params.hasKey("userIcon")) {
            JSONObject avatar = new JSONObject();
            avatar.put("key", "avatar");
            avatar.put("value", params.getString("userIcon"));
            arr.add(avatar);
        }
        if (params.hasKey("device")) {
            JSONObject device = new JSONObject();
            device.put("key", "device");
            device.put("value", params.getString("device"));
            arr.add(device);
        }
        if (params.hasKey("systemVersion")) {
            JSONObject sysVS = new JSONObject();
            sysVS.put("key", "platformVersion");
            sysVS.put("value", params.getString("systemVersion"));
            arr.add(sysVS);
        }
        JSONObject appVS = new JSONObject();
        appVS.put("key", "appVersion");
        appVS.put("value", AppUtils.getVersionName());
        arr.add(appVS);

        userInfo.data = JSONArray.toJSONString(arr);
        Unicorn.setUserInfo(userInfo);
        addUnreadCountChangeListener(true);
        sendEvent2RN(Unicorn.getUnreadCount());
    }

    @ReactMethod
    public void beginQYChat(ReadableMap params) {
        String title = "";
        if (params.hasKey("shopId")) {
            String shopId = params.getString("shopId");
            if (TextUtils.isEmpty(shopId)) {
                title = "平台客服";
            } else {
                if (params.hasKey("title")) {
                    title = params.getString("title");
                }
            }
        } else {
            title = "平台客服";
        }
        double type = params.getDouble("chatType");
        int chatType = (int) type;
        switch (chatType) {
            case BEGIN_FROM_MESSAGE:
                SPCacheUtils.remove("shopId");
                break;
            case BEGIN_FROM_ORDER:
                break;
            case BEGIN_FROM_OTHER:
                SPCacheUtils.remove("shopId");
                break;
            case BEGIN_FROM_PRODUCT:
                break;
            default:
                break;
        }
        /**
         * 设置访客来源，标识访客是从哪个页面发起咨询的，用于客服了解用户是从什么页面进入。
         * 三个参数分别为：来源页面的url，来源页面标题，来源页面额外信息（保留字段，暂时无用）。
         * 设置来源后，在客服会话界面的"用户资料"栏的页面项，可以看到这里设置的值。
         */
        ConsultSource source = new ConsultSource("mine/helper", title, "");
        source.custom = chatType + "";
        source.shopId = params.hasKey("shopId") ? params.getString("shopId") : "";
        ReadableMap map = params.getMap("data");
        if (map.hasKey("urlString")) {
            ProductDetail productDetail = new ProductDetail.Builder()
                    .setShow(1)
                    .setSendByUser(true)
                    .setAlwaysSend(true)
                    .setActionText("发送宝贝")
                    .setActionTextColor(0xFFF00050)
                    .setTitle(map.getString("title"))
                    .setDesc(map.getString("desc"))
                    .setPicture(map.getString("pictureUrlString"))
                    .setUrl(map.getString("urlString"))
                    .setNote(map.getString("note"))
                    .build();
            source.productDetail = productDetail;
        }
        /**
         * 请注意： 调用该接口前，应先检查Unicorn.isServiceAvailable()，
         * 如果返回为false，该接口不会有任何动作
         *
         * @param context 上下文
         * @param title   聊天窗口的标题
         * @param source  咨询的发起来源，包括发起咨询的url，title，描述信息等
         */
        Unicorn.openServiceActivity(mContext, title, source);
    }

    @ReactMethod
    public void qiYULogout() {
        Unicorn.logout();
        addUnreadCountChangeListener(false);
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQiyuUrl(QiyuUrlEvent event) {
        WritableMap map = Arguments.createMap();
        map.putInt("card_type",0);
        map.putString("linkUrl",event.getUrl());
        sendEvent(this.mContext,"QY_CARD_CLICK",map);
    }
}
