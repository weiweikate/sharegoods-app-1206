package com.meeruu.nativedb;

import android.content.Context;
import android.database.Cursor;

import com.facebook.react.modules.storage.AsyncLocalStorageUtil;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static com.facebook.react.modules.storage.ReactDatabaseSupplier.TABLE_CATALYST;


public class AsyncStorageManager {
    static final String KEY_COLUMN = "key";
    static final String VALUE_COLUMN = "value";
    static final String TABLE_CATALYST = "catalystLocalStorage";
    private static final int MAX_SQL_KEYS = 999;
    private ReactDatabaseSupplier mReactDatabaseSupplier;

    private AsyncStorageManager(){}

    private static class AsyncStorageManagerHolder{
        private final static AsyncStorageManager instance = new AsyncStorageManager();
    }

    public static AsyncStorageManager getInstance(){
        return AsyncStorageManagerHolder.instance;
    }

    public void init(Context context){
        mReactDatabaseSupplier = ReactDatabaseSupplier.getInstance(context);
    }

    public void multiGet(List<String> keys, MultiGetCallback callback){
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
        List data = new ArrayList();
        for(int keyStart = 0; keyStart < keys.size(); keyStart += MAX_SQL_KEYS){
            int keyCount = Math.min(keys.size() - keyStart, MAX_SQL_KEYS);
            Cursor cursor = mReactDatabaseSupplier.get().query(
                    TABLE_CATALYST,
                    columns,
                    AsyncLocalStorageUtil.buildKeySelection(keyCount),
                    AsyncLocalStorageUtil.buildKeySelectionArgs(keys, keyStart, keyCount),
                    null,
                    null,
                    null);
        }

    }
}
