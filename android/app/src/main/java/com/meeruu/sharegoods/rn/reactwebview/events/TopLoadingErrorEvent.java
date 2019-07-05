package com.meeruu.sharegoods.rn.reactwebview.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TopLoadingErrorEvent extends Event<TopLoadingErrorEvent> {
    public static final String EVENT_NAME = "topLoadingError";
    private WritableMap mEventData;

    public TopLoadingErrorEvent(int viewTag, WritableMap mEventData) {
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
