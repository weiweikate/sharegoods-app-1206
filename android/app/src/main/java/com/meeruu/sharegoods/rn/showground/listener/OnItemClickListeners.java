package com.meeruu.sharegoods.rn.showground.listener;

import com.meeruu.sharegoods.rn.showground.widgets.ViewHolder;

public interface OnItemClickListeners<T> {
    void onItemClick(ViewHolder viewHolder, T data, int position);
}