package com.meeruu.sharegoods.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by zhanglei on 2018/8/10.
 */

public class CaptureScreenImageUtils {
    public static Bitmap screemShot(Activity activity) {
        //获取当前屏幕的大小
        int width = activity.getWindow().getDecorView().getRootView().getWidth();
        int height = activity.getWindow().getDecorView().getRootView().getHeight();
        //生成相同大小的图片
        Bitmap temBitmap = Bitmap.createBitmap( width, height, Bitmap.Config.ARGB_8888 );
        //找到当前页面的跟布局
        View view = activity.getWindow().getDecorView().getRootView();
        //设置缓存
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache();
        //从缓存中获取当前屏幕的图片
        temBitmap = view.getDrawingCache();
        return  temBitmap;
    }
    //保存文件到指定路径
    public static boolean saveImageToGallery(Context context, Bitmap bmp, Callback callback,Activity activity) {
        if (!AndroidPermission.isGrantExternalRW(activity)){
            Toast.makeText(context, "请先允许储存权限", Toast.LENGTH_SHORT).show();
            return false;
        }
        // 首先保存图片
        String storePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "dearxy";
        File appDir = new File(storePath);
        if (!appDir.exists()) {
            appDir.mkdir();
        }
        String fileName = System.currentTimeMillis() + ".jpg";
        File file = new File(appDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            //通过io流的方式来压缩保存图片
            boolean isSuccess = bmp.compress(Bitmap.CompressFormat.JPEG, 60, fos);
            fos.flush();
            fos.close();

            //把文件插入到系统图库
//            MediaStore.Images.Media.insertImage(context.getContentResolver(), file.getAbsolutePath(), fileName, null);

            //保存图片后发送广播通知更新数据库
            Uri uri = Uri.fromFile(file);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            if (isSuccess) {
                callback.invoke(true);
                return true;
            } else {
                callback.invoke(false);
                return false;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        callback.invoke(false);
        return false;
    }
}
