package com.meeruu.commonlib.tool;

import android.content.Context;
import android.graphics.PointF;
import android.util.DisplayMetrics;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.LinearSmoothScroller;
import androidx.recyclerview.widget.RecyclerView;

public class FastScrollLinearLayoutManager extends LinearLayoutManager {
    private float MILLISECONDS_PER_INCH = 0.03f;
    private Context mContext;

    public FastScrollLinearLayoutManager(Context context) {
        super(context);
        mContext = context;
        setSpeedFast();
    }

    /**
     * 慢滑
     *         
     */
    public void setSpeedSlow() {
        // 自己在这里用density去乘，希望不同分辨率设备上滑动速度相同
        // 0.3f是自己估摸的一个值，可以根据不同需求自己修改
        MILLISECONDS_PER_INCH = mContext.getResources().getDisplayMetrics().density * 0.3f;
    }

    /**
     * 快滑,滑动系数自己修改，这里选了一个比较顺眼的数值
     *         
     */
    public void setSpeedFast() {
        MILLISECONDS_PER_INCH = mContext.getResources().getDisplayMetrics().density * 0.0008f;
    }

    @Override
    public void smoothScrollToPosition(RecyclerView recyclerView, RecyclerView.State state, int position) {
        LinearSmoothScroller smoothScroller = new LinearSmoothScroller(recyclerView.getContext()) {
            @Nullable
            @Override
            public PointF computeScrollVectorForPosition(int targetPosition) {
                return FastScrollLinearLayoutManager.this.computeScrollVectorForPosition(targetPosition);
            }

            // 控制滑动速度
            @Override
            protected float calculateSpeedPerPixel(DisplayMetrics displayMetrics) {
                // 单位速度 25F/densityDpi
                return MILLISECONDS_PER_INCH / displayMetrics.density;
            }

            // 该方法计算滑动所需时间。在此处间接控制速度。
            @Override
            protected int calculateTimeForScrolling(int dx) {
                return super.calculateTimeForScrolling(dx);
            }
        };
        smoothScroller.setTargetPosition(position);
        startSmoothScroll(smoothScroller);
    }
}
