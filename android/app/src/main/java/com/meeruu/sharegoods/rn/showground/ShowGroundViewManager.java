package com.meeruu.sharegoods.rn.showground;

import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.meeruu.sharegoods.rn.waveview.WaveLoadingView;

public class ShowGroundViewManager extends SimpleViewManager<View> {
    private static final String COMPONENT_NAME = "ShowGroundView";

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        return null;
    }
}

