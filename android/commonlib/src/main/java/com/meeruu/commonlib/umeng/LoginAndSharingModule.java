package com.meeruu.commonlib.umeng;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.net.Uri;
import android.text.TextUtils;
import android.view.View;

import com.alibaba.fastjson.JSON;
import com.facebook.binaryresource.BinaryResource;
import com.facebook.binaryresource.FileBinaryResource;
import com.facebook.cache.common.CacheKey;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.cache.DefaultCacheKeyFactory;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.imagepipeline.listener.BaseRequestListener;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.meeruu.commonlib.R;
import com.meeruu.commonlib.bean.WXLoginBean;
import com.meeruu.commonlib.utils.BitmapFillet;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.bean.SHARE_MEDIA;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import jp.wasabeef.blurry.internal.Blur;
import jp.wasabeef.blurry.internal.BlurFactor;

import static com.meeruu.commonlib.utils.BitmapFillet.CORNER_ALL;

public class LoginAndSharingModule extends ReactContextBaseJavaModule {
    private static final String imageUrlKey = "imageUrlStr";
    private static final String titleKey = "titleStr";
    private static final String linkUrlKey = "QRCodeStr";
    private static final String originalPriceKey = "originalPrice";
    private static final String currentPriceKey = "currentPrice";

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "LoginAndShareModule";

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public LoginAndSharingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void share(ReadableMap params, Callback success, Callback fail) {
        UMShareUtils.showShare(getCurrentActivity(), params.toHashMap(), success, fail);
    }

