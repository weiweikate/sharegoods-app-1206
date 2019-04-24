package com.meeruu.sharegoods.rn.showground.presenter;

import com.alibaba.fastjson.JSON;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.model.IShowgroundModel;
import com.meeruu.sharegoods.rn.showground.model.ShowgroundModel;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Map;

public class ShowgroundPresenter {
    private IShowgroundModel showgroundModel;
    private WeakReference<IShowgroundView> showgroundViewWeakReference;

    public ShowgroundPresenter(IShowgroundView view) {
        showgroundViewWeakReference = new WeakReference<>(view);
        showgroundModel = new ShowgroundModel();
    }

    public void setParams(Map map){
        showgroundModel.setParams(map);
    }

    public void getShowList(final int page) {
        showgroundModel.fetchRecommendList(page, 10, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                view.loadMoreFail(errCode);
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
}
