package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;


import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.VideoListBean;

import java.util.List;

public class LittleVideoListAdapter extends BaseVideoListAdapter<LittleVideoListAdapter.MyHolder, VideoListBean>{

    public static final String TAG = LittleVideoListAdapter.class.getSimpleName();
//    private OnItemBtnClick mItemBtnClick;
    public LittleVideoListAdapter(Context context,
                                  List<VideoListBean> urlList) {
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
        textView.setPadding(8,0,8,0);
        textView.setGravity(Gravity.CENTER);
        textView.setBackgroundResource(R.drawable.tag_background);
        LinearLayout.LayoutParams tvParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, 24);
        textView.setLayoutParams(tvParam);
        myHolder.tagWrapper.removeAllViews();
        myHolder.tagWrapper.addView(textView);
    }

    public final class  MyHolder extends BaseVideoListAdapter.BaseHolder {
        private SimpleDraweeView thumb;
        public FrameLayout playerView;
        private ViewGroup mRootView;
        private ViewGroup tagWrapper;
        MyHolder(@NonNull View itemView) {
            super(itemView);
            thumb = itemView.findViewById(R.id.img_thumb);
            playerView = itemView.findViewById(R.id.player_view);
            mRootView = itemView.findViewById(R.id.root_view);
            tagWrapper = itemView.findViewById(R.id.tag_wrapper);
        }

        @Override
        public SimpleDraweeView getCoverView() {
            return thumb;
        }

        @Override
        public ViewGroup getContainerView() {
            return mRootView;
        }

    }
}
