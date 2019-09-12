package com.meeruu.sharegoods.rn.showground.presenter;

import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.model.CollectionModel;
import com.meeruu.sharegoods.rn.showground.model.IShowgroundModel;
import com.meeruu.sharegoods.rn.showground.model.OtherModel;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Map;

public class OthersPresenter {
    private IShowgroundModel showgroundModel;
    private WeakReference<IShowgroundView> showgroundViewWeakReference;

    public OthersPresenter(IShowgroundView view,String userCode) {
        showgroundViewWeakReference = new WeakReference<>(view);
        showgroundModel = new OtherModel(userCode);
    }

    public void setParams(Map map) {
        showgroundModel.setParams(map);
    }

    public void getShowList(final String cursor) {
        showgroundModel.fetchRecommendList(cursor, 10, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                if (view != null) {
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
                        if (!TextUtils.isEmpty(cursor)) {
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
