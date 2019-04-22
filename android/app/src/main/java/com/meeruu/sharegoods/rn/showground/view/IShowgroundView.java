package com.meeruu.sharegoods.rn.showground.view;

import java.util.List;

public interface IShowgroundView {

    void refreshShowground(List data);

    void loadMoreEnd();

    void loadMoreComplete();

    void loadMoreFail();

    void viewLoadMore(List data);

    void repelaceData(int index,int clickNum);
}
