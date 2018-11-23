package com.meeruu.commonlib.customview.wenldbanner.helper;

import android.content.Context;
import android.view.ViewGroup;


public interface Holder<T> {
    ViewHolder createView(Context context,
                          ViewGroup parent, int position, int viewType);

    void UpdateUI(Context context, ViewHolder viewHolder, int position, T data);

    int getViewType(int position);
}