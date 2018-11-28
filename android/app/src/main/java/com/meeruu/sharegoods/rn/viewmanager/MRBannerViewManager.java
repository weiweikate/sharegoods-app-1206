package com.meeruu.sharegoods.rn.viewmanager;

import android.arch.lifecycle.Lifecycle;
import android.arch.lifecycle.OnLifecycleEvent;
import android.support.annotation.Nullable;
import android.view.Gravity;
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
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.ui.customview.wenldbanner.AutoTurnViewPager;
import com.meeruu.sharegoods.ui.customview.wenldbanner.OnPageClickListener;
import com.meeruu.sharegoods.ui.customview.wenldbanner.PageIndicatorListener;
import com.meeruu.sharegoods.ui.customview.wenldbanner.WenldBanner;

import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<WenldBanner<String>> {
    protected static final String REACT_CLASS = "MRBannerView";
    public EventDispatcher eventDispatcher;
    private PageIndicatorListener listener;
    private boolean pageFocus;
    private WenldBanner banner;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected WenldBanner createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        banner = new WenldBanner(reactContext);
        banner.getViewPager().setPages(new BannerHold());
        initBannerEvent(banner);
        initLifeEvent();
        return banner;
    }

    private void initBannerEvent(final WenldBanner banner) {
        listener = new PageIndicatorListener() {
            @Override
            public void setmDatas(List mDatas) {
            }

            @Override
            public List getmDatas() {
                return null;
            }

            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                eventDispatcher.dispatchEvent(
                        new onDidScrollToIndexEvent(banner.getId(), position));
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        };
        banner.setOnItemClickListener(new OnPageClickListener() {
            @Override
            public void onItemClick(int position) {
                banner.stopTurning();
                eventDispatcher.dispatchEvent(
                        new onDidSelectItemAtIndexEvent(
                                banner.getId(), position));
            }
        });
        banner.setPageIndicatorListener(listener);
    }

    private void initLifeEvent() {
        ForegroundCallbacks.get().addListener(new ForegroundCallbacks.Listener() {
            @Override
            public void onBecameForeground() {
                if (pageFocus) {
                    if (banner != null && !banner.isRunning()) {
                        banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                        banner.startTurn();
                    }
                }
            }

            @Override
            public void onBecameBackground() {
                banner.getViewPager().stopTurning();
            }
        });
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final WenldBanner view, ReadableArray urls) {
        if (urls != null) {
            final List datas = urls.toArrayList();
            view.setData(datas);
            view.getViewPager().setOffscreenPageLimit(datas.size() * 100);
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(WenldBanner view, Integer interval) {
        view.setAutoTurnTime(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(WenldBanner view, Boolean autoLoop) {
        view.setCanLoop(autoLoop);
    }

    @ReactProp(name = "tittleArray")
    public void setTittleArray(WenldBanner view, ReadableArray titles) {
    }

    @ReactProp(name = "itemWidth")
    public void setItemWidth(WenldBanner view, Integer width) {
        AutoTurnViewPager viewPager = view.getViewPager();
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(DensityUtils.dip2px(width), ViewGroup.LayoutParams.MATCH_PARENT);
        params.gravity = Gravity.CENTER;
        viewPager.setLayoutParams(params);
    }

    @ReactProp(name = "pageFocused")
    public void pageFocused(WenldBanner view, Boolean focuse) {
        this.pageFocus = focuse;
        if (focuse) {
            if (!view.isRunning()) {
                banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                view.startTurn();
            }
        } else {
            view.stopTurning();
        }
    }

    @ReactProp(name = "itemSpace")
    public void setItemSpace(WenldBanner view, Integer space) {
        AutoTurnViewPager viewPager = view.getViewPager();
        ((BannerHold) viewPager.getAdapter().getHolderCreator()).setSpace(space);
    }

    @ReactProp(name = "itemRadius")
    public void setItemRadius(WenldBanner view, Integer radius) {
        AutoTurnViewPager viewPager = view.getViewPager();
        ((BannerHold) viewPager.getAdapter().getHolderCreator()).setRadius(radius);
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
    public void onDropViewInstance(WenldBanner view) {
        view.getUiContact().removeListener(listener);
        view.removeAllViews();
        view = null;
        eventDispatcher = null;
        eventDispatcher = null;
        super.onDropViewInstance(view);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void onResume() {
        if (pageFocus) {
            if (banner != null && !banner.isRunning()) {
                banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                banner.startTurn();
            }
        }
    }
}
