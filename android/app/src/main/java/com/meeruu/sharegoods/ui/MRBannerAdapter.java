package com.meeruu.sharegoods.ui;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.meeruu.commonlib.customview.rollviewpager.RollPagerView;
import com.meeruu.commonlib.ui.LoopPagerAdapter;
import com.meeruu.commonlib.utils.DisplayImageUtils;
import com.meeruu.commonlib.utils.LogUtils;

import java.util.List;

/**
 * Created by louis on 17/5/16.
 */

public class MRBannerAdapter extends LoopPagerAdapter {
    private List<String> mDatas;
    private Context mContext;

    public MRBannerAdapter(Context context, RollPagerView viewPager, List<String> mDatas) {
        super(viewPager);
        this.mContext = context;
        this.mDatas = mDatas;
        context = null;
        mDatas = null;
    }

    @Override
    public View getView(final ViewGroup container, final int position) {
        final String url = mDatas.get(position);
        LogUtils.d("url====" + url);
        LinearLayout llyt_view = new LinearLayout(container.getContext());
        llyt_view.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        ImageView view = new ImageView(container.getContext());
        llyt_view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 图片点击
            }
        });
        view.setScaleType(ImageView.ScaleType.CENTER_CROP);
        view.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        DisplayImageUtils.displayImage(mContext, url, view);
        ViewGroup parent = (ViewGroup) view.getParent();
        if (parent != null) {
            parent.removeView(view);
        }
        llyt_view.addView(view);
        view = null;
        return llyt_view;
    }

    @Override
    public int getRealCount() {
        return mDatas != null && mDatas.size() > 0 ? mDatas.size() : 0;
    }
}
