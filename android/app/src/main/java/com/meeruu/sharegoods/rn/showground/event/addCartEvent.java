package com.meeruu.sharegoods.rn.showground.event;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class addCartEvent  extends Event<addCartEvent> {
    private WritableMap data;
    private static final String EVENT_NAME = "MrAddCartEvent";

    public void setData(WritableMap data) {
        this.data = data;
    }

    @Override
    public void init(int viewTag) {
        super.init(viewTag);
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
        try {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), this.data);
        } catch (Exception e) {
        }
    }
}
