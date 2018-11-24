package com.meeruu.sharegoods.rn.viewmanager;

import android.support.annotation.Nullable;
import android.support.v4.view.ViewPager;
import android.view.Gravity;
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
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.customview.wenldbanner.AutoTurnViewPager;
import com.meeruu.sharegoods.ui.customview.wenldbanner.OnPageClickListener;

import java.util.Map;

@ReactModule(name = MRBannerViewManager.REACT_CLASS)
public class MRBannerViewManager extends SimpleViewManager<AutoTurnViewPager> {
    protected static final String REACT_CLASS = "MRBannerView";
    private BannerHold hold;
    private EventDispatcher eventDispatcher;


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected AutoTurnViewPager createViewInstance(final ThemedReactContext reactContext) {
        hold = new BannerHold();
        eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
//        FrameLayout frameLayout = new FrameLayout(reactContext);
//        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
//        frameLayout.setLayoutParams(params);
//        frameLayout.setClipChildren(false);
        final AutoTurnViewPager viewPager = new AutoTurnViewPager(reactContext);
        FrameLayout.LayoutParams pagerParams = new FrameLayout.LayoutParams(DensityUtils.dip2px(300), DensityUtils.dip2px(175));
        viewPager.setClipToPadding(false);
        viewPager.setClipChildren(false);
        viewPager.setLayoutParams(pagerParams);
        pagerParams.gravity = Gravity.CENTER;
        viewPager.setId(R.id.banner_tag);
        viewPager.setPages(hold);
        viewPager.setCanTurn(true);
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                LogUtils.d("onPageSelected======" + viewPager.getRealItem(position));
                eventDispatcher.dispatchEvent(
                        new onDidScrollToIndexEvent(viewPager.getId(), viewPager.getRealItem(position)));
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
        viewPager.getAdapter().setOnItemClickListener(new OnPageClickListener() {
            @Override
            public void onItemClick(int position) {
                LogUtils.d("click======" + viewPager.getRealItem(position));
                eventDispatcher.dispatchEvent(
                        new onDidSelectItemAtIndexEvent(
                                viewPager.getId(), viewPager.getRealItem(position)));
            }
        });
//        frameLayout.addView(viewPager);
        return viewPager;
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(AutoTurnViewPager view, ReadableArray urls) {
//        AutoTurnViewPager viewPager = view.findViewById(R.id.banner_tag);
        if (view != null) {
            int position = view.getCurrentItem();
            view.setmDatas(urls.toArrayList());
            view.getAdapter().notifyDataSetChanged(true);
            view.setCurrentItem(position, false);
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(AutoTurnViewPager view, Integer interval) {
//        AutoTurnViewPager viewPager = view.findViewById(R.id.banner_tag);
        view.setAutoTurnTime(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(AutoTurnViewPager view, Boolean autoLoop) {
//        AutoTurnViewPager viewPager = view.findViewById(R.id.banner_tag);
        view.setCanLoop(autoLoop);
    }

    @ReactProp(name = "tittleArray")
    public void setTittleArray(AutoTurnViewPager view, ReadableArray titles) {
    }

//    @ReactProp(name = "itemWidth")
//    public void setItemWidth(FrameLayout view, Integer width) {
//        LogUtils.d("width===========" + width);
//
//        hold.setItemW(width);
//    }
//
//    @ReactProp(name = "itemSpace")
//    public void setItemSpace(FrameLayout view, Integer space) {
//        LogUtils.d("space===========" + space);
//
//        hold.setSpace(space);
//    }
//
//    @ReactProp(name = "itemRadius")
//    public void setItemRadius(FrameLayout view, Integer radius) {
//        LogUtils.d("radius===========" + radius);
//        LogUtils.d("radius===========" + hold);
//        hold.setRadius(radius);
//    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "MrOnDidScrollToIndexEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "OnDidScrollToIndex")))
                .put(
                        "MrOnDidSelectItemAtIndexEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "onDidSelectItemAtIndex")))

                .build();
    }
}
