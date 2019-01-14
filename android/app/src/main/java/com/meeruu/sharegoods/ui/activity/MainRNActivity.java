package com.meeruu.sharegoods.ui.activity;

import android.Manifest;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.text.TextUtils;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.commonlib.base.BaseApplication;
import com.meeruu.commonlib.callback.OnProgressListener;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.event.LoadingDialogEvent;
import com.meeruu.sharegoods.event.VersionUpdateEvent;
import com.meeruu.sharegoods.rn.preload.PreLoadReactDelegate;
import com.meeruu.sharegoods.service.VersionUpdateService;
import com.meeruu.sharegoods.utils.LoadingDialog;
import com.umeng.socialize.UMShareAPI;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import javax.annotation.Nullable;

import cn.jpush.android.api.JPushInterface;

/**
 * @author louis
 * @date on 2018/9/3
 * @describe Android react-native容器类
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class MainRNActivity extends ReactActivity {
    private LoadingDialog mLoadingDialog;
    private boolean isShowLoadingDialog;
    private String apkPath;
    private int updateType;
    private VersionUpdateService.DownloadBinder binder;
    private boolean isBinded;
    private boolean isDestroy = true;
    private ServiceConnection conn;
    private WeakHandler myHandler;
    private String lastVersion;
    private ReactApplicationContext mContext;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return ParameterUtils.RN_MAIN_NAME;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        if (newConfig.fontScale != 1) {
            getResources();
        }
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public Resources getResources() {
        Resources res = super.getResources();
        if (res.getConfiguration().fontScale != 1) {//非默认值
            Configuration newConfig = new Configuration();
            newConfig.setToDefaults();//设置默认
            res.updateConfiguration(newConfig, res.getDisplayMetrics());
        }
        return res;
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MyReactDelegate(this, getMainComponentName());
    }

    //自定义MyReactDelegate
    class MyReactDelegate extends PreLoadReactDelegate {

        public MyReactDelegate(Activity activity, @Nullable String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactNativeHost getReactNativeHost() {
            return super.getReactNativeHost();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initHandler();
        initStatus();
        initServiceConn();
    }

    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // 继续下载apk
        if (isDestroy && BaseApplication.getInstance().isDownload()) {
            Intent it = new Intent(MainRNActivity.this, VersionUpdateService.class);
            it.putExtra("version", lastVersion);
            startService(it);
            bindService(it, conn, Context.BIND_AUTO_CREATE);
        }
        JPushInterface.onResume(this);
        UApp.pageSessionStart(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        UApp.pageSessionEnd(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        isDestroy = false;
    }

    /**
     * 释放资源
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        UShare.release(this);
        if (isBinded) {
            unbindService(conn);
        }
        if (binder != null && binder.isCanceled()) {
            Intent it = new Intent(this, VersionUpdateService.class);
            it.putExtra("version", lastVersion);
            stopService(it);
            binder = null;
        }
        if (myHandler != null) {
            myHandler = null;
        }
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    private void initStatus() {
        fullScreen(MainRNActivity.this);
        View decorView = getWindow().getDecorView();
        //重点：SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decorView.setSystemUiVisibility(option);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.TRANSPARENT);
        }
        // 更改状态栏字体颜色
        StatusBarUtils.setLightMode(this);
    }

    private void initHandler() {
        myHandler = new WeakHandler(new Handler.Callback() {
            @Override
            public boolean handleMessage(Message msg) {
                switch (msg.what) {
                    case ParameterUtils.FLAG_UPDATE:
                        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("UpdateEvent", msg.arg1);
                        break;
                    default:
                        break;
                }
                return false;
            }
        });
    }

    /**
     * 连接版本下载service
     */
    private void initServiceConn() {
        if (conn == null) {
            conn = new ServiceConnection() {

                @Override
                public void onServiceDisconnected(ComponentName name) {
                    isBinded = false;
                }

                @Override
                public void onServiceConnected(ComponentName name, IBinder service) {
                    binder = (VersionUpdateService.DownloadBinder) service;
                    // 开始下载
                    isBinded = true;
                    binder.start(updateType);
                    if (updateType == ParameterUtils.FLAG_UPDATE_NOW) {
                        binder.setOnProgressListener(new OnProgressListener() {
                            @Override
                            public void onStart() {
                            }

                            @Override
                            public void onProgress(int progress) {
                                if (progress < 100) {
                                    Message msg = Message.obtain();
                                    msg.what = ParameterUtils.FLAG_UPDATE;
                                    msg.arg1 = progress;
                                    myHandler.sendMessage(msg);
                                }
                            }

                            @Override
                            public void onFinish(final String path) {
                                apkPath = path;
                                Message msg = Message.obtain();
                                msg.what = ParameterUtils.FLAG_UPDATE;
                                msg.arg1 = 100;
                                myHandler.sendMessage(msg);
                            }
                        });
                    }
                }
            };
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void versionUpdate(VersionUpdateEvent event) {
        updateType = event.isForceUpdate() ? ParameterUtils.FLAG_UPDATE_NOW : ParameterUtils.FLAG_UPDATE;
        lastVersion = event.getVersion();
        mContext = event.getContext();
        if (event.isExist()) {
            apkPath = event.getApkPath();
            if (event.getCallback() != null) {
                event.getCallback().invoke(true);
            }
            handleInstallApk();
        } else {
            if (event.isForceUpdate()) {
                if (event.getCallback() != null) {
                    event.getCallback().invoke(false);
                }
            }
            BaseApplication.getInstance().setDownload(true);
            BaseApplication.getInstance().setDownLoadUrl(event.getDownUrl());
            //开始下载
            Intent it = new Intent(MainRNActivity.this, VersionUpdateService.class);
            it.putExtra("version", event.getVersion());
            startService(it);
            bindService(it, conn, Context.BIND_AUTO_CREATE);
        }
    }

    private void handleInstallApk() {
        if (!TextUtils.isEmpty(apkPath)) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                boolean hasInstallPermission = getPackageManager().canRequestPackageInstalls();
                if (hasInstallPermission) {
                    Utils.installApk(getApplicationContext(), apkPath);
                } else {
                    //请求安装未知应用来源的权限
                    ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.REQUEST_INSTALL_PACKAGES},
                            ParameterUtils.REQUEST_CODE_INSTALL);
                }
            } else {
                Utils.installApk(getApplicationContext(), apkPath);
            }
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onLoadingEvent(LoadingDialogEvent event) {
        if (null == mLoadingDialog) {
            mLoadingDialog = new LoadingDialog(this, R.style.LoadingDialog);
        }
        if (event.isShow()) {
            if (!TextUtils.isEmpty(event.getMsg())) {
                mLoadingDialog.setMessage(event.getMsg());
            }
            if (!isShowLoadingDialog && !this.isFinishing()) {
                mLoadingDialog.show();
            }
            isShowLoadingDialog = true;
        } else {
            isShowLoadingDialog = false;
            mLoadingDialog.dismiss();
        }
    }

    /**
     * 通过设置全屏，设置状态栏透明
     *
     * @param activity
     */
    private void fullScreen(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                //5.x开始需要把颜色设置透明，否则导航栏会呈现系统默认的浅灰色
                Window window = activity.getWindow();
                View decorView = window.getDecorView();
                //两个 flag 要结合使用，表示让应用的主体内容占用系统状态栏的空间
                int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
                decorView.setSystemUiVisibility(option);
                window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
                window.setStatusBarColor(Color.TRANSPARENT);
            } else {
                Window window = activity.getWindow();
                WindowManager.LayoutParams attributes = window.getAttributes();
                int flagTranslucentStatus = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
                attributes.flags |= flagTranslucentStatus;
                window.setAttributes(attributes);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case ParameterUtils.REQUEST_CODE_INSTALL:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Utils.installApk(getApplicationContext(), apkPath);
                } else {
                    ToastUtils.showToast(getString(R.string.install_allow));
                    Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    startActivityForResult(intent, ParameterUtils.REQUEST_CODE_MANAGE_APP_SOURCE);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //涉及到分享时必须调用到方法
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case ParameterUtils.REQUEST_CODE_MANAGE_APP_SOURCE:
                handleInstallApk();
                break;
            default:
                break;
        }
    }
}
