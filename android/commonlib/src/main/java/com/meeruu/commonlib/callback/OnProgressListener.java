package com.meeruu.commonlib.callback;

/**
 * 进度条监听接口
 * Created by louis on 2017/3/6.
 */
public interface OnProgressListener {
    void onStart();

    void onProgress(int progress);

    void onFinish(String path);
}