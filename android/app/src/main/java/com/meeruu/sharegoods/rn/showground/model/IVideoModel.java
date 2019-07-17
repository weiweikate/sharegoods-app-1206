package com.meeruu.sharegoods.rn.showground.model;

import com.meeruu.commonlib.callback.BaseCallback;

public interface IVideoModel {
    void getVideoList(String showNo,String userCode, BaseCallback callback);
}
