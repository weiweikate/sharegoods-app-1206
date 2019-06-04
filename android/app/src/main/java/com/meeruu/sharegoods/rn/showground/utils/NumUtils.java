package com.meeruu.sharegoods.rn.showground.utils;

public class NumUtils {
    public static String formatShowNum(int num) {
        if (num <= 999) {
            return num + "";
        }

        if (num > 999 && num <= 100000) {
            return "999+";
        }

        return "10w+";
    }
}