    @ReactMethod
    public void loginWX(final Callback callback) {
        UMShareAPI.get(getCurrentActivity()).getPlatformInfo(getCurrentActivity(), SHARE_MEDIA.WEIXIN, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                LogUtils.d("onStart授权开始: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //sdk是6.4.5的,但是获取值的时候用的是6.2以前的(access_token)才能获取到值,未知原因
                String uid = map.get("uid");
                String openid = map.get("openid");//微博没有
                String unionid = map.get("unionid");//微博没有
                String access_token = map.get("access_token");
                String refresh_token = map.get("refresh_token");//微信,qq,微博都没有获取到
                String expires_in = map.get("expires_in");
                String name = map.get("name");//名称
                String gender = map.get("gender");//性别
                String iconurl = map.get("iconurl");//头像地址
                umengDeleteOauth(SHARE_MEDIA.WEIXIN);
                WXLoginBean bean = new WXLoginBean();
                bean.setDevice(android.os.Build.DEVICE);
                bean.setAppOpenid(openid);
                bean.setUnionid(unionid);
                bean.setSystemVersion(android.os.Build.VERSION.RELEASE);
                bean.setNickName(name);
                bean.setHeaderImg(iconurl);
                callback.invoke(JSON.toJSONString(bean));
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                callback.invoke(JSON.parse(""));
                ToastUtils.showToast("授权失败");
                LogUtils.d("onError: " + "授权失败");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                callback.invoke(JSON.parse(""));
                ToastUtils.showToast("授权取消");
                LogUtils.d("onError: " + "授权取消");
            }
        });
    }

    private void umengDeleteOauth(SHARE_MEDIA share_media_type) {
        UMShareAPI.get(getCurrentActivity()).deleteOauth(getCurrentActivity(), share_media_type, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                //开始授权
                LogUtils.d("onStart: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //取消授权成功 i=1
                LogUtils.d("onComplete: ");
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                //授权出错
                LogUtils.d("onError: ");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                //取消授权
                LogUtils.d("onCancel: ");
            }
        });
    }

    @ReactMethod
    public void creatShareImage(ReadableMap json, Callback success, Callback fail) {
        ShareImageBean shareImageBean = parseParam(json);
        if (shareImageBean == null) {
            fail.invoke("参数出错");
            return;
        }

        if ("show".equals(shareImageBean.getImageType())) {
            getShowBitmap(mContext, shareImageBean, success, fail);
        } else if ("web".equals(shareImageBean.getImageType())) {
            getWebBitmap(mContext, shareImageBean, success, fail);
        } else if ("webActivity".equals(shareImageBean.getImageType())) {
            getWebActivityBitmap(mContext, shareImageBean, success, fail);
        } else if("group".equals(shareImageBean.getImageType())){
            getGroupBitmap(mContext,shareImageBean,success,fail);
        }else if ("invite".equals(shareImageBean.getImageType())) {
            getInviteBitmap(mContext, shareImageBean, success, fail);
        } else {
            getBitmap(mContext, shareImageBean, success, fail);
        }
    }


    public void getGroupBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        getGroupHeaderBitmap(context, bmp, shareImageBean, success, fail);
                    } else {
                        fail.invoke("图片获取失败");
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    fail.invoke("图片获取失败");
                }
            });
        }
    }

    public void getGroupHeaderBitmap(final Context context, final Bitmap productBitmap, final ShareImageBean shareImageBean, final Callback success, final Callback fail){
        if (TextUtils.isEmpty(shareImageBean.getHeaderImage())) {
            Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
            drawGroup(context, productBitmap, header, shareImageBean, success, fail);
        } else if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getHeaderImage()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                        drawGroup(context, productBitmap, header, shareImageBean, success, fail);
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                        drawGroup(context, productBitmap, header, shareImageBean, success, fail);
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawGroup(context, productBitmap, bmp, shareImageBean, success, fail);
                    } else {
                        drawGroup(context, productBitmap, null, shareImageBean, success, fail);
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                    drawGroup(context, productBitmap, header, shareImageBean, success, fail);
                }


            });
        }
    }

    public void drawGroup(Context context, Bitmap bitmap, Bitmap header, ShareImageBean shareImageBean, Callback success, Callback fail){
        int precision = 3;
        int newWidth = 375 * precision;
        int newHeight = 667 * precision;
        Bitmap result = Bitmap.createBitmap(newWidth, newHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap bitmapBg = BitmapFactory.decodeResource(context.getResources(), R.drawable.group_bg);
        int width = bitmapBg.getWidth();
        int height = bitmapBg.getHeight();
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap newbitmap = Bitmap.createBitmap(bitmapBg, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);
        if (bitmapBg != null && !bitmapBg.isRecycled()) {
            bitmapBg.recycle();
        }

        int bg1W = 320*precision;
        int bg1H = 480*precision;
        Bitmap bitmapBg1 = BitmapFactory.decodeResource(context.getResources(), R.drawable.group_bg2);
        int width1 = bitmapBg1.getWidth();
        int height1 = bitmapBg1.getHeight();
        float scaleWidth1 = ((float) bg1W) / width1;
        float scaleHeight1 = ((float) bg1H) / height1;
        Matrix matrix1 = new Matrix();
        matrix1.postScale(scaleWidth1, scaleHeight1);
        Bitmap newbitmap1 = Bitmap.createBitmap(bitmapBg1, 0, 0, width1, height1, matrix1, true);
        canvas.drawBitmap(newbitmap1, 28*precision, 94*precision, paint);
        if (bitmapBg1 != null && !bitmapBg1.isRecycled()) {
            bitmapBg1.recycle();
        }



        int bg2W = 320*precision;
        int bg2H = 171*precision;
        Bitmap bitmapBg2 = BitmapFactory.decodeResource(context.getResources(), R.drawable.group_header);
        int width2 = bitmapBg2.getWidth();
        int height2 = bitmapBg2.getHeight();
        float scaleWidth2 = ((float) bg2W) / width2;
        float scaleHeight2 = ((float) bg2H) / height2;
        Matrix matrix2 = new Matrix();
        matrix2.postScale(scaleWidth2, scaleHeight2);
        Bitmap newbitmap2 = Bitmap.createBitmap(bitmapBg2, 0, 0, width2, height2, matrix2, true);
        canvas.drawBitmap(newbitmap2, 28*precision, 94*precision, paint);
        if (bitmapBg2 != null && !bitmapBg2.isRecycled()) {
            bitmapBg2.recycle();
        }


        int bg3W = 290*precision;
        int bg3H = 320*precision;
        Bitmap bitmapBg3 = BitmapFactory.decodeResource(context.getResources(), R.drawable.group_bg3);
        int width3 = bitmapBg3.getWidth();
        int height3 = bitmapBg3.getHeight();
        float scaleWidth3 = ((float) bg3W) / width3;
        float scaleHeight3 = ((float) bg3H) / height3;
        Matrix matrix3 = new Matrix();
        matrix3.postScale(scaleWidth3, scaleHeight3);
        Bitmap newbitmap3 = Bitmap.createBitmap(bitmapBg3, 0, 0, width3, height3, matrix3, true);
        canvas.drawBitmap(newbitmap3, 40*precision, 229*precision, paint);
        if (bitmapBg3 != null && !bitmapBg3.isRecycled()) {
            bitmapBg3.recycle();
        }


        //用户图片
        Bitmap headerIcon = getCircleHeaderBitmap(header, precision, 30);
        canvas.drawBitmap(headerIcon, 158 * precision, 206 * precision, paint);


        //商品图片
        Bitmap product = getSquareBitmap(bitmap,80,precision,5);
        canvas.drawBitmap(product, 50 * precision, 291 * precision, paint);

        //绘制商品名称
        String title = shareImageBean.getTitleStr();
        if(!TextUtils.isEmpty(title)){
            int titleSize = 14 * precision;
            int titleCount = (int) ((180 * precision) / titleSize);
            if(title.length() > titleCount){
                title = title.substring(0,title.length()-2)+"...";
            }
            paint.setColor(Color.parseColor("#333333"));
            paint.setTextSize(titleSize);
            canvas.drawText(title,140*precision,291*precision+titleSize,paint);
        }

        //绘制拼团标志
        paint.setColor(Color.parseColor("#fedbe0"));
        RectF rectF = new RectF(140*precision,  317* precision, 164*precision, 331 * precision);
        canvas.drawRoundRect(rectF, 2*precision, 2*precision, paint);
        paint.setColor(Color.parseColor("#FF0050"));
        paint.setTextSize(10*precision);
        canvas.drawText("拼团",142*precision,328*precision,paint);

        //价格
        String price = "￥"+shareImageBean.getPriceStr();
        paint.setTextSize(16*precision);
        canvas.drawText(price,140*precision,365*precision,paint);
        Rect rect = new Rect();
        paint.getTextBounds(price,0,price.length(),rect);
        int priceWidth = rect.width();

        paint.setTextSize(11*precision);
        paint.setColor(Color.parseColor("#999999"));
        paint.setStrikeThruText(true);
        canvas.drawText("￥"+shareImageBean.getOriginalPrice(),146*precision+priceWidth,364*precision,paint);


        Bitmap qrBitmap = createQRImage(shareImageBean.getQRCodeStr(), 70 * precision, 70 * precision);
        canvas.drawBitmap(qrBitmap,153*precision,409*precision,paint);

        paint.setColor(Color.parseColor("#333333"));
        paint.setStrikeThruText(false);
        paint.setTextSize(14*precision);
        String text1 = "长按识别二维码";
        String text2 = "立即参团";
        paint.getTextBounds(text1,0,text1.length(),rect);
        int textWidth1 = rect.width();
        paint.getTextBounds(text2,0,text2.length(),rect);
        int textWidth2 = rect.width();

        canvas.drawText(text1,(375*precision-textWidth1)/2,504*precision,paint);
        canvas.drawText(text2,(375*precision-textWidth2)/2,523*precision,paint);






        String path = BitmapUtils.saveImageToCache(result, "groupImage.png", shareImageBean.toString());
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }
    }

    @ReactMethod
    public void creatShowShareImage(ReadableMap json, Callback success, Callback fail) {
        ShareImageBean shareImageBean = parseParam(json);
        if (shareImageBean == null) {
            fail.invoke("参数出错");
            return;
        }

        getShowBitmap(mContext, shareImageBean, success, fail);
    }

    @ReactMethod
    public void createPromotionShareImage(String url, Callback success, Callback fail) {
        drawPromotionShare(mContext, url, success, fail);
    }


    //秀场下载时获取商品分享图片
    @ReactMethod
    public void createShowProductImage(String info, final Promise promise) {

        if (TextUtils.isEmpty(info)) {
            promise.reject("info为空");
            return;
        }

        final Map data = (Map) JSON.parseObject(info);
        if (!data.containsKey(imageUrlKey) && !data.containsKey(titleKey) && !data.containsKey(linkUrlKey)) {
            promise.reject("数据问题");
            return;
        }

        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse((String) data.get(imageUrlKey)), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        promise.reject("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        promise.reject("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawShowProduct(mContext, data, bmp, promise);
                    } else {
                        promise.reject("图片获取失败");
                    }
                }
            });
        } else {
            promise.reject("Fresco.hasBeenInitialized == false");
            return;
        }
    }


    private void drawShowProduct(Context context, Map data, Bitmap bitmap, Promise promise) {
        String title = (String) data.get(titleKey);
        String price = (String) data.get(originalPriceKey);
        String info = (String) data.get(linkUrlKey);
        String currentPrice = (String) data.get(currentPriceKey);

        int ratio = 2;
        int titleSize = 16 * ratio;
        int titleCount = (int) ((340 * ratio) / titleSize);
        boolean isTwoLine;
        if (title.length() <= titleCount) {
            isTwoLine = false;
        } else {
            isTwoLine = true;
        }

        Bitmap result = Bitmap.createBitmap(375 * ratio, 667 * ratio, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);


        paint.setColor(Color.WHITE);
        canvas.drawRect(0, 0, 375 * ratio, 667 * ratio, paint);

        BlurFactor blurFactor = new BlurFactor();
        blurFactor.width = bitmap.getWidth();
        blurFactor.height = bitmap.getHeight();
        Bitmap outBitmap = Blur.of(context, bitmap, blurFactor);
        int outWidth = outBitmap.getWidth();
        int outHeight = outBitmap.getHeight();
        if (outWidth * 1.0 / outHeight > 375 / 667) {
            int height = outHeight;
            int width = (int) (height * (375 / 667.0));
            Rect mSrcRect = new Rect((outWidth - width) / 2, 0, outWidth - (width / 2), height);
            Rect mDestRect = new Rect(0, 0, 375 * ratio, 667 * ratio);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        } else {
            int height = (int) (outWidth / (375 * 667.0));
            Rect mSrcRect = new Rect(0, (outHeight - height) / 2, outWidth, outHeight - (height / 2));
            Rect mDestRect = new Rect(0, 0, 375 * ratio, 667 * ratio);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        }



        RectF white = new RectF(35 * ratio, 67 * ratio, 340 * ratio, 477 * ratio);
        canvas.drawRoundRect(white, 5*ratio, 5*ratio, paint);

        Bitmap bitmapCenter = Bitmap.createScaledBitmap(bitmap, 275 * ratio, 275 * ratio, true);
        Bitmap bitmapCenter1 = BitmapFillet.fillet(bitmapCenter, 5 * ratio, CORNER_ALL);

        canvas.drawBitmap(bitmapCenter1, 50 * ratio, 82 * ratio, paint);

        Rect bounds = new Rect();

        //绘制价格
        paint.setColor(Color.parseColor("#FF0050"));
        paint.setTextSize(30 * ratio);
        paint.setFakeBoldText(true);
        String pdj = currentPrice;
        paint.getTextBounds(pdj, 0, pdj.length(), bounds);
        canvas.drawText(pdj, 51 * ratio,  (367 + titleSize) * ratio, paint);

        int left = bounds.width() + 71 * ratio;

        paint.setStrikeThruText(true);
        paint.setFakeBoldText(false);
        paint.setTextSize(13 * ratio);
        paint.setColor(Color.parseColor("#999999"));
        String marketStr = "市场价："+price;
        canvas.drawText(marketStr, left, (367 + titleSize) * ratio, paint);

        //绘制文字
        paint.setColor(Color.parseColor("#333333"));
        paint.setStrikeThruText(false);
        paint.setTextSize(titleSize);
        if (title.length() <= titleCount) {
            String s = title.substring(0, title.length());
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, s.length(), bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 51 * ratio, (417 + titleSize / 2) * ratio, paint);
        }
        if (title.length() <= titleCount * 2 && title.length() > titleCount) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 51 * ratio, (417 + titleSize / 2) * ratio, paint);
            s = title.substring(titleCount, title.length());
            canvas.drawText(s, 51 * ratio, (417 + titleSize / 2) * ratio + titleSize + bounds.height() / 2, paint);
        }

        if (title.length() > titleCount * 2) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 51 * ratio, (417 + titleSize / 2) * ratio, paint);
            s = title.substring(titleCount, titleCount * 2 - 2) + "...";
            canvas.drawText(s, 51 * ratio, (417 + titleSize / 2) * ratio + titleSize + bounds.height() / 2, paint);
        }

        Bitmap qrBitmap = createQRImage(info, 90 * ratio, 90 * ratio);
        canvas.drawBitmap(qrBitmap, 143 * ratio, 535 * ratio, paint);

        paint.setColor(Color.WHITE);
        paint.setTextSize(13*ratio);
        String tip = "秀一秀 赚到够";
        canvas.drawText(tip, 147 * ratio,  647 * ratio, paint);


        String path = BitmapUtils.saveImageToCache(result, "shareImage.png", JSON.toJSONString(data));
        if (!TextUtils.isEmpty(path)) {
            Uri uri = Uri.parse("file://" + path);
            saveImageAndRefresh(uri);
            promise.resolve(path);
        } else {
            promise.reject("图片生成失败");
        }

        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }

        if (result != null && !result.isRecycled()) {
            result.recycle();
            result = null;
        }

        if (outBitmap != null && !outBitmap.isRecycled()) {
            outBitmap.recycle();
            outBitmap = null;
        }

        if (bitmapCenter != null && !bitmapCenter.isRecycled()) {
            bitmapCenter.recycle();
            bitmapCenter = null;
        }

        if (bitmapCenter1 != null && !bitmapCenter1.isRecycled()) {
            bitmapCenter1.recycle();
            bitmapCenter1 = null;
        }
    }

    public static void getWebBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawWeb(context, bmp, shareImageBean, success, fail);
                    } else {
                        fail.invoke("图片获取失败");
                    }
                }
            });
        }
    }

    public static void drawWeb(Context context, Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail) {

        String info = shareImageBean.getQRCodeStr();
        int ratio = 3;
        Bitmap result = Bitmap.createBitmap(250 * ratio, 340 * ratio, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        bitmap = Bitmap.createScaledBitmap(bitmap, 250 * ratio, 340 * ratio, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);


        Bitmap qrBitmap = createQRImage(info, 45 * ratio, 45 * ratio);
        canvas.drawBitmap(qrBitmap, 190 * ratio, 285 * ratio, paint);

        String path = BitmapUtils.saveImageToCache(result, "shareImage.png", shareImageBean.toString());
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
    }


    public static void getShowBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        getShowHeaderBitmap(context, bmp, shareImageBean, success, fail);

                    } else {
                        fail.invoke("图片获取失败");
                    }
                }
            });
        }
    }

    public void getInviteBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (TextUtils.isEmpty(shareImageBean.getHeaderImage()) || "logo.png".equals(shareImageBean.getHeaderImage())) {
            Bitmap bitmap = getDefaultIcon(context);
            drawInviteFriendsImage(context, bitmap, shareImageBean, success, fail);
        } else {
            downloadHeaderImg(context, shareImageBean.getHeaderImage(), shareImageBean, success, fail);
        }
    }

    public static void getWebActivityBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        getShowHeaderBitmap(context, bmp, shareImageBean, success, fail);

                    } else {
                        fail.invoke("图片获取失败");
                    }
                }
            });
        }
    }


    public static void getShowHeaderBitmap(final Context context, final Bitmap mainBitmap, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            if (TextUtils.isEmpty(shareImageBean.getHeaderImage())) {
                Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                if ("show".equals(shareImageBean.getImageType())) {
                    drawShow(context, bitmap, mainBitmap, shareImageBean, success, fail);
                } else if ("webActivity".equals(shareImageBean.getImageType())) {
                    drawWebActivity(context, bitmap, mainBitmap, shareImageBean, success, fail);
                } else if ("web".equals(shareImageBean.getImageType())) {

                }
            } else {
                ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getHeaderImage()), 0, 0, new BaseRequestListener() {
                    @Override
                    public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                        super.onRequestSuccess(request, requestId, isPrefetch);
                        CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                        BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                        if (resource == null) {
                            fail.invoke("图片获取失败");
                            return;
                        }
                        final File file = ((FileBinaryResource) resource).getFile();
                        if (file == null) {
                            fail.invoke("图片获取失败");
                            return;
                        }
                        Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));

                        if (bmp != null && !bmp.isRecycled()) {
                            if ("show".equals(shareImageBean.getImageType())) {
                                drawShow(context, bmp, mainBitmap, shareImageBean, success, fail);
                            } else if ("webActivity".equals(shareImageBean.getImageType())) {
                                drawWebActivity(context, bmp, mainBitmap, shareImageBean, success, fail);
                            } else if ("web".equals(shareImageBean.getImageType())) {

                            }
                        } else {
                            fail.invoke("图片获取失败");
                        }
                    }
                });
            }

        }
    }

    private static void drawWebActivity(Context context, Bitmap headBitmap, final Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail) {
        int precision = 2;
        Bitmap result = Bitmap.createBitmap(375 * precision, 667 * precision, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        BlurFactor blurFactor = new BlurFactor();
        blurFactor.width = bitmap.getWidth();
        blurFactor.height = bitmap.getHeight();
        Bitmap outBitmap = Blur.of(context, bitmap, blurFactor);
        int outWidth = outBitmap.getWidth();
        int outHeight = outBitmap.getHeight();
        if (outWidth * 1.0 / outHeight > 375 / 667) {
            int height = outHeight;
            int width = (int) (height * (375 / 667.0));
            Rect mSrcRect = new Rect((outWidth - width) / 2, 0, outWidth - (width / 2), height);
            Rect mDestRect = new Rect(0, 0, 375 * precision, 667 * precision);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        } else {
            int height = (int) (outWidth / (375 * 667.0));
            Rect mSrcRect = new Rect(0, (outHeight - height) / 2, outWidth, outHeight - (height / 2));
            Rect mDestRect = new Rect(0, 0, 375 * precision, 667 * precision);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        }
        paint.reset();
        Bitmap bitmapCenter = Bitmap.createScaledBitmap(bitmap, 310 * precision, 410 * precision, true);
        Bitmap bitmapCenter1 = BitmapFillet.fillet(bitmapCenter, 5 * precision, CORNER_ALL);
        canvas.drawBitmap(bitmapCenter1, 33 * precision, 65 * precision, paint);

        paint.reset();
        Paint headerPaint = new Paint();
        headerPaint.setDither(true);
        Bitmap header = getCircleHeaderBitmap(headBitmap, precision, 18);
        canvas.drawBitmap(header, 64 * precision, 425 * precision, headerPaint);

        Paint textPaint = new Paint();
        textPaint.setAntiAlias(true);
        String name = shareImageBean.getUserName();
        if (!TextUtils.isEmpty(name)) {
            textPaint.reset();
            textPaint.setAntiAlias(true);
            textPaint.setColor(Color.parseColor("#ffffff"));
            textPaint.setTextSize(12 * precision);
            Rect bounds = new Rect();
            textPaint.getTextBounds(name, 0, name.length(), bounds);
            canvas.drawText(name + " " + shareImageBean.getDiamondNum(), 105 * precision, 446 * precision, textPaint);
        }

        String url = shareImageBean.getQRCodeStr();
        if (!TextUtils.isEmpty(url)) {
            Paint qrPaint = new Paint();
            qrPaint.setColor(Color.WHITE);
            RectF qrBg = new RectF(148 * precision, 519 * precision, 228 * precision, 599 * precision);
            canvas.drawRoundRect(qrBg, 5, 5, qrPaint);
            Bitmap qrBitmap = createQRImage(url, 80 * precision, 80 * precision);
            canvas.drawBitmap(qrBitmap, 148 * precision, 519 * precision, qrPaint);
            if (qrBitmap != null && !qrBitmap.isRecycled()) {
                qrBitmap.recycle();
                qrBitmap = null;
            }
        }

        Bitmap arrows = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_arrows);
        Rect mSrcRect = new Rect(0, 0, arrows.getWidth(), arrows.getHeight());
        Rect mDestRect = new Rect(177 * precision, 609 * precision, 197 * precision, 629 * precision);
        canvas.drawBitmap(arrows, mSrcRect, mDestRect, paint);

        String tip = "扫一扫，免费领钻石";
        textPaint.setAntiAlias(true);
        textPaint.setColor(Color.WHITE);
        textPaint.setTextSize(13 * precision);
        Rect bounds = new Rect();
        textPaint.getTextBounds(tip, 0, tip.length(), bounds);
        canvas.drawText(tip, ((375 * precision - bounds.width()) / 2), 647 * precision, textPaint);

        String path = BitmapUtils.saveImageToCache(result, "shareShowImage.png", shareImageBean.toString());

        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (outBitmap != null && !outBitmap.isRecycled()) {
            outBitmap.recycle();
            outBitmap = null;
        }
        if (result != null && !result.isRecycled()) {
            result.recycle();
            result = null;
        }
        if (header != null && !header.isRecycled()) {
            header.recycle();
            header = null;
        }
        if (bitmapCenter != null && !bitmapCenter.isRecycled()) {
            bitmapCenter.recycle();
            bitmapCenter = null;
        }

        if (bitmapCenter1 != null && !bitmapCenter1.isRecycled()) {
            bitmapCenter1.recycle();
            bitmapCenter1 = null;
        }
    }


    private static void drawShow(Context context, Bitmap headBitmap, final Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail) {
        int precision = 2;
        Bitmap result = Bitmap.createBitmap(375 * precision, 667 * precision, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        BlurFactor blurFactor = new BlurFactor();
        blurFactor.width = bitmap.getWidth();
        blurFactor.height = bitmap.getHeight();
        Bitmap outBitmap = Blur.of(context, bitmap, blurFactor);
        int outWidth = outBitmap.getWidth();
        int outHeight = outBitmap.getHeight();
        if (outWidth * 1.0 / outHeight > 375 / 667) {
            int height = outHeight;
            int width = (int) (height * (375 / 667.0));
            Rect mSrcRect = new Rect((outWidth - width) / 2, 0, outWidth - (width / 2), height);
            Rect mDestRect = new Rect(0, 0, 375 * precision, 667 * precision);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        } else {
            int width = outWidth;
            int height = (int) (outWidth / (375 * 667.0));
            Rect mSrcRect = new Rect(0, (outHeight - height) / 2, width, outHeight - (height / 2));
            Rect mDestRect = new Rect(0, 0, 375 * precision, 667 * precision);
            canvas.drawBitmap(outBitmap, mSrcRect, mDestRect, paint);
        }

        paint.setColor(Color.WHITE);
        RectF white = new RectF(15 * precision, 42 * precision, 360 * precision, 514 * precision);
        canvas.drawRoundRect(white, 5 * precision, 5 * precision, paint);

        outWidth = bitmap.getWidth();
        outHeight = bitmap.getHeight();
        paint.reset();
        if (outWidth * 1.0 / outHeight > 315 / 345) {
            int height = outHeight;
            int width = (int) (height * (315 / 345.0));
            Rect mSrcRect = new Rect((outWidth - width) / 2, 0, (outWidth + width) / 2, height);
            Rect mDestRect = new Rect(30 * precision, 57 * precision, 345 * precision, 402 * precision);
            canvas.drawBitmap(bitmap, mSrcRect, mDestRect, paint);
        } else {
            paint.setAntiAlias(true);
            int height = (int) (outWidth / (315 * 345.0));
            Rect mSrcRect = new Rect(0, (outHeight - height) / 2, outWidth, (outHeight + height) / 2);
            Rect mDestRect = new Rect(30 * precision, 57 * precision, 345 * precision, 402 * precision);
            canvas.drawBitmap(bitmap, mSrcRect, mDestRect, paint);
        }

        paint.reset();
        Paint headerPaint = new Paint();
        headerPaint.setDither(true);
        Bitmap header = getCircleHeaderBitmap(headBitmap, precision, 18);
        canvas.drawBitmap(header, 30 * precision, 412 * precision, headerPaint);

        Paint textPaint = new Paint();
        textPaint.setAntiAlias(true);
        String name = shareImageBean.getUserName();
        if (!TextUtils.isEmpty(name)) {
            textPaint.reset();
            textPaint.setAntiAlias(true);
            textPaint.setColor(Color.parseColor("#333333"));
            textPaint.setTextSize(15 * precision);
            Rect bounds = new Rect();
            textPaint.getTextBounds(name, 0, name.length(), bounds);
            canvas.drawText(name, 75 * precision, 435 * precision, textPaint);
        }

        String content = shareImageBean.getTitleStr();
        if (!TextUtils.isEmpty(content)) {
            textPaint.reset();
            textPaint.setAntiAlias(true);
            textPaint.setColor(Color.parseColor("#333333"));
            int titleSize = 13 * precision;
            int titleCount = (315 * precision) / titleSize;
            textPaint.setTextSize(titleSize);
            Rect bounds = new Rect();
            if (content.length() <= titleCount) {
                textPaint.getTextBounds(content, 0, content.length(), bounds);
                canvas.drawText(content, 30 * precision, 468 * precision, textPaint);
            } else if (content.length() <= titleCount * 2 && content.length() > titleCount) {
                String s = content.substring(0, titleCount);
                //获取文字的字宽高以便把文字与图片中心对齐
                paint.getTextBounds(s, 0, titleCount, bounds);
                //画文字的时候高度需要注意文字大小以及文字行间距
                canvas.drawText(s, 30 * precision, 468 * precision, textPaint);
                String s1 = content.substring(titleCount, content.length());
                canvas.drawText(s1, 30 * precision, (468 + 5 + titleSize / 2) * precision, textPaint);
            } else {
                String s = content.substring(0, titleCount);
                //获取文字的字宽高以便把文字与图片中心对齐
                paint.getTextBounds(s, 0, titleCount, bounds);
                //画文字的时候高度需要注意文字大小以及文字行间距
                canvas.drawText(s, 30 * precision, 468 * precision, textPaint);
                String s1 = content.substring(titleCount, titleCount * 2 - 2) + "...";
                canvas.drawText(s1, 30 * precision, (468 + 5 + titleSize / 2) * precision, textPaint);
            }
        }

        String url = shareImageBean.getQRCodeStr();
        if (!TextUtils.isEmpty(url)) {
            Paint qrPaint = new Paint();
            qrPaint.setColor(Color.WHITE);
            RectF qrBg = new RectF(148 * precision, 544 * precision, 228 * precision, 624 * precision);
            canvas.drawRoundRect(qrBg, 5, 5, qrPaint);
            Bitmap qrBitmap = createQRImage(url, 80 * precision, 80 * precision);
            canvas.drawBitmap(qrBitmap, 148 * precision, 544 * precision, qrPaint);
            if (qrBitmap != null && !qrBitmap.isRecycled()) {
                qrBitmap.recycle();
                qrBitmap = null;
            }
        }

        String tip = "秀一秀 赚到够";
        Typeface font = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD);
        paint.setTypeface(font);
        textPaint.setAntiAlias(true);
        textPaint.setColor(Color.WHITE);
        textPaint.setTextSize(13 * precision);
        Rect bounds = new Rect();
        textPaint.getTextBounds(tip, 0, tip.length(), bounds);
        canvas.drawText(tip, ((375 * precision - bounds.width()) / 2), 640 * precision, textPaint);
        paint.setTypeface(null);
        String path = BitmapUtils.saveImageToCache(result, "shareShowImage.png", shareImageBean.toString());

        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (outBitmap != null && !outBitmap.isRecycled()) {
            outBitmap.recycle();
            outBitmap = null;
        }
        if (result != null && !result.isRecycled()) {
            result.recycle();
            result = null;
        }
        if (header != null && !header.isRecycled()) {
            header.recycle();
            header = null;
        }
    }

    public static Bitmap getCircleHeaderBitmap(Bitmap bmp, int precision, int radius) {
        //获取bmp的宽高 小的一个做为圆的直径r
        int w = bmp.getWidth();
        int h = bmp.getHeight();
        int r = Math.min(w, h);
        float sx = radius * 2 * precision * 1.0f / w;
        float sy = radius * 2 * precision * 1.0f / h;
        float scale = Math.max(sx, sy);

        //创建一个paint
        Paint paint = new Paint();

        Bitmap newBitmap = Bitmap.createBitmap(radius * 2 * precision, radius * 2 * precision, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(newBitmap);

        //创建一个BitmapShader对象 使用传递过来的原Bitmap对象bmp
        BitmapShader bitmapShader = new BitmapShader(bmp, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        Matrix matrix = new Matrix();
        matrix.setScale(scale, scale);
        bitmapShader.setLocalMatrix(matrix);
        paint.setShader(bitmapShader);

        canvas.drawCircle(radius * precision, radius * precision, radius * precision, paint);

        return newBitmap;
    }

    /**
     *  生成圆角正方形图片
     * @param bmp
     * @param precision
     * @param radius
     * @return
     */
    public static Bitmap getSquareBitmap(Bitmap bmp,int width, int precision, int radius) {
        int w = bmp.getWidth();
        int h = bmp.getHeight();
        float sx = width* precision * 1.0f / w;
        float sy = width * precision * 1.0f / h;
        float scale = Math.max(sx, sy);

        Paint paint = new Paint();

        Bitmap newBitmap = Bitmap.createBitmap(width* precision, width * precision, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(newBitmap);

        BitmapShader bitmapShader = new BitmapShader(bmp, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        Matrix matrix = new Matrix();
        matrix.setScale(scale, scale);
        bitmapShader.setLocalMatrix(matrix);
        paint.setShader(bitmapShader);

        RectF oval = new RectF(0,0,width*precision,width*precision);
        canvas.drawRoundRect(oval, radius * precision, radius * precision, paint);

        return newBitmap;
    }



    private void downloadHeaderImg(final Context context, final String headImg, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(headImg), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, shareImageBean, success, fail);
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, shareImageBean, success, fail);
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawInviteFriendsImage(context, bmp, shareImageBean, success, fail);
                    } else {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, shareImageBean, success, fail);
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    Bitmap bitmap = getDefaultIcon(context);
                    drawInviteFriendsImage(context, bitmap, shareImageBean, success, fail);
                }
            });
        }
    }

    @ReactMethod
    public void saveShopInviteFriendsImage(ReadableMap map, Callback success, Callback fail) {
        drawShopInviteFriendsImage(mContext, map, success, fail);
    }

    //    headerImg: `${shareInfo.headUrl}`,
    //    shopName: `${shareInfo.name}`,
    //    shopId: `ID: ${shareInfo.showNumber}`,
    //    shopPerson: `店主: ${manager.nickname || ''}`,
    //    codeString: this.state.codeString,
    //    wxTip: this.state.wxTip
    public void drawShopInviteFriendsImage(final Context context, final ReadableMap map, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            String headerImgUrl = map.getString("headerImg");
            ImageLoadUtils.preFetch(Uri.parse(headerImgUrl), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("店主图片下载失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("店主图片下载失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawShopInviteFriendsImageWithHeader(context, map, bmp, success, fail);
                    } else {
                        fail.invoke("店主图片下载失败");
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    fail.invoke("店主图片下载失败");
                }
            });
        }
    }

    private static Bitmap getDefaultIcon(Context context) {
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher_round);
        return bitmap;
    }

    public void drawShopInviteFriendsImageWithHeader(final Context context, final ReadableMap map, final Bitmap headerBitmap, final Callback success, final Callback fail) {
        Bitmap result = Bitmap.createBitmap(375, 667, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.yqhy_04);
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 375;
        int newHeight = 667;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;

        Bitmap whiteBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.yqhy_03);

        int whiteWidth = whiteBitmap.getWidth();
        int whiteHeight = whiteBitmap.getHeight();
        int newWhiteWidth = 325;
        int newWhiteHeight = 380;
        float scaleWidthWhite = ((float) newWhiteWidth) / whiteWidth;
        float scaleHeightWhite = ((float) newWhiteHeight) / whiteHeight;

        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        bitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);

        Matrix whiteMatrix = new Matrix();
        whiteMatrix.postScale(scaleWidthWhite, scaleHeightWhite);
        whiteBitmap = Bitmap.createBitmap(whiteBitmap, 0, 0, whiteWidth, whiteHeight, whiteMatrix, true);
        canvas.drawBitmap(whiteBitmap, 24, 164, paint);

        //头像
        int headerW = headerBitmap.getWidth();
        int headerH = headerBitmap.getHeight();
        int newHeaderLength = 68;
        float scaleWidthHeader = ((float) newHeaderLength) / headerW;
        float scaleHeightHeader = ((float) newHeaderLength) / headerH;
        float scaleHeader = Math.max(scaleHeightHeader, scaleWidthHeader);
        Matrix headerMatrix = new Matrix();
        headerMatrix.postScale(scaleHeader, scaleHeader);

        Bitmap header = Bitmap.createBitmap(headerBitmap, 0, 0, headerW, headerH, headerMatrix, true);
        header = createCircleImage(header, newHeaderLength);
        canvas.drawBitmap(header, 70, 195, paint);

        String shopName = map.getString("shopName");
        paint.setColor(Color.BLACK);
        paint.setTextSize(14);
        Rect bounds = new Rect();
        paint.getTextBounds(shopName, 0, shopName.length(), bounds);
        canvas.drawText(shopName, 150, 215, paint);

        String shopId = map.getString("shopId");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(shopId, 0, shopId.length(), bounds);
        canvas.drawText(shopId, 150, 235, paint);

        String shopPerson = map.getString("shopPerson");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(shopPerson, 0, shopPerson.length(), bounds);
        canvas.drawText(shopPerson, 150, 255, paint);

        Bitmap qrBitmap = createQRImage(map.getString("codeString"), 135, 135);
        canvas.drawBitmap(qrBitmap, 120, 310, paint);

        String wxTip = map.getString("wxTip");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(wxTip, 0, wxTip.length(), bounds);
        canvas.drawText(wxTip, (375 - bounds.width()) / 2, 470, paint);

        HashMap hashMap = map.toHashMap();

        String path = BitmapUtils.saveImageToCache(result, "inviteShop.png", hashMap.toString());

        path = "file://" + path;
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (whiteBitmap != null && !whiteBitmap.isRecycled()) {
            whiteBitmap.recycle();
            whiteBitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        success.invoke();
    }

    /**
     * 根据原图和变长绘制圆形图片
     *
     * @param source
     * @param min
     * @return
     */
    private static Bitmap createCircleImage(Bitmap source, int min) {
        final Paint paint = new Paint();
        paint.setAntiAlias(true);
        Bitmap target = Bitmap.createBitmap(min, min, Bitmap.Config.ARGB_8888);
        /**
         * 产生一个同样大小的画布
         */
        Canvas canvas = new Canvas(target);
        /**
         * 首先绘制圆形
         */
        canvas.drawCircle(min / 2, min / 2, min / 2, paint);
        /**
         * 使用SRC_IN
         */
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        /**
         * 绘制图片
         */
        canvas.drawBitmap(source, 0, 0, paint);

        return target;
    }


    public void drawInviteFriendsImage(final Context context, Bitmap icon, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        int precision = 3;
        Bitmap result = Bitmap.createBitmap(375 * precision, 667 * precision, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.invite_bg);
        Bitmap qrBitmap = createQRImage(shareImageBean.getQRCodeStr(), 144 * precision, 144 * precision);
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 375 * precision;
        int newHeight = 667 * precision;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);

        Bitmap newbitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);
        canvas.drawBitmap(qrBitmap, 116 * precision, 282 * precision, paint);


        Bitmap tipbitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.invite_tip_bg);
        width = tipbitmap.getWidth();
        height = tipbitmap.getHeight();
        newWidth = 258 * precision;
        newHeight = 59 * precision;
        scaleWidth = ((float) newWidth) / width;
        scaleHeight = ((float) newHeight) / height;
        Matrix matrixTip = new Matrix();
        matrixTip.postScale(scaleWidth, scaleHeight);
        Bitmap newTipBg = Bitmap.createBitmap(tipbitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newTipBg, 60 * precision, 208 * precision, paint);

        paint.setColor(Color.parseColor("#B93C3B"));
        paint.setTextSize(13 * precision);
        Rect bounds = new Rect();
        String name = shareImageBean.userName;
        if (!TextUtils.isEmpty(name)) {
            paint.getTextBounds(name, 0, name.length(), bounds);
            canvas.drawText(name, (375 * precision - bounds.width()) / 2, 230 * precision + bounds.height(), paint);
        }
        String tipStr = "已有4000000+用户领取成功～";
        paint.getTextBounds(tipStr, 0, tipStr.length(), bounds);
        canvas.drawText(tipStr, (375 * precision - bounds.width()) / 2, 246 * precision + bounds.height(), paint);

        tipStr = "手机扫一扫注册新用户";
        paint.setColor(Color.parseColor("#ffffff"));
        paint.getTextBounds(tipStr, 0, tipStr.length(), bounds);
        canvas.drawText(tipStr, (375 * precision - bounds.width()) / 2, 431 * precision + bounds.height(), paint);

        int iconW = icon.getWidth();
        int iconH = icon.getHeight();
        // 设置想要的大小
        int newIconLenght = 56 * precision;
        // 计算缩放比例
        float iconWidthScale = ((float) newIconLenght) / iconW;
        float iconHeightScale = ((float) newIconLenght) / iconH;
        // 取得想要缩放的matrix参数
        Matrix matrixIcon = new Matrix();
        matrixIcon.postScale(iconWidthScale, iconHeightScale);
        // 得到新的图片
        Bitmap newIcon = Bitmap.createBitmap(icon, 0, 0, iconW, iconH, matrixIcon, true);

        Bitmap roundIcon = createCircleBitmap(newIcon);

        canvas.drawBitmap(roundIcon, 161 * precision, 153 * precision, paint);

        String path = BitmapUtils.saveImageToCache(result, "inviteFriends.png", shareImageBean.getQRCodeStr());

        path = "file://" + path;
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        if (roundIcon != null && !roundIcon.isRecycled()) {
            roundIcon.recycle();
            roundIcon = null;
        }
        if (icon != null && !icon.isRecycled()) {
            icon.recycle();
            icon = null;
        }

        if (tipbitmap != null && !tipbitmap.isRecycled()) {
            tipbitmap.recycle();
            tipbitmap = null;
        }

        if (newTipBg != null && !newTipBg.isRecycled()) {
            newTipBg.recycle();
            newTipBg = null;
        }
        success.invoke(path);
    }

    private static Bitmap createCircleBitmap(Bitmap resource) {
        //获取图片的宽度
        int width = resource.getWidth();
        Paint paint = new Paint();
        //设置抗锯齿
        paint.setAntiAlias(true);

        //创建一个与原bitmap一样宽度的正方形bitmap
        Bitmap circleBitmap = Bitmap.createBitmap(width, width, Bitmap.Config.ARGB_8888);
        //以该bitmap为低创建一块画布
        Canvas canvas = new Canvas(circleBitmap);
        //以（width/2, width/2）为圆心，width/2为半径画一个圆
        canvas.drawCircle(width / 2, width / 2, width / 2, paint);

        //设置画笔为取交集模式
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        //裁剪图片
        canvas.drawBitmap(resource, 0, 0, paint);
        if (resource != null && !resource.isRecycled()) {
            resource.recycle();
            resource = null;
        }

        return circleBitmap;
    }


    public static void drawPromotionShare(final Context context, final String url, final Callback success, final Callback fail) {
        String info = url;
        String str = "长按扫码打开连接";
        Bitmap result = Bitmap.createBitmap(279, (int) (348), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.red_envelope_bg);


        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 279;
        int newHeight = 348;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;

        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);

        Bitmap newbitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);
        Bitmap qrBitmap = createQRImage(info, 140, 140);
        canvas.drawBitmap(qrBitmap, 70, 146, paint);
        paint.setColor(Color.WHITE);
        paint.setTextSize(12);
        Rect bounds = new Rect();
        paint.getTextBounds(str, 0, str.length(), bounds);
        canvas.drawText(str, (279 - bounds.width()) / 2, 306, paint);
        String path = BitmapUtils.saveImageToCache(result, "sharePromotionImage.png");
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        if (newbitmap != null && !newbitmap.isRecycled()) {
            newbitmap.recycle();
            newbitmap = null;
        }
    }


    public static void getBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        getHeaderBitmap(context, bmp, shareImageBean, success, fail);
                    } else {
                        fail.invoke("图片获取失败");
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    fail.invoke("图片获取失败");
                }
            });
        }
    }

    public static void getHeaderBitmap(final Context context, final Bitmap productBitmap, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (TextUtils.isEmpty(shareImageBean.getHeaderImage())) {
            Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
            draw(context, productBitmap, header, shareImageBean, success, fail);
        } else if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getHeaderImage()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                        draw(context, productBitmap, header, shareImageBean, success, fail);
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                        draw(context, productBitmap, header, shareImageBean, success, fail);
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(1));
                    if (bmp != null && !bmp.isRecycled()) {
                        draw(context, productBitmap, bmp, shareImageBean, success, fail);
                    } else {
                        draw(context, productBitmap, null, shareImageBean, success, fail);
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    Bitmap header = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_app_user);
                    draw(context, productBitmap, header, shareImageBean, success, fail);
                }


            });
        }
    }


    //商品分享图片
    public static void draw(Context context, Bitmap bitmap, Bitmap header, ShareImageBean shareImageBean, Callback success, Callback fail) {
        int precision = 3;
        int titleSize = 16 * precision;
        String title = shareImageBean.getTitleStr() + "";
        int titleCount = (328 * precision) / titleSize;
        String retailPrice = shareImageBean.getRetail();
        List<String> tags = shareImageBean.getPriceType();
        String price = shareImageBean.getPriceStr();
        String info = shareImageBean.getQRCodeStr();
        String tip = "为您推荐好物";
        boolean isTwoLine;
        if (title.length() <= titleCount) {
            isTwoLine = false;
        } else {
            isTwoLine = true;
        }
        String spellPrice = shareImageBean.getSpell();
        String discountPrice = shareImageBean.getDiscount();


        Bitmap result = Bitmap.createBitmap(375 * precision, 667 * precision, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        paint.setColor(Color.WHITE);
        RectF white = new RectF(0, 0, 375 * precision, 667 * precision);
        canvas.drawRoundRect(white, 5 * precision, 5 * precision, paint);

        Bitmap bitmapBg = BitmapFactory.decodeResource(context.getResources(), R.drawable.share_bg);
        int width = bitmapBg.getWidth();
        int height = bitmapBg.getHeight();
        int newWidth = 375 * precision;
        int newHeight = 595 * precision;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap newbitmap = Bitmap.createBitmap(bitmapBg, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);

        if (bitmapBg != null && !bitmapBg.isRecycled()) {
            bitmapBg.recycle();
        }

        int outWidth = bitmap.getWidth();
        int outHeight = bitmap.getHeight();
        paint.setAntiAlias(true);

        if (outWidth * 1.0 / outHeight > 1) {
            height = width = outHeight;
            Rect mSrcRect = new Rect((outWidth - width) / 2, 0, (outWidth + width) / 2, height);
            Rect mDestRect = new Rect(24 * precision, 46 * precision, 351 * precision, 373 * precision);
            canvas.drawBitmap(bitmap, mSrcRect, mDestRect, paint);
        } else {
            height = outWidth;
            Rect mSrcRect = new Rect(0, (outHeight - height) / 2, outWidth, (outHeight + height) / 2);
            Rect mDestRect = new Rect(24 * precision, 46 * precision, 351 * precision, 373 * precision);
            canvas.drawBitmap(bitmap, mSrcRect, mDestRect, paint);
        }


        Bitmap topRightBtp = null;

        if (shareImageBean.getMonthSaleType() == 1) {
            topRightBtp = BitmapFactory.decodeResource(context.getResources(), R.drawable.sale_big_500);
        } else if (shareImageBean.getMonthSaleType() == 2) {
            topRightBtp = BitmapFactory.decodeResource(context.getResources(), R.drawable.sale_big_501);
        } else if (shareImageBean.getMonthSaleType() == 3) {
            topRightBtp = BitmapFactory.decodeResource(context.getResources(), R.drawable.sale_big_1001);
        } else if (shareImageBean.getMonthSaleType() == 4) {
            topRightBtp = BitmapFactory.decodeResource(context.getResources(), R.drawable.sale_big_1002);
        }else if (shareImageBean.getMonthSaleType() == 5) {
            topRightBtp = BitmapFactory.decodeResource(context.getResources(), R.drawable.sale_big_1003);
        }

        if (topRightBtp != null) {
            int typeWidth = topRightBtp.getWidth();
            int typeHeight = topRightBtp.getHeight();
            int newWidthType = 101 * precision;
            int newHeightType = 32 * precision;
            float scaleWidthType = ((float) newWidthType) / typeWidth;
            float scaleHeightType = ((float) newHeightType) / typeHeight;
            Matrix matrixType = new Matrix();
            matrixType.postScale(scaleWidthType, scaleHeightType);
            Bitmap typeBtm = Bitmap.createBitmap(topRightBtp, 0, 0, typeWidth, typeHeight, matrixType, true);
            canvas.drawBitmap(typeBtm, 250 * precision, 40 * precision, paint);
            if (typeBtm != null && !typeBtm.isRecycled()) {
                typeBtm.recycle();
            }
        }

        if (topRightBtp != null && !topRightBtp.isRecycled()) {
            topRightBtp.recycle();
        }

        //绘制文字
        Rect bounds = new Rect();
        paint.setColor(Color.parseColor("#333333"));
        paint.setTextSize(titleSize);
        paint.setFakeBoldText(true);

        if (title.length() <= titleCount) {
            paint.getTextBounds(title, 0, title.length(), bounds);
            canvas.drawText(title, 24 * precision, 380 * precision + bounds.height(), paint);
        }
        if (title.length() <= titleCount * 2 && title.length() > titleCount) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 24 * precision, 380 * precision + bounds.height(), paint);
            s = title.substring(titleCount);
            canvas.drawText(s, 24 * precision, 387  * precision + titleSize + bounds.height() , paint);

        }
        if (title.length() > titleCount * 2) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 24 * precision, 380 * precision + bounds.height(), paint);
            s = title.substring(titleCount, titleCount * 2 - 2) + "...";
            canvas.drawText(s, 24 * precision, 387 * precision  + titleSize + bounds.height(), paint);
        }
        paint.setColor(Color.parseColor("#FF0050"));
        paint.setTextSize(30 * precision);
        paint.setFakeBoldText(true);
        String pdj = retailPrice;
        paint.getTextBounds(pdj, 0, pdj.length(), bounds);
        canvas.drawText(pdj, 16 * precision, isTwoLine?440 * precision + bounds.height() : 437 * precision + bounds.height(), paint);

        int tagLeft = 16 * precision;
        int top = isTwoLine ?495 * precision:492*precision;
        paint.setTypeface(null);

        for (String tag : tags) {
            paint.setColor(Color.parseColor("#FF0050"));
            paint.setTextSize(14 * precision);
            paint.getTextBounds(tag, 0, tag.length(), bounds);
            paint.setColor(Color.parseColor("#F8E4EC"));
            int right = tagLeft + bounds.width() + 14 * precision;
            int bottom = top + bounds.height();
            RectF rectF = new RectF(tagLeft, top - 3 * precision, right, bottom + 5 * precision);
            canvas.drawRoundRect(rectF, 3, 3, paint);
            paint.setColor(Color.parseColor("#FF0050"));
            canvas.drawText(tag, tagLeft + 7 * precision, top + bounds.height(), paint);
            tagLeft += bounds.width() + 26 * precision;
        }

        paint.setStrikeThruText(true);
        paint.setTextSize(15 * precision);
        paint.setColor(Color.parseColor("#999999"));
        String marketStr = "市场价： ";
        marketStr += price;
        paint.getTextBounds(marketStr, 0, marketStr.length(), bounds);
        canvas.drawText(marketStr, 16 * precision, 537 * precision + +bounds.height(), paint);
        Bitmap qrBitmap = createQRImage(info, 100 * precision, 100 * precision);
        canvas.drawBitmap(qrBitmap, 252 * precision, 441 * precision, paint);

        paint.setTextSize(15 * precision);
        paint.setColor(Color.parseColor("#333333"));
        paint.setFakeBoldText(true);
        paint.setStrikeThruText(false);
        paint.getTextBounds(tip, 0, tip.length(), bounds);
        if (header != null) {
            int bottomLeft = (375 * precision - 110 * precision - bounds.width()) / 2;
            Bitmap ous = BitmapFactory.decodeResource(context.getResources(), R.drawable.sharelogo);
            paint.setDither(true);
            Bitmap bitmap1 = getCircleHeaderBitmap(ous, precision, 20);
            canvas.drawBitmap(bitmap1, bottomLeft, 613 * precision, paint);
            Bitmap bitmap2 = getCircleHeaderBitmap(header, precision, 20);
            canvas.drawBitmap(bitmap2, bottomLeft + 58 * precision, 613 * precision, paint);
            canvas.drawText(tip, bottomLeft + 110 * precision, 633 * precision + bounds.height() / 2, paint);

            if (bitmap1 != null && !bitmap1.isRecycled()) {
                bitmap1.recycle();
            }
            if (bitmap2 != null && !bitmap2.isRecycled()) {
                bitmap2.recycle();
            }
        } else {
            int bottomLeft = (375 * precision - 52 * precision - bounds.width()) / 2;
            Bitmap ous = BitmapFactory.decodeResource(context.getResources(), R.drawable.sharelogo);
            paint.setDither(true);
            Bitmap bitmap1 = getCircleHeaderBitmap(ous, precision, 20);
            canvas.drawBitmap(bitmap1, bottomLeft, 613 * precision, paint);
            canvas.drawText(tip, bottomLeft + 52 * precision, 633 * precision + bounds.height() / 2, paint);
            if (bitmap1 != null && !bitmap1.isRecycled()) {
                bitmap1.recycle();
            }
        }

        String path = BitmapUtils.saveImageToCache(result, "shareImage.png", shareImageBean.toString());
        if (result != null && !result.isRecycled()) {
            result.recycle();
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
        }


        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }
    }

    private ShareImageBean parseParam(ReadableMap map) {
        ShareImageBean shareImageBean = new ShareImageBean();
        if (map.hasKey("imageUrlStr")) {
            String imgurl = map.getString("imageUrlStr");
            if (!TextUtils.isEmpty(imgurl) && imgurl.contains("?")) {
                imgurl = imgurl.substring(0, imgurl.indexOf("?"));
            }
            shareImageBean.setImageUrlStr(imgurl);
        } else {
            return null;
        }

        if (map.hasKey("QRCodeStr")) {
            shareImageBean.setQRCodeStr(map.getString("QRCodeStr"));
        } else {
            return null;
        }

        if (map.hasKey("titleStr")) {
            shareImageBean.setTitleStr(map.getString("titleStr"));
        } else {
            shareImageBean.setTitleStr("");
        }
        if (map.hasKey("originalPrice")) {
            shareImageBean.setOriginalPrice(map.getString("originalPrice"));
        } else {
            shareImageBean.setOriginalPrice("");
        }

        if (map.hasKey("priceStr")) {
            shareImageBean.setPriceStr(map.getString("priceStr"));
        } else {
            shareImageBean.setPriceStr("");
        }

        if (map.hasKey("retailPrice")) {
            shareImageBean.setRetail(map.getString("retailPrice"));
        } else {
            shareImageBean.setRetail("");
        }

        if (map.hasKey("spellPrice")) {
            shareImageBean.setSpell(map.getString("spellPrice"));
        } else {
            shareImageBean.setSpell("");
        }


        if (map.hasKey("shareMoney")) {
            shareImageBean.setDiscount(map.getString("shareMoney"));
        } else {
            shareImageBean.setDiscount("");
        }


        if (map.hasKey("imageType")) {
            shareImageBean.setImageType(map.getString("imageType"));
        } else {
            shareImageBean.setImageType(null);
        }

        if (map.hasKey("priceType")) {
            ReadableArray array = map.getArray("priceType");
            shareImageBean.setPriceType((ArrayList) array.toArrayList());
        } else {
            shareImageBean.setPriceType(null);
        }

        if (map.hasKey("headerImage")) {
            shareImageBean.setHeaderImage(map.getString("headerImage"));
        } else {
            shareImageBean.setHeaderImage(null);
        }

        if (map.hasKey("userName")) {
            shareImageBean.setUserName(map.getString("userName"));
        } else {
            shareImageBean.setUserName("");
        }

        if (map.hasKey("other")) {
            shareImageBean.setDiamondNum(map.getString("other"));
        } else {
            shareImageBean.setDiamondNum("");
        }

        if (map.hasKey("monthSaleType")) {
            shareImageBean.setMonthSaleType(map.getInt("monthSaleType"));
        } else {
            shareImageBean.setMonthSaleType(0);
        }

        return shareImageBean;
    }

    @ReactMethod
    public void saveImage(String path) {
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);
        ToastUtils.showToast("保存成功");
    }

    private void saveImageAndRefresh(Uri uri) {
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        intent.setData(uri);
        mContext.sendBroadcast(intent);
    }

    @ReactMethod
    public void creatQRCodeImage(String QRCodeStr, final Callback success, final Callback fail) {
        Bitmap bitmap = createQRImage(QRCodeStr, 300, 300);
        if (bitmap == null) {
            fail.invoke("二维码生成失败！");
            return;
        }
        String path = BitmapUtils.saveImageToCache(bitmap, "shareImage.png", QRCodeStr);
        if (TextUtils.isEmpty(path)) {
            fail.invoke("图片保存失败！");
        } else {
            success.invoke(path);
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
    }

    @ReactMethod
    public void createQRToAlbum(String info, Promise promise) {
        Bitmap bitmap = createQRImage(info, 300, 300);
        if (bitmap == null) {
            promise.reject("二维码生成失败！");
            return;
        }
        String path = BitmapUtils.saveImageToCache(bitmap, "shareImage.png", info);
        Uri uri = Uri.parse("file://" + path);
        saveImageAndRefresh(uri);
        if (TextUtils.isEmpty(path)) {
            promise.reject("图片保存失败！");
        } else {
            promise.resolve(path);
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
    }


    @ReactMethod
    public void saveScreen(ReadableMap params, Callback success, Callback fail) {
        screenshot(success, fail);
    }

    /**
     * 获取屏幕
     */
    private void screenshot(Callback success, Callback fail) {
        // 获取屏幕
        View dView = mContext.getCurrentActivity().getWindow().getDecorView();
        dView.setDrawingCacheEnabled(true);
        dView.buildDrawingCache();
        Bitmap bmp = dView.getDrawingCache();
        long date = System.currentTimeMillis();
        String storePath = SDCardUtils.getFileDirPath(mContext, "MR/picture").getAbsolutePath() + File.separator + "screenshotImage.png_" + date;

        File file = new File(storePath);
        if (bmp != null) {
            try {
                if (file.exists()) {
                    file.delete();
                }
                FileOutputStream os = new FileOutputStream(file);
                bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                os.flush();
                os.close();
                Uri uri = Uri.fromFile(file);
                saveImageAndRefresh(uri);

                success.invoke();
            } catch (Exception e) {
                fail.invoke(e.getMessage());
            }
        } else {
            fail.invoke();
        }
        if (bmp != null && !bmp.isRecycled()) {
            bmp.recycle();
            bmp = null;
        }
    }

    /**
     * 生成二维码 要转换的地址或字符串,可以是中文
     *
     * @param url
     * @param width
     * @param height
     * @return
     */
    public static Bitmap createQRImage(String url, final int width, final int height) {
        try {
            // 判断URL合法性
            if (url == null || "".equals(url) || url.length() < 1) {
                return null;
            }
            if (url.contains("http")) {
                if (url.contains("?")) {
                    url = url + "&pageSource=7";
                } else {
                    url = url + "?pageSource=7";
                }
            }

            Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            hints.put(EncodeHintType.MARGIN, 0);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            // 图像数据转换，使用了矩阵转换
            BitMatrix bitMatrix = new QRCodeWriter().encode(url, BarcodeFormat.QR_CODE, width, height, hints);
            int[] pixels = new int[width * height];
            // 下面这里按照二维码的算法，逐个生成二维码的图片，
            // 两个for循环是图片横列扫描的结果
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (bitMatrix.get(x, y)) {
                        pixels[y * width + x] = 0xff000000;
                    } else {
                        pixels[y * width + x] = 0xffffffff;
                    }
                }
            }
            // 生成二维码图片的格式，使用ARGB_8888
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }
}
