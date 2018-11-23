package com.meeruu.sharegoods.rn.viewmanager;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.commonlib.customview.wenldbanner.AutoTurnViewPager;

public class MRBannerViewManager extends SimpleViewManager<AutoTurnViewPager> {
    protected static final String REACT_CLASS = "MRBannerView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected AutoTurnViewPager createViewInstance(final ThemedReactContext reactContext) {
        return new AutoTurnViewPager(reactContext);
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(AutoTurnViewPager view, ReadableArray urls) {

    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(AutoTurnViewPager view, Integer interval) {
        view.setScrollDuration(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(AutoTurnViewPager view, Boolean autoLoop) {
        view.setCanTurn(true);
    }

    @ReactProp(name = "tittleArray")
    public void setTittleArray(AutoTurnViewPager view, ReadableArray titles) {
    }

    @ReactProp(name = "itemWidth")
    public void setItemWidth(AutoTurnViewPager view, Integer width) {

    }

    @ReactProp(name = "itemSpace")
    public void setItemSpace(AutoTurnViewPager view, Integer space) {

    }

    @ReactProp(name = "itemRadius")
    public void setItemRadius(AutoTurnViewPager view, Integer radius) {

    }
}
