package com.meeruu.sharegoods.rn.showground;

import android.graphics.Rect;
import android.view.View;
import android.widget.LinearLayout;

import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.meeruu.commonlib.utils.DensityUtils;

public class SpaceItemDecoration extends RecyclerView.ItemDecoration {
    private int space;


    public SpaceItemDecoration(int space) {
        this.space = DensityUtils.dip2px(space);
    }

    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        super.getItemOffsets(outRect, view, parent, state);
        outRect.top = space;
        if (view instanceof LinearLayout) {
            return;
        }
        //瀑布流专属分割线
        StaggeredGridLayoutManager.LayoutParams params = (StaggeredGridLayoutManager.LayoutParams) view.getLayoutParams();
        /**
         * 根据params.getSpanIndex()来判断左右边确定分割线
         * 第一列设置左边距为space，右边距为space/2  （第二列反之）
         */
        if (params.getSpanIndex() % 2 == 0) {
            outRect.left = space + 5;
            outRect.right = space / 2;
        } else {
            outRect.left = space / 2;
            outRect.right = space + 5;
        }
    }
}
