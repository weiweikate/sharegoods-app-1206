package com.meeruu.commonlib.utils;


import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class HttpUrlUtils {

    /**************************** api ***************************/
    public static final String URL_SHOWLIST = "/social/show/content/page/query"; // 秀场列表
    public static final String URL_START_AD = "/advertising/queryAdvertisingList"; // 秀场列表
    public static final String URL_DYNAMIC = "/social/show/content/page/mine/query"; // 秀场个人中心
    public static final String URL_DELETE_DYNAMIC = "/social/show/content/delete"; // 秀场个人中心
    public static final String URL_GONGMAO = "/gongmall/contract/notify"; // 签约回调
    public static final String URL_BASE_URL = "/redirect/baseUrl"; // 域名


    /*********获取api接口url***********/
    public static String getUrl(String url) {
        String SERVER = "https://api.sharegoodsmall.com/gateway";
        String jsonStr = (String) SPCacheUtils.get(ParameterUtils.API_SERVER, "");
        if (!TextUtils.isEmpty(jsonStr)) {
            JSONObject object = JSON.parseObject(jsonStr);
            SERVER = object.getString("host");
        }
        return SERVER + url;
    }

    /*********获取api接口url***********/
    public static String getH5Url(String url) {
        String SERVER = "https://h5.sharegoodsmall.com";
        String jsonStr = (String) SPCacheUtils.get(ParameterUtils.API_SERVER, "");
        if (!TextUtils.isEmpty(jsonStr)) {
            JSONObject object = JSON.parseObject(jsonStr);
            SERVER = object.getString("h5");
        }
        return SERVER + url;
    }

    /*********获取工猫回调url***********/
    public static String getGongmaoUrl() {
        String SERVER = "https://api.sharegoodsmall.com/gateway/gongmall/contract/reback";
        String jsonStr = (String) SPCacheUtils.get(ParameterUtils.API_SERVER, "");
        if (!TextUtils.isEmpty(jsonStr)) {
            JSONObject object = JSON.parseObject(jsonStr);
            SERVER = object.getString("gongmao");
        }
        return SERVER;
    }
}
