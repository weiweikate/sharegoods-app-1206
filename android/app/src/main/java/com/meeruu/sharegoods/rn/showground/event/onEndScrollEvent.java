package com.meeruu.sharegoods.rn.showground.event;


import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class onEndScrollEvent extends Event<onEndScrollEvent> {
    private static final String EVENT_NAME = "MrShowGroundOnEndScrollEvent";

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
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
    }
}
