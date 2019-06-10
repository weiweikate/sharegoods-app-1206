package com.meeruu.sharegoods.rn.showground.bean;

import java.util.ArrayList;
import java.util.List;

public class ShowRecommendBean {
    private boolean hasExpand = false;
    private List imageUrls = new ArrayList<>();

    public boolean isHasExpand() {
        return hasExpand;
    }

    public void setHasExpand(boolean hasExpand) {
        this.hasExpand = hasExpand;
    }

    public List getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List imageUrls) {
        this.imageUrls = imageUrls;
    }
}
