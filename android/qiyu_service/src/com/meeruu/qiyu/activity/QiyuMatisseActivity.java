package com.meeruu.qiyu.activity;

import android.os.Bundle;

import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.unicorn.mediaselect.internal.ui.activity.MatisseActivity;

public class QiyuMatisseActivity extends MatisseActivity {

    @Override
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this).barColor(android.R.color.white)
                .fitsSystemWindows(true)
                .navigationBarColor(android.R.color.white)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true).init();
    }
}
