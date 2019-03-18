package com.meeruu.sharegoods.ui.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.customview.loopbanner.BannerLayout;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.R;

import java.util.List;

/**
 * Created by test on 2017/11/22.
 */


public class WebBannerAdapter extends RecyclerView.Adapter<WebBannerAdapter.MzViewHolder> {

    private List<String> urlList;
    private BannerLayout.OnBannerItemClickListener onBannerItemClickListener;
    private int itemWidth;
    private int radius;

    public WebBannerAdapter(Context context, List urlList) {
        this.urlList = urlList;
    }

    public void setUrlList(List<String> urls) {
        if (this.urlList != null) {
            this.urlList.clear();
            if (urls != null) {
                this.urlList.addAll(urls);
            }
        } else {
            this.urlList = urls;
        }
        notifyDataSetChanged();
    }

    public void setItemWidth(int itemWidth) {
        this.itemWidth = itemWidth;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public void setOnBannerItemClickListener(BannerLayout.OnBannerItemClickListener onBannerItemClickListener) {
        this.onBannerItemClickListener = onBannerItemClickListener;
    }

    @Override
    public WebBannerAdapter.MzViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        return new MzViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_mr_banner, parent, false));
    }

    @Override
    public void onBindViewHolder(final WebBannerAdapter.MzViewHolder holder, final int position) {
        if (urlList == null || urlList.isEmpty())
            return;
        final int realPos = position % urlList.size();
        String url = urlList.get(realPos);
        SimpleDraweeView imageView = holder.imageView;
        RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) holder.parent.getLayoutParams();
        params.width = this.itemWidth;
        holder.parent.setLayoutParams(params);
        imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onBannerItemClickListener != null) {
                    onBannerItemClickListener.onItemClick(realPos);
                }
            }
        });
        ImageLoadUtils.loadRoundNetImage(url, imageView, this.radius);
    }

    @Override
    public int getItemCount() {
        if (urlList != null) {
            return urlList.size();
        }
        return 0;
    }


    class MzViewHolder extends RecyclerView.ViewHolder {
        SimpleDraweeView imageView;
        LinearLayout parent;

        MzViewHolder(View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.iv_banner);
            parent = itemView.findViewById(R.id.img_parent);
        }
    }
}
