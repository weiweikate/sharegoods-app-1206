package com.reactnative.ivpusic.imagepicker.cameralibrary.util;

import android.content.ContentUris;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

public class UriUtil {
    /***
     * 将指定路径的图片转uri
     * @param context
     * @param path ，指定图片(或文件)的路径
     * @return
     */
    public static Uri getMediaUriFromPath(Context context, String path) {
        Uri mediaUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        Cursor cursor = context.getContentResolver().query(mediaUri,
            null,
            MediaStore.Images.Media.DISPLAY_NAME + "= ?",
            new String[] {path.substring(path.lastIndexOf("/") + 1)},
            null);

        Uri uri = null;
        if(cursor.moveToFirst()) {
            uri = ContentUris.withAppendedId(mediaUri,
                cursor.getLong(cursor.getColumnIndex(MediaStore.Images.Media._ID)));
        }
        cursor.close();
        return uri;
    }
}
