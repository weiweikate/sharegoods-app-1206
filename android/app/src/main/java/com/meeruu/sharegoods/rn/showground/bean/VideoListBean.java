package com.meeruu.sharegoods.rn.showground.bean;

import com.meeruu.sharegoods.rn.showground.widgets.littlevideo.IVideoSourceModel;

public class VideoListBean implements IVideoSourceModel {
    private String cover;
    private String videoUrl;

    @Override
    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    @Override
    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

}
