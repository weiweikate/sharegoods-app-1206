package com.meeruu.sharegoods.rn.viewmanager;

import android.support.annotation.Nullable;
import android.view.ViewGroup;
import android.widget.FrameLayout;

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
    public EventDispatcher eventDispatcher;
    private boolean pageFocus;
    private BannerLayout banner;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected BannerLayout createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        banner = new BannerLayout(reactContext);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        banner.setLayoutParams(params);
        banner.setShowIndicator(false);
        initBannerEvent(banner);
        initLifeEvent();
        return banner;
    }

    private void initBannerEvent(final BannerLayout banner) {
        banner.setOnPageSelected(new OnPageSelected() {
            @Override
            public void pageSelected(int position) {
                eventDispatcher.dispatchEvent(
                        new onDidScrollToIndexEvent(banner.getId(), position));
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
            WebBannerAdapter webBannerAdapter = new WebBannerAdapter(view.getContext(), datas);
            webBannerAdapter.setOnBannerItemClickListener(this);
            view.setAdapter(webBannerAdapter);
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
        view = null;
        eventDispatcher = null;
        eventDispatcher = null;
        super.onDropViewInstance(view);
    }

    @Override
    public void onItemClick(int position) {
        banner.setAutoPlaying(false);
        eventDispatcher.dispatchEvent(
                new onDidSelectItemAtIndexEvent(
                        banner.getId(), position));
    }
}
