package com.meeruu.sharegoods.rn.showground;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.widgets.usercenter.UserCenterView;

import java.util.Map;

import javax.annotation.Nonnull;

public class ShowDynamicViewManager extends ViewGroupManager<ViewGroup> {
    private static final String COMPONENT_NAME = "ShowDynamicView";
    public static final int REPLACE_DATA = 1;
    public static final int ADD_DATA_TOP = 2;
    public static final int REPLACE_ITEM_DATA = 3;
    public static final int SCROLL_TO_TOP = 4;
    public static final int DELETE_ITEM = 5;
    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
        UserCenterView userCenter = new UserCenterView();
        ViewGroup userCenterView = userCenter.getUserCenterView(reactContext);
        userCenterView.setTag(userCenter);
        return userCenterView;

    }


//    @ReactProp(name = "params")
//    public void setParams(View view, ReadableMap map) {
//        Object object = view.getTag();
//        if (object != null && object instanceof ShowDynamicView) {
//            ((ShowDynamicView) object).setParams(map.toHashMap());
//        }
//    }

    @ReactProp(name = "userType")
    public void setUserType(View view, String s) {
        Object object = view.getTag();
        if (object != null && object instanceof UserCenterView) {
            ((UserCenterView) object).setUserType(s,view);
        }
    }

    @Override
    public void addView(ViewGroup parent, View child, int index) {
        ViewGroup headerWrapper = parent.findViewById(R.id.header_wrapper);
        headerWrapper.removeAllViews();
        headerWrapper.addView(child);
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("replaceData", REPLACE_DATA,"addDataToTop",ADD_DATA_TOP,"replaceItemData",REPLACE_ITEM_DATA,"scrollToTop",SCROLL_TO_TOP,"deleteItem",DELETE_ITEM);
    }

    @Override
    public void receiveCommand(@Nonnull ViewGroup root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case REPLACE_DATA: {
                Object object = root.getTag();
                if (object != null && object instanceof ShowDynamicView) {
                    ((ShowDynamicView) object).repelaceData(args.getInt(0), args.getInt(1));
                }
            }
            break;
            case ADD_DATA_TOP:{
                Object object = root.getTag();
                if (object != null && object instanceof ShowDynamicView) {
                    ((ShowDynamicView) object).addDataToTop(args.getString(0));
                }
            }
            break;
            case REPLACE_ITEM_DATA:{
                Object object = root.getTag();
                if (object != null && object instanceof ShowDynamicView) {
                    ((ShowDynamicView) object).repelaceItemData(args.getInt(0), args.getString(1));
                }
            }
            break;
            case SCROLL_TO_TOP:{
                Object object = root.getTag();
                if (object != null && object instanceof ShowDynamicView) {
                    ((ShowDynamicView) object).scrollIndex(0);
                }
            }
            break;
            case DELETE_ITEM:{
                Object object = root.getTag();
                if (object != null && object instanceof ShowDynamicView) {
                    ((ShowDynamicView) object).scrollIndex(0);
                }
            }
            break;
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("MrOnPersonItemPressEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPersonItemPress")))
                .put("MrShowGroundOnStartRefreshEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onStartRefresh")))
                .put("MrShowGroundOnStartScrollEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onStartScroll")))
                .put("MrShowGroundOnEndScrollEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onEndScroll")))
                .put("MrNineClickEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onNineClick")))
                .put("MrShowScrollStateChangeEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onScrollStateChanged")))
                .put("MrScrollY", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onScrollY")))
                .put("MrNavStatusEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "changeNav")))
                .put("MrGoCollectionEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPersonCollection")))
                .put("MrGoPublishEvent", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPersonPublish")))
                .build();
    }

}
