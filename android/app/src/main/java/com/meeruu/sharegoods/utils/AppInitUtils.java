package com.meeruu.sharegoods.utils;

import android.text.TextUtils;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.sharegoods.event.Event;

import org.greenrobot.eventbus.EventBus;

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
                    EventBus.getDefault().post(new Event.MRBaseUrlEvent(result));
                }
            }
        });
    }
}
