package com.meeruu.sharegoods.rn.storage;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteStatement;
import android.os.AsyncTask;
import android.text.TextUtils;

import com.facebook.common.logging.FLog;
import com.facebook.react.common.ReactConstants;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;


public class AsyncStorageManager {
    static final String KEY_COLUMN = "key";
    static final String VALUE_COLUMN = "value";
    static final String TABLE_CATALYST = "catalystLocalStorage";
    private static final int MAX_SQL_KEYS = 999;
    private ReactDatabaseSupplier mReactDatabaseSupplier;
    private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
    private static final int CORE_POOL_SIZE = Math.max(2, Math.min(CPU_COUNT - 1, 4));
    private static final int MAXIMUM_POOL_SIZE = CPU_COUNT * 2 + 1;
    private static final int KEEP_ALIVE_SECONDS = 30;
    private static final BlockingQueue<Runnable> sPoolWorkQueue =
            new LinkedBlockingQueue<Runnable>(128);
    public static final Executor THREAD_POOL_EXECUTOR;

    private static final ThreadFactory sThreadFactory = new ThreadFactory() {
        private final AtomicInteger mCount = new AtomicInteger(1);
        @Override
        public Thread newThread(Runnable r) {
            return new Thread(r, "AsyncTask #" + mCount.getAndIncrement());
        }
    };

    static {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                CORE_POOL_SIZE, MAXIMUM_POOL_SIZE, KEEP_ALIVE_SECONDS, TimeUnit.SECONDS,
                sPoolWorkQueue, sThreadFactory);
        threadPoolExecutor.allowCoreThreadTimeOut(true);
        THREAD_POOL_EXECUTOR = threadPoolExecutor;
    }
//    private class SerialExecutor implements Executor {
//        private final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();
//        private Runnable mActive;
//        private final Executor executor;
//
//        SerialExecutor(Executor executor) {
//            this.executor = executor;
//        }
//
//        @Override
//        public synchronized void execute(final Runnable r) {
//            mTasks.offer(new Runnable() {
//                public void run() {
//                    try {
//                        r.run();
//                    } finally {
//                        scheduleNext();
//                    }
//                }
//            });
//            if (mActive == null) {
//                scheduleNext();
//            }
//        }
//        synchronized void scheduleNext() {
//            if ((mActive = mTasks.poll()) != null) {
//                executor.execute(mActive);
//            }
//        }
//    }

