package com.meeruu.sharegoods.rn.showground;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class ShowRecommendViewManager extends ViewGroupManager<ViewGroup> {
    private static final String COMPONENT_NAME = "ShowRecommendView";
    public static final int REPLACE_DATA = 1;

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
        ShowRecommendView showRecommendView = new ShowRecommendView();
        ViewGroup viewGroup = showRecommendView.getShowRecommendView(reactContext);
        viewGroup.setTag(showRecommendView);
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
        if (object != null && object instanceof ShowRecommendView) {
            ((ShowRecommendView) object).addHeader(child);
        }
    }

    @javax.annotation.Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("replaceData", REPLACE_DATA);
    }

    @Override
    public void receiveCommand(@Nonnull ViewGroup root, int commandId, @javax.annotation.Nullable ReadableArray args) {
        switch (commandId) {
            case REPLACE_DATA: {
                Object object = root.getTag();
                if (object != null && object instanceof ShowGroundView) {
                    ((ShowGroundView) object).repelaceData(args.getInt(0), args.getInt(1));
                }
            }
            break;
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("MrShowGroundOnItemPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onItemPress")))
                .put("MrShowGroundOnStartRefreshEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onStartRefresh")))
                .put("MrShowGroundOnStartScrollEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onStartScroll")))
                .put("MrShowGroundOnEndScrollEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onEndScroll")))
                .put("MrNineClickEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onNineClick")))
                .put("MrAddCartEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onAddCartClick")))
                .put("MrShowScrollStateChangeEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onScrollStateChanged")))
                .build();
    }
}
