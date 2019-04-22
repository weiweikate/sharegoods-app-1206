package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import com.meeruu.qiyu.ScreenUtils;
import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.nim.uikit.common.media.picker.activity.PickerAlbumActivity;
import com.qiyukf.unicorn.R;

public class QiyuPickerAlbumActivity extends PickerAlbumActivity {

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
