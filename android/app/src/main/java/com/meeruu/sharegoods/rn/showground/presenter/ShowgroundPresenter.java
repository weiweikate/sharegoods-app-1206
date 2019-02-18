package com.meeruu.sharegoods.rn.showground.presenter;

import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.model.IShowgroundModel;
import com.meeruu.sharegoods.rn.showground.model.ShowgroundModel;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;

import java.lang.ref.WeakReference;
import java.util.List;

public class ShowgroundPresenter {
    private IShowgroundModel showgroundModel;
    private WeakReference<IShowgroundView> showgroundViewWeakReference;

    public ShowgroundPresenter(IShowgroundView view){
        showgroundViewWeakReference = new WeakReference<>(view);
        showgroundModel = new ShowgroundModel();
    }

    public void initShowground(){
        showgroundModel.fetchRecommendList(1, 10, new BaseCallback<NewestShowGroundBean>() {
            @Override
            public void onErr(String errCode, String msg) {

            }

            @Override
            public void onSuccess(NewestShowGroundBean result) {
                initView(result.getData().getData());
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
