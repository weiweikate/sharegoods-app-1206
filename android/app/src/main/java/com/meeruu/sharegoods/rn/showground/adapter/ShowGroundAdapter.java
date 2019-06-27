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

import static com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter.userImgW;


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
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgW, userImgW);
            userIcon.setTag(userUrl);
        }
        final SimpleDraweeView imageView = helper.getView(R.id.showground_item_image);
        float width = 1;
        float height = 1;
        String imgUrl = null;
        if (item.getResource() != null) {
            if (item.getShowType() == 3) {
                for (NewestShowGroundBean.DataBean.ResourceBean resourceBean : item.getResource()) {
                    if (resourceBean.getType() == 5) {
                        imgUrl = resourceBean.getBaseUrl();
                        width = (float) resourceBean.getWidth();
                        height = (float) resourceBean.getHeight();
                        break;
                    }
                }
            } else {
                NewestShowGroundBean.DataBean.ResourceBean resourceBean = item.getResource().get(0);
                imgUrl = resourceBean.getBaseUrl();
                width = (float) resourceBean.getWidth();
                height = (float) resourceBean.getHeight();
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
            RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) imageView.getLayoutParams();
            params.width = realWidth;
            params.height = realHeight;
            imageView.setLayoutParams(params);
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, realWidth, realHeight, arr_raduis);
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
