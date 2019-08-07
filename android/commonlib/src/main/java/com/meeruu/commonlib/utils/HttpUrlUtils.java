package com.meeruu.commonlib.utils;


import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;

public class HttpUrlUtils {

    /**************************** api ***************************/
    public static final String URL_SHOWLIST = "/social/show/content/page/query"; //秀场列表
    public static final String URL_START_AD = "/advertising/queryAdvertisingList"; //秀场列表
    public static final String URL_SHOW_VIDEO = "/social/show/video/list/next"; //秀场视频列表
    public static final String URL_DYNAMIC = "/social/show/content/page/mine/query"; //秀场个人中心
    public static final String URL_DELETE_DYNAMIC = "/social/show/content/delete"; //删除发布文章
    public static final String URL_GONGMAO = "/gongmall/contract/notify"; //签约回调
    public static final String URL_VIDEO_AUTH = "/social/show/token"; //视频上传token
    public static final String URL_COLLECTION_LIST = "/social/show/content/page/mine/collect"; //我的收藏
    public static final String REDUCE_COUNT_BY_TYPE = "/social/show/count/reduceCountByType"; //取消点赞/收藏/浏览量
    public static final String URL_OTHER_ARTICLE = "/social/show/content/page/other/query"; //查询其他人的文章
    public static final String URL_ATTENTION = "/social/show/user/follow"; //关注某人
    public static final String URL_ATTENTION_NO = "/social/show/user/cancel/follow"; //取消关注
    public static final String URL_ATTENTION_LIST = "/social/show/content/page/query/attention"; //取消关注
    public static final String URL_BASE_URL = "/redirect/baseUrl"; // 域名
    public static final String URL_SHOPINFO = "/product/getProductShopInfoBySupplierCode"; // 商家信息


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

    /***
     * 获取url 指定name的value;
     * @param url
     * @param name
     * @return
     */
    public static String getValueByName(String url, String name) {
        String result = "";
        int index = url.lastIndexOf("?");
        String temp = url.substring(index + 1);
        String[] keyValue = temp.split("&");
        for (String str : keyValue) {
            if (str.contains(name)) {
                result = str.replace(name + "=", "");
                break;
            }
        }
        return result;
    }
}
