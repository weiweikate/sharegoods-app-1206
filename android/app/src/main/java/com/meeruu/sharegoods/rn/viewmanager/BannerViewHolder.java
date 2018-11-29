package com.meeruu.sharegoods.rn.viewmanager;

import android.view.View;
import android.widget.LinearLayout;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.customview.loopbanner.holder.Holder;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.R;

public class BannerViewHolder extends Holder<String> {

    private int space;
    private int radius;

    private SimpleDraweeView simpleDraweeView;

    public BannerViewHolder(View itemView) {
        super(itemView);
    }

    @Override
    protected void initView(View itemView) {
        simpleDraweeView = itemView.findViewById(R.id.iv_banner);
    }

    @Override
    public void updateUI(String imgUrl) {
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) simpleDraweeView.getLayoutParams();
        if (params.rightMargin != space) {
            params.leftMargin = space;
            params.rightMargin = space;
            simpleDraweeView.setLayoutParams(params);
        }
        ImageLoadUtils.loadRoundNetImage(imgUrl, simpleDraweeView, radius);
    }

    public void setSpace(int space) {
        this.space = DensityUtils.dip2px(space);
    }

    public void setRadius(int radius) {
        this.radius = DensityUtils.dip2px(radius);
    }
}
