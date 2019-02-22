package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import java.util.HashMap;
import java.util.Map;

import static com.meeruu.commonlib.utils.ParameterUtils.NETWORK_ELSE_CACHED;

public class ShowgroundModel implements IShowgroundModel {

    private final String GET = "GET";
    private final String POST = "POST";
    private String uri = "";
    private HashMap rnParams = null;
    private String requestType = GET;

    @Override
    public void fetchRecommendList(int page, int size, final BaseCallback callback) {
        ShowgroundRequestConfig showgroundRequestConfig = new ShowgroundRequestConfig();
        HashMap params = new HashMap();
        params.put("size", size + "");
        params.put("page", page + "");
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
    public void setParams(HashMap map) {
        this.rnParams = map;
    }

    private static class ShowgroundRequestConfig implements BaseRequestConfig {

        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_SHOWLIST);
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
