package com.meeruu.sharegoods.rn.scrollnumber;

import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.AnticipateInterpolator;
import android.view.animation.AnticipateOvershootInterpolator;
import android.view.animation.BounceInterpolator;
import android.view.animation.CycleInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.LinearLayout;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.commonlib.customview.loopbanner.BannerLayout;

import javax.annotation.Nonnull;

public class ScrollNumberViewManager extends SimpleViewManager<MultiScrollNumber> {
    protected static final String REACT_CLASS = "MrScrollNumberView";

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected MultiScrollNumber createViewInstance(@Nonnull ThemedReactContext reactContext) {
        MultiScrollNumber scrollNumber = new MultiScrollNumber(reactContext);
        scrollNumber.setScrollVelocity(150);
        return scrollNumber;
    }

    @ReactProp(name = "data")
    public void setNum(final MultiScrollNumber view, ReadableMap data){
        int num = data.getInt("num");
        int color = data.getInt("color");
        int size = data.getInt("fontSize");
        int[] colors = new int[]{color};
        view.setTextSize(size);
        view.setDefaultColors(colors);
        view.setNumber(num);
    }


}
