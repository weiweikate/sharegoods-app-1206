package com.meeruu.sharegoods.bean;

/**
 * Created by zhanglei on 2018/8/18.
 */

public class WXLoginBean {

    /**
     * device : huawei
     * openid : sadfasdfds
     * systemVersion : 6.0
     */

    private String device;
    private String openid;
    private String systemVersion;
    private String nickName;

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getSystemVersion() {
        return systemVersion;
    }

    public void setSystemVersion(String systemVersion) {
        this.systemVersion = systemVersion;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
