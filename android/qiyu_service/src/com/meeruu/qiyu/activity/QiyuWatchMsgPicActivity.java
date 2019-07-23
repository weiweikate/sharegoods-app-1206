package com.meeruu.qiyu.activity;

import android.os.Bundle;

import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.nim.uikit.session.activity.WatchMessagePictureActivity;

public class QiyuWatchMsgPicActivity extends WatchMessagePictureActivity {


    @Override
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this).
                transparentBar()
                .navigationBarColor(android.R.color.white)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true).init();
    }
}
