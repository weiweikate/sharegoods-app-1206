package com.meeruu.sharegoods.bean;

/**
 * Created by liuxingyu on 2018/6/17.
 */

public class CityPickerBean {
    private String provinceName;
    private long provinceId;
    private String cityName;
    private long cityId;
    private String districName;
    private long districId;

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(long provinceId) {
        this.provinceId = provinceId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public long getCityId() {
        return cityId;
    }

    public void setCityId(long cityId) {
        this.cityId = cityId;
    }

    public String getDistricName() {
        return districName;
    }

    public void setDistricName(String districName) {
        this.districName = districName;
    }

    public long getDistricId() {
        return districId;
    }

    public void setDistricId(long districId) {
        this.districId = districId;
    }
}
