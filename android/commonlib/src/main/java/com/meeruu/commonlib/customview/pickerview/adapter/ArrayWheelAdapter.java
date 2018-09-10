package com.meeruu.commonlib.customview.pickerview.adapter;

import com.meeruu.commonlib.bean.IdNameBean;
import com.meeruu.commonlib.customview.wheelview.adapter.WheelAdapter;

import java.util.List;

/**
 * The simple Array wheel adapter
 *
 * @param <T> the element type
 */
public class ArrayWheelAdapter<T> implements WheelAdapter {


    // items
    private List<T> items;

    /**
     * Constructor
     *
     * @param items the items
     */
    public ArrayWheelAdapter(List<T> items) {
        this.items = items;

    }

    @Override
    public Object getItem(int index) {
        if (index >= 0 && index < items.size()) {
            if (IdNameBean.class.equals(items.get(0).getClass())) {
                return ((IdNameBean) items.get(index)).getName();
            } else {
                return items.get(index);
            }
        }
        return "";
    }

    @Override
    public int getItemsCount() {
        return items.size();
    }

    @Override
    public int indexOf(Object o) {
        return items.indexOf(o);
    }

}
