package com.reactnative.ivpusic.imagepicker.picture.lib.imaging.core.file;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;

public class IMGContentDecoder extends IMGDecoder  {
    private Context mContext;
    public IMGContentDecoder(Context context,Uri uri){
        super(uri);
        this.mContext = context;
    }

    @Override
    public Bitmap decode(BitmapFactory.Options options) {
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(mContext.getContentResolver(), getUri());
            return bitmap;
        }catch (Exception e){
            return null;
        }
    }
}
