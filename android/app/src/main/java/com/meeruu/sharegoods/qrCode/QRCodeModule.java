package com.meeruu.sharegoods.qrCode;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.meeruu.sharegoods.event.ScanQRCodeEvent;

import org.greenrobot.eventbus.EventBus;

public class QRCodeModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "QRCodeModule";

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public QRCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Promise 方式
     * @param promise
     */
    @ReactMethod
    public void scanQRCode(Promise promise) {
        ScanQRCodeEvent event=new ScanQRCodeEvent();
        event.setPromise(promise);
        EventBus.getDefault().post(event);
    }
}
