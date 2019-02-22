package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.util.AttributeSet;
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
            int height= getHeight();
            int width = getWidth();
            int left = getLeft();
            int top = getTop();
            int right = getRight();
            int bottom = getBottom();
            layout(left, top, right, bottom);
        }
    };

}
