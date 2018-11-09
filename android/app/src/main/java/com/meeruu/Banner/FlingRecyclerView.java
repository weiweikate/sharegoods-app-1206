package com.meeruu.Banner;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.util.AttributeSet;

public class FlingRecyclerView extends RecyclerView {
    private double scale;               //抛掷速度的缩放因子

    public FlingRecyclerView(Context context) {
        super(context);
    }

    public FlingRecyclerView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public FlingRecyclerView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    public void setflingScale(double scale){
        this.scale = scale;
    }

    @Override
    public boolean fling(int velocityX, int velocityY) {
        velocityX *= scale;
        return super.fling(velocityX, velocityY);
    }
}
