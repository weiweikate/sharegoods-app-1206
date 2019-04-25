package com.meeruu.sharegoods.rn.module;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meeruu.sharegoods.event.Event;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import javax.annotation.Nonnull;

public class JPushModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;

    public JPushModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Nonnull
    @Override
    public String getName() {
        return "JSPushBridge";
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onHomeRefresh(Event.MRHomeRefreshEvent event) {
        this.mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("homeRefresh", event.getHomeType());
    }
}
