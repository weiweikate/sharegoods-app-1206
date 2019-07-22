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
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chad.library.adapter.base.BaseMultiItemQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.customview.ExpandableTextView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.contacts.CommValue;
import com.meeruu.sharegoods.rn.showground.utils.NumUtils;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridViewAdapter;
import com.meeruu.sharegoods.rn.showground.widgets.gridview.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.gridview.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.gridview.NineGridViewAdapter;

import java.util.ArrayList;
import java.util.List;

public class ShowRecommendAdapter extends BaseMultiItemQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {
    private NineGridView.clickL clickL;
    private ProductsAdapter.AddCartListener addCartListener;
    private ProductsAdapter.PressProductListener pressProductListener;
    private String type;
    public static int maxWidth = ScreenUtils.getScreenWidth() - DensityUtils.dip2px(90);
    private static int radius_5 = DensityUtils.dip2px(5);
    public static int videoOrImageWH = (ScreenUtils.getScreenWidth() - DensityUtils.dip2px(76)) / 3 * 2;
    public static int userImgWH = DensityUtils.dip2px(30f);

    public ShowRecommendAdapter(NineGridView.clickL clickL, ProductsAdapter.AddCartListener addCartListener, ProductsAdapter.PressProductListener pressProductListener) {
        super(new ArrayList<NewestShowGroundBean.DataBean>());
        NineGridView.setImageLoader(new NineGridView.ImageLoader() {
            @Override
            public void onDisplayImage(Context context, SimpleDraweeView imageView, String url, int width) {
                String tag = (String) imageView.getTag();
                if (!TextUtils.equals(tag, url)) {
                    imageView.setTag(url);
                    ImageLoadUtils.loadRoundNetImage(url, imageView, width, width, radius_5);
                }
            }
        });
        this.clickL = clickL;
        this.addCartListener = addCartListener;
        //动态类型
        addItemType(1, R.layout.item_showground_image_goods);
        //图文类型
        addItemType(2, R.layout.item_show_img_text);
        //视频类型
        addItemType(3, R.layout.item_showground_video);
        this.pressProductListener = pressProductListener;
    }

