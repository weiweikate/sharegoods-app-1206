package com.meeruu.sharegoods.rn.showground.widgets.GridView;

import android.content.Context;
import android.widget.ImageView;

import com.facebook.drawee.view.SimpleDraweeView;

import java.io.Serializable;
import java.util.List;

public class NineGridViewAdapter implements Serializable {
    protected Context context;
    private List<ImageInfo> imageInfo;

    public NineGridViewAdapter(Context context, List<ImageInfo> imageInfo) {
        this.context = context;
        this.imageInfo = imageInfo;
    }

    /**
     * 如果要实现图片点击的逻辑，重写此方法即可
     *
     * @param context      上下文
     * @param nineGridView 九宫格控件
     * @param index        当前点击图片的的索引
     * @param imageInfo    图片地址的数据集合
     */
    protected void onImageItemClick(Context context, NineGridView nineGridView, int index, List<ImageInfo> imageInfo) {
    }

    /**
     * 生成ImageView容器的方式，
     * 如果需要自定义图片展示效果，重写此方法即可
     *
     * @param context 上下文
     * @return 生成的 ImageView
     */
    protected SimpleDraweeView generateImageView(Context context) {
        SimpleDraweeView imageView = new SimpleDraweeView(context);
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        return imageView;
    }

    public List<ImageInfo> getImageInfo() {
        return imageInfo;
    }

    public void setImageInfoList(List<ImageInfo> imageInfo) {
        this.imageInfo = imageInfo;
    }
}
