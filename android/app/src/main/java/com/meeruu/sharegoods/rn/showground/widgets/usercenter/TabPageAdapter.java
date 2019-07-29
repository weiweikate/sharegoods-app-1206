package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.view.PagerAdapter;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;
import com.meeruu.sharegoods.rn.showground.DynamicInterface;
import com.meeruu.sharegoods.rn.showground.ShowCollectionView;
import com.meeruu.sharegoods.rn.showground.ShowDynamicView;
import com.meeruu.sharegoods.rn.showground.ShowOtherView;

public class TabPageAdapter extends PagerAdapter {
    public static final String OTHERS = "others";
    public static final String MINEWRITER = "mineWriter";
    public static final String MINENORMAL = "mineNormal";
    private ReactContext context;
    private String type;
    private DynamicInterface dynamicInterface;


    public TabPageAdapter(ReactContext context, String type,DynamicInterface dynamicInterface) {
        super();
        this.context = context;
        this.type = type;
        this.dynamicInterface = dynamicInterface;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {
        if (position == 0) {
            ViewGroup view = null;
            switch (type) {
                case MINENORMAL:
                    view = new ShowCollectionView().getShowCollectionView(context,dynamicInterface);
                    container.addView(view);
                    break;
                case MINEWRITER:
                    view = new ShowDynamicView().getShowDynamicView(context,dynamicInterface);
                    container.addView(view);
                    break;
                default:
                    String userCode = type.replace("others", "");
                    view = new ShowOtherView().getShowOtherView(context, userCode,dynamicInterface);
                    container.addView(view);
                    break;
            }

            return view;
        }
        if (position == 1) {
            ViewGroup view = new ShowCollectionView().getShowCollectionView(context,dynamicInterface);
            container.addView(view);
            return view;
        }
        return null;
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object o) {
        return view == o;
    }

    @Override
    public int getCount() {
        int count = 0;
        switch (type) {
            case MINENORMAL:
                count = 1;
                break;
            case MINEWRITER:
                count = 2;
                break;
            default:
                count = 1;
                break;
        }
        return count;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        String title = "";
        switch (type) {
            case MINENORMAL:
                title = "收藏";
                break;
            case MINEWRITER:
                title = position == 0 ? "文章" : "收藏";
                break;
            default:
                title = "文章";
                break;
        }
        return title;
    }
}
