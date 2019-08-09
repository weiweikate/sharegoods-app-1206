package com.meeruu.sharegoods.rn.showground.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.widget.ScrollView;

public class FocusScrollView extends ScrollView {
    public FocusScrollView(Context context) {
        this(context,null);
    }
    public FocusScrollView(Context context, AttributeSet attrs) {
        this(context, attrs,0);
    }
    public FocusScrollView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }
    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        //关键点在这
        getParent().requestDisallowInterceptTouchEvent(true);
        return super.onInterceptTouchEvent(ev);
    }
}
