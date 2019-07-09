package com.meeruu.sharegoods.rn.showground.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadataRetriever;
import android.media.ThumbnailUtils;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.SecurityUtils;
import com.meeruu.sharegoods.rn.showground.bean.ImageBean;

import java.io.File;
import java.net.URI;

public class VideoCoverUtils {

    public static ImageBean getVideoThumb(Context mContext, String filePath) {

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
            String path = file.getAbsolutePath();
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(Environment.getExternalStorageDirectory().getAbsolutePath()+"/test.png", options);
            int imgWidth = options.outWidth;
            int imgHeight = options.outHeight;
            ImageBean imageBean = new ImageBean();
            imageBean.setHeight(imgHeight);
            imageBean.setWidth(imgWidth);
            imageBean.setPath(path);
           return imageBean;
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
            int width = bmp.getWidth();
            int height = bmp.getHeight();
            if (bmp != null && !bmp.isRecycled()) {
                bmp.recycle();
            }
            bmp = null;
            ImageBean imageBean = new ImageBean();
            imageBean.setWidth(width);
            imageBean.setHeight(height);
            imageBean.setPath(returnPath);
            return imageBean;
        } else {
           return null;
        }
    }
    
}
