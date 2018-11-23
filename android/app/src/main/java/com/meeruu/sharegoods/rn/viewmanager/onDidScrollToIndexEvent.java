package com.meeruu.sharegoods.rn.viewmanager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class onDidScrollToIndexEvent extends Event<onDidScrollToIndexEvent> {
    private static final String EVENT_NAME = "MrOnDidScrollToIndexEvent";

    private int index;

    public onDidScrollToIndexEvent(
            int viewId,
            int index
    ) {
        super(viewId);
        this.index = index;
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
        eventData.putInt("index", index);
        return eventData;
    }
}
