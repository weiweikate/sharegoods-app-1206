package com.meeruu.sharegoods.rn.showground.widgets.littlevideo;

public interface IVideoSourceModel {

    /**
     * 获取视频url相关信息，用于播放该资源，使用URL播放
     * @return
     */
    String getVideoUrl();


    /**
     * 获取首帧路径
     * @return
     */
    String getCover();

}
