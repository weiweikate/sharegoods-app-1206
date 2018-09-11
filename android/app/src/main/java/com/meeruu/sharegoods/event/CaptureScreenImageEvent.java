package com.meeruu.sharegoods.event;

import com.facebook.react.bridge.Callback;

/**
 * Created by zhanglei on 2018/8/2.
 */

public class CaptureScreenImageEvent {
    private int left;
    private int top;
    private int width;
    private int height;
    private boolean allScreen;
    private Callback callback;

    public int getLeft() {
        return left;
    }

    public void setLeft(int left) {
        this.left = left;
    }

    public int getTop() {
        return top;
    }

    public void setTop(int top) {
        this.top = top;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public boolean isAllScreen() {
        return allScreen;
    }

    public void setAllScreen(boolean allScreen) {
        this.allScreen = allScreen;
    }

    public Callback getCallback() {
        return callback;
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }
}
