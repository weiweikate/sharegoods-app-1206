package com.meeruu.commonlib.umeng;

import android.content.Context;

import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

/**
 * @author louis
 * @date on 2018/7/17
 * @describe TODO
 * @org xxd.smartstudy.com
 * @email luoyongming@innobuddy.com
 */
public class UShare {

    public static void init(Context context, String appKey) {
        // 友盟分享，未安装直接跳转到下载页
        Config.isJumptoAppStore = true;
        UMShareAPI.init(context, appKey);

        // 各个平台的配置，建议放在全局Application或者程序入口
        PlatformConfig.setWeixin("wx401bc973f010eece", "405dede82bb1c57e0b63056c8d2274c1");
        PlatformConfig.setSinaWeibo("182724926", "ac38535a71796c40d4315ab436784b3e",
                "");
        PlatformConfig.setQQZone("101512141", "8d90b79cb379cb74a9bf9bd7a13fdb91");
    }

    public static void release(Context context) {
        UMShareAPI.get(context).release();
    }
}
