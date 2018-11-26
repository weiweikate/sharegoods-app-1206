package com.meeruu.sharegoods.rn.viewmanager;

import android.content.Context;
import android.view.ViewGroup;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.customview.wenldbanner.helper.Holder;
import com.meeruu.sharegoods.ui.customview.wenldbanner.helper.ViewHolder;

public class BannerHold implements Holder {
    @Override
    public ViewHolder createView(Context context, ViewGroup parent, int position, int viewType) {
        return ViewHolder.createViewHolder(context, parent, R.layout.layout_mr_banner, getViewType(position));
    }

    @Override
    public void UpdateUI(Context context, ViewHolder viewHolder, int position, Object data) {

    }

    @Override
    public int getViewType(int position) {
        return 0;
    }
}
