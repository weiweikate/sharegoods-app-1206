package com.meeruu.sharegoods.rn.showground.widgets.recordview.control;

import com.aliyun.svideo.sdk.external.struct.recorder.FlashType;

public interface ControlViewListener {
    /**
     * 返回事件
     */
    void onBackClick();

    /**
     * 下一个事件
     */
    void onNextClick();

    /**
     * 摄像头转换事件
     */
    void onCameraSwitch();

    /**
     * 闪光灯模式
     * @param flashType
     */
    void onLightSwitch(FlashType flashType);

    /**
     * 开始录制视频事件
     */
    void onStartRecordClick();

    /**
     * 停止录制视频事件
     */
    void onStopRecordClick();

    /**
     * 删除点击事件
     */
    void onDeleteClick();
    /**
     * 选择视频
     */
    void selectVideo();

    /**
     * 准备录制视频事件
     *
     * @param isCancel true 取消准备，false开始准备
     */
    void onReadyRecordClick(boolean isCancel);
}
