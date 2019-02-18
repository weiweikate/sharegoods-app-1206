package com.meeruu.sharegoods.rn.showground;

import android.widget.RelativeLayout;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.widgets.ScaleImageView;

public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBeanX.DataBean,BaseViewHolder> {
    public ShowGroundAdapter(){
        super(R.layout.item_showground);
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBeanX.DataBean item) {
        ScaleImageView imageView = helper.getView(R.id.showground_item_image);
        imageView.setInitSize(100,100);
        ImageLoadUtils.loadNetImage(item.getImg(),imageView,true);
    }
}
