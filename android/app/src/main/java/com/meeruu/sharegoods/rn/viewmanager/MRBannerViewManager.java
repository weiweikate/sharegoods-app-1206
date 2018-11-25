package com.meeruu.sharegoods.rn.viewmanager;

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
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.ui.customview.wenldbanner.AutoTurnViewPager;
import com.meeruu.sharegoods.ui.customview.wenldbanner.OnPageClickListener;
import com.meeruu.sharegoods.ui.customview.wenldbanner.PageIndicatorListener;
import com.meeruu.sharegoods.ui.customview.wenldbanner.WenldBanner;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<WenldBanner<String>> {
    protected static final String REACT_CLASS = "MRBannerView";
    public EventDispatcher eventDispatcher;
    private PageIndicatorListener listener;
    private ArrayList urls;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected WenldBanner createViewInstance(final ThemedReactContext reactContext) {
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        WenldBanner banner = new WenldBanner(reactContext);
        urls = new ArrayList<>();
        urls.clear();
        banner.setPages(new BannerHold(), urls);
        initBannerEvent(banner);
        return banner;
    }

    private void initBannerEvent(final WenldBanner banner) {
        listener = new PageIndicatorListener() {
            @Override
            public void setmDatas(List mDatas) {
            }

            @Override
            public List getmDatas() {
                return urls;
            }

            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                int realPos = position == 0 ? 0 : position % (urls.size() / 2);
                eventDispatcher.dispatchEvent(
                        new onDidScrollToIndexEvent(banner.getId(), realPos));
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        };
        banner.setOnItemClickListener(new OnPageClickListener() {
            @Override
            public void onItemClick(int position) {
                int realPos = position == 0 ? 0 : position % (urls.size() / 2);
                eventDispatcher.dispatchEvent(
                        new onDidSelectItemAtIndexEvent(
                                banner.getId(), realPos));
            }
        });
        banner.setPageIndicatorListener(listener);
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(WenldBanner view, ReadableArray urls) {
        if (this.urls != null) {
            this.urls.clear();
            this.urls.addAll(urls.toArrayList());
        } else {
            this.urls = urls.toArrayList();
        }
        view.setData(this.urls);
        view.getViewPager().setOffscreenPageLimit(this.urls.size() * 300);
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(WenldBanner view, Integer interval) {
        AutoTurnViewPager viewPager = view.getViewPager();
        viewPager.setAutoTurnTime(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(WenldBanner view, Boolean autoLoop) {
        AutoTurnViewPager viewPager = view.getViewPager();
        viewPager.setCanLoop(autoLoop);
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
        super.onDropViewInstance(view);
    }
}
