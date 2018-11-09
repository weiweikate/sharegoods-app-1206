package com.meeruu.Banner;

import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.meeruu.Banner.adapter.WebBannerAdapter;

import java.util.ArrayList;
import java.util.List;

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
//        WebBannerAdapter webBannerAdapter = new WebBannerAdapter(reactContext,null);
//        bannerLayout.setAdapter(webBannerAdapter);
        this.reactContext = reactContext;
        bannerLayout.setAutoPlaying(true);
        bannerLayout.setCenterScale(1);
        return bannerLayout;
    }

//    //图片url数组
//    imgUrlArray: PropTypes.array.isRequired,
//    //选择index
//    onDidSelectItemAtIndex: PropTypes.func,
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
        WebBannerAdapter webBannerAdapter = new WebBannerAdapter(reactContext,urls);
        view.setAdapter(webBannerAdapter);

    }

//    @ReactProp(name = "height", defaultFloat = 0f)
//    public void setBorderRadius(BannerLayout view, float height) {
//        view.setBorderRadius(borderRadius);
//    }
}
