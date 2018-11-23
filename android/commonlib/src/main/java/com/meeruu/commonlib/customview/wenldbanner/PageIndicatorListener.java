package com.meeruu.commonlib.customview.wenldbanner;

import android.support.v4.view.ViewPager;

import java.util.List;

public interface PageIndicatorListener<T> extends ViewPager.OnPageChangeListener {
    void setmDatas(List<T> mDatas);

    List<T> getmDatas();
}
