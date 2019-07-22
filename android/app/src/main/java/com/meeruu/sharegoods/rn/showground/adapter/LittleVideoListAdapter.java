package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.NonNull;
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
                                  List<NewestShowGroundBean.DataBean> urlList) {
        super(context, urlList);
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
        TextView textView = new TextView(context);
        textView.setTextColor(Color.WHITE);
        textView.setTextSize(12);
        textView.setText("#夏季防晒指南");
        int pad = DensityUtils.dip2px(8);
        textView.setPadding(pad,0,pad,0);
        textView.setGravity(Gravity.CENTER);
        textView.setBackgroundResource(R.drawable.tag_background);
        LinearLayout.LayoutParams tvParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, DensityUtils.dip2px(24));
        textView.setLayoutParams(tvParam);
        myHolder.tagWrapper.removeAllViews();
        myHolder.tagWrapper.addView(textView);
        myHolder.previewWrapper.setVisibility(View.VISIBLE);
        myHolder.detailWrapper.setVisibility(View.INVISIBLE);
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
            detailWrapper = itemView.findViewById(R.id.video_text_open);
            previewWrapper = itemView.findViewById(R.id.video_text_close);
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
