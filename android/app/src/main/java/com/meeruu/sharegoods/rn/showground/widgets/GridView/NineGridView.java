package com.meeruu.sharegoods.rn.showground.widgets.GridView;

import android.content.Context;
import android.content.res.TypedArray;
import android.support.annotation.NonNull;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.sharegoods.R;

import java.util.ArrayList;
import java.util.List;

public class NineGridView extends ViewGroup {
    // public static final int MODE_FILL = 0;          //填充模式，类似于微信
    // public static final int MODE_GRID = 1;          //网格模式，类似于QQ，4张图会 2X2布局

    private static ImageLoader mImageLoader;        //全局的图片加载器(必须设置,否则不显示图片)
    private clickL click;
    private int singleImageSize = 250;              // 单张图片时的最大大小,单位dp
    private float singleImageRatio = 1.0f;          // 单张图片的宽高比(宽/高)
    private int maxImageSize = 9;                   // 最大显示的图片数
    private int gridSpacing = 10;                    // 宫格间距，单位dp
    // private int mode = MODE_FILL;                   // 默认使用fill模式

    private int columnCount;    // 列数
    private int rowCount;       // 行数
    private int gridWidth;      // 宫格宽度
    private int gridHeight;     // 宫格高度

    private List<SimpleDraweeView> imageViews;
    private List<ImageInfo> mImageInfo;
    private NineGridViewAdapter mAdapter;

    public NineGridView(Context context) {
        this(context, null);
    }

