package com.mingrong;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.mingrong.R;
import com.mingrong.event.LoadingDialogEvent;
import com.mingrong.utils.LoadingDialog;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

/**
 * Created by zhanglei on 2018/7/31.
 */

public class NativeActivity extends Activity{
    private LoadingDialog mLoadingDialog;
    private boolean isShowLoadingDialog;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_native_activity);
        startActivity(new Intent(NativeActivity.this,MainActivity.class));
        EventBus.getDefault().register(this);
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

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }
}