//    private final AsyncStorageManager.SerialExecutor executor;
    private AsyncStorageManager() {
    }

    private static class AsyncStorageManagerHolder {
        private final static AsyncStorageManager instance = new AsyncStorageManager();
    }

    public static AsyncStorageManager getInstance() {
        return AsyncStorageManagerHolder.instance;
    }

    public void init(Context context) {
//        this.executor = new AsyncStorageManager.SerialExecutor(executor);

        mReactDatabaseSupplier = ReactDatabaseSupplier.getInstance(context);
    }

    public void getItem(final String key,final MultiGetCallback callback) {
        if (TextUtils.isEmpty(key)) {
            callback.onFail(StorageErrorType.KEYERROR);
            return;
        }

        final List<String> keys = new ArrayList();
        keys.add(key);
        new AsyncTask<Void, Void,Void>(){
            @Override
            protected Void doInBackground(Void... objects) {
                if (!ensureDatabase()) {
                    callback.onFail(StorageErrorType.DBERROR);
                    return null;
                }
                String[] columns = {KEY_COLUMN, VALUE_COLUMN};
                HashSet<String> keysRemaining = new HashSet<>();
                List<List<String>> data = new ArrayList();
                for (int keyStart = 0; keyStart < keys.size(); keyStart += MAX_SQL_KEYS) {
                    int keyCount = Math.min(keys.size() - keyStart, MAX_SQL_KEYS);
                    Cursor cursor = mReactDatabaseSupplier.get().query(TABLE_CATALYST, columns, AsyncLocalStorageUtil.buildKeySelection(keyCount), AsyncLocalStorageUtil.buildKeySelectionArgs(keys, keyStart, keyCount), null, null, null);
                    keysRemaining.clear();
                    try {
                        if (cursor.getCount() != keys.size()) {
                            // some keys have not been found - insert them with null into the final array
                            for (int keyIndex = keyStart; keyIndex < keyStart + keyCount; keyIndex++) {
                                keysRemaining.add(keys.get(keyIndex));
                            }
                        }

                        if (cursor.moveToFirst()) {
                            do {
                                List row = new ArrayList();
                                row.add(cursor.getString(0));
                                row.add(cursor.getString(1));
                                data.add(row);
                                keysRemaining.remove(cursor.getString(0));
                            } while (cursor.moveToNext());
                        }
                    } catch (Exception e) {
                        FLog.w(ReactConstants.TAG, e.getMessage(), e);
                        callback.onFail(e.getMessage());
                        return null;
                    } finally {
                        cursor.close();
                    }

                    for (String key : keysRemaining) {
                        List row = new ArrayList();
                        row.add(key);
                        row.add(null);
                        data.add(row);
                    }
                    keysRemaining.clear();
                }

                if(data != null && data.get(0) != null && data.get(0).get(1) != null){
                    callback.onSuccess(data.get(0).get(1));
                }else {
                    callback.onSuccess(null);
                }
                return null;
            }
        }.executeOnExecutor(THREAD_POOL_EXECUTOR);
    }


    public void setItem(final String key,final Object value,final MultiSetCallback callback){
        if(TextUtils.isEmpty(key)){
            callback.onFail(StorageErrorType.KEYERROR);
            return;
        }
        final List keyValue = new ArrayList();
        keyValue.add(key);
        keyValue.add(value);
        final List<List<String>> keyValueArray = new ArrayList();
        keyValueArray.add(keyValue);

        new AsyncTask<Void, Void,Void>(){
            @Override
            protected Void doInBackground(Void... objects) {
                if (!ensureDatabase()) {
                    callback.onFail(StorageErrorType.DBERROR);
                    return null;
                }
                String sql = "INSERT OR REPLACE INTO " + TABLE_CATALYST + " VALUES (?, ?);";
                SQLiteStatement statement = mReactDatabaseSupplier.get().compileStatement(sql);

                try {
                    mReactDatabaseSupplier.get().beginTransaction();
                    for (int idx=0; idx < keyValueArray.size(); idx++) {
                        if (keyValueArray.get(idx).size() != 2) {
                            callback.onFail(StorageErrorType.VALUEERROR);
                            return null;
                        }
                        if (keyValueArray.get(idx).get(0) == null) {
                            callback.onFail(StorageErrorType.KEYERROR);
                            return null;
                        }
                        if (keyValueArray.get(idx).get(1) == null) {
                            callback.onFail(StorageErrorType.VALUEERROR);
                            return null;
                        }

                        statement.clearBindings();
                        statement.bindString(1, keyValueArray.get(idx).get(0));
                        statement.bindString(2, keyValueArray.get(idx).get(1));
                        statement.execute();
                    }
                    mReactDatabaseSupplier.get().setTransactionSuccessful();
                } catch (Exception e) {
                    FLog.w(ReactConstants.TAG, e.getMessage(), e);
                    callback.onFail(e.getMessage());
                    return null;
                } finally {
                    try {
                        mReactDatabaseSupplier.get().endTransaction();
                    } catch (Exception e) {
                        FLog.w(ReactConstants.TAG, e.getMessage(), e);
                        callback.onFail(e.getMessage());
                        return null;
                    }
                }
                callback.onSuccess();
                return null;
            }
        }.executeOnExecutor(THREAD_POOL_EXECUTOR);


    }

    private boolean ensureDatabase() {
        return mReactDatabaseSupplier.ensureDatabase();
    }
}

