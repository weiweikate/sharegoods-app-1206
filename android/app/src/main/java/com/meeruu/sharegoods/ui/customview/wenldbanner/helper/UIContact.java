package com.meeruu.sharegoods.ui.customview.wenldbanner.helper;

import com.meeruu.sharegoods.ui.customview.wenldbanner.AutoTurnViewPager;
import com.meeruu.sharegoods.ui.customview.wenldbanner.PageIndicatorListener;

import java.util.List;

public class UIContact {
    AutoTurnViewPager autoTurnViewPager;
    PageIndicatorListener pageIndicatorListener;

    UIContact(AutoTurnViewPager autoTurnViewPager,
              PageIndicatorListener pageIndicatorListener) {
        this.autoTurnViewPager = autoTurnViewPager;
        this.pageIndicatorListener = pageIndicatorListener;
    }

    public static UIContact with(AutoTurnViewPager autoTurnViewPager,
                                 PageIndicatorListener pageIndicatorListener) {
        if (autoTurnViewPager != null && pageIndicatorListener != null) {
            autoTurnViewPager.addOnPageChangeListener(pageIndicatorListener);
        }
        return new UIContact(autoTurnViewPager, pageIndicatorListener);
    }

    public <T> UIContact setData(List<T> data) {
        if (pageIndicatorListener != null) {
            pageIndicatorListener.setmDatas(data);
        }
        if (autoTurnViewPager != null) {
            int position = autoTurnViewPager.getCurrentItem();
            autoTurnViewPager.setmDatas(data);
            autoTurnViewPager.getAdapter().notifyDataSetChanged(true);
            autoTurnViewPager.setCurrentItem(position, false);
        }
        if (pageIndicatorListener != null) {
            pageIndicatorListener.onPageSelected(autoTurnViewPager.getCurrentItem());
        }
        return this;
    }

    public void removeListener(PageIndicatorListener pageIndicatorListener) {
        if (pageIndicatorListener == null)
            return;
        if (autoTurnViewPager == null)
            return;
        autoTurnViewPager.removeOnPageChangeListener(pageIndicatorListener);
    }

    public void addListener(PageIndicatorListener pageIndicatorListener) {
        this.pageIndicatorListener = pageIndicatorListener;
        if (pageIndicatorListener == null)
            return;
        if (autoTurnViewPager == null)
            return;
        pageIndicatorListener.setmDatas(autoTurnViewPager.getAdapter().getmDatas());
        removeListener(pageIndicatorListener);
        autoTurnViewPager.addOnPageChangeListener(pageIndicatorListener);
        pageIndicatorListener.onPageSelected(autoTurnViewPager.getCurrentItem());
    }
}
