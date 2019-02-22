package com.meeruu.sharegoods.rn.showground.presenter;

import com.alibaba.fastjson.JSON;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.model.IShowgroundModel;
import com.meeruu.sharegoods.rn.showground.model.ShowgroundModel;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;

import java.lang.ref.WeakReference;
import java.util.Collections;
import java.util.List;

public class ShowgroundPresenter {
    private IShowgroundModel showgroundModel;
    private WeakReference<IShowgroundView> showgroundViewWeakReference;

    public ShowgroundPresenter(IShowgroundView view){
        showgroundViewWeakReference = new WeakReference<>(view);
        showgroundModel = new ShowgroundModel();
    }

    public void initShowground(){
        showgroundModel.fetchRecommendList(1, 10, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                view.loadMoreFail();
            }

            @Override
            public void onSuccess(String result) {
                NewestShowGroundBean data = JSON.parseObject(result,NewestShowGroundBean.class);
                List list = data.getData();
                initView(data.getData());
                IShowgroundView view = showgroundViewWeakReference.get();
                if(list == null){
                    view.loadMoreEnd();
                }else if (list.size() < 10){
                    view.loadMoreEnd();
                }else {
                    view.loadMoreComplete();
                }
            }
        });
    }

    public void setUri(String uri){
        showgroundModel.setUri(uri);
    }

    public void loadMore(int page){
        showgroundModel.fetchRecommendList(page, 10, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                IShowgroundView view = showgroundViewWeakReference.get();
                view.loadMoreFail();
            }

            @Override
            public void onSuccess(String result) {
                NewestShowGroundBean data = JSON.parseObject(result,NewestShowGroundBean.class);
                List list = data.getData();

                IShowgroundView view = showgroundViewWeakReference.get();
                view.viewLoadMore(list);
                if(list == null){
                    view.loadMoreEnd();
                }else if(list.size()<10){
                    view.loadMoreEnd();
                }else {
                    view.loadMoreComplete();
                }
            }
        });
    }

    public void initView(List data){
        if(showgroundViewWeakReference != null){
            IShowgroundView iShowgroundView = showgroundViewWeakReference.get();
            if(iShowgroundView != null){
                iShowgroundView.refreshShowground(data);
            }
        }
    }

}
