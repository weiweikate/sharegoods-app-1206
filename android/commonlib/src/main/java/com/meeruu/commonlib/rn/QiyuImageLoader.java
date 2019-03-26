package com.meeruu.commonlib.rn;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;

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
import com.meeruu.commonlib.base.BaseApplication;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.UnicornImageLoader;

import javax.annotation.Nullable;

@SuppressLint("StaticFieldLeak")
public class QiyuImageLoader implements UnicornImageLoader {

    @Override
    public Bitmap loadImageSync(String url, int width, int height) {
        Bitmap resultBitmap = null;
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        Uri uri = Uri.parse(url);
        boolean inMemoryCache = imagePipeline.isInBitmapMemoryCache(uri);
        if (inMemoryCache) {
            ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(uri);
            if (width > 0 && height > 0) {
                builder.setResizeOptions(new ResizeOptions(width, height));
            } else {
                builder.setResizeOptions(new ResizeOptions(100, 100));
            }
            ImageRequest imageRequest = builder.build();
            DataSource<CloseableReference<CloseableImage>> dataSource =
                    imagePipeline.fetchImageFromBitmapCache(imageRequest, BaseApplication.appContext);
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
    public void loadImage(String uri, int width, int height, final ImageLoaderListener listener) {
        ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(Uri.parse(uri));
        if (width > 0 && height > 0) {
            builder.setResizeOptions(new ResizeOptions(width, height));
        } else {
            builder.setResizeOptions(new ResizeOptions(100, 100));
        }
        ImageRequest imageRequest = builder.build();

        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, BaseApplication.appContext);

        BaseBitmapDataSubscriber subscriber = new BaseBitmapDataSubscriber() {
            @Override
            public void onNewResultImpl(@Nullable Bitmap bitmap) {
                if (listener != null) {
                    new AsyncTask<Bitmap, Void, Bitmap>() {
                        @Override
                        protected Bitmap doInBackground(Bitmap... params) {
                            try {
                                Thread.sleep(5);
                            } catch (InterruptedException e) {
                            }
                            Bitmap bitmap = params[0];
                            Bitmap result = null;
                            if (bitmap != null && !bitmap.isRecycled()) {
                                result = bitmap.copy(Bitmap.Config.RGB_565, false);
                            }
                            return result;
                        }

                        @Override
                        protected void onPostExecute(Bitmap bitmap) {
                            if (bitmap != null) {
                                listener.onLoadComplete(bitmap);
                            } else {
                                listener.onLoadFailed(null);
                            }
                        }
                    }.execute(bitmap);
                }
            }

            @Override
            public void onFailureImpl(DataSource dataSource) {
                if (listener != null) {
                    listener.onLoadFailed(dataSource.getFailureCause());
                }
            }
        };

        dataSource.subscribe(subscriber, UiThreadImmediateExecutorService.getInstance());
    }
}
