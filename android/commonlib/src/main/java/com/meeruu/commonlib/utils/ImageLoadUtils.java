package com.meeruu.commonlib.utils;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.DrawableRes;
import android.text.TextUtils;
import android.view.ViewTreeObserver;

import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.generic.RoundingParams;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.meeruu.commonlib.R;
import com.meeruu.commonlib.base.BaseApplication;

public class ImageLoadUtils {

    private static RoundingParams roundParams;

    static {
        roundParams = new RoundingParams();
    }


    public static void loadImageRes(Context context, @DrawableRes int resId, SimpleDraweeView view) {
        Uri uri = Uri.parse("res://" + context.getPackageName() + "/" + resId);
        loadImage(uri, view, 0);
    }

    public static void loadImageResAsCircle(Context context, @DrawableRes int resId, SimpleDraweeView view) {
        Uri uri = Uri.parse("res://" + context.getPackageName() + "/" + resId);
        loadImageAsCircle(uri, view);
    }

    public static void loadImageFile(String filePath, SimpleDraweeView view) {
        Uri uri = Uri.parse("file://" + filePath);
        loadImage(uri, view, 0);
    }

    public static void loadImageFileAsCircle(String filePath, SimpleDraweeView view) {
        Uri uri = Uri.parse("file://" + filePath);
        loadImageAsCircle(uri, view);
    }

