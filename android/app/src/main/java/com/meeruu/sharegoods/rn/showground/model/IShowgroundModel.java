package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;

import java.util.Map;

public interface IShowgroundModel {

    void fetchRecommendList(int page, int size, BaseCallback callback);

    void setParams(Map map);
}
