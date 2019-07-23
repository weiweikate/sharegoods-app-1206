package com.meeruu.sharegoods.rn.reactwebview.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TopMessageEvent extends Event<TopMessageEvent> {
    public static final String EVENT_NAME = "topMessage";
    private String mData;

    public TopMessageEvent(int viewTag, String mData) {
        super(viewTag);
        this.mData = mData;
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
        data.putString("data", this.mData);
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, data);
    }
}
