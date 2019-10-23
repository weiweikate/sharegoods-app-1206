package com.meeruu.commonlib.base;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.meeruu.commonlib.utils.LogUtils;

import java.util.HashMap;
import java.util.Map;

public class BaseModel {

    /**
     * 捕获错误日志上传
     *
     * @param content
     */
    public static void uploadCrach(final String content) {
        RequestManager.getInstance().doPost(new BaseRequestConfig() {
            @Override
            public String getUrl() {
                return HttpUrlUtils.getClientUrl(HttpUrlUtils.URL_CRASH_INFO);
            }

            @Override
            public Map getParams() {
                Map params = new HashMap();
                params.put("content", content);
                return params;
            }
        }, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
            }

            @Override
            public void onSuccess(String result) {
                LogUtils.d("======" + result);
            }
        });
    }
}
