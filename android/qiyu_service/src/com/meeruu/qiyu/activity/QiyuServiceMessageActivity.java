package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.widget.EditText;

import com.meeruu.qiyu.Event;
import com.meeruu.qiyu.KeyBoardUtils;
import com.meeruu.qiyu.SoftKeyboardFixerForFullscreen;
import com.meeruu.statusbar.ImmersionBar;
import com.qiyukf.unicorn.R;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.ui.activity.ServiceMessageActivity;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

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
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void toChatShop(final Event.QiyuShopIdEvent event) {
        Bundle data = getIntent().getExtras();
        source = (ConsultSource) data.getSerializable("source");
        source.shopId = event.getShopId();
        Unicorn.openServiceActivity(QiyuServiceMessageActivity.this, event.getShopName(), source);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
        EditText editText = findViewById(R.id.editTextMessage);
        if (editText != null) {
            KeyBoardUtils.closeKeybord(editText, this);
        }
    }
}
