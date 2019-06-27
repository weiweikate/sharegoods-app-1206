package com.meeruu.sharegoods.rn.showground.adapter;

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
import com.meeruu.sharegoods.rn.showground.contacts.CommValue;

public class ShowDynamicAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {
    private final int realWidth;
    private final int maxHeight;
    private final int minHeight;


    private final int radius = DensityUtils.dip2px(5);
    private float[] arr_raduis = {radius, radius, radius, radius, 0, 0, 0, 0};

    public ShowDynamicAdapter() {
        super(R.layout.show_dynamic_item);
        realWidth = (ScreenUtils.getScreenWidth() - DensityUtils.dip2px(40)) / 2;
        minHeight = realWidth * 120 / 167;
        maxHeight = realWidth * 240 / 167;
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView imageView = helper.getView(R.id.dynamic_item_image);
        double width = 1;
        double height = 1;
        String imgUrl = null;
        if (item.getResource() != null) {
            if (item.getShowType() != 3) {
                //非视频类型
                NewestShowGroundBean.DataBean.ResourceBean resourceBean = item.getResource().get(0);
                imgUrl = resourceBean.getUrl();
                width = resourceBean.getWidth();
                height = resourceBean.getHeight();
            } else {
                //视频类型，取封面
                imgUrl = item.getVideoCover().imageUrl;
                width = item.getVideoCover().imageViewWidth;
                height = item.getVideoCover().imageViewHeight;
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
            params.height = realHeight;
            params.width = realWidth;
            imageView.setLayoutParams(params);
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, realWidth, realHeight, arr_raduis);
        }

        ImageView shadow = helper.getView(R.id.iv_shadow);
        FrameLayout root = helper.getView(R.id.root_view);
        if (item.getStatus() == 3) {
            int length = minHeight - 30;
            RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) shadow.getLayoutParams();
            params.width = length;
            params.height = length;
            shadow.setLayoutParams(params);
            shadow.setVisibility(View.VISIBLE);
            root.setForeground(root.getContext().getResources().getDrawable(R.drawable.white_shadow));
        } else {
            shadow.setVisibility(View.GONE);
            root.setForeground(null);
        }

        TextView desc = helper.getView(R.id.tv_desc);

        if (item.getStatus() == CommValue.PUBLISH_DONE) {
            desc.setText("已发布");
            desc.setTextColor(desc.getContext().getResources().getColor(R.color.status_red));
        } else if (item.getStatus() == CommValue.WAIT_APPROVE) {
            desc.setText("审核中");
            desc.setTextColor(desc.getContext().getResources().getColor(R.color.status_blue));
        } else if (item.getStatus() == CommValue.SHIELD) {
            desc.setText("已屏蔽");
            desc.setTextColor(desc.getContext().getResources().getColor(R.color.status_gray));
        } else if (item.getStatus() == CommValue.DELETED) {
            desc.setText("已删除");
            desc.setTextColor(desc.getContext().getResources().getColor(R.color.status_gray));
        }

        TextView title = helper.getView(R.id.showground_item_title);
        String titleStr = item.getContent();
        if (titleStr != null && titleStr.trim().length() > 0) {
            title.setText(titleStr);
            title.setVisibility(View.VISIBLE);
        } else {
            title.setVisibility(View.GONE);
        }

        helper.addOnClickListener(R.id.iv_delete);
    }
}
