package com.meeruu.qiyu.activity;

import android.os.Bundle;

import com.meeruu.qiyu.StatusBarUtils;
import com.qiyukf.nim.uikit.session.activity.WatchVideoActivity;

public class QiyuWatchVideoActivity extends WatchVideoActivity {


    @Override
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        int result = StatusBarUtils.setLightMode(this);
        int statusColor = android.R.color.white;
        if (result == 3) {
            // 6.0以上沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        } else if (result == 4) {
            // 其它半透明效果
            StatusBarUtils.setColor(this, getResources().getColor(statusColor));
        } else {
            // miui、flyme沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        int result = StatusBarUtils.setLightMode(this);
        int statusColor = android.R.color.white;
        if (result == 3) {
            // 6.0以上沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        } else if (result == 4) {
            // 其它半透明效果
            StatusBarUtils.setColor(this, getResources().getColor(statusColor));
        } else {
            // miui、flyme沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        }
    }
}
