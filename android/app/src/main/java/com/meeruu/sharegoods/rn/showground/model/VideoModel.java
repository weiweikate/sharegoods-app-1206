package com.meeruu.sharegoods.rn.showground.model;

import android.text.TextUtils;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import java.util.HashMap;
import java.util.Map;

import static com.meeruu.commonlib.utils.ParameterUtils.ONLY_NETWORK;

public class VideoModel implements IVideoModel {
    @Override
    public void getVideoList(String showNo, String userCode, BaseCallback callback) {
        VideoRequestConfig videoRequestConfig = new VideoRequestConfig();
        HashMap params = new HashMap();
        params.put("currentShowNo",showNo);
        if(!TextUtils.isEmpty(userCode)){
            params.put("queryUserCode",userCode);
        }
        videoRequestConfig.setParams(params);
        RequestManager.getInstance().doGet(ONLY_NETWORK,videoRequestConfig, callback);
    }

    private static class VideoRequestConfig implements BaseRequestConfig {

        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_SHOW_VIDEO);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
    }
}
