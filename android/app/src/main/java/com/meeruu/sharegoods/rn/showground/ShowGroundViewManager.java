package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowGroundViewManager extends ViewGroupManager<ViewGroup> {
    private static final String COMPONENT_NAME = "ShowGroundView";
    private int page = 1;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private ShowGroundAdapter adapter;
    private ShowgroundPresenter presenter;
    private EventDispatcher eventDispatcher;
    private onItemPressEvent itemPressEvent;
    private onStartRefreshEvent startRefreshEvent;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;

//    private WeakReference<View> showgroundView;

    HashMap<ViewGroup,ShowGroundView> hashMap = new HashMap();


    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
       ShowGroundView showGroundView = new ShowGroundView();
       ViewGroup viewGroup = showGroundView.getShowGroundView(reactContext);

       hashMap.put(viewGroup,showGroundView);
       return viewGroup;

    }



    @ReactProp(name = "params")
    public void setParams(View view, ReadableMap map) {
//        if (presenter != null) {
//            HashMap map1 = map.toHashMap();
//            presenter.setParams(map1);
//        }
    }

    @Override
    public void addView(ViewGroup parent, View child, int index) {
//        super.addView(parent, child, index);
        Integer id = parent.getId();
        Log.e("id",id+"");
        if(hashMap.containsKey(id)){
            ShowGroundView showGroundView = hashMap.get(id);
            showGroundView.addHeader(child);
        }

    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "MrShowGroundOnItemPressEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "onItemPress")))
                .put("MrShowGroundOnStartRefreshEvent", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of(
                                "bubbled", "onStartRefresh")))
                .put("MrShowGroundOnStartScrollEvent", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of(
                                "bubbled", "onStartScroll")))
                .put("MrShowGroundOnEndScrollEvent", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of(
                                "bubbled", "onEndScroll")))
                .build();
    }

}


