package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.meeruu.qiyu.SPCacheUtils;
import com.meeruu.qiyu.ScreenUtils;
import com.meeruu.qiyu.SoftKeyboardFixerForFullscreen;
import com.meeruu.qiyu.StatusBarUtils;
import com.meeruu.qiyu.view.MyKefuButton;
import com.qiyukf.unicorn.R;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.ui.activity.ServiceMessageActivity;

public class QiyuServiceMessageActivity extends ServiceMessageActivity {

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        SoftKeyboardFixerForFullscreen.assistActivity(this);
        int result = StatusBarUtils.setLightMode(this);
        int statusColor = android.R.color.white;
        if (result == 3) {
            // 6.0以上沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
            handleTop();
        } else if (result == 4) {
            // 其它半透明效果
            StatusBarUtils.setColor(this, getResources().getColor(statusColor));
        } else {
            // miui、flyme沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
            handleTop();
        }

        MyKefuButton myKefuButton = findViewById(R.id.mb_kefu_btn);
        final ImageView ivKefu = findViewById(R.id.iv_kefu);
        Bundle data = getIntent().getExtras();
        final ConsultSource source = (ConsultSource) data.getSerializable("source");
        if (source != null) {
            String shopId = (String) SPCacheUtils.get(QiyuServiceMessageActivity.this, "shopId", "");
            if (TextUtils.isEmpty(source.shopId)) {
                if (TextUtils.isEmpty(shopId)) {
                    myKefuButton.setVisibility(View.GONE);
                } else {
                    myKefuButton.setVisibility(View.VISIBLE);
                }
            } else {
                myKefuButton.setVisibility(View.VISIBLE);
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
                    SPCacheUtils.put(QiyuServiceMessageActivity.this, "shopId", source.shopId);
                    source.shopId = "";
                    Unicorn.openServiceActivity(QiyuServiceMessageActivity.this, "秀购客服", source);
                } else {
                    String shopId = (String) SPCacheUtils.get(QiyuServiceMessageActivity.this, "shopId", "");
                    source.shopId = shopId;
                    Unicorn.openServiceActivity(QiyuServiceMessageActivity.this, source.title, source);
                }
            }
        });
    }

    private void handleTop() {
        View titleBar = findViewById(R.id.ysf_title_bar);
        if (titleBar.getPaddingTop() != ScreenUtils.getStatusHeight(this)) {
            titleBar.setPadding(0, ScreenUtils.getStatusHeight(this), 0, 0);
            LinearLayout.LayoutParams param = (LinearLayout.LayoutParams) titleBar.getLayoutParams();
            param.height += ScreenUtils.getStatusHeight(this);
            titleBar.setLayoutParams(param);
        }
    }

    @Override
    protected void onResume() {
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
