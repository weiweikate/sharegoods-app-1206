package com.meeruu.sharegoods.rn.showground.utils;

import android.content.Context;

import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSourceFactory;
import com.google.android.exoplayer2.upstream.FileDataSource;
import com.google.android.exoplayer2.upstream.cache.CacheDataSink;
import com.google.android.exoplayer2.upstream.cache.CacheDataSource;
import com.google.android.exoplayer2.upstream.cache.LeastRecentlyUsedCacheEvictor;
import com.google.android.exoplayer2.upstream.cache.SimpleCache;
import com.google.android.exoplayer2.util.Util;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.sharegoods.R;

import java.io.File;

public class CacheDataSourceFactory implements DataSource.Factory {
    private final Context context;
    private final DefaultDataSourceFactory defaultDatasourceFactory;
    private final long maxFileSize, maxCacheSize;
    private String fileName;
    private SimpleCache simpleCache;
    private LeastRecentlyUsedCacheEvictor evictor;
    private FileDataSource fileDataSource;
    private CacheDataSink cacheDataSink;

    public CacheDataSourceFactory(Context context, long maxCacheSize, long maxFileSize) {
        super();
        this.context = context;
        this.maxCacheSize = maxCacheSize;
        this.maxFileSize = maxFileSize;
        String userAgent = Util.getUserAgent(context, context.getString(R.string.app_name));
        DefaultBandwidthMeter bandwidthMeter = new DefaultBandwidthMeter();
        defaultDatasourceFactory = new DefaultDataSourceFactory(this.context,
                bandwidthMeter,
                new DefaultHttpDataSourceFactory(userAgent, bandwidthMeter));
        evictor = new LeastRecentlyUsedCacheEvictor(maxCacheSize);
        fileDataSource = new FileDataSource();
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void realseCache() {
        if (simpleCache != null) {
            simpleCache.release();
            simpleCache = null;
        }
    }

    @Override
    public DataSource createDataSource() {
        File fileDir = SDCardUtils.getFileDirPath(this.context, "MR/media/"
                + fileName);
        if (simpleCache == null) {
            simpleCache = new SimpleCache(fileDir, evictor);
        }
        if (cacheDataSink == null) {
            cacheDataSink = new CacheDataSink(simpleCache, maxFileSize);
        }
        CacheDataSource dataSource = new CacheDataSource(simpleCache, defaultDatasourceFactory.createDataSource(),
                fileDataSource, cacheDataSink,
                CacheDataSource.FLAG_BLOCK_ON_CACHE | CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR, null);
        return dataSource;
    }
}
