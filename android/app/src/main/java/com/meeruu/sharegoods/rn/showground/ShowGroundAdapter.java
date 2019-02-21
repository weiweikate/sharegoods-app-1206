package com.meeruu.sharegoods.rn.showground;

import android.text.TextUtils;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.widgets.ScaleImageView;

public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {

    public ShowGroundAdapter() {
        super(R.layout.item_showground);
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {

        SimpleDraweeView userIcon = helper.getView(R.id.showground_item_userIcon);
        ImageLoadUtils.loadCircleNetImage(item.getUserHeadImg(),userIcon,false);

        ScaleImageView imageView = helper.getView(R.id.showground_item_image);
        float width = 1;
        float height = 1;
        String imgUrl;
        if (!TextUtils.isEmpty(item.getCoverImg())) {
            width = item.getCoverImgWide();
            height = item.getCoverImgHigh();
            imgUrl = item.getCoverImg();
        } else {
            width = item.getImgWide();
            height = item.getImgHigh();
            imgUrl = item.getImg();
        }

        int realWidth = (ScreenUtils.getScreenWidth() - 40) / 2;
        int realHeight = (int) ((height / width) * realWidth);

        imageView.setInitSize(realWidth, realHeight);
        ImageLoadUtils.loadNetImage(imgUrl, imageView, false);




        TextView name = helper.getView(R.id.showground_item_name);
        name.setText(item.getUserName());

        TextView time = helper.getView(R.id.showground_item_time);
        time.setText(item.getTime());

        TextView title = helper.getView(R.id.showground_item_title);
        title.setText(item.getPureContent());


    }


}
