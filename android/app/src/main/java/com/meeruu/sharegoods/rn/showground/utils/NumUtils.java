package com.meeruu.sharegoods.rn.showground.utils;

public class NumUtils {
    public static String formatShowNum(int num) {
        if (num <= 999) {
            return num + "";
        } else if (num < 10000) {
            return num / 1000 + "K+";
        } else if (num < 100000) {
            return num / 10000 + "W+";
        } else {
            return "10w+";
        }
    }
}
