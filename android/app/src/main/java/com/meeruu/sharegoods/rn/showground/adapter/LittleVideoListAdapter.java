package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;


import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoListBean;

import java.util.List;

public class LittleVideoListAdapter extends BaseVideoListAdapter<LittleVideoListAdapter.MyHolder>{

    public static final String TAG = LittleVideoListAdapter.class.getSimpleName();
//    private OnItemBtnClick mItemBtnClick;
    public LittleVideoListAdapter(Context context,
                                  List<NewestShowGroundBean.DataBean> list) {
        super(context, list);
    }

    public LittleVideoListAdapter(Context context) {
        super(context);
    }

    @NonNull
    @Override
    public LittleVideoListAdapter.MyHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View inflate = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_view_pager, viewGroup, false);
        return new MyHolder(inflate);
    }

    @Override
    public void onBindViewHolder(@NonNull MyHolder myHolder, final int position) {
        super.onBindViewHolder(myHolder, position);
        NewestShowGroundBean.DataBean itemData = this.list.get(position);


        List<NewestShowGroundBean.DataBean.ShowTagsBean> showTagsBeanList = itemData.getShowTags();

        //标签
        if(showTagsBeanList == null || showTagsBeanList.size() == 0){
            myHolder.tagWrapper.setVisibility(View.GONE);
        }else {
            myHolder.tagWrapper.setVisibility(View.VISIBLE);
            myHolder.tagWrapper.removeAllViews();
            for(int i = 0;i<showTagsBeanList.size();i++){
                NewestShowGroundBean.DataBean.ShowTagsBean showTagsBean = showTagsBeanList.get(i);
                TextView textView = new TextView(context);
                textView.setTextColor(Color.WHITE);
                textView.setTextSize(12);
                textView.setText("#"+showTagsBean.getName());
                int pad = DensityUtils.dip2px(8);
                textView.setPadding(pad,0,pad,0);
                textView.setGravity(Gravity.CENTER);
                textView.setBackgroundResource(R.drawable.tag_background);
                LinearLayout.LayoutParams tvParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, DensityUtils.dip2px(24));
                int margin = DensityUtils.dip2px(10);
                tvParam.setMargins(i== 0 ? 0: margin,0,0,0);
                textView.setLayoutParams(tvParam);
                myHolder.tagWrapper.addView(textView);
            }
        }





        myHolder.collection.setText(itemData.getCollectCount()+"");
        myHolder.download.setText(itemData.getDownloadCount()+"");
        myHolder.like.setText(itemData.getLikesCount()+"");

        if(itemData.isLike()){
            myHolder.ivLike.setImageResource(R.mipmap.icon_liked);
        }else {
            myHolder.ivLike.setImageResource(R.mipmap.icon_like);
        }

        if(itemData.isCollect()){
            myHolder.ivCollection.setImageResource(R.mipmap.icon_collected);
        }else {
            myHolder.ivCollection.setImageResource(R.mipmap.icon_collection);
        }

        String content = itemData.getContent();
        if(TextUtils.isEmpty(content)){
            myHolder.previewWrapper.setVisibility(View.GONE);
            myHolder.detailWrapper.setVisibility(View.GONE);
        }else {
            myHolder.previewWrapper.setVisibility(View.VISIBLE);
            myHolder.detailWrapper.setVisibility(View.INVISIBLE);
            myHolder.tvDetail.setText(content);
            myHolder.previewDetail.setText(content);
        }

    }

    public final class  MyHolder extends BaseVideoListAdapter.BaseHolder {
        private SimpleDraweeView thumb;
        public FrameLayout playerView;
        private ViewGroup mRootView;
        private ViewGroup tagWrapper;
        private ViewGroup detailWrapper,previewWrapper;
        private TextView tvDetail;
        private TextView previewDetail;
        private TextView close,open;
        private ImageView playIcon;
        private TextView like,download,collection;
        private ImageView ivLike,ivCollection;
        MyHolder(@NonNull View itemView) {
            super(itemView);
            thumb = itemView.findViewById(R.id.img_thumb);
            playIcon = itemView.findViewById(R.id.iv_play_icon);
            playerView = itemView.findViewById(R.id.player_view);
            mRootView = itemView.findViewById(R.id.root_view);
            tagWrapper = itemView.findViewById(R.id.tag_wrapper);
            tvDetail = itemView.findViewById(R.id.tv_detail);
            previewDetail = itemView.findViewById(R.id.preview_detail);
            close = itemView.findViewById(R.id.tv_close);
            open = itemView.findViewById(R.id.tv_open);
            like = itemView.findViewById(R.id.tv_like);
            download = itemView.findViewById(R.id.tv_download);
            collection = itemView.findViewById(R.id.tv_collection);
            detailWrapper = itemView.findViewById(R.id.video_text_open);
            previewWrapper = itemView.findViewById(R.id.video_text_close);
            ivLike = itemView.findViewById(R.id.iv_like);
            ivCollection = itemView.findViewById(R.id.iv_collection);
            open.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    previewWrapper.setVisibility(View.INVISIBLE);
                    detailWrapper.setVisibility(View.VISIBLE);
                }
            });
            close.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    detailWrapper.setVisibility(View.INVISIBLE);
                    previewWrapper.setVisibility(View.VISIBLE);
                }
            });


        }

        @Override
        public SimpleDraweeView getCoverView() {
            return thumb;
        }

        @Override
        public ViewGroup getContainerView() {
            return mRootView;
        }

        @Override
        public ImageView getPlayIcon() {
            return playIcon;
        }
    }
}
