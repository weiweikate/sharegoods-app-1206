package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.view.LayoutInflater;
import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.waveview.WaveLoadingView;

public class ShowGroundViewManager extends SimpleViewManager<View> {
    private static final String COMPONENT_NAME = "ShowGroundView";

    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.home_page, null);
        initView(reactContext,view);
        initData();
        return view;
    }

    private void initView(Context context, View view) {
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        homePageAdapter.addData(mock.getItems());
                        homePageAdapter.notifyDataSetChanged();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                }, 2000);
            }
        });
        recyclerView = view.findViewById(R.id.home_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(context));
    }

    private void initData() {
        data.addAll(mock.getItems());
        homePageAdapter = new HomePageAdapter(data);
        recyclerView.setAdapter(homePageAdapter);
    }
}

