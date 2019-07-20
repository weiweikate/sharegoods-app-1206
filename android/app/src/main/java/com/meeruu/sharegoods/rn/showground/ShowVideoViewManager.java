package com.meeruu.sharegoods.rn.showground;

import android.view.View;

import com.alibaba.fastjson.JSON;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.sharegoods.rn.showground.adapter.LittleVideoListAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoListBean;
import com.meeruu.sharegoods.rn.showground.widgets.littlevideo.VideoListView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nonnull;

public class ShowVideoViewManager extends SimpleViewManager<VideoListView> {
    private static final String COMPONENT_NAME = "MrShowVideoListView";

    @Nonnull
    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Nonnull
    @Override
    protected VideoListView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        final VideoListView videoListView = new VideoListView(reactContext);
        LittleVideoListAdapter mVideoAdapter = new LittleVideoListAdapter(reactContext);
        videoListView.setAdapter(mVideoAdapter);

        reactContext.addLifecycleEventListener(new LifecycleEventListener() {
            @Override
            public void onHostResume() {
//                videoListView.resumePlay();
            }

            @Override
            public void onHostPause() {
                videoListView.pausePlay();
            }

            @Override
            public void onHostDestroy() {
                videoListView.releasePlayer();
            }
        });
        return videoListView;
    }

    @ReactProp(name = "params")
    public void initData(View view, String map) {
        NewestShowGroundBean.DataBean videoListBean = JSON.parseObject(map, NewestShowGroundBean.DataBean.class);
        List<NewestShowGroundBean.DataBean> list = new ArrayList<NewestShowGroundBean.DataBean>();
        list.add(videoListBean);
        ((VideoListView) view).refreshData(list);
    }
}
