package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.react.bridge.ReactContext;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.ShowCollectionView;
import com.meeruu.sharegoods.rn.showground.ShowDynamicView;

import java.util.ArrayList;
import java.util.List;

public class TabPageAdapter extends PagerAdapter {
    public static final String ARTICLE = "article";
    public static final String COLLECTION = "collection";
    public static final String COLLECTIONANDARTICLE = "collectionAndArticle";
    private ReactContext context;
    private String type;



    public TabPageAdapter(ReactContext context, String type) {
        super();
        this.context = context;
        this.type = type;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {
        if(position == 0){
            ViewGroup view = new ShowDynamicView().getShowDynamicView(context);
            container.addView(view);
            return  view;
        }
       if(position == 1){
           ViewGroup view = new ShowCollectionView().getShowCollectionView(context);
           container.addView(view);
           return  view;
       }
       return  null;
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object o) {
        return view == o;
    }

    @Override
    public int getCount() {
        int count  = 0;
        switch (type) {
            case ARTICLE:
                count = 1;
                break;
            case COLLECTION:
                count = 1;
                break;
            case COLLECTIONANDARTICLE:
                count = 2;
                break;
        }
        return count;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        String title  = "";
        switch (type) {
            case ARTICLE:
                title = "文章";
                break;
            case COLLECTION:
                title = "收藏";
                break;
            case COLLECTIONANDARTICLE:
                title = position == 0 ? "文章": "收藏";
                break;
        }
        return title;
    }
}
