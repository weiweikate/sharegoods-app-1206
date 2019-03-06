package com.meeruu.sharegoods.rn.module;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.alicom.phonenumberauthsdk.gatewayauth.AlicomAuthHelper;
import com.alicom.phonenumberauthsdk.gatewayauth.TokenResultListener;
import com.alicom.phonenumberauthsdk.gatewayauth.model.InitResult;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

public class PhoneAuthenTool extends AppCompatActivity {
    private AlicomAuthHelper mAlicomAuthHelper;
    private TokenResultListener mTokenListener;
    private InitResult mAutInitResult;
    private SparseArray<PermissionCallback> mPerMissionCallbackCache;
    private int mCurrentPermissionRequestCode = 0;
    private ProgressDialog mProgressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        init();
    }

    public PhoneAuthenTool(){
        init();
    }
    private void init() {
        /*
         *   1.init get token callback Listener
         */
        mTokenListener = new TokenResultListener() {
            @Override
            public void onTokenSuccess(final String ret) {
                PhoneAuthenTool.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        /*
                         *   setText just show the result for get token。
                         *   use ret to verfiy number。
                         */
//                        hideLoadingDialog();
//                        mRetTV.setText("获取token成功\n" + ret);
                    }
                });
            }

            @Override
            public void onTokenFailed(final String ret) {
                PhoneAuthenTool.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        /*
                         *  setText just show the result for get token
                         *  do something when getToken failed, such as use sms verify code.
                         */
//                        hideLoadingDialog();
//                        mRetTV.setText("获取token失败\n" + ret);
                    }
                });
            }
        };

        /*
         *   2.init AlicomAuthHelper with tokenListener
         */
        mAlicomAuthHelper = AlicomAuthHelper.getInstance(this, mTokenListener);
        /*
         *   3.set debugMode when app is in debug mode, sdk will print log in debug mode
         */
        if (isApkInDebug(this)) {
            mAlicomAuthHelper.setDebugMode(true);
        }

        /*
         *   4.ask permission from user, this step is not necessary
         *   just do when your app is needed
         */
//        if (ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
//            requestPermission(new String[]{Manifest.permission.READ_PHONE_STATE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, new PermissionCallback() {
//                @Override
//                public void onPermissionGranted(boolean isRequestUser) {
//                    /*
//                     *   5.sdk init
//                     */
//                    mAutInitResult = mAlicomAuthHelper.init();
//                }
//
//                @Override
//                public void onPermissionDenied(boolean isRequestUser) {
////                    Toast.makeText(MainActivity.this, "请允许相关权限", Toast.LENGTH_LONG).show();
//                }
//            });
//        } else {
            /*
             *   5.sdk init
             */
            mAutInitResult = mAlicomAuthHelper.init();
//        }



        /*
         *   7.user sdk init result to do someting
         *   this step is also not necessary
         *   if you do this step, user experience maybe better
         */
        if (mAutInitResult != null) {
            //judge the phone condition can use 4g auth
            if (!mAutInitResult.isCan4GAuth()) {
//                mVaildBtn.setClickable(false);
//                mRetTV.setText("请开启移动网络后重试！");
            }
            /*
             *  read phone number from sim card
             *  set phonenumber to edittext
             *  avoid user to input number
             *  but still need to vaild number by sdk
             *  this step just reduce user input action
             *  can't use getSimPhoneNumber（） for final result
             *
             */
            if (!TextUtils.isEmpty(mAutInitResult.getSimPhoneNumber())) {
//                mPhoneNumberET.setText(mAutInitResult.getSimPhoneNumber());
            }
        }
    }
    public void isCanAuthen(Promise promise) {
        mAlicomAuthHelper.getAuthToken(5000);
        WritableMap map = Arguments.createMap();
        map.putInt("resultCode", 6666);
        promise.resolve(map);
    }

    @Override
    protected void onDestroy() {
        /*
         *   8.remember on destory
         */
        mAlicomAuthHelper.onDestroy();
        super.onDestroy();
    }

    /*
     *  Dynamic request application permissions
     */
    protected void requestPermission(String[] permissions, PermissionCallback callback) {
        int result = PackageManager.PERMISSION_GRANTED;
        for (String s : permissions) {
            if (ContextCompat.checkSelfPermission(this, s) != PackageManager.PERMISSION_GRANTED)
                result = PackageManager.PERMISSION_DENIED;
        }

        if (result == PackageManager.PERMISSION_GRANTED && callback != null) {
            callback.onPermissionGranted(false);
        } else {
            if (Build.VERSION.SDK_INT >= 23) {
                if (mPerMissionCallbackCache == null)
                    mPerMissionCallbackCache = new SparseArray<PermissionCallback>();
                mPerMissionCallbackCache.put(mCurrentPermissionRequestCode, callback);
                requestPermissions(permissions, mCurrentPermissionRequestCode++);
            } else if (callback != null) {
                callback.onPermissionDenied(false);
            }
        }
    }

    public interface PermissionCallback {
        void onPermissionGranted(boolean isRequestUser);

        void onPermissionDenied(boolean isRequestUser);
    }

    public boolean isApkInDebug(Context context) {
        try {
            ApplicationInfo info = context.getApplicationInfo();
            return (info.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        } catch (Exception e) {
            return false;
        }
    }

    public void showLoadingDialog(String hint) {
        if (mProgressDialog == null) {
            mProgressDialog = new ProgressDialog(this);
            mProgressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        }
        mProgressDialog.setMessage(hint);
        mProgressDialog.setCancelable(true);
        mProgressDialog.show();
    }

    public void hideLoadingDialog() {
        if (mProgressDialog != null)
            if (mProgressDialog.isShowing()) {
                mProgressDialog.dismiss();
            }
    }


}

