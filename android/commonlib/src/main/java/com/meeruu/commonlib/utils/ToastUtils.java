package com.meeruu.commonlib.utils;

import android.widget.Toast;

import com.facebook.react.bridge.UiThreadUtil;
import com.meeruu.commonlib.base.BaseApplication;

public class ToastUtils {

    private static Toast mToast;

    /**
     * 非阻塞试显示Toast,防止出现连续点击Toast时的显示问题
     */
    public static void showToast(CharSequence text, int duration) {
        if (text.length() > 0) {
            if (mToast == null) {
                mToast = Toast.makeText(BaseApplication.appContext, text, duration);
            } else {
                mToast.setText(text);
                mToast.setDuration(duration);
            }
            mToast.show();
        }
    }

    public static void showToast(final CharSequence text) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showToast(text, Toast.LENGTH_SHORT);
            }
        });
    }
}
