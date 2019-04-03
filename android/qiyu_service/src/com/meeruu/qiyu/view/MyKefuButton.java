package com.meeruu.qiyu.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;

import com.qiyukf.unicorn.R;

public class MyKefuButton extends DragFloatActionButton {
    public MyKefuButton(Context context) {
        super(context);
    }

    public MyKefuButton(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public MyKefuButton(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public int getLayoutId() {
        return R.layout.drag_botton_layout;//拿到你自己定义的悬浮布局
    }

    @Override
    public void renderView(View view) {
        //初始化那些布局
    }
}