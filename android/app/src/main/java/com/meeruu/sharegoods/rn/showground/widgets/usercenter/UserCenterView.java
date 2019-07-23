package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.support.design.widget.AppBarLayout;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.DynamicInterface;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.SetNavStatusEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;


import java.util.Map;

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
    private EventDispatcher eventDispatcher;

    public ViewGroup getUserCenterView(ReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
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

    public void setUserType(String s,final View view){
        TabPageAdapter adapter = new TabPageAdapter(mContext, s, new DynamicInterface() {
            @Override
            public void onItemPress(Object data, int position) {
                NewestShowGroundBean.DataBean item = (NewestShowGroundBean.DataBean) data;
                String json = JSONObject.toJSONString(item);
                Map map = JSONObject.parseObject(json);
                map.put("index", position);
                WritableMap realData = Arguments.makeNativeMap(map);
                if (eventDispatcher != null) {
                    onItemPressEvent itemPressEvent = new onItemPressEvent();
                    itemPressEvent.init(view.getId());
                    itemPressEvent.setData(realData);
                    eventDispatcher.dispatchEvent(itemPressEvent);
                }
            }
        });
        viewpager.setAdapter(adapter);
    }


    private void initTabBar(final View view){
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
                    changeNav(true,view);
                }else {
                    headerWrapper.setVisibility(View.INVISIBLE);
                    changeNav(false,view);
                }
            }
        });
        tableLayout.setupWithViewPager(viewpager);
    }

    private void changeNav(boolean s,View view){
        SetNavStatusEvent setNavStatusEvent = new SetNavStatusEvent();
        setNavStatusEvent.init(view.getId());
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean("show",s);
        setNavStatusEvent.setData(writableMap);
        eventDispatcher.dispatchEvent(setNavStatusEvent);
    }
}
