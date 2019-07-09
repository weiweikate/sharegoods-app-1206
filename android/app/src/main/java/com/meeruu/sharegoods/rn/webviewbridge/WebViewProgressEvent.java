package com.meeruu.sharegoods.rn.webviewbridge;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class WebViewProgressEvent extends Event<WebViewProgressEvent> {
    private static final String EVENT_NAME = "mrWebProgressEvent";

    private int progress;

    public WebViewProgressEvent(
            int viewId,
            int progress
    ) {
        super(viewId);
        this.progress = progress;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public boolean canCoalesce() {
        return false;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("target", getViewTag());
        eventData.putInt("progress",progress );
        return eventData;
    }
}
