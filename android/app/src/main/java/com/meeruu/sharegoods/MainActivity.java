package com.meeruu.sharegoods;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.Promise;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.meeruu.sharegoods.event.CaptureScreenImageEvent;
import com.meeruu.sharegoods.event.LoadingDialogEvent;
import com.meeruu.sharegoods.event.ScanQRCodeEvent;
import com.meeruu.sharegoods.utils.AndroidPermission;
import com.meeruu.sharegoods.utils.CaptureScreenImageUtils;
import com.meeruu.sharegoods.utils.LoadingDialog;
import com.meeruu.sharegoods.utils.Utils;
import com.meeruu.sharegoods.zxing.activity.CaptureActivity;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

public class MainActivity extends ReactActivity {
    private LoadingDialog mLoadingDialog;
    private boolean isShowLoadingDialog;
    private Promise promise;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sharegoods";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MyReactDelegate(this, getMainComponentName());
    }

    //自定义MyReactDelegate
    class MyReactDelegate extends ReactActivityDelegate {

        public MyReactDelegate(Activity activity, @javax.annotation.Nullable String mainComponentName) {
            super(activity, mainComponentName);
        }

        @javax.annotation.Nullable
        @Override
        protected Bundle getLaunchOptions() {
            Bundle bundle = new Bundle();
            // android状态栏高度
            bundle.putInt("androidStatusH", DensityUtils.px2dip(ScreenUtils.getStatusHeight()));
            return bundle;
        }
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
        Log.e("package", Utils.getAppPackageName(this));
        fullScreen(MainActivity.this);
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

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onLoadingEvent(LoadingDialogEvent event) {
        if (event.isShow()) {
            if (null == mLoadingDialog) {
                mLoadingDialog = new LoadingDialog(this, R.style.LoadingDialog);
            }
            if (isShowLoadingDialog) {
                return;
            } else {
                if (!this.isFinishing()) {
                    isShowLoadingDialog = true;
                    mLoadingDialog.show();
                }

            }
        } else {
            if (null != mLoadingDialog && isShowLoadingDialog) {
                isShowLoadingDialog = false;
                mLoadingDialog.dismiss();
            }
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void scanQRCode(ScanQRCodeEvent event) {
        this.promise = event.getPromise();
        if (AndroidPermission.isGrantExternalRW3(this)) {
            startActivityForResult(new Intent(MainActivity.this, CaptureActivity.class), 0);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void captureScreenImage(CaptureScreenImageEvent event) {
        Bitmap bitmap = CaptureScreenImageUtils.screemShot(this);
        WindowManager wm = (WindowManager) this.getSystemService(Context.WINDOW_SERVICE);
        int width = wm.getDefaultDisplay().getWidth();
        int height = wm.getDefaultDisplay().getHeight();
        if (event.isAllScreen()) {
            bitmap = Bitmap.createBitmap(bitmap, 0, 60, width, height);
        } else {
            //todo 兼容性要做
            //      android  width:1080 height:1794
            //      reactNa  width:411 height:683
            //                      2.62    2.62
            int widthPercent = (int) width / 411;
            int heightPercent = (int) height / 683;
            bitmap = Bitmap.createBitmap(bitmap, 100, 360, 880, 1330);
//            bitmap=Bitmap.createBitmap(bitmap,event.getLeft(),event.getHeight(),event.getWidth()*2,(int)(event.getHeight()*2));
        }
        CaptureScreenImageUtils.saveImageToGallery(this, bitmap, event.getCallback(), MainActivity.this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == 123) {
            Bundle bundle = data.getExtras();
            String scanResult = bundle.getString("result");
            promise.resolve(scanResult);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
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
                //导航栏颜色也可以正常设置
//                window.setNavigationBarColor(Color.TRANSPARENT);
            } else {
                Window window = activity.getWindow();
                WindowManager.LayoutParams attributes = window.getAttributes();
                int flagTranslucentStatus = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
                int flagTranslucentNavigation = WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION;
                attributes.flags |= flagTranslucentStatus;
//                attributes.flags |= flagTranslucentNavigation;
                window.setAttributes(attributes);
            }
        }
    }
}
