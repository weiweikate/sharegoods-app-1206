package com.meeruu.sharegoods.rn.showground.presenter;

import com.alibaba.fastjson.JSON;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.model.DynamicModel;
import com.meeruu.sharegoods.rn.showground.model.IShowgroundModel;
import com.meeruu.sharegoods.rn.showground.model.ShowgroundModel;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Map;

public class DynamicPresenter {
    private IShowgroundModel showgroundModel;
    private WeakReference<IShowgroundView> showgroundViewWeakReference;

    public DynamicPresenter(IShowgroundView view) {
        showgroundViewWeakReference = new WeakReference<>(view);
        showgroundModel = new DynamicModel();
    }

    public void setParams(Map map){
        showgroundModel.setParams(map);
    }

    public void getShowList(final int page) {
        showgroundModel.fetchRecommendList(page, 10, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                if(view != null){
                    view.loadMoreFail(errCode);
                }
            }

            @Override
            public void onSuccess(String result) {
                NewestShowGroundBean data = JSON.parseObject(result, NewestShowGroundBean.class);
                List list = data.getData();
                if (showgroundViewWeakReference != null) {
                    IShowgroundView iShowgroundView = showgroundViewWeakReference.get();
                    if (iShowgroundView != null) {
                        if (page > 1) {
                            iShowgroundView.viewLoadMore(list);
                            if (list == null) {
                                iShowgroundView.loadMoreEnd();
                            } else if (list.size() < 10) {
                                iShowgroundView.loadMoreEnd();
                            } else {
                                iShowgroundView.loadMoreComplete();
                            }
                        } else {
                            iShowgroundView.refreshShowground(list);
                        }
                    }
                }
            }
        });
    }

    public void deleteItem(String showNo){
        showgroundModel.deleteDynamic(showNo, new BaseCallback() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                if(view != null){
                    view.deleteFail(msg);
                }
            }

            @Override
            public void onSuccess(Object result) {
                IShowgroundView view = showgroundViewWeakReference.get();
                if(view != null){
                    view.deleteSuccess();
                }
            }
        });
    }
}
