package com.meeruu.sharegoods.rn.showground.widgets;

import android.annotation.SuppressLint;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.widget.FrameLayout;

public class RnFrameLayout extends FrameLayout {
    protected boolean mRequestedLayout = false;

    public RnFrameLayout( @NonNull Context context) {
        super(context);
    }

    public RnFrameLayout( @NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public RnFrameLayout( @NonNull Context context,  @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
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

                    measure(
                            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY)
                    );
                    layout(getLeft(), getTop(), getRight(), getBottom());
                    // 自定义样式处理

//                    layout(getLeft(), getTop(), getRight(), getBottom());
//                    onLayout(false, getLeft(), getTop(), getRight(), getBottom());
                }
            });
        }
    }
}
