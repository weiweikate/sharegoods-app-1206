package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import com.meeruu.qiyu.ScreenUtils;
import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.unicorn.R;
import com.qiyukf.unicorn.ui.activity.FileDownloadActivity;

public class QiyuFileDownloadActivity extends FileDownloadActivity {

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this).barColor(android.R.color.white)
                .fitsSystemWindows(true)
                .navigationBarColor(android.R.color.white)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true).init();
    }
}
