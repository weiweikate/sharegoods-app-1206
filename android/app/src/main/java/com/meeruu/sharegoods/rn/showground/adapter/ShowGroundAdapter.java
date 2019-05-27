package com.meeruu.sharegoods.rn.showground.adapter;

import android.text.TextUtils;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.utils.NumUtils;
import com.meeruu.sharegoods.rn.showground.utils.UrlUtils;

import java.util.HashMap;
import java.util.Map;


public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {

    //    public static final int Featured = 1;
//    public static final int Hot = 2;
    private static final int Recommend = 3;
    private static final int New = 4;
    private final int realWidth;
    private final int maxHeight;
    private final int minHeight;


    private final int radius = DensityUtils.dip2px(5);
    private float[] arr_raduis = {radius, radius, radius, radius, 0, 0, 0, 0};

    public ShowGroundAdapter() {
        super(R.layout.item_showground);
        realWidth = (ScreenUtils.getScreenWidth() - 40) / 2;
        minHeight = realWidth*120/167;
        maxHeight = realWidth*240/167;
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView userIcon = helper.getView(R.id.showground_item_userIcon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (!TextUtils.equals(userUrl, userTag)) {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
            userIcon.setTag(userUrl);
        }
        final SimpleDraweeView imageView = helper.getView(R.id.showground_item_image);
        float width = 1;
        float height = 1;
        String imgUrl = null;
        if(item.getResource() != null){
            imgUrl = item.getResource().get(0).getUrl();
            Map<String,String> map = UrlUtils.urlSplit(imgUrl);
            if(map.containsKey("width")){
                width = Float.valueOf(map.get("width"));
            }
            if(map.containsKey("height")){
                height = Float.valueOf(map.get("height"));
            }
        }

        if (TextUtils.isEmpty(imgUrl)) {
            imgUrl = "res://" + imageView.getContext().getPackageName() + "/" + R.drawable.bg_app_img;
        }
        int realHeight = (int) ((height / width) * realWidth);
        if(realHeight < minHeight){
            realHeight = minHeight;
        }
        if(realHeight > maxHeight){
            realHeight = maxHeight;
        }
        if (realHeight <= 1) {
            realHeight = realWidth;
        }
        String tag = (String) imageView.getTag();

        if (!TextUtils.equals(imgUrl, tag)) {
            imageView.setTag(imgUrl);
            RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) imageView.getLayoutParams();
            params.width = realWidth;
            params.height = realHeight;
            imageView.setLayoutParams(params);
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, arr_raduis);
        }
        TextView name = helper.getView(R.id.showground_item_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView title = helper.getView(R.id.showground_item_title);
        String titleStr = item.getContent();
        if(titleStr != null && titleStr.trim().length() > 0){
            title.setText(titleStr);
        }else {
            title.setVisibility(View.GONE);
        }

        TextView showTimes = helper.getView(R.id.showground_item_rqz);
        int times = item.getHotCount();
        showTimes.setText(NumUtils.formatShowNum(times));
    }
}
