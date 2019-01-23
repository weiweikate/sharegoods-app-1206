package com.meeruu.commonlib.bean;

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
    private String appOpenid;
    private String systemVersion;
    private String nickName;
    private String headerImg;
    private String unionid;

    public String getAppOpenid() {
        return appOpenid;
    }

    public void setAppOpenid(String appOpenid) {
        this.appOpenid = appOpenid;
    }

    public String getUnionid() {
        return unionid;
    }

    public void setUnionid(String unionid) {
        this.unionid = unionid;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
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

    public String getHeaderImg() {
        return headerImg;
    }

    public void setHeaderImg(String headerImg) {
        this.headerImg = headerImg;
    }
}
