package com.meeruu.Banner;

import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.Banner.adapter.WebBannerAdapter;
import com.meeruu.Banner.event.DidScrollToIndexEvent;
import com.meeruu.Banner.event.DidSelectItemAtIndexEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class ReactBannerManager extends SimpleViewManager<BannerLayout> {
    public static final String REACT_CLASS = "MRBannerView";
    public ReactContext reactContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected BannerLayout createViewInstance(ThemedReactContext reactContext) {
        BannerLayout bannerLayout = new BannerLayout(reactContext);
        this.reactContext = reactContext;
        bannerLayout.setAutoPlaying(true);
        bannerLayout.setCenterScale(1);
        bannerLayout.setShowIndicator(false);
        return bannerLayout;
    }

//    //图片url数组
//    imgUrlArray: PropTypes.array.isRequired,
//    //选择index
//    onDidSelectItemAtIndex: PropTypes.func,({index})
//    //滚动到index
//    onDidScrollToIndex: PropTypes.func,
//
//    //滚动间隔 设置0为不滚动  默认3
//    autoInterval: PropTypes.number,
//    //是否轮播 默认true
//    autoLoop: PropTypes.bool

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(BannerLayout view, @Nullable ReadableArray sources) {
        List urls = sources.toArrayList();
        WebBannerAdapter adapter = (WebBannerAdapter) view.getAdapter();
        adapter.setUrls(urls);
        adapter.notifyDataSetChanged();
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(BannerLayout view, @Nullable int interval) {
        view.setAutoPlayDuration(interval);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(BannerLayout view, @Nullable boolean autoLoop) {
        view.setAutoPlaying(autoLoop);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                DidScrollToIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidScrollToIndex"),
                DidSelectItemAtIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidSelectItemAtIndex"));
    }


}
