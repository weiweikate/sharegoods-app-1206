package com.meeruu.sharegoods.rn.showground;

import android.text.TextUtils;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.widgets.ScaleImageView;

public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean,BaseViewHolder> {

    public ShowGroundAdapter(){
        super(R.layout.item_showground);
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {
        ScaleImageView imageView = helper.getView(R.id.showground_item_image);
        float width = 1;
        float height = 1;
        String imgUrl;
        if(!TextUtils.isEmpty(item.getCoverImg())){
            width = item.getCoverImgWide();
            height = item.getCoverImgHigh();
            imgUrl = item.getCoverImg();
        }else {
            width = item.getImgWide();
            height = item.getImgHigh();
            imgUrl = item.getImg();
        }

        int realWidth = (ScreenUtils.getScreenWidth()-40)/2;
         int realHeight = (int)((height/width)*realWidth);

//        ViewGroup.LayoutParams para1;
//        para1 = imageView.getLayoutParams();
//        para1.height = realHeight;
//        para1.width = realWidth;
//        imageView.setLayoutParams(para1);
//        imageView.requestLayout();
        imageView.setInitSize(realWidth,realHeight);
        ImageLoadUtils.loadNetImage(imgUrl,imageView,false);
//        LinearLayout linearLayout = helper.getView(R.id.item_wrapper);
//        linearLayout.requestLayout();
//        linearLayout.invalidate();

    }


}
