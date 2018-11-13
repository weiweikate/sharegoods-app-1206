package com.meeruu.WaveView;

import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class WaveViewManager extends SimpleViewManager<WaveLoadingView> {
    private static final String COMPONENT_NAME = "MRWaveView";
    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected WaveLoadingView createViewInstance(ThemedReactContext reactContext) {
        WaveLoadingView waveLoadingView = new WaveLoadingView(reactContext);
        return waveLoadingView;
    }

    @ReactProp(name="topTitle")
    public void setTopTitle(WaveLoadingView view, String topTitle){
        view.setTopTitle(topTitle);
    }
}
