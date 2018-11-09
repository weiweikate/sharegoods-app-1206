package com.meeruu.Banner.event;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class DidScrollToIndexEvent extends Event<DidScrollToIndexEvent> {
    public static final String EVENT_NAME = "DidScrollToIndex";

    private final int index;

    public DidScrollToIndexEvent(int viewTag, int index) {
        super(viewTag);
        this.index = index;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("index", this.index);
        return eventData;
    }
}
