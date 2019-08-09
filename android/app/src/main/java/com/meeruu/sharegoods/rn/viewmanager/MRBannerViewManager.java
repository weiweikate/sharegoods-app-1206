package com.meeruu.sharegoods.rn.viewmanager;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.customview.loopbanner.BannerLayout;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.ui.adapter.WebBannerAdapter;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<BannerLayout> {
    protected static final String REACT_CLASS = "MRBannerView";
    private EventDispatcher eventDispatcher;
    private onDidScrollToIndexEvent scrollToIndexEvent;
    private onDidSelectItemAtIndexEvent selectItemAtIndexEvent;
    private static boolean pageFocus;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected BannerLayout createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        BannerLayout banner = new BannerLayout(reactContext);
        initBannerEvent(reactContext, banner);
        if (ForegroundCallbacks.get() != null) {
            ForegroundCallbacks.get().addListener(new MRListener(banner));
        }
        return banner;
    }

    private void initBannerEvent(final ReactContext reactContext, final BannerLayout banner) {
        scrollToIndexEvent = new onDidScrollToIndexEvent();
        selectItemAtIndexEvent = new onDidSelectItemAtIndexEvent();
        banner.setOnPageSelected(position -> {
            if (eventDispatcher == null) {
                eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
            }
            if (scrollToIndexEvent == null) {
                scrollToIndexEvent = new onDidScrollToIndexEvent();
            }
            scrollToIndexEvent.setIndex(position);
            scrollToIndexEvent.init(banner.getId());
            try {
                eventDispatcher.dispatchEvent(scrollToIndexEvent);
            } catch (AssertionError e) {
            }
        });
    }

    static class MRListener implements ForegroundCallbacks.Listener {

        private WeakReference<BannerLayout> reference;


        MRListener(BannerLayout view) {
            reference = new WeakReference<>(view);
        }

        @Override
        public void onBecameForeground() {
            if (pageFocus) {
                BannerLayout view = reference.get();
                if (view != null && !view.isPlaying()) {
                    view.setAutoPlaying(true);
                }
            }
        }

        @Override
        public void onBecameBackground() {
            BannerLayout view = reference.get();
            if (view != null && view.isPlaying()) {
                view.setAutoPlaying(false);
            }
        }
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final BannerLayout view, ReadableArray urls) {
        LogUtils.d("======" + urls.toString());
        if (urls != null) {
            final List datas = urls.toArrayList();
            final WebBannerAdapter adapter;
            if (view.getAdapter() != null) {
                view.setAutoPlaying(false);
                view.set2First();
                adapter = (WebBannerAdapter) view.getAdapter();
                adapter.setUrlList(null);
                view.postDelayed(() -> {
                    adapter.setUrlList(datas);
                    view.setBannerSize(adapter);
                }, 500);
            } else {
                adapter = new WebBannerAdapter(view, datas);
                view.setAdapter(adapter);
            }
            if (!view.isPlaying()) {
                view.setAutoPlaying(true);
            }
            adapter.setOnBannerItemClickListener(position -> {
                view.setAutoPlaying(false);
                selectItemAtIndexEvent.init(view.getId());
                selectItemAtIndexEvent.setIndex(position);
                try {
                    eventDispatcher.dispatchEvent(selectItemAtIndexEvent);
                } catch (AssertionError e) {
                }
            });
        }
    }

    @ReactProp(name = "itemWidth")
    public void setItemWidth(BannerLayout view, Integer width) {
        if (width > 0 && BaseApplication.appContext != null) {
            if (view.getItemWidth() != width) {
                view.setItemWidth(DensityUtils.dip2px(width));
            }
        }
    }

    @ReactProp(name = "itemRadius")
    public void setItemRadius(BannerLayout view, Integer radius) {
        if (radius > 0 && view.getAdapter() != null && BaseApplication.appContext != null) {
            ((WebBannerAdapter) view.getAdapter()).setRadius(DensityUtils.dip2px(radius));
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
    public void pageFocused(BannerLayout view, boolean focuse) {
        this.pageFocus = focuse;
        if (focuse) {
            if (!view.isPlaying()) {
                view.setAutoPlaying(true);
            }
        } else {
            if (view.isPlaying()) {
                view.setAutoPlaying(false);
            }
        }
    }

    @ReactProp(name = "itemSpace")
    public void setItemSpace(BannerLayout view, Integer space) {
        if (BaseApplication.appContext != null) {
            view.setItemSpace(DensityUtils.dip2px(space));
        }
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
}
