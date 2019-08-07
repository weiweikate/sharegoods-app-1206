package com.reactnative.ivpusic.imagepicker.picture.lib.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PointF;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.viewpager.widget.PagerAdapter;

import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.reactnative.ivpusic.imagepicker.R;
import com.reactnative.ivpusic.imagepicker.picture.lib.PictureVideoPlayActivity;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureConfig;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureMimeType;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMedia;
import com.reactnative.ivpusic.imagepicker.picture.lib.photoview.OnViewTapListener;
import com.reactnative.ivpusic.imagepicker.picture.lib.photoview.PhotoView;
import com.reactnative.ivpusic.imagepicker.picture.lib.widget.longimage.ImageSource;
import com.reactnative.ivpusic.imagepicker.picture.lib.widget.longimage.ImageViewState;
import com.reactnative.ivpusic.imagepicker.picture.lib.widget.longimage.SubsamplingScaleImageView;

import java.util.List;

/**
 * @author：luck
 * @data：2018/1/27 下午7:50
 * @描述:图片预览
 */

public class SimpleFragmentAdapter extends PagerAdapter {
    private List<LocalMedia> images;
    private Context mContext;
    private OnCallBackActivity onBackPressed;
    private SimpleFragmentAdapterInterface simpleFragmentAdapterInterface;

    public interface OnCallBackActivity {
        /**
         * 关闭预览Activity
         */
        void onActivityBackPressed();
    }

    public SimpleFragmentAdapter(List<LocalMedia> images, Context context,
                                 OnCallBackActivity onBackPressed, SimpleFragmentAdapterInterface simpleFragmentAdapterInterface) {
        super();
        this.images = images;
        this.mContext = context;
        this.onBackPressed = onBackPressed;
        this.simpleFragmentAdapterInterface = simpleFragmentAdapterInterface;
    }

    @Override
    public int getCount() {
        if (images != null) {
            return images.size();
        }
        return 0;
    }

    @Override
    public int getItemPosition(@NonNull Object object) {
        if (simpleFragmentAdapterInterface == null) {
            return super.getItemPosition(object);
        }
        String tag = (String) ((View) object).getTag();
        String path = images.get(simpleFragmentAdapterInterface.getCurrentIndex()).getPath();
        if (TextUtils.equals(tag, path)) {
            return super.getItemPosition(object);
        } else {
            return POSITION_NONE;
        }
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        (container).removeView((View) object);
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == object;
    }

    @Override
    public Object instantiateItem(ViewGroup container, int position) {
        final View contentView = LayoutInflater.from(container.getContext())
                .inflate(R.layout.picture_image_preview, container, false);
        // 常规图控件
        final PhotoView imageView = (PhotoView) contentView.findViewById(R.id.preview_image);
        // 长图控件
        final SubsamplingScaleImageView longImg = (SubsamplingScaleImageView) contentView.findViewById(R.id.longImg);

        ImageView iv_play = (ImageView) contentView.findViewById(R.id.iv_play);
        LocalMedia media = images.get(position);
        if (media != null) {
            final String pictureType = media.getPictureType();
            boolean eqVideo = pictureType.startsWith(PictureConfig.VIDEO);
            iv_play.setVisibility(eqVideo ? View.VISIBLE : View.GONE);
            final String path;
            if (media.isCut() && !media.isCompressed()) {
                // 裁剪过
                path = media.getCutPath();
            } else if (media.isCompressed() || (media.isCut() && media.isCompressed())) {
                // 压缩过,或者裁剪同时压缩过,以最终压缩过图片为准
                path = media.getCompressPath();
            } else {
                path = media.getPath();
            }
            boolean isGif = PictureMimeType.isGif(pictureType);
            final boolean eqLongImg = PictureMimeType.isLongImg(media);
            imageView.setVisibility(eqLongImg && !isGif ? View.GONE : View.VISIBLE);
            longImg.setVisibility(eqLongImg && !isGif ? View.VISIBLE : View.GONE);
            // 压缩过的gif就不是gif了
            if (isGif && !media.isCompressed()) {
                ImageLoadUtils.loadGif(Uri.parse(path), imageView);
            } else {
                if (eqLongImg) {
                    Bitmap bmp = BitmapFactory.decodeFile(path, BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        displayLongPic(bmp, longImg);
                    }
                } else {
                    ImageLoadUtils.loadImageFile(path, imageView);
                }
            }
            imageView.setOnViewTapListener(new OnViewTapListener() {
                @Override
                public void onViewTap(View view, float x, float y) {
                    if (onBackPressed != null) {
                        onBackPressed.onActivityBackPressed();
                    }
                }
            });
            longImg.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (onBackPressed != null) {
                        onBackPressed.onActivityBackPressed();
                    }
                }
            });
            iv_play.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent();
                    Bundle bundle = new Bundle();
                    bundle.putString("video_path", path);
                    intent.putExtras(bundle);
                    intent.setClass(mContext, PictureVideoPlayActivity.class);
                    mContext.startActivity(intent);
                }
            });
        }
        (container).addView(contentView, 0);
        container.setTag(media.getPath());
        return contentView;
    }

    /**
     * 加载长图
     *
     * @param bmp
     * @param longImg
     */
    private void displayLongPic(Bitmap bmp, SubsamplingScaleImageView longImg) {
        longImg.setQuickScaleEnabled(true);
        longImg.setZoomEnabled(true);
        longImg.setPanEnabled(true);
        longImg.setDoubleTapZoomDuration(100);
        longImg.setMinimumScaleType(SubsamplingScaleImageView.SCALE_TYPE_CENTER_CROP);
        longImg.setDoubleTapZoomDpi(SubsamplingScaleImageView.ZOOM_FOCUS_CENTER);
        longImg.setImage(ImageSource.cachedBitmap(bmp), new ImageViewState(0, new PointF(0, 0), 0));
    }

    public interface SimpleFragmentAdapterInterface {
        int getCurrentIndex();
    }
}
