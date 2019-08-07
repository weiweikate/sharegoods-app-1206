package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import java.util.HashMap;
import java.util.Map;

import static com.meeruu.commonlib.utils.ParameterUtils.NETWORK_ELSE_CACHED;

public class DynamicModel implements IShowgroundModel  {
    private final String GET = "GET";
    private final String POST = "POST";
    private String uri = "";
    private Map rnParams = new HashMap();
    private String requestType = GET;

    @Override
    public void fetchRecommendList(int page, int size, final BaseCallback callback) {
        DynamicModel.ShowgroundRequestConfig showgroundRequestConfig = new DynamicModel.ShowgroundRequestConfig();
        HashMap params = new HashMap();
        params.put("size", size + "");
        params.put("page", page + "");
        params.putAll(this.rnParams);
        showgroundRequestConfig.setParams(params);
        switch (this.requestType){
            case GET:{
                RequestManager.getInstance().doGet(NETWORK_ELSE_CACHED, showgroundRequestConfig, callback);
            }
            break;
            case POST:{
                RequestManager.getInstance().doPost(showgroundRequestConfig, callback);
            }
            break;
            default:return;
        }
    }
    @Override
    public void setParams(Map map) {
        this.rnParams = map;
    }

    @Override
    public void deleteDynamic(String showNo, BaseCallback callback) {
        DeleteRequestConfig deleteRequestConfig = new DeleteRequestConfig();
        deleteRequestConfig.setParams(showNo);
        RequestManager.getInstance().doPost(deleteRequestConfig,callback);
    }

    private static class ShowgroundRequestConfig implements BaseRequestConfig {

        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_DYNAMIC);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
    }

    private static class DeleteRequestConfig implements BaseRequestConfig {

        private String showNo;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_DELETE_DYNAMIC);
        }

        public void setParams(String params) {
            showNo = params;
        }

        @Override
        public Map getParams() {
            HashMap map = new HashMap();
            map.put("showNo",showNo);
            return map;
        }
    }

    @Override
    public void unCollection(String showNo, BaseCallback callback) {

    }
}
