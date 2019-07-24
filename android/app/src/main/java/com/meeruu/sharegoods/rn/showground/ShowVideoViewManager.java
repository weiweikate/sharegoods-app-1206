package com.meeruu.sharegoods.rn.showground;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
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
import java.util.Map;

import javax.annotation.Nonnull;

public class ShowVideoViewManager extends SimpleViewManager<View> {
    private static final String COMPONENT_NAME = "MrShowVideoListView";

    @Nonnull
    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Nonnull
    @Override
    protected View createViewInstance(@Nonnull ThemedReactContext reactContext) {
        final VideoListView videoListView = new VideoListView();
        View view = videoListView.getVideoListView(reactContext);
        view.setTag(videoListView);

        reactContext.addLifecycleEventListener(new LifecycleEventListener() {
            @Override
            public void onHostResume() {}

            @Override
            public void onHostPause() {
                videoListView.pausePlay();
            }

            @Override
            public void onHostDestroy() {
                videoListView.releasePlayer();
            }
        });
        return view;
    }

    @ReactProp(name = "params")
    public void initData(View view, ReadableMap map) {
        boolean isPersonal = false;
        boolean isCollect = false;
        HashMap data = map.toHashMap();
        if(data.containsKey("isPersonal")){
            isPersonal = (boolean) data.get("isPersonal");
            if(isPersonal){
                isCollect = (boolean) data.get("isCollect");
            }
        }
        NewestShowGroundBean.DataBean videoListBean = JSON.parseObject(JSONObject.toJSONString(data), NewestShowGroundBean.DataBean.class);
        List<NewestShowGroundBean.DataBean> list = new ArrayList<NewestShowGroundBean.DataBean>();
        list.add(videoListBean);
        ((VideoListView) view.getTag()).refreshData(list,isPersonal,isCollect);
    }

    @ReactProp(name = "isLogin")
    public void setLogin(View view, boolean isLogin){
        ((VideoListView) view.getTag()).setLogin(isLogin);
    }

    @ReactProp(name = "userCode")
    public void setLogin(View view, String userCode){
        ((VideoListView) view.getTag()).setUserCode(userCode);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("MrAttentionPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onAttentionPress")))
                .put("MrBackPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onBack")))
                .put("MrSharePress", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onSharePress")))
                .put("MrPressTagEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPressTag")))
                .put("MrBuyEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onBuy")))
                .put("MrDownloadPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onDownloadPress")))
                .put("MrZanPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onZanPress")))
                .put("MrCollectionEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCollection")))
                .put("MrSeeUserEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onSeeUser")))
                .build();
    }
}