//public class PhoneAuthenTool  extends AppCompatActivity{
//
//    private AlicomAuthHelper mAlicomAuthHelper;
//    private TokenResultListener mTokenListener;
//    private InitResult mAutInitResult;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        getmAutInitResult();
//    }
//
//    public void startPhoneAuthen(String phoneNum ,final Promise promise){
//        mTokenListener = new TokenResultListener() {
//            @Override
//            public void onTokenSuccess(String s) {
//                WritableMap map = Arguments.createMap();
//                map.putString("accessCode",s);
//                map.putInt("resultCode",6666);
//                promise.resolve(map);
//               Log.i("onTokensuccess",s);
//            }
//
//            @Override
//            public void onTokenFailed(String s) {
//                WritableMap map = Arguments.createMap();
//                map.putString("accessCode",s);
//                map.putInt("resultCode",-1);
//                promise.resolve(map);
//                Log.i("onTokenFailed: " , s);
//            }
//        };
//        /*
//         *   2.init AlicomAuthHelper with tokenListener
//         */
//
//        mAlicomAuthHelper = AlicomAuthHelper.getInstance(getApplicationContext(), mTokenListener);
//        /*
//         *   3.set debugMode when app is in debug mode, sdk will print log in debug mode
//         */
//        mAlicomAuthHelper.setDebugMode(true);
//        /*
//         *   5.sdk init
//         */
//        mAutInitResult = mAlicomAuthHelper.init();
//        /**
//         * 获取token
//         */
//        mAlicomAuthHelper.getAuthToken(5000);
//    }
//
//    public InitResult getmAutInitResult(){
//        mTokenListener = new TokenResultListener() {
//            @Override
//            public void onTokenSuccess(String s) {
//
//            }
//            @Override
//            public void onTokenFailed(String s) {
//
//            }
//        };
//        /*
//         *   2.init AlicomAuthHelper with tokenListener
//         */
//        mAlicomAuthHelper = AlicomAuthHelper.getInstance(getApplicationContext(), mTokenListener);
//        /*
//         *   3.set debugMode when app is in debug mode, sdk will print log in debug mode
//         */
//        mAlicomAuthHelper.setDebugMode(true);
//        /*
//         *   5.sdk init
//         */
//        mAutInitResult = mAlicomAuthHelper.init();
//
//        return mAutInitResult;
//    }
//    public void isCanAuthen (Promise promise){
//        Integer flag = getmAutInitResult().isCan4GAuth()?1:0;
//        String phoneNum = this.mAutInitResult.getSimPhoneNumber()+"";//读取sm卡手机号
//        WritableMap map = Arguments.createMap();
//        map.putInt("isCanAuthen",flag);
//        map.putString("phoneNum",phoneNum);
//        promise.resolve(map);
//    }
//    @Override
//    protected void onDestroy() {
//        mAlicomAuthHelper.onDestroy();
//        super.onDestroy();
//    }
//}
