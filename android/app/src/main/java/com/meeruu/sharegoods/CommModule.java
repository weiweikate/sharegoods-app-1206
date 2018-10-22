package com.meeruu.sharegoods;

import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.meeruu.commonlib.bean.IdNameBean;
import com.meeruu.commonlib.customview.pickerview.builder.OptionsPickerBuilder;
import com.meeruu.commonlib.customview.pickerview.listener.OnOptionsSelectListener;
import com.meeruu.commonlib.customview.pickerview.view.OptionsPickerView;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.meeruu.sharegoods.bean.AreaListResponse;
import com.meeruu.sharegoods.bean.CityPickerBean;
import com.meeruu.sharegoods.bean.NetCommonParamsBean;
import com.meeruu.sharegoods.event.CaptureScreenImageEvent;
import com.meeruu.sharegoods.event.LoadingDialogEvent;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;


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
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_NAME, msg);
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
        callback.invoke(new Gson().toJson(paramsBean));
    }

    /**
     * Native调用RN
     *
     * @param //msg
     */
    public void nativeCallRnUpdateHeadImg(String imgUrl) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_UPDATE_IMG_URL, imgUrl);
    }

    public void nativeCallRnLoadPhoto(List<String> photos) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_ADD_PHOTO, photos);
    }

    /**
     * Native调用RN
     *
     * @param //msg
     */
    public void nativeCallRnSelectContacts(String phone) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_SELECT_CONTACTS, phone);
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
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);

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
    public void captureScreenImage(ReadableMap params, Callback callback) throws JSONException {
        int left = (int) params.getDouble("left");
        int top = (int) params.getDouble("top");
        int width = (int) params.getDouble("width");
        int height = (int) params.getDouble("height");
        boolean allScreen = false;
        try {
            params.getBoolean("allScreen");
        } catch (Exception e) {
            allScreen = false;
        }
        CaptureScreenImageEvent event = new CaptureScreenImageEvent();
        event.setLeft(left);
        event.setTop(top);
        event.setWidth(width);
        event.setHeight(height);
        event.setAllScreen(allScreen);
        event.setCallback(callback);
        EventBus.getDefault().post(event);
    }

    @ReactMethod
    public void setStatusMode(String tag) {
        if ("HomePage".equals(tag)) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    StatusBarUtils.setDarkMode(getCurrentActivity());
                }
            });
        } else {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    StatusBarUtils.setLightMode(getCurrentActivity());
                }
            });
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
}
