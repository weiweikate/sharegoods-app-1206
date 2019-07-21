package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.LayoutInflater;
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
import com.meeruu.sharegoods.rn.showground.utils.NumUtils;

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

    private VideoListCallback videoListCallback;

    public void setVideoListCallback(VideoListCallback callback){
        this.videoListCallback = callback;
    }

    @NonNull
    @Override
    public LittleVideoListAdapter.MyHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View inflate = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_view_pager, viewGroup, false);
        return new MyHolder(inflate);
    }

    @Override
    public void onBindViewHolder(@NonNull MyHolder holder, int position, @NonNull List<Object> payloads) {
//        super.onBindViewHolder(holder, position, payloads);
        if (payloads.isEmpty()) {
            onBindViewHolder(holder, position);
        } else {
            final NewestShowGroundBean.DataBean itemData = this.list.get(position);
            if(itemData.isLike()){
                holder.ivLike.setImageResource(R.mipmap.icon_liked);
            }else {
                holder.ivLike.setImageResource(R.mipmap.icon_like);
            }
        }
    }

    @Override
    public void onBindViewHolder(@NonNull final MyHolder myHolder, final int position) {
        super.onBindViewHolder(myHolder, position);
        final NewestShowGroundBean.DataBean itemData = this.list.get(position);


        List<NewestShowGroundBean.DataBean.ShowTagsBean> showTagsBeanList = itemData.getShowTags();

        //标签
        if(showTagsBeanList == null || showTagsBeanList.size() == 0){
            myHolder.tagWrapper.setVisibility(View.GONE);
        }else {
            myHolder.tagWrapper.setVisibility(View.VISIBLE);
            myHolder.tagWrapper.removeAllViews();
            for(int i = 0;i<showTagsBeanList.size();i++){
                final NewestShowGroundBean.DataBean.ShowTagsBean showTagsBean = showTagsBeanList.get(i);
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
                textView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(videoListCallback != null){
                            videoListCallback.onTag(showTagsBean,position);
                        }
                    }
                });
                myHolder.tagWrapper.addView(textView);
            }
        }
        myHolder.collection.setText(NumUtils.formatShowNum(itemData.getCollectCount()));
        myHolder.collection.setTag(itemData.getCollectCount());
        myHolder.download.setText(NumUtils.formatShowNum(itemData.getDownloadCount()));
        myHolder.download.setTag(itemData.getDownloadCount());
        myHolder.like.setText(NumUtils.formatShowNum(itemData.getLikesCount()));
        myHolder.like.setTag(itemData.getLikesCount());

        if(itemData.isLike()){
            myHolder.ivLike.setImageResource(R.mipmap.icon_liked);
        }else {
            myHolder.ivLike.setImageResource(R.mipmap.icon_like);
        }
        myHolder.ivLike.setTag(itemData.isLike());

        if(itemData.getProducts() == null || itemData.getProducts().size() == 0){
            myHolder.line.setVisibility(View.GONE);
            myHolder.tvBuy.setVisibility(View.GONE);
        }else {
            myHolder.line.setVisibility(View.VISIBLE);
            myHolder.tvBuy.setVisibility(View.VISIBLE);
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

        myHolder.ivDownload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(videoListCallback != null){
                    videoListCallback.onDownload(itemData,position);
                }
            }
        });

        myHolder.ivCollection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(videoListCallback != null){
                    videoListCallback.onLike(itemData,position);
                }
            }
        });

        myHolder.ivLike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean isLike = (Boolean) myHolder.ivLike.getTag();
                if(isLike){
                    myHolder.ivLike.setTag(Boolean.FALSE);
                    myHolder.ivLike.setImageResource(R.mipmap.icon_like);
                    int like = (Integer) myHolder.like.getTag();
                    like-=1;
                    myHolder.like.setTag(like);
                    myHolder.like.setText(NumUtils.formatShowNum(like));
                }else {
                    myHolder.ivLike.setTag(Boolean.TRUE);
                    myHolder.ivLike.setImageResource(R.mipmap.icon_liked);
                    int like = (Integer) myHolder.like.getTag();
                    like+=1;
                    myHolder.like.setTag(like);
                    myHolder.like.setText(NumUtils.formatShowNum(like));
                }

                if(videoListCallback != null){
                    videoListCallback.onLike(itemData,position);
                }
            }
        });

        myHolder.ivCollection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean isCollectioned =(Boolean) myHolder.ivCollection.getTag();
                if(isCollectioned){
                    myHolder.ivLike.setTag(Boolean.FALSE);
                    myHolder.ivLike.setImageResource(R.mipmap.icon_like);
                    int like = (Integer) myHolder.like.getTag();
                    like-=1;
                    myHolder.like.setTag(like);
                    myHolder.like.setText(NumUtils.formatShowNum(like));
                }else {
                    myHolder.ivLike.setTag(Boolean.TRUE);
                    myHolder.ivLike.setImageResource(R.mipmap.icon_liked);
                    int like = (Integer) myHolder.like.getTag();
                    like+=1;
                    myHolder.like.setTag(like);
                    myHolder.like.setText(NumUtils.formatShowNum(like));
                }
            }
        });

        myHolder.tvBuy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(videoListCallback != null){
                    videoListCallback.onBuy(itemData,position);
                }
            }
        });
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
        private TextView tvBuy;
        private View line;
        private ImageView ivLike,ivCollection,ivDownload;
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
            ivDownload = itemView.findViewById(R.id.iv_download);
            tvBuy = itemView.findViewById(R.id.tv_buy);
            line = itemView.findViewById(R.id.line);
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

    public interface VideoListCallback{
        void onDownload(NewestShowGroundBean.DataBean dataBean,int position);
        void onCollection(NewestShowGroundBean.DataBean dataBean,int position);
        void onLike(NewestShowGroundBean.DataBean dataBean,int position);
        void onTag(NewestShowGroundBean.DataBean.ShowTagsBean tagsBean,int position);
        void onBuy(NewestShowGroundBean.DataBean dataBean,int position);
    }
}
