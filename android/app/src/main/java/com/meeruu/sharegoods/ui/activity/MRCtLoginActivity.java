package com.meeruu.sharegoods.ui.activity;

import android.os.Bundle;

import com.meeruu.sharegoods.R;
import com.meeruu.statusbar.BarHide;
import com.meeruu.statusbar.ImmersionBar;

import cn.jiguang.verifysdk.CtLoginActivity;

public class MRCtLoginActivity extends CtLoginActivity {

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this)
                .barColor(R.color.app_top_color)
                .hideBar(BarHide.FLAG_SHOW_BAR)
                .fitsSystemWindows(true)
                .navigationBarColor(R.color.app_top_color)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true)
                .init();
    }
}