package com.meeruu.sharegoods.rn.showground.widgets;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.AttributeSet;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;


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
