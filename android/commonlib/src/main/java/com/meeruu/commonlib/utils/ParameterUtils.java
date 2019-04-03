package com.meeruu.commonlib.utils;

public class ParameterUtils {
    // 没有连接
    public static final String UM_KEY = "5b7663a3f29d9830cb0000d8";
    // 没有连接
    public static final String NETWORN_NONE = "NETWORN_NONE";
    // wifi连接
    public static final String NETWORN_WIFI = "NETWORN_WIFI";
    // 手机网络数据连接
    public static final String NETWORN_2G = "NETWORN_2G";
    public static final String NETWORN_3G = "NETWORN_3G";
    public static final String NETWORN_4G = "NETWORN_4G";
    public static final String NETWORN_MOBILE = "NETWORN_MOBILE";
    public static final String API_SERVER = "host_json";
    public static final String GET_DATA_FAILED = "获取数据失败,请稍候重试!";
    public static final String UPLOAD_ERR = "上传失败!";
    public static final String DOWNLOAD_ERR = "下载失败!";
    public static final String NET_ERR = "请检查网络连接状态!";
    public static final String ALL_PICS = "所有图片";
    public static final String RESPONSE_CODE_SUCCESS = "10000";  //响应成功码
    // 无网络连接错误码
    public static final String RESPONE_CODE_NETERR = "net_err";
    public static final String RN_MAIN_NAME = "sharegoods";
    /**
     * 标题
     */
    public static final String TITLE = "title";
    /**
     * webview参数传递key
     */
    public static final String WEBVIEW_URL = "web_url";
    /**
     * webview参数传递key
     */
    public static final String WEBVIEW_ACTION = "url_action";
    // 应用更新
    public static final int FLAG_UPDATE = 1;
    // 应用强制更新
    public static final int FLAG_UPDATE_NOW = 2;
    // 通知栏更新
    public static final int MSG_WHAT_PROGRESS = 3;
    public static final int MSG_WHAT_ERR = 4;
    public static final int MSG_WHAT_FINISH = 5;
    public static final int MSG_WHAT_REFRESH = 6;
    //message empty what
    public static final int EMPTY_WHAT = 7;

    public static final int REQUEST_CODE_CAMERA = 9; //拍摄照片请求码
    public static final int REQUEST_CODE_PERMISSIONS = 14; //添加权限请求码

    public static final int ONLY_NETWORK = 17; //只查询网络数据
    public static final int ONLY_CACHED = 18; //只查询本地缓存
    public static final int CACHED_ELSE_NETWORK = 19; //先查询本地缓存，如果本地没有，再查询网络数据
    public static final int NETWORK_ELSE_CACHED = 20; //先查询网络数据，如果没有，再查询本地缓
    public static final int REQUEST_CODE_INSTALL = 38;
    public static final int REQUEST_CODE_MANAGE_APP_SOURCE = 39;
    public static final int TIMER_START = 40;
    public static final int REQUEST_CODE_CHANGEPHOTO = 41; //更换照片请求码
    public static final int REQUEST_CODE_CLIP_OVER = 43; //剪裁照片请求码
    public static final int QIYU_IMG = 44;
    public static final int ACTION_FROM_WEB = 45;
    public static final int SIGN_OK = 46;  // 工猫签约
    public static final int REQUEST_CODE_GONGMAO = 47;  // 工猫签约
    /**
     * 一般图片url宽高
     */
    public static final String IMG_URL_WH = "%1$s?x-oss-process=image/resize,m_lfit,w_%2$s,h_%3$s";
    /**
     * 圆形图片url宽高
     */
    public static final String CIRCLE_IMG_URL_WH = "%1$s?x-oss-process=image/resize,m_pad,w_%2$s,h_%3$s";

}
