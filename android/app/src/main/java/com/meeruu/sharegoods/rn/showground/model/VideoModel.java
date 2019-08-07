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
    public void getVideoList(String showNo, String userCode,boolean isCollect,String tabType, BaseCallback callback) {
        VideoRequestConfig videoRequestConfig = new VideoRequestConfig();
        HashMap params = new HashMap();
        params.put("currentShowNo",showNo);
        if(!TextUtils.isEmpty(userCode)){
            params.put("queryUserCode",userCode);
            params.put("isCollect",(isCollect?1:0)+"");
        }
        if(!TextUtils.equals(tabType,"0")){
            params.put("spreadPosition",tabType+"");
        }
        videoRequestConfig.setParams(params);
        RequestManager.getInstance().doGet(ONLY_NETWORK,videoRequestConfig, callback);
    }

    @Override
    public void attentionUser(String userCode, BaseCallback callback) {
        AttentionRequestConfig attentionRequestConfig = new AttentionRequestConfig();
        HashMap hashMap = new HashMap();
        hashMap.put("userNo",userCode);
        attentionRequestConfig.setParams(hashMap);
        RequestManager.getInstance().doPost(attentionRequestConfig,callback);
    }

    @Override
    public void notAttentionUser(String userCode, BaseCallback callback) {
        NoAttentionRequestConfig noAttentionRequestConfig = new NoAttentionRequestConfig();
        HashMap hashMap = new HashMap();
        hashMap.put("userNo",userCode);
        noAttentionRequestConfig.setParams(hashMap);
        RequestManager.getInstance().doPost(noAttentionRequestConfig,callback);
    }

    private static class AttentionRequestConfig implements BaseRequestConfig {
        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_ATTENTION);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
    }

    private static class NoAttentionRequestConfig implements BaseRequestConfig {
        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_ATTENTION_NO);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
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
