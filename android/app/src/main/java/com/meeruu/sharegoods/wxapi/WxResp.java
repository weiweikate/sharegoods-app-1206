package com.meeruu.sharegoods.wxapi;

public class WxResp {
    public int code;
    public String sdkCode;
    public String msg;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getSdkCode() {
        return sdkCode;
    }

    public void setSdkCode(String sdkCode) {
        this.sdkCode = sdkCode;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