    public static void loadNetImage(final String url, final SimpleDraweeView view) {
        view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            boolean hasMeasured = false;

            @Override
            public boolean onPreDraw() {
                if (!hasMeasured) {
                    int width = view.getMeasuredWidth();
                    int height = view.getMeasuredHeight();
                    String newUrl = url;
                    if (width != 0 || height != 0) {
                        if (!TextUtils.isEmpty(newUrl)) {
                            newUrl = String.format(ParameterUtils.IMG_URL_WH, url, width, height);
                        }
                    }
                    Uri uri = Uri.parse(newUrl);
                    loadImage(uri, view, 0);
                    view.getViewTreeObserver().removeOnPreDrawListener(this);
                    hasMeasured = true;
                }
                return true;
            }
        });
    }

    public static void loadRoundNetImage(final String url, final SimpleDraweeView view, final int radius) {
        view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            boolean hasMeasured = false;

            @Override
            public boolean onPreDraw() {
                if (!hasMeasured) {
                    int width = view.getMeasuredWidth();
                    int height = view.getMeasuredHeight();
                    String newUrl = url;
                    if (width != 0 || height != 0) {
                        if (!TextUtils.isEmpty(newUrl)) {
                            newUrl = String.format(ParameterUtils.IMG_URL_WH, url, width, height);
                        }
                    }
                    Uri uri = Uri.parse(newUrl);
                    loadImage(uri, view, radius);
                    view.getViewTreeObserver().removeOnPreDrawListener(this);
                    hasMeasured = true;
                }
                return true;
            }
        });
    }

    public static void loadNetImageAsCircle(String url, SimpleDraweeView view) {
        Uri uri = Uri.parse(url);
        loadImageAsCircle(uri, view);
    }

    public static void loadImage(Uri uri, SimpleDraweeView view, int radius) {
        roundParams.setCornersRadius(radius);
        GenericDraweeHierarchy hierarchy =
                new GenericDraweeHierarchyBuilder(BaseApplication.appContext.getResources())
                        .setFadeDuration(300)
                        .setRoundingParams(roundParams)
                        .setPlaceholderImage(R.drawable.bg_app_img)
                        .setPlaceholderImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .setActualImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .build();
        view.setHierarchy(hierarchy);
        view.setImageURI(uri);
    }

    public static void loadImage(Uri uri, SimpleDraweeView view, int radius, ControllerListener listener) {
        roundParams.setCornersRadius(radius);
        GenericDraweeHierarchy hierarchy =
                new GenericDraweeHierarchyBuilder(BaseApplication.appContext.getResources())
                        .setFadeDuration(300)
                        .setRoundingParams(roundParams)
                        .setPlaceholderImage(R.drawable.bg_app_img)
                        .setPlaceholderImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .setActualImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .build();
        view.setHierarchy(hierarchy);
        view.setController(Fresco.newDraweeControllerBuilder().setUri(uri).setControllerListener(listener).build());
    }

    public static void downloadImage(Uri uri, BaseBitmapDataSubscriber subscriber) {
        ImageRequest imageRequest = ImageRequestBuilder
                .newBuilderWithSource(uri)
                .disableDiskCache()
                .setProgressiveRenderingEnabled(true)//渐进渲染
                .build();
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, BaseApplication.appContext);
        dataSource.subscribe(subscriber, CallerThreadExecutor.getInstance());
    }

    /**
     * 加载图片为圆形图片
     *
     * @param uri  图片的uri
     * @param view 要加载的视图
     */
    public static void loadImageAsCircle(Uri uri, SimpleDraweeView view) {
        roundParams.setRoundAsCircle(true);
        GenericDraweeHierarchy hierarchy =
                new GenericDraweeHierarchyBuilder(BaseApplication.appContext.getResources())
                        .setFadeDuration(300)
                        .setRoundingParams(roundParams)
                        .setPlaceholderImage(R.drawable.bg_app_img)
                        .setPlaceholderImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .setActualImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .build();
        view.setHierarchy(hierarchy);
        view.setImageURI(uri);
    }

    /**
     * 加载Gif资源
     *
     * @param resId Gif的资源Id
     * @param view  要填充的View
     */
    public static void loadGifRes(Context context, @DrawableRes int resId, SimpleDraweeView view) {
        Uri uri = Uri.parse("res://" + context.getPackageName() + "/" + resId);
        loadGif(uri, view);
    }

    /**
     * 加载Gif文件
     *
     * @param filePath Gif的路径
     * @param view     要填充的View
     */
    public static void loadGifFile(String filePath, SimpleDraweeView view) {
        Uri uri = Uri.parse("file://" + filePath);
        loadGif(uri, view);
    }

    /**
     * 加载网络Gif
     *
     * @param url  Gif的URI
     * @param view 要填充的View
     */
    public static void loadNetGif(String url, SimpleDraweeView view) {
        Uri uri = Uri.parse(url);
        loadGif(uri, view);
    }

    /**
     * 加载Gif
     *
     * @param uri  Gif的URI
     * @param view 要填充的View
     */
    public static void loadGif(Uri uri, SimpleDraweeView view) {
        GenericDraweeHierarchy hierarchy =
                new GenericDraweeHierarchyBuilder(BaseApplication.appContext.getResources())
                        .setFadeDuration(300)
                        .setPlaceholderImage(R.drawable.bg_app_img)
                        .setPlaceholderImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .setActualImageScaleType(ScalingUtils.ScaleType.CENTER_CROP)
                        .build();
        DraweeController controller = Fresco.newDraweeControllerBuilder()
                .setUri(uri)
                .setRetainImageOnFailure(true)
                .setAutoPlayAnimations(true)
                .build();
        view.setHierarchy(hierarchy);
        view.setController(controller);
    }

    /**
     * 清除缓存
     *
     * @param uri 图片的URI
     */
    public static void clearDiskCache(Uri uri) {
        Fresco.getImagePipeline().evictFromDiskCache(uri);
    }

    public static void clearMemoryCache(Uri uri) {
        Fresco.getImagePipeline().evictFromMemoryCache(uri);
    }

    public static void clearCache(Uri uri) {
        clearDiskCache(uri);
        clearMemoryCache(uri);
    }

    /**
     * 清除文件的磁盘缓存
     *
     * @param path 文件路径
     */
    public static void clearFileDiskCache(String path) {
        Uri uri = Uri.parse("file://" + path);
        clearDiskCache(uri);
    }

    /**
     * 清除文件的内存缓存
     *
     * @param path 文件路径
     */
    public static void clearFileMemoryCache(String path) {
        Uri uri = Uri.parse("file://" + path);
        clearMemoryCache(uri);
    }

    /**
     * 清除文件的内存和磁盘缓存
     *
     * @param path 文件路径
     */
    public static void clearFileCache(String path) {
        Uri uri = Uri.parse("file://" + path);
        clearCache(uri);
    }

    /**
     * 清除网络图片的磁盘缓存
     *
     * @param url 链接
     */
    public static void clearUrlDiskCache(String url) {
        Uri uri = Uri.parse(url);
        clearDiskCache(uri);
    }

    /**
     * 清除网络图片的内存缓存
     *
     * @param url 图片链接
     */
    public static void clearUrlMemoryCache(String url) {
        Uri uri = Uri.parse(url);
        clearMemoryCache(uri);
    }

    /**
     * 清除网络图片的内存和磁盘缓存
     *
     * @param url 图片链接
     */
    public static void clearUrlCache(String url) {
        Uri uri = Uri.parse(url);
        clearCache(uri);
    }
}
