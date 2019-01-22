package com.meeruu.nativedb;

import android.text.TextUtils;

import java.util.Arrays;

import static com.facebook.react.modules.storage.ReactDatabaseSupplier.KEY_COLUMN;

public class MrAsyncLocalStorageUtil {
    static String buildKeySelection(int selectionCount) {
        String[] list = new String[selectionCount];
        Arrays.fill(list, "?");
        return KEY_COLUMN + " IN (" + TextUtils.join(", ", list) + ")";
    }
}
