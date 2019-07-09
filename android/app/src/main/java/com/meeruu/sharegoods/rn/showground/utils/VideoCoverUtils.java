package com.meeruu.sharegoods.rn.showground.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.media.ThumbnailUtils;
import android.provider.MediaStore;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.SecurityUtils;

import java.io.File;
import java.net.URI;

public class VideoCoverUtils {

    public  static String getVideoThumb(Context mContext,String filePath) {

        File dir = SDCardUtils.getFileDirPath(mContext, "MR/picture");
        String absolutePath = dir.getAbsolutePath();
        String md5 = "";
        try {
            md5 = SecurityUtils.MD5(filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String fileName = md5 + "video.png";
        File file = new File(absolutePath, fileName);
        if (file.exists()) {
           return file.getAbsolutePath();
        }

        String curPath = filePath;
        if(!TextUtils.isEmpty(filePath) && filePath.startsWith("file://")){
            try {
                File  file1 = new File(new URI(filePath));
                curPath = file1.getAbsolutePath();
            }catch (Exception e){
               return null;
            }
        }

        Bitmap bmp = ThumbnailUtils.createVideoThumbnail(curPath, MediaStore.Images.Thumbnails.MINI_KIND);
        if (bmp != null) {
            String returnPath = BitmapUtils.saveImageToCache(bmp, "video.png", filePath);
            if (bmp != null && !bmp.isRecycled()) {
                bmp.recycle();
            }
            bmp = null;
            return returnPath;
        } else {
           return null;
        }
    }
    
}
