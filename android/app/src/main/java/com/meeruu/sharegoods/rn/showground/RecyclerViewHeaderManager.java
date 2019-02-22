package com.meeruu.sharegoods.rn.showground;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class RecyclerViewHeaderManager extends ViewGroupManager<RecyclerViewHeaderView> {
    private static final String COMPONENT = "RecyclerViewHeaderView";

    @Override
    public String getName() {
        return COMPONENT;
    }

    @Override
    protected RecyclerViewHeaderView createViewInstance(ThemedReactContext reactContext) {
        return new RecyclerViewHeaderView(reactContext);
    }
}
