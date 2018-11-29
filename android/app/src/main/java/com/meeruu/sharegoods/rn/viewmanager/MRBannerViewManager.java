package com.meeruu.sharegoods.rn.viewmanager;

import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;

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
import com.meeruu.sharegoods.R;

import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<LinearLayout> {
    protected static final String REACT_CLASS = "MRBannerView";
    public EventDispatcher eventDispatcher;
    private boolean pageFocus;
    private CBViewHolderCreator holder;
    private boolean isFirstLoad = true;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected LinearLayout createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        holder = new CBViewHolderCreator() {
            @Override
            public Holder createHolder(View itemView) {
                return new BannerViewHolder(itemView);
            }

            @Override
            public int getLayoutId() {
                return R.layout.item_mr_banner;
            }
        };
        return new LinearLayout(reactContext);
    }

    private void initBannerEvent(final LinearLayout view, final ConvenientBanner banner) {
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
                        new onDidScrollToIndexEvent(view.getId(), index));
            }
        });
        banner.setOnItemClickListener(new OnItemClickListener() {
            @Override
            public void onItemClick(int position) {
                banner.stopTurning();
                eventDispatcher.dispatchEvent(
                        new onDidSelectItemAtIndexEvent(
                                view.getId(), position));
            }
        });
    }

    private void initLifeEvent(final ConvenientBanner banner) {
        if (!isFirstLoad) {
            ForegroundCallbacks.get().addListener(new ForegroundCallbacks.Listener() {
                @Override
                public void onBecameForeground() {
                    if (pageFocus) {
                        if (!banner.isTurning()) {
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
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final LinearLayout view, ReadableArray urls) {
        isFirstLoad = false;
        if (urls != null) {
            view.removeAllViewsInLayout();
            List datas = urls.toArrayList();
            View bannerView = LayoutInflater.from(view.getContext()).inflate(R.layout.layout_mr_banner, null);
            ConvenientBanner banner = bannerView.findViewById(R.id.convenientBanner);
            banner.setPages(holder, datas);
//            banner.setCurrentItem(0, true);
            initBannerEvent(view, banner);
            initLifeEvent(banner);
            view.addView(bannerView);
        }
    }

    @ReactProp(name = "pageFocused")
    public void pageFocused(LinearLayout view, Boolean focuse) {
        if (!isFirstLoad) {
            this.pageFocus = focuse;
            ConvenientBanner banner = view.findViewById(R.id.mr_banner);
            if (focuse) {
                if (!banner.isTurning()) {
                    banner.startTurning();
                }
            } else {
                banner.stopTurning();
            }
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

    @Override
    public void onDropViewInstance(LinearLayout view) {
        view.removeAllViews();
        view = null;
        isFirstLoad = true;
        eventDispatcher = null;
        eventDispatcher = null;
        super.onDropViewInstance(view);
    }
}
