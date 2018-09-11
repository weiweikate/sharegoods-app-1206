package com.meeruu.sharegoods.bean;

/**
 * Created by shangwf on 2017/9/25.
 */

public class NetCommonParamsBean {
    private String device= android.os.Build.DEVICE;
    private String systemVersion= android.os.Build.VERSION.RELEASE;

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

}
