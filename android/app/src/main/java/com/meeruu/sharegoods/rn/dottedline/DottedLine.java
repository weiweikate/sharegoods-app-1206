package com.meeruu.sharegoods.rn.dottedline;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PathEffect;
import android.util.AttributeSet;
import android.view.View;

public class DottedLine extends View {

    private int color = Color.WHITE;
    private float itemWidth = 10;
    private float space = 10;
    private boolean isRow = true;


    public DottedLine(Context context){
        super(context,null);
    }

    public DottedLine(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        setMeasuredDimension(widthMeasureSpec, heightMeasureSpec);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        Paint p = new Paint();
        p.setAntiAlias(true);
        p.setStyle(Paint.Style.STROKE);
        p.setColor(color);
        p.setStrokeWidth(isRow ? getMeasuredHeight() : getMeasuredWidth());
        PathEffect effects = new DashPathEffect(new float[] { space,itemWidth }, 0);
        Path path = new Path();
        path.moveTo(isRow?0:getMeasuredWidth()/2,isRow? getMeasuredHeight()/2 : 0 );
        path.lineTo(isRow?getMeasuredWidth():getMeasuredWidth()/2, isRow?getMeasuredHeight()/2:getMeasuredHeight());
        p.setPathEffect(effects);
        canvas.drawPath(path, p);
    }

    /**
     * 设置颜色
     *
     * @param color
     */
    public void setColor(int color) {
        this.color = color;
        invalidate();
    }

    /**
     * 设置颜色值
     *
     * @param color
     */
    public void setColor(String color) {
        this.color = Color.parseColor(color);
        invalidate();
    }

    public void setItemWidth(float i){
        this.itemWidth = i;
        invalidate();
    }

    public void setSpace(float i){
        this.space = i;
        invalidate();
    }

    public void setRow(boolean i){
        this.isRow = i;
        invalidate();
    }
}
