package com.meeruu.nativedb;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;



public class AsyncStorageUtils {
    static final String KEY_COLUMN = "key";
    static final String VALUE_COLUMN = "value";
    public static void multiGet(List<String> keys, MultiGetCallback callback){
        if(keys == null){
            callback.onFail(StorageErrorType.KEYERROR);
            return;
        }
        if(keys.size() == 0){
            callback.onFail(StorageErrorType.KEYERROR);
            return;
        }
        String[] columns = {KEY_COLUMN, VALUE_COLUMN};
        HashSet<String> keysRemaining = new HashSet<>();
        List data = Arrays.

    }
}
