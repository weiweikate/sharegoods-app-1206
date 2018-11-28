package com.meeruu.sharegoods.rn.viewmanager;

import android.view.View;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.customview.loopbanner.holder.Holder;
import com.meeruu.sharegoods.R;

public class BannerViewHolder extends Holder<String> {

    private SimpleDraweeView simpleDraweeView;

    public BannerViewHolder(View itemView) {
        super(itemView);
    }

    @Override
    protected void initView(View itemView) {
        simpleDraweeView = itemView.findViewById(R.id.iv_banner);
    }

    @Override
    public void updateUI(String data) {


    }
}
