package com.meeruu.sharegoods.rn.module;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.meeruu.sharegoods.ui.activity.QrCodeScanActivity;

public class QRCodeModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    public static final String MODULE_NAME = "QRCodeModule";
    private ReactApplicationContext mContext;
    private static final int REQUEST_SCAN = 500;

    public static Callback scanSuccess;
    public static Callback scanFail;

    public QRCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void scanQRCode(Callback success, Callback fail) {
        scanSuccess = success;
        scanFail = fail;
        Intent intent = new Intent(mContext, QrCodeScanActivity.class);
        getCurrentActivity().startActivityForResult(intent, REQUEST_SCAN);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (resultCode == QrCodeScanActivity.SCAN_RESULT_CODE && requestCode == REQUEST_SCAN) {
            boolean isSuccess = data.getBooleanExtra("isSuccess", false);
            if (isSuccess) {
                String result = data.getStringExtra("ScanInfo");
                if (scanSuccess != null) {
                    scanSuccess.invoke(result);
                }
            } else {
                if (scanFail != null) {
                    scanFail.invoke("权限不足！");
                }
            }
        }
    }

}
