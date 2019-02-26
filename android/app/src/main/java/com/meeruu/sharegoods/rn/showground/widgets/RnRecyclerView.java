package com.meeruu.sharegoods.rn.showground.widgets;

import android.annotation.SuppressLint;
import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.util.AttributeSet;


public class RnRecyclerView extends RecyclerView {

    protected boolean mRequestedLayout = false;

    public RnRecyclerView(Context context) {
        super(context);
    }

    public RnRecyclerView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }


    public RnRecyclerView(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!mRequestedLayout) {
            mRequestedLayout = true;
            this.post(new Runnable() {
                @SuppressLint("WrongCall")
                @Override
                public void run() {
                    mRequestedLayout = false;
                    layout(getLeft(), getTop(), getRight(), getBottom());
                    onLayout(false, getLeft(), getTop(), getRight(), getBottom());
                }
            });
        }
    }
}
