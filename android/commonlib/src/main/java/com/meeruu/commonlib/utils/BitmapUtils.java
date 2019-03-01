package com.meeruu.commonlib.utils;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.media.ExifInterface;
import android.net.Uri;
import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public final class BitmapUtils {
    private static final String TAG = "BitmapUtils";

    /**
     * 对Bitmap进行质量压缩
     *
     * @param bitmap Bitmap
     * @return ByteArrayInputStream
     */
    public static Bitmap compressBitmap(Bitmap bitmap, int maxSize) {
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        // 图片质量默认值为100，表示不压缩
        int quality = 100;
        // PNG是无损的，将会忽略质量设置。因此，这里设置为JPEG
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outStream);

        // 判断压缩后图片的大小是否大于1M，大于则继续压缩
        while (outStream.toByteArray().length / 1024 > maxSize) {
            outStream.reset();

            // 压缩quality%，把压缩后的数据存放到baos中
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outStream);
            quality -= 10;
        }

        byte[] data = outStream.toByteArray();
        return BitmapFactory.decodeByteArray(data, 0, data.length);
    }

    public static byte[] compressBitmap2Byte(Bitmap bitmap) {
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        // 图片质量默认值为100，表示不压缩
        int quality = 100;
        // PNG是无损的，将会忽略质量设置。因此，这里设置为JPEG
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outStream);

        // 判断压缩后图片的大小是否大于1M，大于则继续压缩
        while (outStream.toByteArray().length / 1024 > 1024) {
            outStream.reset();

            // 压缩quality%，把压缩后的数据存放到baos中
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outStream);
            quality -= 10;
        }

        return outStream.toByteArray();
    }

    /**
     * 根据指定的压缩比例，获得合适的Bitmap
     *
     * @param inStream InputStream
     * @param width    指定的宽度
     * @param height   指定的高度
     * @return Bitmap
     * @throws IOException
     */
    public static Bitmap decodeStream(InputStream inStream, int width, int height) throws IOException {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;

        // 从输入流读取数据
        byte[] data = read(inStream);
        BitmapFactory.decodeByteArray(data, 0, data.length, options);

        int w = options.outWidth;
        int h = options.outHeight;

        // 从服务器端获取的图片大小为：80x120
        // 我们想要的图片大小为：40x40
        // 缩放比：120/40 = 3，也就是说我们要的图片大小为原图的1/3

        // 缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        int ratio = 1; // 默认为不缩放
        if (w >= h && w > width) {
            if (width != 0) {
                ratio = w / width;
            }
        } else if (w < h && h > height) {
            if (height != 0) {
                ratio = h / height;
            }
        }

        if (ratio <= 0) {
            ratio = 1;
        }

        options.inJustDecodeBounds = false;
        // 属性值inSampleSize表示缩略图大小为原始图片大小的几分之一，即如果这个值为2，
        // 则取出的缩略图的宽和高都是原始图片的1/2，图片大小就为原始大小的1/4。
        options.inSampleSize = ratio;
        return BitmapFactory.decodeByteArray(data, 0, data.length);
    }

    /**
     * 根据指定的压缩比例，获得合适的Bitmap
     *
     * @param data   byte[]
     * @param width  指定的宽度
     * @param height 指定的高度
     * @return Bitmap
     * @throws IOException
     */
    public static Bitmap decodeStream(byte[] data, int width, int height) throws IOException {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;

        BitmapFactory.decodeByteArray(data, 0, data.length, options);

        int w = options.outWidth;
        int h = options.outHeight;

        // 从服务器端获取的图片大小为：80x120
        // 我们想要的图片大小为：40x40
        // 缩放比：120/40 = 3，也就是说我们要的图片大小为原图的1/3

        // 缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        int ratio = 1; // 默认为不缩放
        if (w >= h && w > width) {
            if (width != 0) {
                ratio = w / width;
            }
        } else if (w < h && h > height) {
            if (height != 0) {
                ratio = h / height;
            }
        }

        if (ratio <= 0) {
            ratio = 1;
        }

        options.inJustDecodeBounds = false;
        // 属性值inSampleSize表示缩略图大小为原始图片大小的几分之一，即如果这个值为2，
        // 则取出的缩略图的宽和高都是原始图片的1/2，图片大小就为原始大小的1/4。
        options.inSampleSize = ratio;
        return BitmapFactory.decodeByteArray(data, 0, data.length);
    }

    /**
     * 根据指定的压缩比例，获得合适的Bitmap
     *
     * @param srcPath 文件路径
     * @param width   指定的宽度
     * @param height  指定的高度
     * @return Bitmap
     */
    public static Bitmap decodeStream(String srcPath, int width, int height) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;

        int w = options.outWidth;
        int h = options.outHeight;

        // 从服务器端获取的图片大小为：80x120
        // 我们想要的图片大小为：40x40
        // 缩放比：120/40 = 3，也就是说我们要的图片大小为原图的1/3

        // 缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        int ratio = 1; // 默认为不缩放
        if (w >= h && w > width) {
            if (width != 0) {
                ratio = w / width;
            }
        } else if (w < h && h > height) {
            if (height != 0) {
                ratio = h / height;
            }
        }

        if (ratio <= 0) {
            ratio = 1;
        }

        options = new BitmapFactory.Options();
        options.inJustDecodeBounds = false;
        // 属性值inSampleSize表示缩略图大小为原始图片大小的几分之一，即如果这个值为2，
        // 则取出的缩略图的宽和高都是原始图片的1/2，图片大小就为原始大小的1/4。
        options.inSampleSize = ratio;
        return BitmapFactory.decodeFile(srcPath, options);
    }

    // 将drawable资源文件转换成bitmap公共方法
    public static Bitmap readBitmap(Context context, int id) {
        BitmapFactory.Options opt = new BitmapFactory.Options();
        opt.inPreferredConfig = Bitmap.Config.ARGB_8888;
        opt.inInputShareable = true;
        opt.inPurgeable = true;// 设置图片可以被回收
        InputStream is = context.getResources().openRawResource(id);
        return BitmapFactory.decodeStream(is, null, opt);
    }

    public static byte[] read(InputStream inStream) throws IOException {
        ByteArrayOutputStream outSteam = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len;
        while ((len = inStream.read(buffer)) != -1) {
            outSteam.write(buffer, 0, len);
        }
        outSteam.close();
        inStream.close();
        return outSteam.toByteArray();
    }

    /**
     * 保存文件
     *
     * @param bm
     * @throws IOException
     */
    public static boolean saveBitmap(Bitmap bm, String filePath, Context context) {
        File file = new File(filePath);
        try {
            if (file.exists()) {
                file.delete();
            }
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
            bm.compress(Bitmap.CompressFormat.PNG, 100, bos);
            bos.flush();
            bos.close();
            //把文件插入到系统图库
            galleryAddPic(context, file);
            return true;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 添加到图库
     */
    public static void galleryAddPic(Context context, File file) {
        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri contentUri = Uri.fromFile(file);
        mediaScanIntent.setData(contentUri);
        context.sendBroadcast(mediaScanIntent);
    }

    /**
     * @param bm
     * @param orientationDegree
     * @return
     */
    public static Bitmap adjustPhotoRotation(Bitmap bm, final int orientationDegree) {

        Matrix m = new Matrix();
        m.setRotate(orientationDegree, (float) bm.getWidth() / 2, (float) bm.getHeight() / 2);
        float targetX, targetY;
        if (orientationDegree == 90) {
            targetX = bm.getHeight();
            targetY = 0;
        } else {
            targetX = bm.getHeight();
            targetY = bm.getWidth();
        }

        final float[] values = new float[9];
        m.getValues(values);

        float x1 = values[Matrix.MTRANS_X];
        float y1 = values[Matrix.MTRANS_Y];

        m.postTranslate(targetX - x1, targetY - y1);

        Bitmap bm1 = Bitmap.createBitmap(bm.getHeight(), bm.getWidth(), Bitmap.Config.ARGB_8888);
        Paint paint = new Paint();
        Canvas canvas = new Canvas(bm1);
        canvas.drawBitmap(bm, m, paint);

        return bm1;
    }

    /**
     * 旋转图片
     *
     * @param angle
     * @param bitmap
     * @return Bitmap
     */
    public static Bitmap rotaingImageView(int angle, Bitmap bitmap) {
        //旋转图片 动作
        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        // 创建新的图片
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    }

    /**
     * 读取图片属性：旋转的角度
     *
     * @param path 图片绝对路径
     * @return degree旋转的角度
     */
    public static int readPictureDegree(String path) {
        int degree = 0;
        try {
            ExifInterface exifInterface = new ExifInterface(path);
            int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    degree = 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    degree = 180;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    degree = 270;
                    break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return degree;
    }

    public static boolean compressBitmap(String srcPath, int ImageSize, String savePath) {
        int subtract;

        Bitmap bitmap = compressByResolution(srcPath, 1024, 720); //分辨率压缩
        if (bitmap == null) {
            Log.i(TAG, "bitmap 为空");
            return false;
        }
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int options = 100;
        bitmap.compress(Bitmap.CompressFormat.JPEG, options, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        Log.i(TAG, "图片分辨率压缩后：" + baos.toByteArray().length / 1024 + "KB");


        while (baos.toByteArray().length > ImageSize * 1024) {  //循环判断如果压缩后图片是否大于ImageSize kb,大于继续压缩
            subtract = setSubstractSize(baos.toByteArray().length / 1024);
            baos.reset();//重置baos即清空baos
            options -= subtract;//每次都减少10
            bitmap.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            Log.i(TAG, "图片压缩后：" + baos.toByteArray().length / 1024 + "KB");
        }
        Log.i(TAG, "图片处理完成!" + baos.toByteArray().length / 1024 + "KB");
        try {
            FileOutputStream fos = new FileOutputStream(new File(savePath));//将压缩后的图片保存的本地上指定路径中
            fos.write(baos.toByteArray());
            fos.flush();
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }

        return true;  //压缩成功返回ture
    }

    /**
     * 根据图片的大小设置压缩的比例，提高速度
     *
     * @param imageMB
     * @return
     */
    private static int setSubstractSize(int imageMB) {

        if (imageMB > 1000) {
            return 60;
        } else if (imageMB > 750) {
            return 40;
        } else if (imageMB > 500) {
            return 20;
        } else {
            return 10;
        }

    }


    private static Bitmap compressByResolution(String imgPath, int w, int h) {
        BitmapFactory.Options opts = new BitmapFactory.Options();
        opts.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(imgPath, opts);

        int width = opts.outWidth;
        int height = opts.outHeight;
        int widthScale = width / w;
        int heightScale = height / h;

        int scale;
        if (widthScale < heightScale) {  //保留压缩比例小的
            scale = widthScale;
        } else {
            scale = heightScale;
        }

        if (scale < 1) {
            scale = 1;
        }


        opts.inSampleSize = scale;

        opts.inJustDecodeBounds = false;

        Bitmap bitmap = BitmapFactory.decodeFile(imgPath, opts);

        return bitmap;
    }

    /**
     * bitmap转file，返回file的路径,id唯一标识拼接到name
     *
     * @param bitmap
     * @param name
     * @param id
     * @return
     */
    public static String saveImageToCache(Bitmap bitmap, String name, String id) {
        File dir = SDCardUtils.getFileDirPath("MR/picture");
        String path = dir.getAbsolutePath();
        String md5 = "";
        try {
            md5 = SecurityUtils.MD5(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String fileName = md5 + name;
        File file = new File(path, fileName);
        if (file.exists()) {
            file.delete();
        }
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        return file.getAbsolutePath();
    }

    /**
     * bitmap转file，返回file的路径
     *
     * @param bitmap
     * @param name
     * @return
     */
    public static File saveImageAsFile(Bitmap bitmap, String name) {
        File dir = SDCardUtils.getFileDirPath("MR/picture");
        String path = dir.getAbsolutePath();
        long date = System.currentTimeMillis();
        String fileName = date + name;
        File file = new File(path, fileName);
        if (file.exists()) {
            file.delete();
        }
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }

    public static String saveImageToCache(Bitmap bitmap, String name) {
        return saveImageAsFile(bitmap, name).getAbsolutePath();
    }

}
