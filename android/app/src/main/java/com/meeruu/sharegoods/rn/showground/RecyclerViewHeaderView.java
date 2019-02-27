package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;

public class RecyclerViewHeaderView extends ViewGroup {
    public RecyclerViewHeaderView(Context context) {
        super(context);
    }

    public RecyclerViewHeaderView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public RecyclerViewHeaderView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int w = MeasureSpec.getSize(widthMeasureSpec);
        int h = 0;
        if (getChildCount() > 0) {
            final View child = getChildAt(0);
            LayoutParams lp = child.getLayoutParams();
            if (lp == null) {
                lp = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.MATCH_PARENT);
            }
            int w1 = MeasureSpec.makeMeasureSpec(lp.width, MeasureSpec.AT_MOST), h1 = MeasureSpec.makeMeasureSpec(lp.height, MeasureSpec.AT_MOST);
            child.measure(w1, h1);
            h = child.getHeight();
        }
        setMeasuredDimension(w, h);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            int left = getLeft();
            int top = getTop();
            int right = getRight();
            int bottom = getBottom();
            layout(left, top, right, bottom);
        }
    };
}
