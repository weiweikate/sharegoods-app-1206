package com.meeruu.sharegoods.rn.viewmanager;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.customview.wenldbanner.helper.Holder;
import com.meeruu.sharegoods.ui.customview.wenldbanner.helper.ViewHolder;

public class BannerHold implements Holder<String> {
    private int space;
    private int radius;

    @Override
    public ViewHolder createView(Context context, ViewGroup parent, int position, int viewType) {
        return ViewHolder.createViewHolder(context, parent, R.layout.layout_mr_banner, getViewType(position));
    }

    @Override
    public void UpdateUI(Context context, ViewHolder viewHolder, int position, String imgUrl) {
        SimpleDraweeView imageView = viewHolder.getView(R.id.iv_banner);
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) imageView.getLayoutParams();
        if (params.rightMargin != space) {
            params.leftMargin = space;
            params.rightMargin = space;
            imageView.setLayoutParams(params);
        }
        imageView.setTag(imgUrl);
        if (imageView.getTag() != null && imageView.getTag().equals(imgUrl)) {
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, radius);
        }
    }

    @Override
    public int getViewType(int position) {
        return 0;
    }

    public void setSpace(int space) {
        this.space = DensityUtils.dip2px(space);
    }

    public void setRadius(int radius) {
        this.radius = DensityUtils.dip2px(radius);
    }
}
