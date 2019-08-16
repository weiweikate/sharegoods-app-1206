package com.meeruu.sharegoods.rn.showground.view;

import java.util.List;

public interface IShowgroundView {

    void refreshShowground(List data);

    void refreshShowground(List data,String cursor);

    void loadMoreEnd();

    void loadMoreComplete();

    void loadMoreFail(String code);

    void viewLoadMore(List data);

    void viewLoadMore(List data,String cursor);

    void repelaceData(int index,int clickNum);

    void repelaceItemData(int index,String value);

    void addDataToTop(String value);

    void deleteSuccess();

    void deleteFail(String err);


}
