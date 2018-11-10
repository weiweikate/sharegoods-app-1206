package com.meeruu.sharegoods.rn;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.Banner.event.DidScrollToIndexEvent;
import com.meeruu.Banner.event.DidSelectItemAtIndexEvent;
import com.meeruu.commonlib.customview.rollviewpager.RollPagerView;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.ui.MRBannerAdapter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class ReactBannerManager extends SimpleViewManager<RollPagerView> {
    public static final String REACT_CLASS = "MRBannerView";

    public ReactContext reactContext;
    public static EventDispatcher dispatcher;
    private List<String> mDatas;
    private MRBannerAdapter mAdapter;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RollPagerView createViewInstance(ThemedReactContext reactContext) {
        this.reactContext = reactContext;
        dispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        RollPagerView mzBannerView = new RollPagerView(reactContext);
        mDatas = new ArrayList<>();
        mAdapter = new MRBannerAdapter(reactContext, mzBannerView, mDatas);
        mzBannerView.setAdapter(mAdapter);
        return mzBannerView;
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final RollPagerView view, @Nullable ReadableArray sources) {
        if (sources != null) {
            List urls = sources.toArrayList();
            LogUtils.d("=======" + urls);
            if (urls != null) {
                mDatas.clear();
                mDatas.addAll(urls);
                mAdapter.notifyDataSetChanged();
            }
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(RollPagerView view, @Nullable int interval) {
        view.setPlayDelay(interval);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(RollPagerView view, @Nullable boolean autoLoop) {
//        if (autoLoop) {
//            view.resume();
//        } else {
//            view.pause();
//        }
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(DidScrollToIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidScrollToIndex"), DidSelectItemAtIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidSelectItemAtIndex"));
    }
}
