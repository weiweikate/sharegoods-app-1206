package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.meeruu.commonlib.utils.ParameterUtils.NETWORK_ELSE_CACHED;

public class ShowgroundModel implements IShowgroundModel{
    private List data = new ArrayList();

    @Override
    public void fetchRecommendList(int page, int size, final BaseCallback callback ) {
        ShowgroundRequestConfig showgroundRequestConfig = new ShowgroundRequestConfig();
        HashMap params = new HashMap();
        params.put("size",size);
        params.put("page",page);
        showgroundRequestConfig.setParams(params);
        RequestManager.getInstance().doGet(NETWORK_ELSE_CACHED, showgroundRequestConfig, callback);
    }

    private static class ShowgroundRequestConfig implements BaseRequestConfig{

        private HashMap map;
        @Override
        public String getUrl() {
            return "https://api.sharegoodsmall.com/gateway/discover/query";
        }

        public void setParams(HashMap params){
            map = params;
        }

        @Override
        public Map getParams() {
           return map;
        }
    }
}
