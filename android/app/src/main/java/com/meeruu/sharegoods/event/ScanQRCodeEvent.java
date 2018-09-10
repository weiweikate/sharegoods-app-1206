package com.meeruu.sharegoods.event;

import com.facebook.react.bridge.Promise;

/**
 * Created by zhanglei on 2018/8/10.
 */

public class ScanQRCodeEvent {
    private Promise promise;

    public Promise getPromise() {
        return promise;
    }

    public void setPromise(Promise promise) {
        this.promise = promise;
    }
}
