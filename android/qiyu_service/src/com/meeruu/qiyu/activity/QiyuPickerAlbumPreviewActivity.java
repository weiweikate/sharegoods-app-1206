package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import com.meeruu.qiyu.ScreenUtils;
import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.nim.uikit.common.media.picker.activity.PickerAlbumPreviewActivity;
import com.qiyukf.unicorn.R;

public class QiyuPickerAlbumPreviewActivity extends PickerAlbumPreviewActivity {

    @Override
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ImmersionBar.with(this).barColor(R.color.ysf_black_b3000000)
                .fitsSystemWindows(true)
                .navigationBarColor(android.R.color.white)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true).init();
    }
}
