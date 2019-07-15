package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;


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

    }

    public final class  MyHolder extends BaseVideoListAdapter.BaseHolder {
        private SimpleDraweeView thumb;
        public FrameLayout playerView;
        private ViewGroup mRootView;

        MyHolder(@NonNull View itemView) {
            super(itemView);
            Log.d(TAG,"new PlayerManager");
            thumb = itemView.findViewById(R.id.img_thumb);
            playerView = itemView.findViewById(R.id.player_view);
            mRootView = itemView.findViewById(R.id.root_view);
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
