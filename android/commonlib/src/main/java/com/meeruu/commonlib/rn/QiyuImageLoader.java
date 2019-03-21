package com.meeruu.commonlib.rn;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Looper;

import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.UnicornImageLoader;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.annotation.Nullable;

@SuppressLint("StaticFieldLeak")
public class QiyuImageLoader implements UnicornImageLoader {
    private Context context;
    private ExecutorService executeBackgroundTask = Executors.newSingleThreadExecutor();

    public QiyuImageLoader(Context context) {
        this.context = context.getApplicationContext();
    }

    @Override
    public Bitmap loadImageSync(String uri, int width, int height) {
        Bitmap resultBitmap = null;
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        boolean inMemoryCache = imagePipeline.isInBitmapMemoryCache(Uri.parse(uri));
        if (inMemoryCache) {
            ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(Uri.parse(uri));
            if (width > 0 && height > 0) {
                builder.setResizeOptions(new ResizeOptions(width, height));
            }
            ImageRequest imageRequest = builder.build();
            DataSource<CloseableReference<CloseableImage>> dataSource =
                    imagePipeline.fetchImageFromBitmapCache(imageRequest, context);
            CloseableReference<CloseableImage> imageReference = dataSource.getResult();
            try {
                if (imageReference != null) {
                    CloseableImage closeableImage = imageReference.get();
                    if (closeableImage != null && closeableImage instanceof CloseableBitmap) {
                        Bitmap underlyingBitmap = ((CloseableBitmap) closeableImage).getUnderlyingBitmap();
                        if (underlyingBitmap != null && !underlyingBitmap.isRecycled()) {
                            resultBitmap = underlyingBitmap.copy(Bitmap.Config.RGB_565, false);
                        }
                    }
                }
            } finally {
                dataSource.close();
                CloseableReference.closeSafely(imageReference);
            }
        }
        return resultBitmap;
    }

    @Override
    public void loadImage(String url, int width, int height, final ImageLoaderListener listener) {
        Uri uri = Uri.parse(url);
        ImageRequestBuilder requestBuilder = ImageRequestBuilder.newBuilderWithSource(uri);
        if (width > 0 && height > 0) {
            requestBuilder.setResizeOptions(new ResizeOptions(width, height));
        } else {
            requestBuilder.setResizeOptions(new ResizeOptions(100, 100));
        }
        ImageRequest imageRequest = requestBuilder
                .setLocalThumbnailPreviewsEnabled(true)
                .build();
        DataSource<CloseableReference<CloseableImage>> dataSource = Fresco.getImagePipeline().fetchDecodedImage(imageRequest, null);
        dataSource.subscribe(
                new BaseBitmapDataSubscriber() {
                    @Override
                    public void onNewResultImpl(@Nullable final Bitmap bitmap) {
                        if (listener == null) {
                            return;
                        }
                        if (bitmap != null && !bitmap.isRecycled()) {
                            handlerBackgroundTask(new Callable<Bitmap>() {
                                @Override
                                public Bitmap call() {
                                    final Bitmap resultBitmap = bitmap.copy(Bitmap.Config.RGB_565, false);
                                    if (resultBitmap != null && !resultBitmap.isRecycled()) {
                                        postResult(resultBitmap, listener);
                                    }
                                    return resultBitmap;
                                }
                            });
                        }
                    }

                    @Override
                    public void onFailureImpl(DataSource dataSource) {
                        if (listener == null) {
                            return;
                        }
                        Throwable throwable = null;
                        if (dataSource != null) {
                            throwable = dataSource.getFailureCause();
                        }
                        listener.onLoadFailed(throwable);
                    }
                }, UiThreadImmediateExecutorService.getInstance());
    }

    /**
     * @param callable Callable
     * @param <T>      T
     * @return Future
     */
    private <T> Future<T> handlerBackgroundTask(Callable<T> callable) {
        return executeBackgroundTask.submit(callable);
    }

    /**
     * 回调UI线程中去
     *
     * @param result   result
     * @param callback FrescoBitmapCallback
     * @param <T>      T
     */
    private <T> void postResult(final T result, final ImageLoaderListener callback) {
        final Bitmap bmp = BitmapUtils.compressBitmap((Bitmap) result, 200);
        if (bmp != null && !bmp.isRecycled()) {
            new WeakHandler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    callback.onLoadComplete(bmp);
                }
            });
        } else {
            callback.onLoadFailed(null);
        }
    }
}
