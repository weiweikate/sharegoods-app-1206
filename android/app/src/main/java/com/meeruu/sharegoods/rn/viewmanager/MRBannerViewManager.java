package com.meeruu.sharegoods.rn.viewmanager;

import android.arch.lifecycle.Lifecycle;
import android.arch.lifecycle.OnLifecycleEvent;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.view.Gravity;
import android.view.View;
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
import com.meeruu.commonlib.customview.loopbanner.ConvenientBanner;
import com.meeruu.commonlib.customview.loopbanner.holder.CBViewHolderCreator;
import com.meeruu.commonlib.customview.loopbanner.holder.Holder;
import com.meeruu.commonlib.customview.loopbanner.listener.OnItemClickListener;
import com.meeruu.commonlib.customview.loopbanner.listener.OnPageChangeListener;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<ConvenientBanner<String>> {
    protected static final String REACT_CLASS = "MRBannerView";
    public EventDispatcher eventDispatcher;
    private boolean pageFocus;
    private ConvenientBanner banner;
    private List datas;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ConvenientBanner createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        banner = new ConvenientBanner(reactContext);
        datas = new ArrayList();
        banner.setPages(new CBViewHolderCreator() {
            @Override
            public Holder createHolder(View itemView) {
                return new BannerViewHolder(itemView);
            }

            @Override
            public int getLayoutId() {
                return R.layout.layout_mr_banner;
            }
        }, datas);
        initBannerEvent(banner);
        initLifeEvent();
        return banner;
    }

    private void initBannerEvent(final ConvenientBanner banner) {
        banner.setOnPageChangeListener(new OnPageChangeListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {

            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {

            }

            @Override
            public void onPageSelected(int index) {
                eventDispatcher.dispatchEvent(
                        new onDidScrollToIndexEvent(banner.getId(), index));
            }
        });
        banner.setOnItemClickListener(new OnItemClickListener() {
            @Override
            public void onItemClick(int position) {
                banner.stopTurning();
                eventDispatcher.dispatchEvent(
                        new onDidSelectItemAtIndexEvent(
                                banner.getId(), position));
            }
        });
    }

    private void initLifeEvent() {
        ForegroundCallbacks.get().addListener(new ForegroundCallbacks.Listener() {
            @Override
            public void onBecameForeground() {
                if (pageFocus) {
                    if (banner != null && !banner.isTurning()) {
//                        banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                        banner.startTurning();
                    }
                }
            }

            @Override
            public void onBecameBackground() {
                banner.stopTurning();
            }
        });
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final ConvenientBanner view, ReadableArray urls) {
        if (urls != null) {
            if (datas.size() > 0) {
                datas.clear();
                datas.addAll(urls.toArrayList());
            } else {
                datas = urls.toArrayList();
            }
            view.notifyDataSetChanged();
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(ConvenientBanner view, Integer interval) {
        view.startTurning(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(ConvenientBanner view, Boolean autoLoop) {
        view.setCanLoop(autoLoop);
    }

    @ReactProp(name = "tittleArray")
    public void setTittleArray(ConvenientBanner view, ReadableArray titles) {
    }

    @ReactProp(name = "itemWidth")
    public void setItemWidth(ConvenientBanner view, Integer width) {
//        AutoTurnViewPager viewPager = view.getViewPager();
//        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(DensityUtils.dip2px(width), ViewGroup.LayoutParams.MATCH_PARENT);
//        params.gravity = Gravity.CENTER;
//        viewPager.setLayoutParams(params);
    }

    @ReactProp(name = "pageFocused")
    public void pageFocused(ConvenientBanner view, Boolean focuse) {
        this.pageFocus = focuse;
        if (focuse) {
            if (!view.isTurning()) {
//                banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                view.startTurning();
            }
        } else {
            view.stopTurning();
        }
    }

    @ReactProp(name = "itemSpace")
    public void setItemSpace(ConvenientBanner view, Integer space) {
//        AutoTurnViewPager viewPager = view.getViewPager();
//        ((BannerHold) viewPager.getAdapter().getHolderCreator()).setSpace(space);
    }

    @ReactProp(name = "itemRadius")
    public void setItemRadius(ConvenientBanner view, Integer radius) {
//        AutoTurnViewPager viewPager = view.getViewPager();
//        ((BannerHold) viewPager.getAdapter().getHolderCreator()).setRadius(radius);
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
    public void onDropViewInstance(ConvenientBanner view) {
        view.removeAllViews();
        view = null;
        eventDispatcher = null;
        eventDispatcher = null;
        super.onDropViewInstance(view);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void onResume() {
        if (pageFocus) {
            if (banner != null && !banner.isTurning()) {
//                banner.getViewPager().setSuperCurrentItem(banner.getViewPager().getAdapter().startAdapterPosition(0), false);
                banner.startTurning();
            }
        }
    }
}
