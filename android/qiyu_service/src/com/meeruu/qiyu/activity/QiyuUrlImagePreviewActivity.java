package com.meeruu.qiyu.activity;

import android.os.Bundle;

import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.unicorn.ui.activity.UrlImagePreviewActivity;

public class QiyuUrlImagePreviewActivity extends UrlImagePreviewActivity {

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this)
                .transparentStatusBar()
                .navigationBarColor(android.R.color.white)
                .navigationBarDarkIcon(true).init();
    }
}
