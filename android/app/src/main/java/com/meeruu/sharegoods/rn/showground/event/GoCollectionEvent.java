package com.meeruu.sharegoods.rn.showground.event;

import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class GoCollectionEvent extends Event<GoCollectionEvent> {
    private static final String EVENT_NAME = "MrGoCollectionEvent";


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
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        } catch (Exception e) {
        }
    }
}
