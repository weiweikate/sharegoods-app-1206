package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.support.design.widget.AppBarLayout;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.facebook.react.bridge.ReactContext;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;


import static com.meeruu.sharegoods.rn.showground.widgets.usercenter.TabPageAdapter.MINENORMAL;
import static com.meeruu.sharegoods.rn.showground.widgets.usercenter.TabPageAdapter.OTHERS;

public class UserCenterView {
    private ReactContext mContext;
    private ViewPager viewpager;
    private ViewGroup headerWrapper;
    private String userType;
    private int ox =( ScreenUtils.getScreenWidth()- DensityUtils.dip2px(130))/2;
    private int oy = 0;
    private int headerHeight = 0;
    private String userCode;
    public ViewGroup getUserCenterView(ReactContext reactContext) {
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        this.mContext = reactContext;
        View view = inflater.inflate(R.layout.show_user_center_view, null);
        initView(view);
        initTabBar(view);
        return (ViewGroup) view;
    }
    private void initView(View view){
        viewpager = view.findViewById(R.id.viewpager);

        headerWrapper = view.findViewById(R.id.header_wrapper);
    }

    public void setUserType(String s){
        TabPageAdapter adapter = new TabPageAdapter(mContext
                , s);
        viewpager.setAdapter(adapter);
    }


    private void initTabBar(View view){
        final TabLayout tableLayout = view.findViewById(R.id.tablayout);
        AppBarLayout appBarLayout = view.findViewById(R.id.appbarlayout);
        appBarLayout.addOnOffsetChangedListener(new AppBarLayout.OnOffsetChangedListener() {
            @Override
            public void onOffsetChanged(AppBarLayout appBarLayout, int i) {
                if(headerHeight == 0){
                    headerHeight = headerWrapper.getHeight();
                    oy = headerHeight-DensityUtils.dip2px(36);
                }
                if(headerHeight == 0){
                    return;
                }
                float p = ox/(oy*1.0f);
                tableLayout.setTranslationX(-i*p);
                if(i>(-1*oy+10)){
                    headerWrapper.setVisibility(View.VISIBLE);
                }else {
                    headerWrapper.setVisibility(View.INVISIBLE);
                }
            }
        });
        tableLayout.setupWithViewPager(viewpager);
    }
}
