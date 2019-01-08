package com.meeruu.sharegoods.rn.module;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.commonlib.bean.IdNameBean;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.FileUtils;
import com.meeruu.commonlib.utils.ImageCacheUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.bean.NetCommonParamsBean;
import com.meeruu.sharegoods.event.HideSplashEvent;
import com.meeruu.sharegoods.event.LoadingDialogEvent;
import com.meeruu.sharegoods.event.VersionUpdateEvent;
import com.qiyukf.unicorn.api.Unicorn;

import org.greenrobot.eventbus.EventBus;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import cn.jpush.android.api.JPushInterface;


public class CommModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "commModule";
    public static final String EVENT_NAME = "nativeCallRn";

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
        ToastUtils.showToast(message);
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
    public void showLoadingDialog(String msg) {
        loadingDialog(true, msg);
    }

    @ReactMethod
    public void hideLoadingDialog() {
        loadingDialog(false, "");
    }

    public void loadingDialog(boolean isShow, String msg) {
        LoadingDialogEvent event = new LoadingDialogEvent();
        event.setShow(isShow);
        if (!TextUtils.isEmpty(msg)) {
            event.setMsg(msg);
        }
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

    /**
     * 图片压缩
     */
    @ReactMethod
    public void RN_ImageCompression(String filePath, int fileSize, int maxSize, Callback callback) {

        File file = new File(filePath);
        if (!file.exists()) {
            ToastUtils.showToast("文件不存在");
            callback.invoke();
            return;
        }
        if (isVideo(filePath)) {
            ToastUtils.showToast("头像不能上传视频");
            callback.invoke();
            return;
        }

        if (isGIF(filePath)) {
            ToastUtils.showToast("头像不支持GIF格式图片");
            callback.invoke();
            return;
        }

        if (fileSize > maxSize) {
            BitmapUtils.compressBitmap(filePath, maxSize / 1024, filePath);
            callback.invoke();
        } else {
            callback.invoke();
        }
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

    @ReactMethod
    public void updateable(String data, boolean force, Callback callback) {
        JSONObject updateObj = JSON.parseObject(data);
        String lastVersion = updateObj.getString("version");
        VersionUpdateEvent event = updateEvent(lastVersion);
        event.setExist(event.isExist());
        event.setApkPath(event.getApkPath());
        event.setDownUrl(updateObj.getString("url"));
        event.setVersion(lastVersion);
        event.setForceUpdate(force);
        event.setCallback(callback);
        event.setContext(mContext);
        EventBus.getDefault().post(event);
    }

    private VersionUpdateEvent updateEvent(String lastVersion) {
        //提示当前有版本更新
        File apkFile = SDCardUtils.getFileDirPath("MR/file");
        String fileName = AppUtils.getAppName() + "_" + lastVersion + ".apk";
        String filePath = apkFile.getAbsolutePath() + File.separator + fileName;
        boolean exist = FileUtils.fileIsExists(filePath);
        VersionUpdateEvent event = new VersionUpdateEvent();
        event.setExist(exist);
        event.setApkPath(filePath);
        return event;
    }

    @ReactMethod
    public void apkExist(String version, Callback callback) {
        callback.invoke(updateEvent(version).isExist());
    }

    @ReactMethod
    public void setLightMode() {
        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    StatusBarUtils.setLightMode(getCurrentActivity());
                }
            });
        }
    }

    @ReactMethod
    public void setDarkMode() {
        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    StatusBarUtils.setDarkMode(getCurrentActivity());
                }
            });
        }
    }

    @ReactMethod
    public void nativeTaskToBack() {
        if (getCurrentActivity() != null) {
            getCurrentActivity().moveTaskToBack(true);
        }
    }

    @ReactMethod
    public void getTotalCacheSize(Callback callback) {
        try {
            long s = ImageCacheUtils.getInstance().getCacheSize(mContext);
            int reslut = new Long(s).intValue();
            callback.invoke(reslut);
        } catch (Exception e) {
            LogUtils.d(e.getMessage());
        }
    }

    @ReactMethod
    public void clearAllCache(Callback callback) {
        try {
            // 清楚七鱼缓存
            Unicorn.clearCache();
            ImageCacheUtils.getInstance().deleteCacheFloder();
            callback.invoke();
        } catch (Exception e) {
            LogUtils.d(e.getMessage());
        }
    }

    @ReactMethod
    public void removeLaunch() {
        EventBus.getDefault().post(new HideSplashEvent());
    }

    @ReactMethod
    public void stopPush() {
        JPushInterface.stopPush(mContext);
    }

    @ReactMethod
    public void resumePush() {
        JPushInterface.resumePush(mContext);
    }

    @ReactMethod
    public void isPushStopped(Callback callback) {
        callback.invoke(JPushInterface.isPushStopped(mContext));
    }

    /*
     * 推送相关方法
     * userId
     * */
    @ReactMethod
    public void updatePushAlias(ReadableMap data) {
        if (data.hasKey("userId")) {
            String lastVersion = data.getString("userId");
            JPushInterface.setAlias(this.mContext, lastVersion, null);
        }
    }

    /**
     * @param data {
     *             environment: "测试"
     *             levelRemark: "V0"
     *             status: "已激活"
     *             version: "1.0.3"
     *             }
     */
    @ReactMethod
    public void updatePushTags(ReadableMap data) {
        HashSet tagSet = new HashSet();

        if (data.hasKey("environment")) {
            tagSet.add(data.getString("environment"));
        }
        if (data.hasKey("levelRemark")) {
            tagSet.add(data.getString("levelRemark"));
        }
        if (data.hasKey("status")) {
            tagSet.add(data.getString("status"));
        }
        if (data.hasKey("version")) {
            tagSet.add(data.getString("version"));
        }
        JPushInterface.setTags(this.mContext, tagSet, null);
    }
}
