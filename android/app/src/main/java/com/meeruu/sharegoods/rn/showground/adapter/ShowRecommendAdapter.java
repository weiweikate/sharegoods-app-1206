package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.OrientationHelper;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseMultiItemQuickAdapter;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.SpaceItemDecoration;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.event.onNineClickEvent;
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

//        super(R.layout.item_showground_image_goods);

        super(new ArrayList<NewestShowGroundBean.DataBean>());
        NineGridView.setImageLoader(new NineGridView.ImageLoader() {
            @Override
            public void onDisplayImage(Context context, SimpleDraweeView imageView, String url) {
                ImageLoadUtils.loadRoundNetImage(url, imageView, 5);
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
        if (!TextUtils.equals(userUrl, userTag)) {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
            userIcon.setTag(userUrl);
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());


        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            TextView publishTime = helper.getView(R.id.publish_time);
            publishTime.setText(item.getPublishTimeStr());
        }

        TextView like = helper.getView(R.id.like_num);
        like.setText(item.getLikesCount()+"");

        TextView title = helper.getView(R.id.title);
        title.setText(item.getTitle()+"");

        SimpleDraweeView simpleDraweeView = helper.getView(R.id.image);
        if (item.getResource() != null) {
            String url = item.getResource().get(0).getUrl();
            ImageLoadUtils.loadRoundNetImage(url, simpleDraweeView,5);
        }else {
            simpleDraweeView.setVisibility(View.GONE);
        }

        ImageView hand = helper.getView(R.id.icon_hand);
        if(item.isLike()){
            hand.setImageResource(R.drawable.icon_like);
        }else {
            hand.setImageResource(R.drawable.icon_hand);
        }
        helper.addOnClickListener(R.id.icon_hand,R.id.icon_share);

    }

    private void convertDynamic(final BaseViewHolder helper, final NewestShowGroundBean.DataBean item) {
        final TextView content = helper.getView(R.id.content);

        final SimpleDraweeView userIcon = helper.getView(R.id.user_icon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserInfoVO().getUserImg();
        if (!TextUtils.equals(userUrl, userTag)) {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
            userIcon.setTag(userUrl);
        }

        if (!TextUtils.isEmpty(item.getPublishTimeStr())) {
            TextView publishTime = helper.getView(R.id.publish_time);
            publishTime.setText(item.getPublishTimeStr());
        }

        String titleStr = item.getContent();
        if (titleStr != null && titleStr.trim().length() > 0) {
            content.setText(titleStr);
        } else {
            content.setVisibility(View.GONE);
        }

        TextView name = helper.getView(R.id.user_name);
        name.setText(item.getUserInfoVO().getUserName());

        TextView download = helper.getView(R.id.download_num);

        download.setText(item.getDownloadCount()+"");

        TextView like = helper.getView(R.id.like_num);
        like.setText(item.getLikesCount()+"");

        NineGridView nineGridView = helper.getView(R.id.nine_grid);
        nineGridView.setSingleImageRatio((float)( 19/12.0));
        nineGridView.setSingleImageRatio(ScreenUtils.getScreenWidth()-DensityUtils.px2dip(185));
        List<ImageInfo> imageInfoList = new ArrayList<>();
        if (item.getResource() != null) {
            for (int i = 0; i < item.getResource().size(); i++) {
                if(item.getResource().get(i).getType() == 2){
                    String url = item.getResource().get(i).getUrl();
                    ImageInfo info = new ImageInfo();
                    info.setImageUrl(url);
                    imageInfoList.add(info);
                }
            }
        }

        if (this.clickL != null) {
            nineGridView.setClick(clickL);
        }
        NineGridViewAdapter adapter = new NineGridViewAdapter(mContext, imageInfoList);
        nineGridView.setAdapter(adapter);

        RecyclerView recyclerView = helper.getView(R.id.product_list);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(mContext);
        linearLayoutManager.setOrientation(OrientationHelper.HORIZONTAL);
        recyclerView.setLayoutManager(linearLayoutManager);

        if(item.getProducts() != null){
            ProductsAdapter productsAdapter = new ProductsAdapter(item.getProducts());

            if (this.addCartListener != null) {
                productsAdapter.setAddCartListener(addCartListener);
            }
            if(this.pressProductListener != null){
                productsAdapter.setPressProductListener(this.pressProductListener);
            }
            recyclerView.setVisibility(View.VISIBLE);
            recyclerView.setAdapter(productsAdapter);
        }else {
            recyclerView.setVisibility(View.GONE);
        }

        helper.addOnClickListener(R.id.icon_hand,R.id.icon_download,R.id.icon_share);


        ImageView hand = helper.getView(R.id.icon_hand);
        if(item.isLike()){
            hand.setImageResource(R.drawable.icon_like);
        }else {
            hand.setImageResource(R.drawable.icon_hand);
        }
    }


}
