package com.reactnative.ivpusic.imagepicker;

import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by xzm on 17-3-1.
 */

public class ImagesUtils {
    public static List<ImageModel> getImages(Context context){
        List<ImageModel> list = new ArrayList<ImageModel>();
            ContentResolver contentResolver = context.getContentResolver();
            Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            String[] projection = {MediaStore.Images.Media._ID, MediaStore.Images.Media.DATA,};
            String sortOrder = MediaStore.Images.Media.DATE_ADDED + " desc";
            Cursor cursor = contentResolver.query(uri, projection, null, null, sortOrder);
            int iId = cursor.getColumnIndex(MediaStore.Images.Media._ID);
            int iPath = cursor.getColumnIndex(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            while (!cursor.isAfterLast()) {
                String id = cursor.getString(iId);
                String path = cursor.getString(iPath);
                ImageModel imageModel = new ImageModel(id,path);
                list.add(imageModel);
                cursor.moveToNext();
            }
            cursor.close();
        return list;
    }

    public static boolean hasFroyo() {
        // Can use static final constants like FROYO, declared in later versions
        // of the OS since they are inlined at compile time. This is guaranteed behavior.
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.FROYO;
    }

    public static boolean hasGingerbread() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD;
    }

    public static boolean hasHoneycomb() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB;
    }

    public static boolean hasHoneycombMR1() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR1;
    }

    public static boolean hasJellyBean() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN;
    }

    public static boolean hasKitKat() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
    }

}
