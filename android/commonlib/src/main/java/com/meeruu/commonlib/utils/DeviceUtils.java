package com.meeruu.commonlib.utils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Point;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.NetworkInfo.State;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.view.Display;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;

import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.permissions.Permission;
import com.meeruu.permissions.PermissionUtil;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

/**
 * 获取设备信息
 * Created by louis on 2017/3/4.
 */
public class DeviceUtils {

    protected static final String PREFS_FILE = "mr_device_id";

    protected static final String PREFS_DEVICE_ID = "device_id";

    private static String deviceType = "0";

    private static final String TYPE_ANDROID_ID = "1";

    private static final String TYPE_DEVICE_ID = "2";

    private static final String TYPE_RANDOM_UUID = "3";

    /**
     * 获取系统版本号
     *
     * @return
     */
    public static String getSystemName() {
        return Build.VERSION.RELEASE;
    }

    /**
     * 获取系统版本号
     *
     * @return
     */
    public static int getSystemVersion() {
        return Build.VERSION.SDK_INT;
    }

    /**
     * 获取系统唯一标识
     *
     * @return
     */
    public static String getUniquePsuedoID(Context context) {
        if (context == null) {
            context = BaseApplication.appContext;
        }
        String uuid = (String) SPCacheUtils.get(PREFS_DEVICE_ID, null);
        if (TextUtils.isEmpty(uuid)) {
            final String androidId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
            try {
                if (!"9774d56d682e549c".equals(androidId)) {
                    deviceType = TYPE_ANDROID_ID;
                    uuid = UUID.nameUUIDFromBytes(androidId.getBytes("utf8")).toString();
                } else {
                    if (PermissionUtil.hasPermissions(context, Permission.PHONE)) {
                        @SuppressLint("MissingPermission") final String deviceId = ((TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();
                        if (deviceId != null
                                && !"0123456789abcdef".equals(deviceId.toLowerCase())
                                && !"000000000000000".equals(deviceId.toLowerCase())) {
                            deviceType = TYPE_DEVICE_ID;
                            uuid = UUID.nameUUIDFromBytes(deviceId.getBytes("utf8")).toString();
                        } else {
                            deviceType = TYPE_RANDOM_UUID;
                            uuid = UUID.randomUUID().toString();
                        }
                    } else {
                        deviceType = TYPE_RANDOM_UUID;
                        uuid = UUID.randomUUID().toString();
                    }
                }
            } catch (UnsupportedEncodingException e) {
                deviceType = TYPE_RANDOM_UUID;
                uuid = UUID.randomUUID().toString();
            } finally {
                uuid = UUID.fromString(deviceType + uuid).toString();
            }
            SPCacheUtils.put(PREFS_DEVICE_ID, uuid);
        }
        return uuid;
    }

    /**
     * 获取设备型号
     */
    public static String getDeviceModel(Context context) {
        return Build.DEVICE + ":" + Build.MODEL;
    }


    /**
     * 获取网络类型
     *
     * @param context
     * @return
     */
    public static int getNetworkType(Context context) {
        TelephonyManager TelephonyMgr = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        return TelephonyMgr.getNetworkType(); // Requires READ_PHONE_STATE
    }


    /**
     * 返回当前网络连接类型
     *
     * @param context 上下文
     * @return
     */
    public static String getNetworkState(Context context) {
        ConnectivityManager connManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        if (null == connManager) {
            return ParameterUtils.NETWORN_NONE;
        }
        NetworkInfo activeNetInfo = connManager.getActiveNetworkInfo();
        if (activeNetInfo == null || !activeNetInfo.isAvailable()) {
            return ParameterUtils.NETWORN_NONE;
        }
        // Wifi
        NetworkInfo wifiInfo = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        if (null != wifiInfo) {
            State state = wifiInfo.getState();
            if (null != state) {
                if (state == State.CONNECTED || state == State.CONNECTING) {
                    return ParameterUtils.NETWORN_WIFI;
                }
            }
        }
        // 网络
        NetworkInfo networkInfo = connManager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
        if (null != networkInfo) {
            State state = networkInfo.getState();
            String strSubTypeName = networkInfo.getSubtypeName();
            if (null != state) {
                if (state == State.CONNECTED || state == State.CONNECTING) {
                    switch (activeNetInfo.getSubtype()) {
                        case TelephonyManager.NETWORK_TYPE_GPRS: // 联通2g
                        case TelephonyManager.NETWORK_TYPE_CDMA: // 电信2g
                        case TelephonyManager.NETWORK_TYPE_EDGE: // 移动2g
                        case TelephonyManager.NETWORK_TYPE_1xRTT:
                        case TelephonyManager.NETWORK_TYPE_IDEN:
                            return ParameterUtils.NETWORN_2G;
                        case TelephonyManager.NETWORK_TYPE_EVDO_A: // 电信3g
                        case TelephonyManager.NETWORK_TYPE_UMTS:
                        case TelephonyManager.NETWORK_TYPE_EVDO_0:
                        case TelephonyManager.NETWORK_TYPE_HSDPA:
                        case TelephonyManager.NETWORK_TYPE_HSUPA:
                        case TelephonyManager.NETWORK_TYPE_HSPA:
                        case TelephonyManager.NETWORK_TYPE_EVDO_B:
                        case TelephonyManager.NETWORK_TYPE_EHRPD:
                        case TelephonyManager.NETWORK_TYPE_HSPAP:
                            return ParameterUtils.NETWORN_3G;
                        case TelephonyManager.NETWORK_TYPE_LTE:
                            return ParameterUtils.NETWORN_4G;
                        default://有机型返回16,17
                            //中国移动 联通 电信 三种3G制式
                            if ("TD-SCDMA".equalsIgnoreCase(strSubTypeName) || "WCDMA".equalsIgnoreCase(strSubTypeName) || "CDMA2000".equalsIgnoreCase(strSubTypeName)) {
                                return ParameterUtils.NETWORN_3G;
                            } else {
                                return ParameterUtils.NETWORN_MOBILE;
                            }
                    }
                }
            }
        }
        return ParameterUtils.NETWORN_NONE;
    }

    /**
     * 判断是否显示虚拟按键
     */
    private static final String NAVIGATION = "navigationBarBackground";

    public static boolean isNavigationBarExist(Activity activity) {
        ViewGroup vp = (ViewGroup) activity.getWindow().getDecorView();
        if (vp != null) {
            for (int i = 0; i < vp.getChildCount(); i++) {
                vp.getChildAt(i).getContext().getPackageName();
                if (vp.getChildAt(i).getId() != View.NO_ID && NAVIGATION.equals(activity.getResources().getResourceEntryName(vp.getChildAt(i).getId()))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 判断是否是全面屏
     */
    private volatile static boolean mHasCheckAllScreen;
    private volatile static boolean mIsAllScreenDevice;

    public static boolean isAllScreenDevice(Context context) {
        if (mHasCheckAllScreen) {
            return mIsAllScreenDevice;
        }
        mHasCheckAllScreen = true;
        mIsAllScreenDevice = false;
        // 低于 API 21的，都不会是全面屏。。。
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            return false;
        }
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        if (windowManager != null) {
            Display display = windowManager.getDefaultDisplay();
            Point point = new Point();
            display.getRealSize(point);
            float width, height;
            if (point.x < point.y) {
                width = point.x;
                height = point.y;
            } else {
                width = point.y;
                height = point.x;
            }
            if (height / width >= 1.97f) {
                mIsAllScreenDevice = true;
            }
        }
        return mIsAllScreenDevice;
    }


    // 是否是小米手机
    public static boolean isXiaomi() {
        return "Xiaomi".equals(Build.MANUFACTURER);
    }
}
