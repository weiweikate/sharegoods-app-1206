package com.meeruu.sharegoods.rn.viewmanager;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.customview.loopbanner.BannerLayout;
import com.meeruu.commonlib.customview.loopbanner.OnPageSelected;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.ui.adapter.WebBannerAdapter;

import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<BannerLayout> implements BannerLayout.OnBannerItemClickListener {
    protected static final String REACT_CLASS = "MRBannerView";
    private EventDispatcher eventDispatcher;
    private onDidScrollToIndexEvent scrollToIndexEvent;
    private onDidSelectItemAtIndexEvent selectItemAtIndexEvent;
    private boolean pageFocus;
    private BannerLayout banner;
    private WebBannerAdapter webBannerAdapter;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected BannerLayout createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        banner = new BannerLayout(reactContext);
        banner.setShowIndicator(false);
        initBannerEvent(banner);
        initLifeEvent();
        return banner;
    }

    private void initBannerEvent(final BannerLayout banner) {
        scrollToIndexEvent = new onDidScrollToIndexEvent();
        selectItemAtIndexEvent = new onDidSelectItemAtIndexEvent();
        banner.setOnPageSelected(new OnPageSelected() {
            @Override
            public void pageSelected(int position) {
                if (eventDispatcher != null) {
                    scrollToIndexEvent.init(banner.getId());
                    scrollToIndexEvent.setIndex(position);
                    eventDispatcher.dispatchEvent(scrollToIndexEvent);
                }
            }
        });
    }

    private void initLifeEvent() {
        ForegroundCallbacks.get().addListener(new ForegroundCallbacks.Listener() {
            @Override
            public void onBecameForeground() {
                if (pageFocus) {
                    if (banner != null && !banner.isPlaying()) {
                        banner.setAutoPlaying(true);
                    }
                }
            }

            @Override
            public void onBecameBackground() {
                banner.setAutoPlaying(false);
            }
        });
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final BannerLayout view, ReadableArray urls) {
        if (urls != null) {
            final List datas = urls.toArrayList();
            webBannerAdapter = new WebBannerAdapter(view.getContext(), datas);
            webBannerAdapter.setOnBannerItemClickListener(this);
            view.setAdapter(webBannerAdapter);
        }
    }

    @ReactProp(name = "itemWidth")
    public void setItemWidth(BannerLayout view, Integer width) {
        if (webBannerAdapter != null) {
            webBannerAdapter.setItemWidth(DensityUtils.dip2px(width));
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(BannerLayout view, Integer interval) {
        view.setAutoPlayDuration(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(BannerLayout view, Boolean autoLoop) {
        view.setAutoPlaying(autoLoop);
    }

    @ReactProp(name = "tittleArray")
    public void setTittleArray(BannerLayout view, ReadableArray titles) {
    }

    @ReactProp(name = "interceptTouchEvent")
    public void setInterceptTouchEvent(BannerLayout view, boolean intercept) {
        view.setIntercept(intercept);
    }

    @ReactProp(name = "pageFocused")
    public void pageFocused(BannerLayout view, Boolean focuse) {
        this.pageFocus = focuse;
        if (focuse) {
            if (!view.isPlaying()) {
                view.setAutoPlaying(true);
            }
        } else {
            view.setAutoPlaying(false);
        }
    }

    @ReactProp(name = "itemSpace")
    public void setItemSpace(BannerLayout view, Integer space) {
        view.setItemSpace(DensityUtils.dip2px(space));
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "MrOnDidScrollToIndexEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "onDidScrollToIndex")))
                .put(
                        "MrOnDidSelectItemAtIndexEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "onDidSelectItemAtIndex")))

                .build();
    }

    @Override
    public void onDropViewInstance(BannerLayout view) {
        view.removeAllViews();
        if (eventDispatcher != null) {
            eventDispatcher.onCatalystInstanceDestroyed();
            eventDispatcher = null;
        }
        scrollToIndexEvent = null;
        selectItemAtIndexEvent = null;
        super.onDropViewInstance(view);
    }

    @Override
    public void onItemClick(int position) {
        banner.setAutoPlaying(false);
        selectItemAtIndexEvent.init(banner.getId());
        selectItemAtIndexEvent.setIndex(position);
        eventDispatcher.dispatchEvent(selectItemAtIndexEvent);
    }
}
