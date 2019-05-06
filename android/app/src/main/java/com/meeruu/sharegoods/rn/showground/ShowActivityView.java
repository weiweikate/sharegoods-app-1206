package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ShowActivityAdapter;
import com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter;
import com.meeruu.sharegoods.rn.showground.bean.ShowActivityBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onNineClickEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollStateChangedEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.util.ArrayList;
import java.util.List;

public class ShowActivityView {
    private RnRecyclerView recyclerView;
    private ShowActivityAdapter adapter;
    private EventDispatcher eventDispatcher;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;
    public ViewGroup getActivityView(ReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();

        return (ViewGroup) view;
    }

    public void initView(Context context, final View view) {
        final onNineClickEvent onNineClickEvent = new onNineClickEvent();
        final onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
        recyclerView = view.findViewById(R.id.home_recycler_view);
        startScrollEvent = new onStartScrollEvent();
        endScrollEvent = new onEndScrollEvent();
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
//                public static final int SCROLL_STATE_IDLE = 0;
//                public static final int SCROLL_STATE_DRAGGING = 1;
//                public static final int SCROLL_STATE_SETTLING = 2;
                super.onScrollStateChanged(recyclerView, newState);
                onScrollStateChangedEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putInt("state",newState);
                onScrollStateChangedEvent.setData(map);
                eventDispatcher.dispatchEvent(onScrollStateChangedEvent);

                switch (newState) {
                    case RecyclerView.SCROLL_STATE_IDLE:
                        endScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(endScrollEvent);
                        break;
                    case RecyclerView.SCROLL_STATE_DRAGGING:
                        startScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(startScrollEvent);
                        break;
                    default:
                        break;
                }
            }
        });

        adapter = new ShowActivityAdapter();
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        LinearLayoutManager layoutManager = new LinearLayoutManager(context);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        adapter.setLoadMoreView(new CustomLoadMoreView());
        recyclerView.setAdapter(adapter);
    }

    private void initData() {
        ShowActivityBean bean = new ShowActivityBean();
        List list = new ArrayList();
        bean.setUrl("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        list.add(bean);
        list.add(bean);
        list.add(bean);
        list.add(bean);
        adapter.setNewData(list);
    }

    public void addHeader(View view) {
        int i = adapter.getHeaderLayoutCount();
        if (i != 0) {
            adapter.removeAllHeaderView();
        }
        adapter.addHeaderView(view);
        recyclerView.scrollToPosition(0);
    }
}
