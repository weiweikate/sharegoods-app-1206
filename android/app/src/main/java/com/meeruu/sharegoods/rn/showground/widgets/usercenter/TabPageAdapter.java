package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.view.PagerAdapter;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;
import com.meeruu.sharegoods.rn.showground.ShowCollectionView;
import com.meeruu.sharegoods.rn.showground.ShowDynamicView;
import com.meeruu.sharegoods.rn.showground.ShowOtherView;

public class TabPageAdapter extends PagerAdapter {
    public static final String OTHERS = "others";
    public static final String MINEWRITER = "mineWriter";
    public static final String MINENORMAL = "mineNormal";
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
            ViewGroup view = null;
            switch (type) {
                case MINENORMAL:
                    view = new ShowDynamicView().getShowDynamicView(context);
                    container.addView(view);
                    break;
                case OTHERS:
                    view = new ShowOtherView().getShowOtherView(context);
                    container.addView(view);
                    break;
                case MINEWRITER:
                    view = new ShowDynamicView().getShowDynamicView(context);
                    container.addView(view);
                    break;
            }

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
            case MINENORMAL:
                count = 1;
                break;
            case OTHERS:
                count = 1;
                break;
            case MINEWRITER:
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
            case MINENORMAL:
                title = "文章";
                break;
            case OTHERS:
                title = "收藏";
                break;
            case MINEWRITER:
                title = position == 0 ? "文章": "收藏";
                break;
        }
        return title;
    }
}
