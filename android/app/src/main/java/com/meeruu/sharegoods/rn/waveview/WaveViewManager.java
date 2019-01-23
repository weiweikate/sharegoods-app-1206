package com.meeruu.sharegoods.rn.waveview;

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

    @ReactProp(name="waveBackgroundColor")
    public void setWaveBackgroundColor(WaveLoadingView view, Integer waveBackgroundColor){
        view.setWaveBgColor(waveBackgroundColor);
    }

    @ReactProp(name="waveColor")
    public void setWaveColor(WaveLoadingView view, Integer waveColor){
        view.setWaveColor(waveColor);
    }

    @ReactProp(name="waveLightColor")
    public void setWaveLightColor(WaveLoadingView view, Integer waveLightColor){
        view.setWaveLightColor(waveLightColor);
    }


    @ReactProp(name="topTitleColor")
    public void setTopTitleColor(WaveLoadingView view, Integer topTitleColor){
        view.setTopTitleColor(topTitleColor);
    }

    @ReactProp(name="topTitleSize")
    public void setTopTitleSize(WaveLoadingView view, Integer topTitleSize){
        view.setTopTitleSize(topTitleSize);
    }

    @ReactProp(name="progressValue")
    public void setProgressValue(WaveLoadingView view, Integer progressValue){
        view.setProgressValue(progressValue);
    }


}
