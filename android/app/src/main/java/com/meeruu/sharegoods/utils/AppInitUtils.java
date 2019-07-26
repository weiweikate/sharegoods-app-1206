package com.meeruu.sharegoods.utils;

import android.text.TextUtils;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;

import java.util.Map;

public class AppInitUtils {

    public static void getAndSaveHost() {
        RequestManager.getInstance().doGet(ParameterUtils.NETWORK_ELSE_CACHED, new BaseRequestConfig() {
            @Override
            public String getUrl() {
                return HttpUrlUtils.getUrl(HttpUrlUtils.URL_BASE_URL);
            }

            @Override
            public Map getParams() {
                return null;
            }
        }, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
            }

            @Override
            public void onSuccess(String result) {
                if (!TextUtils.isEmpty(result)) {
                    SPCacheUtils.put("D_baseUrl", result);
                } else {
                    SPCacheUtils.remove("D_baseUrl");
                }
            }
        });
    }
}
