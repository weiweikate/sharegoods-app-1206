package com.meeruu.commonlib.rn;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;

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
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.UnicornImageLoader;

import javax.annotation.Nullable;

@SuppressLint("StaticFieldLeak")
public class QiyuImageLoader implements UnicornImageLoader {

    private Context context;

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
            } else {
                builder.setResizeOptions(new ResizeOptions(100, 100));
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
    public void loadImage(final String url, int width, int height, final ImageLoaderListener listener) {
        final Uri uri = Uri.parse(url);
        ImageLoadUtils.load2Bitmap(uri, width, height, new BaseBitmapDataSubscriber() {
            @Override
            protected void onNewResultImpl(@Nullable Bitmap bitmap) {
                if (listener != null) {
                    giveBitmap(bitmap, listener);
                }
            }

            @Override
            protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                if (listener != null) {
                    listener.onLoadFailed(dataSource.getFailureCause());
                }
            }
        });
    }

    private void giveBitmap(Bitmap bitmap, final ImageLoaderListener listener) {
        new AsyncTask<Bitmap, Void, Bitmap>() {
            @Override
            protected Bitmap doInBackground(Bitmap... params) {
                Bitmap bitmap = params[0];
                Bitmap result = null;
                if (bitmap != null && !bitmap.isRecycled()) {
                    result = bitmap.copy(Bitmap.Config.RGB_565, false);
                }
                return result;
            }

            @Override
            protected void onPostExecute(Bitmap bitmap) {
                if (bitmap != null && !bitmap.isRecycled()) {
                    listener.onLoadComplete(bitmap);
                } else {
                    listener.onLoadFailed(null);
                }
            }
        }.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, bitmap);
    }
}
