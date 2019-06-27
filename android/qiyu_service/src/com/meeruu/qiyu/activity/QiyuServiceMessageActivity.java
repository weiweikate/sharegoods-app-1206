package com.meeruu.qiyu.activity;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;

import com.meeruu.qiyu.KeyBoardUtils;
import com.meeruu.qiyu.SoftKeyboardFixerForFullscreen;
import com.meeruu.qiyu.preference.PreferenceUtil;
import com.meeruu.qiyu.view.MyKefuButton;
import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.unicorn.R;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.ui.activity.ServiceMessageActivity;

public class QiyuServiceMessageActivity extends ServiceMessageActivity {

    private ConsultSource source;

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        SoftKeyboardFixerForFullscreen.assistActivity(this);
        ImmersionBar.with(this).barColor(android.R.color.white)
                .fitsSystemWindows(true)
                .navigationBarColor(android.R.color.white)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true).init();
        MyKefuButton myKefuButton = findViewById(R.id.mb_kefu_btn);
        final ImageView ivKefu = findViewById(R.id.iv_kefu);
        Bundle data = getIntent().getExtras();
        source = (ConsultSource) data.getSerializable("source");
        final SharedPreferences preferences = PreferenceUtil.getSharedPreference(getApplication(), "qiyu");
        if (source != null) {
            String shopId = preferences.getString("shopId", "");
            if (TextUtils.isEmpty(source.shopId)) {
                if (TextUtils.isEmpty(shopId)) {
                    myKefuButton.setVisibility(View.GONE);
                } else {
                    myKefuButton.setVisibility(View.VISIBLE);
                }
            } else {
                if (TextUtils.equals("hzmrwlyxgs", source.shopId)) {
                    myKefuButton.setVisibility(View.GONE);
                } else {
                    myKefuButton.setVisibility(View.VISIBLE);
                }
            }
        }
        if (source != null && !TextUtils.isEmpty(source.shopId)) {
            ivKefu.setImageResource(R.drawable.pingtkfu_icon);
        } else {
            ivKefu.setImageResource(R.drawable.shopkfu_icon);
        }
        myKefuButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!TextUtils.isEmpty(source.shopId)) {
                    preferences.edit().putString("shopId", source.shopId).apply();
                    source.shopId = "";
                    Unicorn.openServiceActivity(QiyuServiceMessageActivity.this, "平台客服", source);
                } else {
                    source.shopId = preferences.getString("shopId", "");
                    Unicorn.openServiceActivity(QiyuServiceMessageActivity.this, source.title, source);
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EditText editText = findViewById(R.id.editTextMessage);
        if (editText != null) {
            KeyBoardUtils.closeKeybord(editText, this);
        }
    }
}
