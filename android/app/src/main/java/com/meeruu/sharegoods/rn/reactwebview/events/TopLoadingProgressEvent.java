package com.meeruu.sharegoods.rn.reactwebview.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TopLoadingProgressEvent extends Event<TopLoadingProgressEvent> {
    public static final String EVENT_NAME = "topLoadingProgress";
    private WritableMap mEventData;

    public TopLoadingProgressEvent(int viewTag, WritableMap mEventData) {
        super(viewTag);
        this.mEventData = mEventData;
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
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, mEventData);
    }
}