    public void setType(String type) {
        this.type = type;
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
            case 3:
                covertVideo(helper, item);
                break;
            default:
                covertImageText(helper, item);
        }
    }

    private void covertVideo(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final ExpandableTextView content = helper.getView(R.id.content);
        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(userIcon.getContext(), R.drawable.bg_app_user, userIcon);
        } else {
            if (!TextUtils.equals(userUrl, userTag)) {
                ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgWH, userImgWH);
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
        if (titleStr != null && titleStr.trim().length() > 0) {
            if (!TextUtils.equals(titleStr, (String) content.getTag())) {
                content.updateForRecyclerView(titleStr, maxWidth);
                content.setTag(titleStr);
                content.setExpandListener(null);
                content.setVisibility(View.VISIBLE);
            }
        } else {
            content.setVisibility(View.GONE);
            content.setTag(titleStr);
        }
        ImageView hand = helper.getView(R.id.icon_hand);
        if(item.isLike()){
            hand.setImageResource(R.mipmap.icon_liked);
        }else {
            hand.setImageResource(R.mipmap.icon_hand_gray);
        }
        ImageView collect = helper.getView(R.id.icon_collection);
        if (item.isCollect()) {
            collect.setImageResource(R.mipmap.icon_collected);
        } else {
            collect.setImageResource(R.mipmap.icon_collection_gray);
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView download = helper.getView(R.id.download_num);

        download.setText(NumUtils.formatShowNum(item.getDownloadCount()));

        TextView like = helper.getView(R.id.like_num);
        like.setText(NumUtils.formatShowNum(item.getHotCount()));

        SimpleDraweeView coverView = helper.getView(R.id.iv_cover);

        //九宫格数据在网络请求完APP端处理的
        String coverTag = (String) coverView.getTag();
        if (!TextUtils.equals(coverTag, item.getVideoCover())) {
            coverView.setTag(item.getVideoCover());
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) coverView.getLayoutParams();
            layoutParams.width = videoOrImageWH;
            layoutParams.height = videoOrImageWH;
            coverView.setLayoutParams(layoutParams);
            ImageLoadUtils.loadRoundNetImage(item.getVideoCover(), coverView, videoOrImageWH,
                    videoOrImageWH, radius_5);
        }

        RecyclerView recyclerView = helper.getView(R.id.product_list);

        if (item.getProducts() != null && item.getProducts().size() > 0) {
            String tag = (String) recyclerView.getTag(R.id.mr_show_product);

            if (!TextUtils.equals(tag, item.getShowNo())) {
                recyclerView.setTag(R.id.mr_show_product, item.getShowNo());
                ((SimpleItemAnimator) recyclerView.getItemAnimator())
                        .setSupportsChangeAnimations(false);
                LinearLayoutManager linearLayoutManager = new LinearLayoutManager(mContext);
                linearLayoutManager.setOrientation(OrientationHelper.HORIZONTAL);
                recyclerView.setLayoutManager(linearLayoutManager);
                ProductsAdapter productsAdapter = new ProductsAdapter(item.getProducts(), JSON.toJSONString(item));
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
                if (!Boolean.TRUE.equals(recyclerView.getTag(R.id.mr_show_snap))) {
                    SnapHelper snapHelper = new PagerSnapHelper();
                    snapHelper.attachToRecyclerView(recyclerView);
                    recyclerView.setTag(R.id.mr_show_snap, Boolean.TRUE);
                }
            }
        } else {
            recyclerView.setVisibility(View.GONE);
            recyclerView.setTag(null);
        }

        ImageView ivRecommend = helper.getView(R.id.iv_recommend);
        if (item.getCreateSource() == CommValue.NORMAL_USER_CONTENT) {
            ivRecommend.setVisibility(View.VISIBLE);
        } else {
            ivRecommend.setVisibility(View.GONE);
        }

        helper.addOnClickListener(R.id.icon_download, R.id.icon_share, R.id.content,R.id.icon_hand,R.id.icon_collection,R.id.user_icon);
    }

    private void covertImageText(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(userIcon.getContext(), R.drawable.bg_app_user, userIcon);
        } else {
            if (!TextUtils.equals(userUrl, userTag)) {
                ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgWH, userImgWH);
                userIcon.setTag(userUrl);
            }
        }
        ImageView hand = helper.getView(R.id.icon_hand);
        if(item.isLike()){
            hand.setImageResource(R.mipmap.icon_liked);
        }else {
            hand.setImageResource(R.mipmap.icon_hand_gray);
        }
        ImageView collect = helper.getView(R.id.icon_collection);
        if (item.isCollect()) {
            collect.setImageResource(R.mipmap.icon_collected);
        } else {
            collect.setImageResource(R.mipmap.icon_collection_gray);
        }

        TextView collectNum = helper.getView(R.id.collection_num);
        collectNum.setText(NumUtils.formatShowNum(item.getCollectCount()));

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView tvHot =helper.getView(R.id.tv_hotCount);
        tvHot.setText(NumUtils.formatShowNum(item.getHotCount()));

        TextView tvCollection = helper.getView(R.id.collection_num);
        tvCollection.setText(NumUtils.formatShowNum(item.getCollectCount()));

        TextView publishTime = helper.getView(R.id.publish_time);
        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            publishTime.setText(item.getPublishTimeStr());
        } else {
            publishTime.setText("");
        }

        TextView like = helper.getView(R.id.like_num);
        like.setText(NumUtils.formatShowNum(item.getLikesCount()));
        TextView hot = helper.getView(R.id.tv_hotCount);
        hot.setText(NumUtils.formatShowNum(item.getHotCount()));

        TextView title = helper.getView(R.id.title);
        title.setText(item.getTitle() + "");

        SimpleDraweeView simpleDraweeView = helper.getView(R.id.image);
        if (item.getResource() != null) {
            String tag = (String) simpleDraweeView.getTag();
            String url = item.getResource().get(0).getUrl();
            if (!TextUtils.equals(url, tag)) {
                simpleDraweeView.setTag(url);
                LinearLayout.LayoutParams linearParams = (LinearLayout.LayoutParams) simpleDraweeView.getLayoutParams();
                linearParams.height = videoOrImageWH;
                simpleDraweeView.setLayoutParams(linearParams);
                ImageLoadUtils.loadRoundNetImage(url, simpleDraweeView, videoOrImageWH, maxWidth, radius_5);
                simpleDraweeView.setVisibility(View.VISIBLE);
            }
        } else {
            simpleDraweeView.setVisibility(View.GONE);
        }

        helper.addOnClickListener(R.id.icon_share,R.id.content,R.id.icon_hand,R.id.icon_collection,R.id.user_icon);
    }


    private void convertDynamic(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final ExpandableTextView content = helper.getView(R.id.content);
        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(userIcon.getContext(), R.drawable.bg_app_user, userIcon);
        } else {
            if (!TextUtils.equals(userUrl, userTag)) {
                ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgWH, userImgWH);
                userIcon.setTag(userUrl);
            }
        }

        TextView publishTime = helper.getView(R.id.publish_time);
        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            publishTime.setText(item.getPublishTimeStr());
        } else {
            publishTime.setText("");
        }

        TextView tvHot =helper.getView(R.id.tv_hotCount);
        tvHot.setText(NumUtils.formatShowNum(item.getHotCount()));

        TextView tvCollection = helper.getView(R.id.collection_num);
        tvCollection.setText(NumUtils.formatShowNum(item.getCollectCount()));

        String titleStr = item.getContent();
        if (titleStr != null && titleStr.trim().length() > 0) {
            if (!TextUtils.equals(titleStr, (String) content.getTag())) {
                content.updateForRecyclerView(titleStr, maxWidth);
                content.setTag(titleStr);
                content.setExpandListener(null);
                content.setVisibility(View.VISIBLE);
            }
        } else {
            content.setVisibility(View.GONE);
            content.setTag(titleStr);
        }

        ImageView hand = helper.getView(R.id.icon_hand);
        if(item.isLike()){
            hand.setImageResource(R.mipmap.icon_liked);
        }else {
            hand.setImageResource(R.mipmap.icon_hand_gray);
        }
        ImageView collect = helper.getView(R.id.icon_collection);
        if (item.isCollect()) {
            collect.setImageResource(R.mipmap.icon_collected);
        } else {
            collect.setImageResource(R.mipmap.icon_collection_gray);
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView download = helper.getView(R.id.download_num);

        download.setText(NumUtils.formatShowNum(item.getDownloadCount()));

        TextView like = helper.getView(R.id.like_num);
        like.setText(NumUtils.formatShowNum(item.getLikesCount()));

        NineGridView nineGridView = helper.getView(R.id.nine_grid);

        //九宫格数据在网络请求完APP端处理的
        List<String> imageInfoList = item.getImgUrls();

        if (this.clickL != null) {
            nineGridView.setClick(clickL);
        } else {
            nineGridView.setClick(null);
        }

        if (imageInfoList != null && imageInfoList.size() > 0) {
            String tag = (String) nineGridView.getTag();
            String data = JSONObject.toJSONString(imageInfoList);
            if (!TextUtils.equals(tag, data)) {
                nineGridView.setTag(data);
                NineGridViewAdapter adapter = new NineGridViewAdapter(mContext, imageInfoList);
                nineGridView.setAdapter(adapter);
                nineGridView.setVisibility(View.VISIBLE);
            }
        } else {
            nineGridView.setVisibility(View.GONE);
            nineGridView.setTag(null);
        }

        RecyclerView recyclerView = helper.getView(R.id.product_list);

        if (item.getProducts() != null && item.getProducts().size() > 0) {
            String tag = (String) recyclerView.getTag(R.id.mr_show_product);
            if (!TextUtils.equals(tag, item.getShowNo())) {
                recyclerView.setTag(R.id.mr_show_product, item.getShowNo());
                ((SimpleItemAnimator) recyclerView.getItemAnimator())
                        .setSupportsChangeAnimations(false);
                LinearLayoutManager linearLayoutManager = new LinearLayoutManager(mContext);
                linearLayoutManager.setOrientation(OrientationHelper.HORIZONTAL);
                recyclerView.setLayoutManager(linearLayoutManager);
                ProductsAdapter productsAdapter = new ProductsAdapter(item.getProducts(), JSON.toJSONString(item));
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
                if (!Boolean.TRUE.equals(recyclerView.getTag(R.id.mr_show_snap))) {
                    SnapHelper snapHelper = new PagerSnapHelper();
                    snapHelper.attachToRecyclerView(recyclerView);
                    recyclerView.setTag(R.id.mr_show_snap, Boolean.TRUE);
                }
            }
        } else {
            recyclerView.setVisibility(View.GONE);
            recyclerView.setTag(null);
        }

        ImageView ivRecommend = helper.getView(R.id.iv_recommend);
        if (item.getCreateSource() == CommValue.NORMAL_USER_CONTENT) {
            ivRecommend.setVisibility(View.VISIBLE);
        } else {
            ivRecommend.setVisibility(View.GONE);
        }
        helper.addOnClickListener(R.id.icon_download, R.id.icon_share, R.id.content,R.id.icon_collection,R.id.icon_hand,R.id.user_icon);
    }
}
