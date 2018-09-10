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
import com.meeruu.sharegoods.bean.AreaListResponse;
import com.meeruu.sharegoods.bean.CityPickerBean;
import com.meeruu.sharegoods.bean.NetCommonParamsBean;
import com.meeruu.sharegoods.event.CaptureScreenImageEvent;
import com.meeruu.sharegoods.event.LoadingDialogEvent;
import com.meeruu.sharegoods.utils.Utils;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class CommModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "commModule";
    public static final String EVENT_NAME = "nativeCallRn";
    public static final String EVENT_NAME1 = "getPatchImgs";

    public static final String EVENT_UPDATE_IMG_URL = "uploadedImageURL";
    public static final String EVENT_SELECT_CONTACTS = "ContactSelected";
    public static final String EVENT_ADD_PHOTO = "AddPhotos";
    //    private TimePickerView timePicker;
    public static ArrayList<IdNameBean> options1Items = new ArrayList<IdNameBean>();
    public static ArrayList<ArrayList<IdNameBean>> options2Items = new ArrayList<ArrayList<IdNameBean>>();
    public static ArrayList<ArrayList<ArrayList<IdNameBean>>> options3Items = new ArrayList<ArrayList<ArrayList<IdNameBean>>>();
    private OptionsPickerView pvOptions;

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
     * RN调用Native的方法
     */
    @ReactMethod
    public void rnModalContactList() {
        // 跳转到系统联系人界面
//        HandlerUtils.runOnUiThread(() -> {
//            Activity activity = getCurrentActivity();
//            if (null != activity) {
//                new RxPermissions(activity)
//                        .request(Manifest.permission.READ_CONTACTS)
//                        .subscribe(granted -> {
//                            if (!granted) {
//                                DialogManager.getSingleton().showReadContactsDialog(activity);
//                            }
//                        });
//                BusniessUtils.startContactsNoRepeatList(getCurrentActivity());
//            }
//        });


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


    private void handleH5(JSONObject jsonObject) throws JSONException {

    }

    /**
     * 功能：toast消息
     */
    @ReactMethod
    public void toast(final String msg) {
        String message = msg + "";
        Toast.makeText(mContext, message, message.length() > 10 ? Toast.LENGTH_SHORT : Toast.LENGTH_SHORT).show();
    }

    /**
     * 获取网络请求通用参数
     */
    @ReactMethod
    public void netCommParas(Callback callback) {
        final NetCommonParamsBean paramsBean = new NetCommonParamsBean();
        callback.invoke(new Gson().toJson(paramsBean));
    }

    @ReactMethod
    public void showCommDialog(String dialogType, Callback callback) {
//        HandlerUtils.runOnUiThread(() -> {
//            final Context context = mContext.getCurrentActivity();
//            switch (dialogType) {
//                case "exitApp":
//
//                    break;
//                case "updatePersonalAvatar":
//                    DialogManager.getSingleton().showPhotoSelectDialog(context);
//                    break;
//                default:
//            }
//        });
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

    @ReactMethod
    public void isHaveBottomNav(Callback callback) {
//        callback.invoke(ScreenUtils.hasSoftKeys(mContext.getCurrentActivity()));
    }

    @ReactMethod
    public void putNativeStore(String key, String value) {
        Utils.setUserData(mContext, key, value);
    }

    @ReactMethod
    public void getNativeStore(String key, Callback callback) {
        callback.invoke(Utils.getUserData(mContext, key));
    }
    //Array -> ReadableArray，android使用ReadableArray提供的array与map互转api效率较低易卡顿
//    @ReactMethod
//    public void setCityPicker(ReadableArray params) {
//        CommModule.options1Items.clear();CommModule.options2Items.clear();CommModule.options3Items.clear();
//        if (params.size()!=0){
//            for (int i=0;i<params.size();i++){
//                ArrayList<CityBean> option2Items_temp=new ArrayList<>();option2Items_temp.clear();//添加市缓存
//                ArrayList<ArrayList<DistricBean>>option3Iteems_temp2=new ArrayList<>();option3Iteems_temp2.clear();//添加区缓存2级
//                for (int j=0;j<params.getMap(i).getArray("value").size();j++){
//                    ArrayList<DistricBean>option3Item_temp1=new ArrayList<>();option3Item_temp1.clear();//添加区缓存1级别
//                    for (int k=0;k<params.getMap(i).getArray("value").getMap(j).getArray("value").size();k++){
//                        option3Item_temp1.add(new DistricBean(params.getMap(i).getArray("value").getMap(j).getArray("value").getMap(k).getInt("code"), params.getMap(i).getArray("value").getMap(j).getArray("value").getMap(k).getString("name")));
//                    }
//                    //如果区为空
//                    if (params.getMap(i).getArray("value").getMap(j).getArray("value").size()==0){
//                        option3Item_temp1.add(new DistricBean(-1,""));
//                    }
//                    option3Iteems_temp2.add(option3Item_temp1);
//                    option2Items_temp.add(new CityBean(params.getMap(i).getArray("value").getMap(j).getInt("code"),params.getMap(i).getArray("value").getMap(j).getString("name")));
//                }
//                //如果市为空
//                if (params.getMap(i).getArray("value").size()==0){
//                    ArrayList<DistricBean>option3Item_temp1=new ArrayList<>();
//                    option3Item_temp1.add(new DistricBean(-1,""));
//                    option3Iteems_temp2.add(option3Item_temp1);
//                    option2Items_temp.add(new CityBean(-1,""));
//                }
//                CommModule.options1Items.add(new ProvinceBean(params.getMap(i).getInt("code"),params.getMap(i).getString("name")));//添加省
//                CommModule.options2Items.add(option2Items_temp);//添加市
//                CommModule.options3Items.add(option3Iteems_temp2);//添加区
//            }
//        }
//    }

    @ReactMethod
    public void setCityPicker(String str) {
        List<AreaListResponse> list = (new Gson()).fromJson(str, new TypeToken<List<AreaListResponse>>() {
        }.getType());
        CommModule.options1Items.clear();
        CommModule.options2Items.clear();
        CommModule.options3Items.clear();
        if (list.size() != 0) {
            for (int i = 0; i < list.size(); i++) {
                ArrayList<IdNameBean> option2Items_temp = new ArrayList<>();
                option2Items_temp.clear();//添加市缓存
                ArrayList<ArrayList<IdNameBean>> option3Iteems_temp2 = new ArrayList<>();
                option3Iteems_temp2.clear();//添加区缓存2级
                for (int j = 0; j < list.get(i).getValue().size(); j++) {
                    ArrayList<IdNameBean> option3Item_temp1 = new ArrayList<>();
                    option3Item_temp1.clear();//添加区缓存1级别
                    for (int k = 0; k < list.get(i).getValue().get(j).getValue().size(); k++) {
                        option3Item_temp1.add(new IdNameBean(list.get(i).getValue().get(j).getValue().get(k).getCode(), list.get(i).getValue().get(j).getValue().get(k).getName()));
                    }
                    //如果区为空
                    if (list.get(i).getValue().get(j).getValue().size() == 0) {
                        option3Item_temp1.add(new IdNameBean(-1, ""));
                    }
                    option3Iteems_temp2.add(option3Item_temp1);
                    option2Items_temp.add(new IdNameBean(list.get(i).getValue().get(j).getCode(), list.get(i).getValue().get(j).getName()));
                }
                //如果市为空
                if (list.get(i).getValue().size() == 0) {
                    ArrayList<IdNameBean> option3Item_temp1 = new ArrayList<>();
                    option3Item_temp1.add(new IdNameBean(-1, ""));
                    option3Iteems_temp2.add(option3Item_temp1);
                    option2Items_temp.add(new IdNameBean(-1, ""));
                }
                CommModule.options1Items.add(new IdNameBean(list.get(i).getCode(), list.get(i).getName()));//添加省
                CommModule.options2Items.add(option2Items_temp);//添加市
                CommModule.options3Items.add(option3Iteems_temp2);//添加区
            }
        }
    }

    //地址选择器弹窗
    @ReactMethod
    public void cityPicker(final Callback callback) {
        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            public void run() {
                if (options1Items.size() == 0) {
//                    ApiManager.getAreaList(mContext.getCurrentActivity(), areaListResponse -> {
//                        EventBus.getDefault().postSticky(areaListResponse);
//                    });
                    Toast.makeText(mContext, "commModule", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    pvOptions = new OptionsPickerBuilder(mContext.getCurrentActivity(), new OnOptionsSelectListener() {
                        @Override
                        public void onOptionsSelect(int options1, int options2, int options3, View v) {
                            CityPickerBean cityPickerBean = new CityPickerBean();
                            cityPickerBean.setProvinceName(options1Items.get(options1).getPickerViewText());
                            cityPickerBean.setProvinceId(options1Items.get(options1).getId());
                            cityPickerBean.setCityName(options2Items.get(options1).get(options2).getName());
                            cityPickerBean.setCityId(options2Items.get(options1).get(options2).getId());
                            cityPickerBean.setDistricName(options3Items.get(options1).get(options2).get(options3).getName());
                            cityPickerBean.setDistricId(options3Items.get(options1).get(options2).get(options3).getId());
                            callback.invoke((new Gson()).toJson(cityPickerBean));
                        }
                    }).setLayoutRes(R.layout.pickerview_options, null).setCyclic(false, false, false)
                            .setTitleText("选择城市").setSelectOptions(0, 0, 0).build();
                    // 初始化三个列表数据
                    //三级联动效果
                    pvOptions.setPicker(options1Items, options2Items, options3Items);
                    pvOptions.show();
                }
            }
        });
    }
//        HandlerUtils.runOnUiThread(new Runnable() {
//            @Override
//            public void run() {

//        });
//    }

    //选取照片Dialog
    @ReactMethod
    public void showPhotoDialog(boolean isSingle, int maxNum) {
//        PhotoSelectDialog dialogChooseImage = new PhotoSelectDialog(getCurrentActivity(), isSingle, maxNum);
//        dialogChooseImage.show();
    }

    @ReactMethod
    public void netWorkState(Callback callback) {
//        callback.invoke(NetWorkUtils.isConnectedByState(mContext));
    }

    private String getTime(Date date) {//可根据需要自行截取数据显示
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    //三方登录
    @ReactMethod
    public void thirdLogin(String type) {
        /*
         * 假数据？（因为取值需要翻墙，这里是个开关）
         * */
//        boolean isDefaultData = false;
//        if (isDefaultData) {
//            WritableMap writableMap = new WritableNativeMap();
//            writableMap.putString("userId", "359126924572054");
//            writableMap.putString("accessToken", "EAAODMYhdcIgBAIVSDsYWtVZAKTwRH99N7KTPu1mUhHDgcLkkYbmTTZCe7oEuPZBHMreoXZA0Nzvjv3ZBFxMXm9bXXV87ZAEP6qo3jKWiFf0X9eZAI7Vm6yenpnGgxRJnTpRJeZAcgNIPTdaSB2xYwZC8eH1HWAlvOdW8QR33LSIweHwZDZD");
//            sendTransMisson(mContext, "thirdLoginMessage", writableMap);
//        } else {
//            int index = Integer.valueOf(type);
//            String[] platform = {"", Facebook.NAME, GooglePlus.NAME};
//            Platform facebook = ShareSDK.getPlatform(platform[index]);
//            //回调信息，可以在这里获取基本的授权返回的信息，但是注意如果做提示和UI操作要传到主线程handler里去执行
//            facebook.setPlatformActionListener(new PlatformActionListener() {
//
//                @Override
//                public void onError(Platform arg0, int arg1, Throwable arg2) {
//                    // TODO Auto-generated method stub
//                    arg2.printStackTrace();
//                }
//
//                @Override
//                public void onComplete(Platform platform, int action, HashMap<String, Object> res) {
//                    // TODO Auto-generated method stub
//                    //输出所有授权信息
//                    String userId = platform.getDb().getUserId();
//                    String accessToken = platform.getDb().getToken();
//                    WritableMap writableMap = new WritableNativeMap();
//                    writableMap.putString("userId", userId);
//                    writableMap.putString("accessToken", accessToken);
//                    sendTransMisson(mContext, "thirdLoginMessage", writableMap);
//                }
//
//                @Override
//                public void onCancel(Platform arg0, int arg1) {
//                    // TODO Auto-generated method stub
//
//                }
//            });
//            facebook.showUser(null);//执行登录，登录后在回调里面获取用户资料
//        }
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

    /*
     * 三方分享
     * */
    @ReactMethod
    public void shareMessage(String str) {
        /*
         * 0表示shareSDK自带的UI
         * 1表示activity窗口化
         * 2表示Dialog
         * */
        int type = 2;
//
//        ShareInfoBean shareInfoBean = (new Gson()).fromJson(str, ShareInfoBean.class);
//        switch (type) {
//            case 0:
//                OnekeyShare oks = new OnekeyShare();
//                oks.setText(shareInfoBean.getProductName());
//                oks.setUrl(shareInfoBean.getShareUrl());
//                oks.show(mContext);
//                break;
//            case 1:
//                MainRouter.jumpToShare(shareInfoBean.getProductName(), shareInfoBean.getShareUrl());
//                break;
//            case 2:
//                EventBus.getDefault().post(shareInfoBean);
//                break;
//        }
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
}
