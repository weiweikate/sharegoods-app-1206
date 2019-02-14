package com.meeruu.commonlib.umeng;

public class ShareImageBean {
    public String imageUrlStr;
    public String titleStr;
    public String priceStr;
    public String QRCodeStr;
    public String retail;
    public String spell;

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

    @Override
    public String toString() {
        return "ShareImageBean{" + "imageUrlStr='" + imageUrlStr + '\'' + ", titleStr='" + titleStr + '\'' + ", priceStr='" + priceStr + '\'' + ", QRCodeStr='" + QRCodeStr + '\'' + ", retail='" + retail + '\'' + ", spell='" + spell + '\'' + '}';
    }

    public void setQRCodeStr(String QRCodeStr) {
        this.QRCodeStr = QRCodeStr;
    }


}
