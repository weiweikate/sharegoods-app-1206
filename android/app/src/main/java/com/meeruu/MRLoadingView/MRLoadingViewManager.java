package com.meeruu.MRLoadingView;

import android.view.View;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.meeruu.sharegoods.R;


public class MRLoadingViewManager extends SimpleViewManager<View> {
    private static final String COMPONENT_NAME = "MRLoadingView";
    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        View inflate = View.inflate(reactContext,R.layout.loading_view,null);
        return inflate;
    }
}
