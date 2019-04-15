package com.meeruu.sharegoods.rn.showground;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class ShowGroundViewManager extends ViewGroupManager<ViewGroup> {
    private static final String COMPONENT_NAME = "ShowGroundView";

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
        ShowGroundView showGroundView = new ShowGroundView();
        ViewGroup viewGroup = showGroundView.getShowGroundView(reactContext);
        viewGroup.setTag(showGroundView);
        return viewGroup;

    }


    @ReactProp(name = "params")
    public void setParams(View view, ReadableMap map) {
        Object object = view.getTag();
        if (object != null && object instanceof ShowGroundView) {
            ((ShowGroundView) object).setParams(map.toHashMap());
        }
    }

    @Override
    public void addView(ViewGroup parent, View child, int index) {
        Object object = parent.getTag();
        if (object != null && object instanceof ShowGroundView) {
            ((ShowGroundView) object).addHeader(child);
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


