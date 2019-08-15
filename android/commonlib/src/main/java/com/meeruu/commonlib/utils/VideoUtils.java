package com.meeruu.commonlib.utils;

import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;

import java.util.HashMap;

/**
 * 网络视频第一帧
 */
public class VideoUtils {
    public static Bitmap getNetVideoBitmap(String videoUrl) {
        Bitmap bitmap = null;

        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        try {
            //根据url获取缩略图
            retriever.setDataSource(videoUrl, new HashMap());
            //获得第一帧图片
            bitmap = retriever.getFrameAtTime();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } finally {
            retriever.release();
        }
        return bitmap;
    }
}
