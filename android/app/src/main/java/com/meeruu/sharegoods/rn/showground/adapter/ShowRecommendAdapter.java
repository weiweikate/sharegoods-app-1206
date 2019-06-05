package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.OrientationHelper;
import android.support.v7.widget.PagerSnapHelper;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.SnapHelper;
import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSONObject;
import com.chad.library.adapter.base.BaseMultiItemQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.widgets.FolderTextView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridViewAdapter;

import java.util.ArrayList;
import java.util.List;

public class ShowRecommendAdapter extends BaseMultiItemQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {
    private NineGridView.clickL clickL;
    private ProductsAdapter.AddCartListener addCartListener;
    private ProductsAdapter.PressProductListener pressProductListener;

    public ShowRecommendAdapter(NineGridView.clickL clickL, ProductsAdapter.AddCartListener addCartListener, ProductsAdapter.PressProductListener pressProductListener) {
        super(new ArrayList<NewestShowGroundBean.DataBean>());
        NineGridView.setImageLoader(new NineGridView.ImageLoader() {
            @Override
            public void onDisplayImage(Context context, SimpleDraweeView imageView, String url) {
                ImageLoadUtils.loadRoundNetImage(url, imageView, DensityUtils.dip2px(5));
            }
        });
        this.clickL = clickL;
        this.addCartListener = addCartListener;
        addItemType(1, R.layout.item_showground_image_goods);
        addItemType(2, R.layout.item_show_img_text);
        this.pressProductListener = pressProductListener;
    }

    @Override
    protected void convert(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        switch (helper.getItemViewType()) {
            case 1:
                convertDynamic(helper, item);
                break;
            case 2:
                covertImageText(helper, item);
                break;
            default:
                covertImageText(helper, item);
        }


    }

    private void covertImageText(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(userIcon.getContext(), R.drawable.bg_app_user, userIcon);
        } else {
            if (!TextUtils.equals(userUrl, userTag)) {
                ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
                userIcon.setTag(userUrl);
            }
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView publishTime = helper.getView(R.id.publish_time);
        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            publishTime.setText(item.getPublishTimeStr());
        } else {
            publishTime.setText("");
        }

        TextView like = helper.getView(R.id.like_num);
        like.setText(item.getLikesCount() + "");

        TextView title = helper.getView(R.id.title);
        title.setText(item.getTitle() + "");

        SimpleDraweeView simpleDraweeView = helper.getView(R.id.image);
        if (item.getResource() != null) {
            String url = item.getResource().get(0).getUrl();
            int width = ScreenUtils.getScreenWidth() - DensityUtils.dip2px(85);
            int height = width/29*16;
            LinearLayout.LayoutParams linearParams = (LinearLayout.LayoutParams) simpleDraweeView.getLayoutParams();
            linearParams.height = height;
            linearParams.width = width;
            simpleDraweeView.setLayoutParams(linearParams);
            ImageLoadUtils.loadRoundNetImage(url, simpleDraweeView, DensityUtils.dip2px(5));
            simpleDraweeView.setVisibility(View.VISIBLE);
        } else {
            simpleDraweeView.setVisibility(View.GONE);
        }

        ImageView hand = helper.getView(R.id.icon_hand);
        if (item.isLike()) {
            hand.setImageResource(R.drawable.icon_like);
        } else {
            hand.setImageResource(R.drawable.icon_hand);
        }
        helper.addOnClickListener(R.id.icon_hand, R.id.icon_share);
    }


    private void convertDynamic(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final FolderTextView content = helper.getView(R.id.content);
        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(userIcon.getContext(), R.drawable.bg_app_user, userIcon);
        } else {
            if (!TextUtils.equals(userUrl, userTag)) {
                ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
                userIcon.setTag(userUrl);
            }
        }

        TextView publishTime = helper.getView(R.id.publish_time);
        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            publishTime.setText(item.getPublishTimeStr());
        } else {
            publishTime.setText("");
        }

        String titleStr = item.getContent();
        if (!TextUtils.equals(titleStr, (String) content.getTag())) {
            if (titleStr != null && titleStr.trim().length() > 0) {
                content.setText(titleStr);
                content.setTag(titleStr);
                content.setVisibility(View.VISIBLE);
            } else {
                content.setVisibility(View.GONE);
                content.setTag(titleStr);
            }
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView download = helper.getView(R.id.download_num);

        download.setText(item.getDownloadCount() + "");

        TextView like = helper.getView(R.id.like_num);
        like.setText(item.getLikesCount() + "");

        NineGridView nineGridView = helper.getView(R.id.nine_grid);

        nineGridView.setSingleImageRatio(ScreenUtils.getScreenWidth() - DensityUtils.dip2px(185));
        List<ImageInfo> imageInfoList = item.getNineImageInfos();

        if (this.clickL != null) {
            nineGridView.setClick(clickL);
        } else {
            nineGridView.setClick(null);
        }

        if (imageInfoList != null && imageInfoList.size() > 0) {
            String tag = (String) nineGridView.getTag();
            if (!TextUtils.equals(tag, JSONObject.toJSONString(imageInfoList))) {
                NineGridViewAdapter adapter = new NineGridViewAdapter(mContext, imageInfoList);
                nineGridView.setAdapter(adapter);
                nineGridView.setVisibility(View.VISIBLE);
                nineGridView.setTag(JSONObject.toJSONString(imageInfoList));
            }
        } else {
            nineGridView.setVisibility(View.GONE);
            nineGridView.setTag(null);
        }

        RecyclerView recyclerView = helper.getView(R.id.product_list);
        ((SimpleItemAnimator) recyclerView.getItemAnimator())
                .setSupportsChangeAnimations(false);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(mContext);
        linearLayoutManager.setOrientation(OrientationHelper.HORIZONTAL);
        recyclerView.setLayoutManager(linearLayoutManager);

        if (item.getProducts() != null) {
            ProductsAdapter productsAdapter = new ProductsAdapter(item.getProducts());
            if (this.addCartListener != null) {
                productsAdapter.setAddCartListener(addCartListener);
            } else {
                productsAdapter.setAddCartListener(null);
            }
            if (this.pressProductListener != null) {
                productsAdapter.setPressProductListener(this.pressProductListener);
            } else {
                productsAdapter.setPressProductListener(null);
            }
            recyclerView.setVisibility(View.VISIBLE);
            recyclerView.setAdapter(productsAdapter);
            if (!Boolean.TRUE.equals(recyclerView.getTag())) {
                SnapHelper snapHelper = new PagerSnapHelper();
                snapHelper.attachToRecyclerView(recyclerView);
                recyclerView.setTag(Boolean.TRUE);
            }
        } else {
            recyclerView.setVisibility(View.GONE);
        }
        helper.addOnClickListener(R.id.icon_hand, R.id.icon_download, R.id.icon_share);
        ImageView hand = helper.getView(R.id.icon_hand);
        if (item.isLike()) {
            hand.setImageResource(R.drawable.icon_like);
        } else {
            hand.setImageResource(R.drawable.icon_hand);
        }
    }
}
