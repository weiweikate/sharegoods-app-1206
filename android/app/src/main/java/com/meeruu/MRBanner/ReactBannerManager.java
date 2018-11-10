package com.meeruu.MRBanner;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.Banner.event.DidScrollToIndexEvent;
import com.meeruu.Banner.event.DidSelectItemAtIndexEvent;
import com.meeruu.MRBanner.mzbanner.MZBannerView;
import com.meeruu.MRBanner.mzbanner.holder.MZHolderCreator;
import com.meeruu.MRBanner.mzbanner.holder.MZViewHolder;
import com.meeruu.commonlib.utils.DisplayImageUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.R;

import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class ReactBannerManager extends SimpleViewManager<MZBannerView> {
    public static final String REACT_CLASS = "MRBannerView";

    public ReactContext reactContext;
    public static EventDispatcher dispatcher;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MZBannerView createViewInstance(ThemedReactContext reactContext) {
        this.reactContext = reactContext;
        dispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        MZBannerView mzBannerView = new MZBannerView(reactContext, false);
        return mzBannerView;
    }

    @ReactProp(name = "imgUrlArray")
    public void setImgUrlArray(final MZBannerView view, @Nullable ReadableArray sources) {
        if (sources != null) {
            List urls = sources.toArrayList();
            view.setPages(urls, new MZHolderCreator<BannerPaddingViewHolder>() {
                @Override
                public BannerPaddingViewHolder createViewHolder() {
                    return new BannerPaddingViewHolder();
                }
            });
            view.start();
        }
    }

    @ReactProp(name = "autoInterval")
    public void setAutoInterval(MZBannerView view, @Nullable int interval) {
        view.setDelayedTime(interval * 1000);
    }

    @ReactProp(name = "autoLoop")
    public void setAutoLoop(MZBannerView view, @Nullable boolean autoLoop) {
//        view.setCanLoop(autoLoop);
//        if(autoLoop){
//            view.start();
//        }else {
//            view.pause();
//        }
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(DidScrollToIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidScrollToIndex"), DidSelectItemAtIndexEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDidSelectItemAtIndex"));
    }


    public static class BannerPaddingViewHolder implements MZViewHolder<String> {
        private ImageView mImageView;

        @Override
        public View createView(Context context) {
            // 返回页面布局文件
            View view = LayoutInflater.from(context).inflate(R.layout.banner_item_padding, null);
            mImageView = (ImageView) view.findViewById(R.id.banner_image);
            return view;
        }

        @Override
        public void onBind(Context context, int position, String data) {
            // 数据绑定
            LogUtils.d("ssss" + data);
            if (context != null) {
                DisplayImageUtils.displayImage(context, data, mImageView);
            }
        }
    }
}
