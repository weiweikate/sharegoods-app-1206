package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;

public interface IVideoModel {
    void getVideoList(String showNo,String userCode,boolean isCollect, BaseCallback callback);
    void attentionUser(String userCode, BaseCallback callback);
    void notAttentionUser(String userCode, BaseCallback callback);
}