    public NineGridView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public NineGridView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);

        DisplayMetrics dm = context.getResources().getDisplayMetrics();
        gridSpacing = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, gridSpacing, dm);

        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.NineGridView);
        gridSpacing = (int) a.getDimension(R.styleable.NineGridView_ngv_gridSpacing, gridSpacing);
        a.recycle();

        imageViews = new ArrayList<>();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        //控件总宽度
        int width = MeasureSpec.getSize(widthMeasureSpec);
        int height = 0;
        //为所有图片分配的总宽度，包括图片间距
        int totalWidth = width - getPaddingLeft() - getPaddingRight();
        if (mImageInfo != null && mImageInfo.size() > 0) {
            //只有1张图时 图片宽度即是总宽度  高度等于宽度
            if (mImageInfo.size() == 1) {
                gridWidth = (int)(totalWidth*0.8);
                gridHeight = gridWidth*12/19;
            } else {
                //按照有几列 来计算每张图片的宽度和高度
                //gridWidth 、gridHeight表示每张图片占据的宽、高
                gridWidth = gridHeight = (totalWidth - gridSpacing * (columnCount - 1)) / columnCount;
            }
            //此处width height就是我们即将为控件设置的总宽度 width可在layout中给定 height需要根据图片数量计算
            width = gridWidth * columnCount + gridSpacing * (columnCount - 1) + getPaddingLeft() + getPaddingRight();
            height = gridHeight * rowCount + gridSpacing * (rowCount - 1) + getPaddingTop() + getPaddingBottom();
            Log.d("yzp","wid  "+width+ "height   "+height);
        }
        setMeasuredDimension(width,height);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        if (mImageInfo == null) {return;}
        int childrenCount = mImageInfo.size();
        //根据图片数量 创建相应个数的imageview  并根据设定的imageview的宽高以及间距 ，将imageview放置在正确的位置
        for (int i = 0; i < childrenCount; i++) {
            //得到父控件中相应的imageview
            SimpleDraweeView childrenView = (SimpleDraweeView) getChildAt(i);
            int rowNum = i / columnCount;
            int columnNum = i % columnCount;
            int left = (gridWidth + gridSpacing) * columnNum + getPaddingLeft();
            int top = (gridHeight + gridSpacing) * rowNum + getPaddingTop();
            int right = left + gridWidth;
            int bottom = top + gridHeight;
            Log.d("yyy","left  "+left+"right "+right+ "top "+top+"bottom  "+bottom);
            childrenView.layout(left, top, right, bottom);
            //imageloader是接口，调用接口中的onDisplayImage方法绘制imageview 。在使用的地方调用setImageLoader方法
            //重写接口中的方法，可以使用不同的图片框架显示图片 如Glide Piccasso等
            if (mImageLoader != null) {
                mImageLoader.onDisplayImage(getContext(), childrenView, mImageInfo.get(i).imageUrl);
            }
        }
    }

    /** 设置适配器 */
    //等到adapter 得到需要显示的图片信息
    public void setAdapter(@NonNull NineGridViewAdapter adapter) {
        mAdapter = adapter;
        List<ImageInfo> imageInfo = adapter.getImageInfo();

        if (imageInfo == null || imageInfo.isEmpty()) {
            setVisibility(GONE);
            return;
        } else {
            setVisibility(VISIBLE);
        }

        int imageCount = imageInfo.size();
        if (maxImageSize > 0 && imageCount > maxImageSize) {
            imageInfo = imageInfo.subList(0, maxImageSize);
            imageCount = imageInfo.size();   //再次获取图片数量
        }

        //默认是3列显示，行数根据图片的数量决定
        rowCount = imageCount / 3 + (imageCount % 3 == 0 ? 0 : 1);
        columnCount = 3;
        //grid模式下，显示4张图片使用2X2模式
        if (imageCount == 4) {
            rowCount = 2;
            columnCount = 2;
        }
        //grid模式下，显示2张图片使用 2X1 模式

        if (imageCount == 2) {
            rowCount = 1;
            columnCount = 2;
        }
        if(imageCount ==1){
            rowCount =1;
            columnCount =1;
        }

        //保证View的复用，避免重复创建
        //mImageInfo=null 表示第一次创建
        if (mImageInfo == null) {
            for (int i = 0; i < imageCount; i++) {
                SimpleDraweeView iv = getImageView(i);
                if (iv == null) {return;}
                //添加相应个imageview到父控件 viewgroup中
                addView(iv, generateDefaultLayoutParams());
            }
        } else {
            //根据上次已有的imageview数量以及这次需要创建的imageview数量 移除或添加相应个数个imageview
            int oldViewCount = mImageInfo.size();
            int newViewCount = imageCount;
            if (oldViewCount > newViewCount) {
                removeViews(newViewCount, oldViewCount - newViewCount);
            } else if (oldViewCount < newViewCount) {
                for (int i = oldViewCount; i < newViewCount; i++) {
                    SimpleDraweeView iv = getImageView(i);
                    if (iv == null) {return;}
                    addView(iv, generateDefaultLayoutParams());
                }
            }
        }
        //修改最后一个条目，决定是否显示更多
        /*if (adapter.getImageInfo().size() > maxImageSize) {
            View child = getChildAt(maxImageSize - 1);
            if (child instanceof NineGridViewWrapper) {
                NineGridViewWrapper imageView = (NineGridViewWrapper) child;
                imageView.setMoreNum(adapter.getImageInfo().size() - maxImageSize);
            }
        }*/
        //将传过来的imageInfo信息赋给mImageInfo 用于判断下次是否需要全部创建
        mImageInfo = imageInfo;
        requestLayout();
    }

    /** 获得 ImageView 保证了 ImageView 的重用 */
    private SimpleDraweeView getImageView(final int position) {
        SimpleDraweeView imageView;
        if (position < imageViews.size()) {
            imageView = imageViews.get(position);
        } else {
            imageView = mAdapter.generateImageView(getContext());
            imageView.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    //  mAdapter.onImageItemClick(getContext(), NineGridView.this, position, mAdapter.getImageInfo());
                    if(click != null && mImageInfo != null){
                        List<String> list = new ArrayList<>();
                        for(int i = 0;i<  mImageInfo.size();i++){
                            String url =mImageInfo.get(i).getImageUrl();
                            list.add(url);
                        }
                        click.imageClick(list,position);
                    }
                }
            });
            imageViews.add(imageView);
        }
        return imageView;
    }

    /** 设置宫格间距 */
    public void setGridSpacing(int spacing) {
        gridSpacing = spacing;
    }

    /** 设置只有一张图片时的宽 */
    public void setSingleImageSize(int maxImageSize) {
        singleImageSize = maxImageSize;
    }

    /** 设置只有一张图片时的宽高比 */
    public void setSingleImageRatio(float ratio) {
        singleImageRatio = ratio;
    }

    /** 设置最大图片数 */
    public void setMaxSize(int maxSize) {
        maxImageSize = maxSize;
    }

    public int getMaxSize() {
        return maxImageSize;
    }

    public static void setImageLoader(ImageLoader imageLoader) {
        mImageLoader = imageLoader;
    }

    public static ImageLoader getImageLoader() {
        return mImageLoader;
    }

    public interface ImageLoader {
        /**
         * 需要子类实现该方法，以确定如何加载和显示图片
         *
         * @param context   上下文
         * @param imageView 需要展示图片的ImageView
         * @param url       图片地址
         */
        void onDisplayImage(Context context, SimpleDraweeView imageView, String url);

        /*  *//**
         * @param url 图片的地址
         * @return 当前框架的本地缓存图片
         *//*
        Bitmap getCacheImage(String url);*/
    }
    //设置图片的点击事件
    public  void setClick(clickL click){
        this.click=click;
    }
    public  interface  clickL{
        void imageClick(List urls , int index);
    }

}
