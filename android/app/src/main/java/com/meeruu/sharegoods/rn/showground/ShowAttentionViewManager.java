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

public class ShowAttentionViewManager extends ViewGroupManager<ViewGroup> {
     private static final String COMPONENT_NAME = "ShowAttentionView";
    public static final int REPLACE_DATA = 1;
    public static final int ADD_DATA_TOP = 2;
    public static final int REPLACE_ITEM_DATA = 3;
    public static final int SCROLL_TO_TOP = 4;

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
        ShowAttentionView showRecommendView = new ShowAttentionView();
        ViewGroup viewGroup = showRecommendView.getShowAttentionView(reactContext);
        viewGroup.setTag(showRecommendView);
        return viewGroup;

    }


    @ReactProp(name = "params")
    public void setParams(View view, ReadableMap map) {
        Object object = view.getTag();
        if (object != null && object instanceof ShowAttentionView) {
            ((ShowAttentionView) object).setParams(map.toHashMap());
        }
    }

    @ReactProp(name = "type")
    public void setType(View view, String type) {
        Object object = view.getTag();
        if (object != null && object instanceof ShowAttentionView) {
            ((ShowAttentionView) object).setType(type);
        }
    }
    @ReactProp(name = "isLogin")
    public void setLogin(View view, boolean isLogin){
        ((ShowAttentionView) view.getTag()).setLogin(isLogin);
    }


    @Override
    public void addView(ViewGroup parent, final View child, int index) {
        final Object object = parent.getTag();
        if (object != null && object instanceof ShowAttentionView) {
            ((ShowAttentionView) object).addHeader(child);
        }
    }

    @javax.annotation.Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("replaceData", REPLACE_DATA, "replaceItemData", REPLACE_ITEM_DATA, "scrollToTop", SCROLL_TO_TOP);
    }

    @Override
    public void receiveCommand(@Nonnull ViewGroup root, int commandId, @javax.annotation.Nullable ReadableArray args) {
        switch (commandId) {
            case REPLACE_DATA: {
                Object object = root.getTag();
                if (object != null && object instanceof ShowAttentionView) {
                    ((ShowAttentionView) object).repelaceData(args.getInt(0), args.getInt(1));
                }
            }
            break;
            case REPLACE_ITEM_DATA: {
                Object object = root.getTag();
                if (object != null && object instanceof ShowAttentionView) {
                    ((ShowAttentionView) object).repelaceItemData(args.getInt(0), args.getString(1));
                }
            }
            break;
            case SCROLL_TO_TOP: {
                Object object = root.getTag();
                if (object != null && object instanceof ShowAttentionView) {
                    ((ShowAttentionView) object).scrollIndex(0);
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
                .put("MrDownloadPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onDownloadPress")))
                .put("MrZanPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onZanPress")))
                .put("MrSharePress", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onSharePress")))
                .put("MrScrollY", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onScrollY")))
                .put("MrPressProductEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPressProduct")))
                .put("MrCollectionEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCollection")))
                .put("MrSeeUserEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onSeeUser")))
                .build();
    }
}
