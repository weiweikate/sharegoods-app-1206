package com.meeruu.commonlib.rn;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import com.facebook.binaryresource.BinaryResource;
import com.facebook.binaryresource.FileBinaryResource;
import com.facebook.cache.common.CacheKey;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.cache.DefaultCacheKeyFactory;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.listener.BaseRequestListener;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.UnicornImageLoader;

import java.io.File;

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
        ImageLoadUtils.preFetch(Uri.parse(uri), width, height, new BaseRequestListener() {
            @Override
            public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                super.onRequestSuccess(request, requestId, isPrefetch);
                if (listener != null) {
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        listener.onLoadFailed(null);
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        listener.onLoadFailed(null);
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        listener.onLoadComplete(bmp);
                    } else {
                        listener.onLoadFailed(null);
                    }
                }
            }

            @Override
            public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                super.onRequestFailure(request, requestId, throwable, isPrefetch);
                if (listener != null) {
                    listener.onLoadFailed(null);
                }
            }
        });
    }
}
