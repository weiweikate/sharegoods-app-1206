package com.meeruu.sharegoods.event;


public class LoadingDialogEvent {
    private boolean isShow;
    private String msg;

    public LoadingDialogEvent(boolean isShow, String msg) {
        this.isShow = isShow;
        this.msg = msg;
    }

    public boolean isShow() {
        return isShow;
    }

    public void setShow(boolean show) {
        isShow = show;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
