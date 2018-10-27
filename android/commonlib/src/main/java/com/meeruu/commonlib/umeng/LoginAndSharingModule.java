package com.meeruu.commonlib.umeng;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.meeruu.commonlib.R;
import com.meeruu.commonlib.bean.WXLoginBean;
import com.meeruu.commonlib.utils.LogUtils;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMMin;
import com.umeng.socialize.media.UMWeb;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.Hashtable;
import java.util.Map;

public class LoginAndSharingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "LoginAndShareModule";

    private static class ShareListener implements UMShareListener {
        Callback success;
        Callback fail;
        WeakReference<Context> contextWeakReference;

        public ShareListener(Context context, Callback success, Callback fail) {
            this.success = success;
            this.fail = fail;
            this.contextWeakReference = new WeakReference<>(context);
        }

        @Override
        public void onStart(SHARE_MEDIA share_media) {

        }

        @Override
        public void onResult(SHARE_MEDIA share_media) {
            Context context = contextWeakReference.get();
            if (null != context) {
                Toast.makeText(context, "成功了", Toast.LENGTH_LONG).show();
            }
            if (success != null) {
                success.invoke();
            }
        }

        @Override
        public void onError(SHARE_MEDIA share_media, Throwable throwable) {
            Context context = contextWeakReference.get();
            if (null != context) {
                Toast.makeText(context, "失败" + throwable.getMessage(), Toast.LENGTH_LONG).show();
            }
            if (fail != null) {
                fail.invoke("失败" + throwable.getMessage());
            }
        }

        @Override
        public void onCancel(SHARE_MEDIA share_media) {
            Context context = contextWeakReference.get();
            if (null != context) {
                Toast.makeText(context, "取消了", Toast.LENGTH_LONG).show();
            }
            if (fail != null) {
                fail.invoke("取消了");
            }
        }
    }

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
//
//         api参考地址：https://developer.umeng.com/docs/66632/detail/66639
//         jsonData 参数
//
//        0图片分享
//        shareImage:分享的大图(本地URL)图片分享使用
//
//        1 图文链接分享
//        title:分享标题(当为图文分享时候使用)
//        dec:内容(当为图文分享时候使用)
//        linkUrl:(图文分享下的链接)
//                thumImage:(分享图标小图 图文分享使用)
//        支持 1.本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）
//                2分享小程序
//                title
//                dec
//                thumImage
//                linkUrl"兼容微信低版本网页地址";
//        userName //"小程序username，如 gh_3ac2059ac66f";
//                miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";

        ShareListener umShareListener = new ShareListener(mContext, success, fail);
        int shareType = params.getInt("shareType");
        SHARE_MEDIA platform = null;
        switch (params.getInt("platformType")) {
            case 0:
                platform = SHARE_MEDIA.WEIXIN;
                break;
            case 1:
                platform = SHARE_MEDIA.WEIXIN_CIRCLE;
                break;
            case 2:
                platform = SHARE_MEDIA.QQ;
                break;
            case 3:
                platform = SHARE_MEDIA.QZONE;
                break;
            case 4:
                platform = SHARE_MEDIA.SINA;
                break;
            default:
                if (fail != null) {
                    fail.invoke("获取分享平台失败！");
                }
                break;
        }


        switch (shareType) {
            case 0:
                UMImage image = fixThumImage(params.getString("thumImage"));
                new ShareAction(getCurrentActivity()).setPlatform(platform)//传入平台
                        .withMedia(image).setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 1:
                image = fixThumImage(params.getString("thumImage"));
                UMWeb web = new UMWeb(params.getString("linkUrl"));
                web.setTitle(params.getString("title"));//标题
                web.setThumb(image);  //缩略图
                web.setDescription(params.getString("dec"));//描述
                new ShareAction(getCurrentActivity()).setPlatform(platform)//传入平台
                        .withMedia(web).withText(params.getString("dec"))//分享内容
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 2:
                UMMin umMin = new UMMin(params.getString("linkUrl"));
                image = fixThumImage(params.getString("thumImage"));
                //兼容低版本的网页链接
                umMin.setThumb(image);
                // 小程序消息封面图片
                umMin.setTitle(params.getString("title"));
                // 小程序消息title
                umMin.setDescription(params.getString("dec"));
                // 小程序消息描述
                umMin.setPath(params.getString("miniProgramPath"));
                //小程序页面路径
                umMin.setUserName(params.getString("userName"));
                // 小程序原始id,在微信平台查询
                new ShareAction(mContext.getCurrentActivity()).withMedia(umMin).setPlatform(platform).setCallback(umShareListener).share();

        }
    }

    //本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）
    private UMImage fixThumImage(String url) {
        if (TextUtils.isEmpty(url)) {
            return null;
        }
        if (url.startsWith("http")) {
            return new UMImage(getCurrentActivity(), url);//网络图片
        } else if (url.startsWith("/")) {
            File file = new File(url);
            return new UMImage(mContext, file);//本地文件
        } else {
            if (url.endsWith(".png") || url.endsWith(".jpg")) {
                url = url.substring(0, url.length() - 4);
            }
            int res = getRes(url);
            if (res == 0) {
                return new UMImage(mContext, R.mipmap.ic_launcher);
            } else {
                return new UMImage(mContext, getRes(url));//资源文件
            }
        }
    }

    public int getRes(String name) {
        ApplicationInfo appInfo = mContext.getApplicationInfo();
        int resID = mContext.getResources().getIdentifier(name, "drawable", appInfo.packageName);
        return resID;
    }

    @ReactMethod
    public void loginWX(final Callback callback) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).getPlatformInfo(getCurrentActivity(), SHARE_MEDIA.WEIXIN, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                Log.e(TAG, "onStart授权开始: ");
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

                Log.e(TAG, "onStart授权完成: " + openid);
                Log.e(TAG, "onStart授权完成: " + unionid);
                Log.e(TAG, "onStart授权完成: " + access_token);
                Log.e(TAG, "onStart授权完成: " + refresh_token);
                Log.e(TAG, "onStart授权完成: " + expires_in);
                Log.e(TAG, "onStart授权完成: " + uid);
                Log.e(TAG, "onStart授权完成: " + name);
                Log.e(TAG, "onStart授权完成: " + gender);
                Log.e(TAG, "onStart授权完成: " + iconurl);
                umengDeleteOauth(SHARE_MEDIA.WEIXIN);
                WXLoginBean bean = new WXLoginBean();
                bean.setDevice(android.os.Build.DEVICE);
                bean.setOpenid(openid);
                bean.setSystemVersion(android.os.Build.VERSION.RELEASE);
                bean.setNickName(name);
                LogUtils.d("==========" + JSON.toJSONString(bean));
                callback.invoke(JSON.toJSONString(bean));
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Toast.makeText(getCurrentActivity(), "授权失败", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权失败");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Toast.makeText(getCurrentActivity(), "授权取消", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权取消");
            }
        });
    }

    private void umengDeleteOauth(SHARE_MEDIA share_media_type) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).deleteOauth(getCurrentActivity(), share_media_type, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                //开始授权
                Log.e(TAG, "onStart: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //取消授权成功 i=1
                Log.e(TAG, "onComplete: ");
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                //授权出错
                Log.e(TAG, "onError: ");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                //取消授权
                Log.e(TAG, "onCancel: ");
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

        getBitmap(mContext, shareImageBean, success, fail);


    }


    public static void getBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        Fresco.initialize(context);

        ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(shareImageBean.getImageUrlStr())).setProgressiveRenderingEnabled(true).build();


        DataSource<CloseableReference<CloseableImage>> dataSource = Fresco.getImagePipeline().fetchDecodedImage(imageRequest, context);

        dataSource.subscribe(new BaseBitmapDataSubscriber() {

            @Override
            public void onNewResultImpl(Bitmap bitmap) {

                draw(context, bitmap, shareImageBean, success, fail);
            }

            @Override
            public void onFailureImpl(DataSource dataSource) {
            }
        }, CallerThreadExecutor.getInstance());

    }

    public static void draw(Context context, Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail) {

        String title = shareImageBean.getTitleStr();
        String price = shareImageBean.getPriceStr();
        String info = shareImageBean.getQRCodeStr();

        int titleSize = 26;
        int priceSize = 24;
        int titleCount = (int) ((500 * 0.57) / titleSize);
//        height: autoSizeWidth(650 / 2), width: autoSizeWidth(250)
        Bitmap result = Bitmap.createBitmap(500, (int) (660), Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        bitmap = Bitmap.createScaledBitmap(bitmap, 500, 500, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);

        //在图片下边画一个白色矩形块用来放文字，防止文字是透明背景，在有些情况下保存到本地后看不出来

        paint.setColor(Color.WHITE);
        canvas.drawRect(0, 500, 500, 660, paint);
        paint.setColor(Color.BLACK);

        //绘制文字
        paint.setColor(Color.BLACK);
        paint.setTextSize(titleSize);
        Rect bounds = new Rect();
        if (title.length() <= titleCount) {
            String s = title.substring(0, title.length());
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, s.length(), bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 12, 500 + 30, paint);
        }
        if (title.length() <= titleCount * 2 && title.length() > titleCount) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 12, 500 + 30, paint);

            s = title.substring(titleCount, title.length());

            canvas.drawText(s, 12, 500 + 30 + titleSize + 8 + bounds.height() / 2, paint);
        }

        if (title.length() > titleCount * 2) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 12, 500 + 30, paint);

            s = title.substring(titleCount, titleCount * 2 - 3) + "...";

            canvas.drawText(s, 12, 500 + 30 + titleSize + 8 + bounds.height() / 2, paint);
        }

        paint.setColor(Color.RED);
        paint.setTextSize(priceSize);
        Rect boundsPrice = new Rect();
        paint.getTextBounds(price, 0, price.length(), boundsPrice);
        canvas.drawText(price, 12, 610, paint);

        Bitmap qrBitmap = createQRImage(info, 120, 120);
        canvas.drawBitmap(qrBitmap, 360, 520, paint);
        String path = saveImageToCache(context, result);
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }
    }

    private ShareImageBean parseParam(ReadableMap map) {
        ShareImageBean shareImageBean = new ShareImageBean();
        if (map.hasKey("imageUrlStr")) {
            shareImageBean.setImageUrlStr(map.getString("imageUrlStr"));
        } else {
            return null;
        }

        if (map.hasKey("titleStr")) {
            shareImageBean.setTitleStr(map.getString("titleStr"));
        } else {
            return null;
        }

        if (map.hasKey("priceStr")) {
            shareImageBean.setPriceStr(map.getString("priceStr"));
        } else {
            return null;
        }

        if (map.hasKey("QRCodeStr")) {
            shareImageBean.setQRCodeStr(map.getString("QRCodeStr"));
        } else {
            return null;
        }
        return shareImageBean;
    }

    @ReactMethod
    public void saveImage(String path) {
        try {
            MediaStore.Images.Media.insertImage(mContext.getContentResolver(), path, path, null);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        // 最后通知图库更新
        mContext.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse(path)));
    }

    @ReactMethod
    public void creatQRCodeImage(String QRCodeStr, final Callback success, final Callback fail) {
        Bitmap bitmap = createQRImage(QRCodeStr, 100, 100);
        if (bitmap == null) {
            fail.invoke("二维码生成失败！");
            bitmap.recycle();
            return;
        }
        String path = saveImageToCache(mContext, bitmap);
        if (TextUtils.isEmpty(path)) {
            fail.invoke("图片保存失败！");
        } else {
            success.invoke(path);
        }

        bitmap.recycle();
    }

    @ReactMethod
    public void saveScreen(ReadableMap params) {
        if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(mContext.getCurrentActivity(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 54);
            Log.i("-->", "权限申请");
        } else {
            screenshot();
        }
    }

    /**
     * 获取屏幕
     */
    private void screenshot() {
        // 获取屏幕
        View dView = mContext.getCurrentActivity().getWindow().getDecorView();
        dView.setDrawingCacheEnabled(true);
        dView.buildDrawingCache();
        Bitmap bmp = dView.getDrawingCache();

        String path = getDiskCachePath(mContext);
        String fileName = "screenshotImage.png";

        File file = new File(path, fileName);

        if (bmp != null) {
            try {
                if (file.exists()) {
                    file.delete();
                }


                FileOutputStream os = new FileOutputStream(file);
                bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                os.flush();
                os.close();
                long currentTime = System.currentTimeMillis();
                String name = "shot" + currentTime;
                String mUri = MediaStore.Images.Media.insertImage(mContext.getContentResolver(), file.getPath(), file.getName(), null);

                if (mUri != null) {
                    Toast.makeText(mContext, "截图成功", Toast.LENGTH_SHORT).show();
                    // 最后通知图库更新
                    Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                    Uri uri = Uri.fromFile(new File(mUri));
                    intent.setData(uri);
                    mContext.sendBroadcast(intent);
                } else {
                    Toast.makeText(mContext, "截图失败", Toast.LENGTH_SHORT).show();
                }

            } catch (Exception e) {

            }
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
            Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
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

    private static String saveImageToCache(Context context, Bitmap bitmap) {

        String path = getDiskCachePath(context);
        long date = System.currentTimeMillis();
        String fileName = date + "shareImage.png";
        File file = new File(path, fileName);
        if (file.exists()) {
            file.delete();
        }
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file.getAbsolutePath();
    }

    /**
     * 获取cache路径
     *
     * @param context
     * @return
     */
    public static String getDiskCachePath(Context context) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()) || !Environment.isExternalStorageRemovable()) {
            return context.getExternalCacheDir().getPath();
        } else {
            return context.getCacheDir().getPath();
        }
    }


}
