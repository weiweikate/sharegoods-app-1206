package com.meeruu.sharegoods.rn.showground.adapter;

import android.graphics.drawable.Drawable;
import android.text.TextUtils;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
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
import com.meeruu.sharegoods.rn.showground.utils.VideoCoverUtils;

import static com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter.userImgWH;
import static com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter.videoOrImageWH;


public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {
    private final int realWidth;
    private final int maxHeight;
    private final int minHeight;


    private final int radius = DensityUtils.dip2px(5);
    private float[] arr_raduis = {radius, radius, radius, radius, 0, 0, 0, 0};

    public ShowGroundAdapter() {
        super(R.layout.item_showground);
        realWidth = (ScreenUtils.getScreenWidth() - DensityUtils.dip2px(40)) / 2;
        minHeight = realWidth * 120 / 167;
        maxHeight = realWidth * 240 / 167;
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView userIcon = helper.getView(R.id.showground_item_userIcon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            userUrl = "res://" + userIcon.getContext().getPackageName() + "/" + R.drawable.bg_app_user;
        }
        if (!TextUtils.equals(userUrl, userTag)) {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgWH, userImgWH);
            userIcon.setTag(userUrl);
        }
        final SimpleDraweeView imageView = helper.getView(R.id.showground_item_image);
        final ImageView playIcon = helper.getView(R.id.icon_play);
        final FrameLayout content = helper.getView(R.id.cover_wrapper);
        double width = 1;
        double height = 1;
        String imgUrl = null;
        Drawable drawable = mContext.getResources().getDrawable(R.drawable.black_transparent);
        if (item.getResource() != null) {
            if (item.getShowType() == 3) {
                imgUrl = item.getVideoCover();
                width = item.getCoverWidth();
                height = item.getCoverHeight();
                playIcon.setVisibility(View.VISIBLE);
                content.setForeground(drawable);
            } else {
                NewestShowGroundBean.DataBean.ResourceBean resourceBean = item.getResource().get(0);
                imgUrl = resourceBean.getBaseUrl();
                width = (float) resourceBean.getWidth();
                height = (float) resourceBean.getHeight();
                playIcon.setVisibility(View.GONE);
                content.setForeground(null);
            }
        }

        if (TextUtils.isEmpty(imgUrl)) {
            imgUrl = "res://" + imageView.getContext().getPackageName() + "/" + R.drawable.bg_app_img;
        }

        int realHeight = (int) ((height / width) * realWidth);
        if (realHeight < minHeight) {
            realHeight = minHeight;
        }
        if (realHeight > maxHeight) {
            realHeight = maxHeight;
        }
        if (realHeight <= 1) {
            realHeight = realWidth;
        }
        String tag = (String) imageView.getTag();

        if (!TextUtils.equals(imgUrl, tag)) {
            imageView.setTag(imgUrl);
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) imageView.getLayoutParams();
            params.width = realWidth;
            params.height = realHeight;
            imageView.setLayoutParams(params);
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, realWidth, realHeight, arr_raduis, false);
        }
        TextView name = helper.getView(R.id.showground_item_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView title = helper.getView(R.id.showground_item_title);
        String titleStr = item.getContent();
        if (titleStr != null && titleStr.trim().length() > 0) {
            title.setText(titleStr);
            title.setVisibility(View.VISIBLE);
        } else {
            title.setVisibility(View.GONE);
        }

        TextView showTimes = helper.getView(R.id.showground_item_rqz);
        int times = item.getHotCount();
        showTimes.setText(NumUtils.formatShowNum(times));
    }
}
