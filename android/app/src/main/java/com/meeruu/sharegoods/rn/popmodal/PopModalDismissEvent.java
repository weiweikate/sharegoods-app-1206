package com.meeruu.sharegoods.rn.popmodal;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class PopModalDismissEvent extends Event<PopModalDismissEvent> {
    private static final String EVENT_NAME = "mrModalDismiss";

    private String mText;

    public PopModalDismissEvent(
            int viewId
            ) {
        super(viewId);
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
        eventData.putString("text", mText);
        return eventData;
    }
}
