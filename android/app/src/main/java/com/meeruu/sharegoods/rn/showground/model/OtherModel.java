package com.meeruu.sharegoods.rn.showground.model;

import android.text.TextUtils;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.HttpUrlUtils;

import java.util.HashMap;
import java.util.Map;

import static com.meeruu.commonlib.utils.ParameterUtils.NETWORK_ELSE_CACHED;

public class OtherModel  implements IShowgroundModel{
    private final String GET = "GET";
    private final String POST = "POST";
    private String uri = "";
    private Map rnParams = new HashMap();
    private String requestType = GET;
    private String userCode;

    public OtherModel(String userCode){
        this.userCode = userCode;
    }

    @Override
    public void fetchRecommendList(int page, int size, BaseCallback callback) {

    }

    @Override
    public void fetchRecommendList(String cursor, int size, final BaseCallback callback) {
        OthersRequestConfig showgroundRequestConfig = new OthersRequestConfig();
        HashMap params = new HashMap();
        params.put("size", size + "");
        params.put("userCode",userCode);
        if(!TextUtils.isEmpty(cursor)){
            params.put("cursor",cursor);
        }
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
    public void unCollection(String showNo, BaseCallback callback) {
    }

    private static class OthersRequestConfig implements BaseRequestConfig {

        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_OTHER_ARTICLE);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
    }



    @Override
    public void deleteDynamic(String showNo, BaseCallback callback) {

    }
}
