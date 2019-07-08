package com.meeruu.sharegoods.rn.showground.utils;

import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;

public class VideoCoverUtils {
    /**

     * 获取视频文件截图

     *

     * @param path 视频文件的路径

     * @return Bitmap 返回获取的Bitmap

     */

    public  static Bitmap getVideoThumb(String path) {

        MediaMetadataRetriever media = new MediaMetadataRetriever();

        media.setDataSource(path);

        return  media.getFrameAtTime();

    }
    
}
