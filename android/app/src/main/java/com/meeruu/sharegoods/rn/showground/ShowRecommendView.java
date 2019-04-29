package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ShowRecommendView {
    private RnRecyclerView recyclerView;
    private ShowRecommendAdapter adapter;
    public ViewGroup getShowRecommendView(ReactContext reactContext){
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();

        return (ViewGroup) view;
    }
    public void initView(Context context,View view){

        recyclerView = view.findViewById(R.id.home_recycler_view);

        adapter = new ShowRecommendAdapter();
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        LinearLayoutManager layoutManager = new LinearLayoutManager(context);
        recyclerView.setLayoutManager(layoutManager);

        adapter.setEnableLoadMore(true);

        adapter.setLoadMoreView(new CustomLoadMoreView());

        recyclerView.setAdapter(adapter);

    }

    private void initData(){
        ShowRecommendBean bean = new ShowRecommendBean();
        List list = new ArrayList();
        list.add(bean);
        List<String> urls = new ArrayList<>();
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        urls.add("https://k.zol-img.com.cn/sjbbs/7692/a7691501_s.jpg");
        bean.setImageUrls(urls);
        list.add(bean);
        adapter.setNewData(list);
    }
}
