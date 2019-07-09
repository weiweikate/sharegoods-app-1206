package com.meeruu.sharegoods.rn.dottedline;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.sharegoods.rn.waveview.WaveLoadingView;

public class DottedLineManager  extends SimpleViewManager<DottedLine> {
    private static final String COMPONENT_NAME = "MRDottedLine";

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected DottedLine createViewInstance(ThemedReactContext reactContext) {
        DottedLine dottedLine = new DottedLine(reactContext);
        return dottedLine;
    }

    @ReactProp(name="color")
    public void setTopTitle(DottedLine view, int color){
        view.setColor(color);
    }

    @ReactProp(name="itemWidth")
    public void setItemWidth(DottedLine view, float i){
        view.setItemWidth(i);
    }

    @ReactProp(name="space")
    public void setSpace(DottedLine view, float i){
        view.setSpace(i);
    }

    @ReactProp(name="isRow")
    public void setIsRow(DottedLine view, boolean i){
        view.setRow(i);
    }


}
