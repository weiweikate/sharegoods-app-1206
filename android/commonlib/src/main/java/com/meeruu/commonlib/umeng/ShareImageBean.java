package com.meeruu.commonlib.umeng;

import java.util.List;

public class ShareImageBean {
    public String imageUrlStr;
    public String titleStr;
    public String priceStr;
    public String QRCodeStr;
    public String retail;
    public String spell;
    public String discount;

    public String imageType;
    public String headerImage;
    public String userName;
    public String diamondNum;
    public int monthSaleType;

    public int getMonthSaleType() {
        return monthSaleType;
    }

    public void setMonthSaleType(int monthSaleType) {
        this.monthSaleType = monthSaleType;
    }

    public String getDiamondNum() {
        return diamondNum;
    }

    public void setDiamondNum(String diamondNum) {
        this.diamondNum = diamondNum;
    }

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }

    public String getHeaderImage() {
        return headerImage;
    }

    public void setHeaderImage(String headerImage) {
        this.headerImage = headerImage;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<String> getPriceType() {
        return priceType;
    }

    public void setPriceType(List<String> priceType) {
        this.priceType = priceType;
    }

    public List<String> priceType;

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getRetail() {
        return retail;
    }

    public void setRetail(String retail) {
        this.retail = retail;
    }


    public String getSpell() {
        return spell;
    }

    public void setSpell(String spell) {
        this.spell = spell;
    }

    public String getImageUrlStr() {
        return imageUrlStr;
    }

    public void setImageUrlStr(String imageUrlStr) {
        this.imageUrlStr = imageUrlStr;
    }

    public String getTitleStr() {
        return titleStr;
    }

    public void setTitleStr(String titleStr) {
        this.titleStr = titleStr;
    }

    public String getPriceStr() {
        return priceStr;
    }

    public void setPriceStr(String priceStr) {
        this.priceStr = priceStr;
    }

    public String getQRCodeStr() {
        return QRCodeStr;
    }


    public void setQRCodeStr(String QRCodeStr) {
        this.QRCodeStr = QRCodeStr;
    }

    @Override
    public String toString() {
        return "ShareImageBean{" + "imageUrlStr='" + imageUrlStr + '\'' + ", titleStr='" + titleStr + '\'' + ", priceStr='" + priceStr + '\'' + ", QRCodeStr='" + QRCodeStr + '\'' + ", retail='" + retail + '\'' + ", spell='" + spell + '\'' + ", imageType='" + imageType + '\'' + ", headerImage='" + headerImage + '\'' + ", userName='" + userName + '\'' + ", priceType='" + priceType + '\'' + '}';
    }
}
