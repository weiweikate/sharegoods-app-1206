package com.meeruu.sharegoods.rn.showground.event;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class onItemPressEvent extends Event<onItemPressEvent> {
    private WritableMap data;
    private static final String EVENT_NAME = "MrShowGroundOnItemPressEvent";

    public onItemPressEvent(int viewId,WritableMap data){
        super(viewId);
        this.data = data;
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
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), this.data);
    }
}
