package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.graphics.Point;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public abstract class BaseVideoListAdapter<VH extends BaseVideoListAdapter.BaseHolder> extends RecyclerView.Adapter<VH> {

    public static final String TAG = BaseVideoListAdapter.class.getSimpleName();
    protected List<NewestShowGroundBean.DataBean> list;
    protected Context context;
    private Point mScreenPoint = new Point();

    public BaseVideoListAdapter(Context context, List<NewestShowGroundBean.DataBean> urlList) {
        this.context = context;
        this.list = urlList;
        //获取屏幕宽高
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        mScreenPoint.x = displayMetrics.widthPixels;
        mScreenPoint.y = displayMetrics.heightPixels;

    }

    public BaseVideoListAdapter(Context context) {
        this(context, new ArrayList<NewestShowGroundBean.DataBean>());
    }


    @Override
    public void onBindViewHolder(final VH holder, int position) {

        Log.d(TAG, "onBindViewHolder position:" + position);
        final NewestShowGroundBean.DataBean video = list.get(position);
        List<NewestShowGroundBean.DataBean.ResourceBean> resource = video.getResource();
        String cover = null;
        if (resource != null) {
            for (int j = 0; j < resource.size(); j++) {
                NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                if (resourceBean.getType() == 5) {
                    cover = resourceBean.getBaseUrl();
                    break;
                }
            }
        }

        final SimpleDraweeView iv = holder.getCoverView();
        String tag = (String) iv.getTag();

        if (!TextUtils.equals(cover, tag)) {
            iv.setTag(cover);
            ImageLoadUtils.loadScaleTypeNetImage(cover, iv, ScalingUtils.ScaleType.FIT_CENTER, true);
        }

//        new ImageLoaderImpl().loadImage(context, coverPath, new ImageLoaderOptions.Builder()
//                .asBitmap()
//                .placeholder(android.R.color.black)
//                .thumbnail(0.1f)
//                .build()
//        ).listener(new ImageLoaderRequestListener<Bitmap>() {
//            @Override
//            public boolean onLoadFailed(String exception, boolean isFirstResource) {
//                return false;
//            }
//
//            @Override
//            public boolean onResourceReady(Bitmap resource, boolean isFirstResource) {
//                float aspectRatio = (float)resource.getWidth() / resource.getHeight();
//                float screenRatio = mScreenPoint.x / (float)mScreenPoint.y;
//                Log.d(TAG, "aspectRatio : " + aspectRatio + " ,screenRatio : " + screenRatio + "\n mScreenPoint : " + mScreenPoint.toString());
//                if (aspectRatio <= (9f / 16f + 0.01) && aspectRatio >= (9f / 16f - 0.01) //考虑到float值不精确的原因取一个范围值 视频比例 = 9/16
//                        && (screenRatio < 9f / 16f - 0.01) //屏幕宽高比例小于9/16(长手机)
//                ) {
//                    float height = holder.getContainerView().getHeight();
//                    float width = height * resource.getWidth() / resource.getHeight();
//                    ViewGroup.LayoutParams layoutParams = iv.getLayoutParams();
//                    layoutParams.width = (int)width;
//                    layoutParams.height = (int)height;
//                    iv.setLayoutParams(layoutParams);
//
//                } else {
//                    //获取屏幕宽度
//                    float screenWith = mScreenPoint.x;
//                    ViewGroup.LayoutParams layoutParams = iv.getLayoutParams();
//                    //获取imageview的高度
//                    float height = screenWith * resource.getHeight() / resource.getWidth();
//                    layoutParams.width = (int)screenWith;
//                    layoutParams.height = (int)height;
//                    iv.setLayoutParams(layoutParams);
//                    Log.d(TAG, "bitmap width : " + screenWith + " height : " + height);
//                }
//                return false;
//            }
//        }).into(iv);

    }

    @Override
    public int getItemCount() {
        return list != null ? list.size() : 0;
    }

    /**
     * 刷新数据
     *
     * @param list
     */
    public void refreshData(List<NewestShowGroundBean.DataBean> list) {
        this.list.clear();
        this.list.addAll(list);
        notifyDataSetChanged();
    }

    public void replaceData(@NonNull Collection<NewestShowGroundBean.DataBean> data) {
        // 不是同一个引用才清空列表
        if (data != list) {
            list.clear();
            list.addAll(data);
        }
        notifyDataSetChanged();
    }

    /**
     * 添加数据
     *
     * @param list
     */
    public void addMoreData(List<NewestShowGroundBean.DataBean> list) {
        this.list.addAll(list);
        notifyItemRangeInserted(this.list.size() - list.size(), list.size());
    }

    public List<NewestShowGroundBean.DataBean> getDataList() {
        return list;
    }

    public abstract class BaseHolder extends RecyclerView.ViewHolder {
        public BaseHolder(View itemView) {
            super(itemView);
        }

        public abstract SimpleDraweeView getCoverView();

        public abstract ImageView getPlayIcon();

        public abstract ViewGroup getContainerView();
    }
}
