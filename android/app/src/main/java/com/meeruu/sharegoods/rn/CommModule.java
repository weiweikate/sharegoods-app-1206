package com.meeruu.sharegoods.rn;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.commonlib.bean.IdNameBean;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.meeruu.sharegoods.bean.NetCommonParamsBean;
import com.meeruu.sharegoods.event.LoadingDialogEvent;

import org.greenrobot.eventbus.EventBus;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;


public class CommModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "commModule";
    public static final String EVENT_NAME = "nativeCallRn";
    public static final String TAG = "CommModule";

    public static final String EVENT_UPDATE_IMG_URL = "uploadedImageURL";
    public static final String EVENT_SELECT_CONTACTS = "ContactSelected";
    public static final String EVENT_ADD_PHOTO = "AddPhotos";
    public static ArrayList<IdNameBean> options1Items = new ArrayList<IdNameBean>();
    public static ArrayList<ArrayList<IdNameBean>> options2Items = new ArrayList<ArrayList<IdNameBean>>();
    public static ArrayList<ArrayList<ArrayList<IdNameBean>>> options3Items = new ArrayList<ArrayList<ArrayList<IdNameBean>>>();

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public CommModule(ReactApplicationContext reactContext) {
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

    /**
     * RN调用Native的方法
     *
     * @param phone
     */
    @ReactMethod
    public void rnCallNative(String phone) {
        // 跳转到打电话界面
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_CALL);
        intent.setData(Uri.parse("tel:" + phone));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // 跳转需要添加flag, 否则报错
        mContext.startActivity(intent);
    }

    /**
     * Native调用RN
     *
     * @param msg
     */
    public void nativeCallRn(String msg) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_NAME, msg);
    }

    /**
     * Callback 方式
     * rn调用Native,并获取返回值
     *
     * @param msg
     * @param callback
     */
    @ReactMethod
    public void rnCallNativeFromCallback(String msg, Callback callback) {

        // 1.处理业务逻辑...
        String result = "处理结果：" + msg;
        // 2.回调RN,即将处理结果返回给RN
        callback.invoke(result);
    }

    /**
     * Promise
     *
     * @param msg
     * @param promise
     */
    @ReactMethod
    public void rnCallNativeFromPromise(String msg, Promise promise) {

        // 1.处理业务逻辑...
        String result = "处理结果：" + msg;
        // 2.回调RN,即将处理结果返回给RN
        promise.resolve(result);
    }

    /**
     * 功能：toast消息
     */
    @ReactMethod
    public void toast(final String msg) {
        String message = msg + "";
        Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
    }

    /**
     * 获取网络请求通用参数
     */
    @ReactMethod
    public void netCommParas(Callback callback) {
        final NetCommonParamsBean paramsBean = new NetCommonParamsBean();
        callback.invoke(JSON.toJSONString(paramsBean));
    }

    /**
     * Native调用RN
     *
     * @param //msg
     */
    public void nativeCallRnUpdateHeadImg(String imgUrl) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_UPDATE_IMG_URL, imgUrl);
    }

    public void nativeCallRnLoadPhoto(List<String> photos) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ADD_PHOTO, photos);
    }

    /**
     * Native调用RN
     *
     * @param //msg
     */
    public void nativeCallRnSelectContacts(String phone) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_SELECT_CONTACTS, phone);
    }

    /**
     * 功能显示加载弹窗
     */
    @ReactMethod
    public void showLoadingDialog() {
        loadingDialog(true);
    }

    @ReactMethod
    public void hideLoadingDialog() {
        loadingDialog(false);
    }

    public void loadingDialog(boolean isShow) {
        LoadingDialogEvent event = new LoadingDialogEvent();
        event.setShow(isShow);
        EventBus.getDefault().post(event);
    }


    /**
     * RCTDeviceEventEmitter方式
     *
     * @param reactContext
     * @param eventName    事件名
     * @param params       传惨
     */
    public void sendTransMisson(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);

    }

    @ReactMethod
    public void clearCookie(String url) {
        CookieSyncManager.createInstance(mContext);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.removeSessionCookie();//移除
        cookieManager.setCookie(url, "");//指定要修改的cookies
        CookieSyncManager.getInstance().sync();
    }

    @ReactMethod
    public void getCookie(String url, Callback callback) {
        CookieSyncManager.createInstance(mContext);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        callback.invoke(cookieManager.getCookie(url));
    }

    @ReactMethod
    public void setStatusMode(String tag) {
        if ("HomePage".equals(tag)) {
            if (getCurrentActivity() != null) {
                getCurrentActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        StatusBarUtils.setDarkMode(getCurrentActivity());
                    }
                });
            }
        } else {
            if (getCurrentActivity() != null) {
                getCurrentActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        StatusBarUtils.setLightMode(getCurrentActivity());
                    }
                });
            }
        }
    }

    @ReactMethod
    public void setStatusTrans() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                StatusBarUtils.setTransparent(getCurrentActivity());
            }
        });
    }

    /**
     * 图片压缩
     */
    @ReactMethod
    public void RN_ImageCompression(String filePath, int fileSize, int maxSize, Callback callback) {

        File file = new File(filePath);
        if (!file.exists()) {
            Toast.makeText(mContext, "文件不存在", Toast.LENGTH_LONG).show();
            callback.invoke();
            return;
        }
        if (isVideo(filePath)) {
            Toast.makeText(mContext, "头像不能上传视频", Toast.LENGTH_LONG).show();
            callback.invoke();
            return;
        }

        if (isGIF(filePath)) {
            Toast.makeText(mContext, "头像不支持GIF格式图片", Toast.LENGTH_LONG).show();
            callback.invoke();
            return;
        }

        if(fileSize > maxSize){
            compressBitmap(filePath,maxSize/1024,filePath);
            callback.invoke();
        }else {
            callback.invoke();
        }
    }

    public static boolean compressBitmap(String srcPath, int ImageSize, String savePath) {
        int subtract;

        Bitmap bitmap = compressByResolution(srcPath, 1024, 720); //分辨率压缩
        if (bitmap == null) {
            Log.i(TAG, "bitmap 为空");
            return false;
        }
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int options = 100;
        bitmap.compress(Bitmap.CompressFormat.JPEG, options, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        Log.i(TAG, "图片分辨率压缩后：" + baos.toByteArray().length / 1024 + "KB");


        while (baos.toByteArray().length > ImageSize * 1024) {  //循环判断如果压缩后图片是否大于ImageSize kb,大于继续压缩
            subtract = setSubstractSize(baos.toByteArray().length / 1024);
            baos.reset();//重置baos即清空baos
            options -= subtract;//每次都减少10
            bitmap.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            Log.i(TAG, "图片压缩后：" + baos.toByteArray().length / 1024 + "KB");
        }
        Log.i(TAG, "图片处理完成!" + baos.toByteArray().length / 1024 + "KB");
        try {
            FileOutputStream fos = new FileOutputStream(new File(savePath));//将压缩后的图片保存的本地上指定路径中
            fos.write(baos.toByteArray());
            fos.flush();
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (bitmap != null) {
            bitmap.recycle();
        }

        return true;  //压缩成功返回ture
    }

    /**
     * 根据图片的大小设置压缩的比例，提高速度
     *
     * @param imageMB
     * @return
     */
    private static int setSubstractSize(int imageMB) {

        if (imageMB > 1000) {
            return 60;
        } else if (imageMB > 750) {
            return 40;
        } else if (imageMB > 500) {
            return 20;
        } else {
            return 10;
        }

    }


    private static Bitmap compressByResolution(String imgPath, int w, int h) {
        BitmapFactory.Options opts = new BitmapFactory.Options();
        opts.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(imgPath, opts);

        int width = opts.outWidth;
        int height = opts.outHeight;
        int widthScale = width / w;
        int heightScale = height / h;

        int scale;
        if (widthScale < heightScale) {  //保留压缩比例小的
            scale = widthScale;
        } else {
            scale = heightScale;
        }

        if (scale < 1) {
            scale = 1;
        }


        opts.inSampleSize = scale;

        opts.inJustDecodeBounds = false;

        Bitmap bitmap = BitmapFactory.decodeFile(imgPath, opts);

        return bitmap;
    }



    public boolean isGIF(String path) {
        if (path.toLowerCase().endsWith(".gif")) {
            return true;
        } else {
            return false;
        }
    }

    public boolean isImage(@NonNull String path) {
        final String[] imageTypes = {".png", ".jpg", ".jpeg"};
        String filePath = path.toLowerCase();
        for (int i = 0; i < imageTypes.length; i++) {
            if (filePath.endsWith(imageTypes[i])) {
                return true;
            }
        }
        return false;
    }

    public boolean isVideo(@NonNull String path) {
        final String[] videoTypes = {"avi", "wmv", "mpeg", "mp4", "mov", "mkv", "flv", "f4v", "m4v", "rmvb", "rm", "3gp"};
        String filePath = path.toLowerCase();
        for (int i = 0; i < videoTypes.length; i++) {
            if (filePath.endsWith(videoTypes[i])) {
                return true;
            }
        }
        return false;
    }


    public Uri getMediaUriFromPath(Context context, String path) {
        Uri mediaUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        Cursor cursor = context.getContentResolver().query(mediaUri, null, MediaStore.Images.Media.DISPLAY_NAME + "= ?", new String[]{path.substring(path.lastIndexOf("/") + 1)}, null);

        Uri uri = null;
        if (cursor.moveToFirst()) {
            uri = ContentUris.withAppendedId(mediaUri, cursor.getLong(cursor.getColumnIndex(MediaStore.Images.Media._ID)));
        }
        cursor.close();
        return uri;
    }


    private String getRealFilePath(final Context context, final Uri uri) {
        if (null == uri) {
            return null;
        }
        final String scheme = uri.getScheme();
        String data = null;
        if (scheme == null) {
            data = uri.getPath();
        } else if (ContentResolver.SCHEME_FILE.equals(scheme)) {
            data = uri.getPath();
        } else if (ContentResolver.SCHEME_CONTENT.equals(scheme)) {
            Cursor cursor = context.getContentResolver().query(uri, new String[]{MediaStore.Images.ImageColumns.DATA}, null, null, null);
            if (null != cursor) {
                if (cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                    if (index > -1) {
                        data = cursor.getString(index);
                    }
                }
                cursor.close();
            }
        }
        return data;
    }

    //    @ReactMethod
    //    public void updateable(final String downUrl, String version, String des) {
    //        this.lastVersion = version;
    //        //提示当前有版本更新
    //        File apkfile_file = SDCardUtils.getFileDirPath("MR/file");
    //        String fileName = AppUtils.getAppName(getCurrentActivity()) + "_" + lastVersion + ".apk";
    //        final String filePath = apkfile_file.getAbsolutePath() + File.separator + fileName;
    //        final boolean exist = FileUtils.fileIsExists(filePath);
    //        String positiveTxt = getString(R.string.update_vs_now);
    //        String title = getString(R.string.version_update);
    //        if (exist) {
    //            apkPath = filePath;
    //            title = getString(R.string.version_install);
    //            positiveTxt = getString(R.string.install_now);
    //        }
    //        updateDialog = DialogCreator.createAppBasicDialog(this, title, des,
    //                positiveTxt, getString(R.string.not_update), new View.OnClickListener() {
    //                    @Override
    //                    public void onClick(View v) {
    //                        switch (v.getId()) {
    //                            case R.id.positive_btn:
    //                                if (exist) {
    //                                    handleInstallApk();
    //                                } else {
    //                                    BaseApplication.getInstance().setDownload(true);
    //                                    BaseApplication.getInstance().setDownLoadUrl(downUrl);
    //                                    //开始下载
    //                                    Intent it = new Intent(SettingActivity.this, VersionUpdateService.class);
    //                                    it.putExtra("version", lastVersion);
    //                                    startService(it);
    //                                    bindService(it, conn, Context.BIND_AUTO_CREATE);
    //                                }
    //                                updateDialog.dismiss();
    //                                break;
    //                            case R.id.negative_btn:
    //                                updateDialog.dismiss();
    //                                break;
    //                            default:
    //                                break;
    //                        }
    //                    }
    //                });
    //        ((TextView) updateDialog.findViewById(R.id.dialog_info)).setGravity(Gravity.CENTER_VERTICAL);
    //        if (!isFinishing()) {
    //            updateDialog.show();
    //        }
    //    }

}
