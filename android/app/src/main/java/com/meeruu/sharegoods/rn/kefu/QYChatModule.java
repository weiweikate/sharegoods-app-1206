package com.meeruu.sharegoods.rn.kefu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.meeruu.commonlib.utils.AppUtils;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.YSFUserInfo;

public class QYChatModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "QYChatModule";

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public QYChatModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
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

    @ReactMethod
    public void qiYUChat(ReadableMap params) {
        String title = params.getString("title");
        /**
         * 设置访客来源，标识访客是从哪个页面发起咨询的，用于客服了解用户是从什么页面进入。
         * 三个参数分别为：来源页面的url，来源页面标题，来源页面额外信息（保留字段，暂时无用）。
         * 设置来源后，在客服会话界面的"用户资料"栏的页面项，可以看到这里设置的值。
         */
        ConsultSource source = new ConsultSource("mine/helper", "帮助与客服", "");
        source.staffId = params.getInt("staffId");
        source.groupId = params.getInt("groupId");
        YSFUserInfo userInfo = new YSFUserInfo();
        // APP 的用户 ID
        userInfo.userId = params.getString("userId");
        // CRM 扩展字段
        JSONArray arr = new JSONArray();
        JSONObject name = new JSONObject();
        name.put("key", "real_name");
        name.put("value", params.getString("nickName"));
        arr.add(name);
        JSONObject phone = new JSONObject();
        phone.put("key", "mobile_phone");
        phone.put("value", params.getString("phoneNum"));
        arr.add(phone);
        JSONObject avatar = new JSONObject();
        avatar.put("key", "avatar");
        avatar.put("value", params.getString("userIcon"));
        arr.add(avatar);
        JSONObject device = new JSONObject();
        device.put("key", "device");
        device.put("value", params.getString("device"));
        arr.add(device);
        JSONObject sysVS = new JSONObject();
        sysVS.put("key", "platformVersion");
        sysVS.put("value", params.getString("systemVersion"));
        arr.add(sysVS);
        JSONObject appVS = new JSONObject();
        appVS.put("key", "appVersion");
        appVS.put("value", AppUtils.getVersionName());
        arr.add(appVS);

        userInfo.data = JSONArray.toJSONString(arr);
        Unicorn.setUserInfo(userInfo);
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
    }
}
