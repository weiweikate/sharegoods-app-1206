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
    public static final String TYPE11 = "type11";
    public static final String TYPE43 = "type43";
    public static final String TYPE916 = "type916";

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

    public static String getCoverType(double width,double height){
        double roate11 = 1;
        double roate43 = 4/3.0;
        double roate916 = 9/16.0;
        double[] roates = new double[]{roate11,roate43,roate916};
        double roate = width/height*1.0f;
        String result = TYPE11;
        double diff = Math.abs(roates[0]-roate);
        double diff1 = Math.abs(roates[1]-roate);
        double diff2 = Math.abs(roates[2]-roate);

        if(diff1<diff){
            diff = diff1;
            result = TYPE43;
        }
        if(diff2 < diff){
            diff = diff2;
            result = TYPE916;
        }
        return result;
    }
    
}
