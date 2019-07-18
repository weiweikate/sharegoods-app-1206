package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.content.Context;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.meeruu.sharegoods.R;

import java.util.Arrays;

import static com.meeruu.sharegoods.rn.showground.widgets.usercenter.TabPageAdapter.ARTICLE;
import static com.meeruu.sharegoods.rn.showground.widgets.usercenter.TabPageAdapter.COLLECTIONANDARTICLE;

public class UserCenterView {
    private Context mContext;
    private ViewPager viewpager;

    public ViewGroup getUserCenterView(ReactContext reactContext) {
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.show_user_center_view, null);
        initView(reactContext, view);

        return (ViewGroup) view;
    }
    private void initView(Context context,View view){
        viewpager = view.findViewById(R.id.viewpager);
        TabPageAdapter adapter = new TabPageAdapter(mContext
                , COLLECTIONANDARTICLE);
        viewpager.setAdapter(adapter);
        viewpager.setCurrentItem(0);
    }
}
