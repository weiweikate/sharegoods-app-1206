package com.meeruu.sharegoods.rn.reactwebview.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class OnLongClickImageEvent extends Event<OnLongClickImageEvent> {
    public static final String EVENT_NAME = "OnLongClickImageEvent";
    private final String mUrl;

    public OnLongClickImageEvent(int viewId, String url) {
        super(viewId);
        mUrl = url;
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
    public short getCoalescingKey() {
        // All events for a given view can be coalesced.
        return 0;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap data = Arguments.createMap();
        data.putString("url", mUrl);
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, data);
    }
}
