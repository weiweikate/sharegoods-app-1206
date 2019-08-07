package com.reactnative.ivpusic.imagepicker;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;


import androidx.appcompat.app.AppCompatActivity;

import com.reactnative.ivpusic.imagepicker.cameralibrary.JCameraView;
import com.reactnative.ivpusic.imagepicker.cameralibrary.listener.ClickListener;
import com.reactnative.ivpusic.imagepicker.cameralibrary.listener.ErrorListener;
import com.reactnative.ivpusic.imagepicker.cameralibrary.listener.JCameraListener;
import com.reactnative.ivpusic.imagepicker.cameralibrary.util.DeviceUtil;
import com.reactnative.ivpusic.imagepicker.cameralibrary.util.FileUtil;

import java.io.File;

import static com.reactnative.ivpusic.imagepicker.picture.lib.PicturePreviewActivity.REQ_IMAGE_EDIT;
import static com.reactnative.ivpusic.imagepicker.picture.lib.imaging.IMGEditActivity.EXTRA_IMAGE_SAVE_PATH;

public class CameraActivity extends AppCompatActivity {
    private JCameraView jCameraView;
    public static final int REQ_CAMERA = 998;
    public static final int RES_CAMERA_ERR = 999;
    public static final int RES_CAMERA_PICTURE = 1000;
    public static final int RES_CAMERA_VIDEO = 1001;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        setContentView(R.layout.activity_camera);
        jCameraView = (JCameraView) findViewById(R.id.jcameraview);
        //设置视频保存路径
        jCameraView.setSaveVideoPath(Environment.getExternalStorageDirectory().getPath() + File.separator + "JCamera");
        if(PickerModule.canVideo){
            jCameraView.setFeatures(JCameraView.BUTTON_STATE_BOTH);
        }else {
            jCameraView.setFeatures(JCameraView.BUTTON_STATE_ONLY_CAPTURE);
        }
        jCameraView.setMediaQuality(JCameraView.MEDIA_QUALITY_MIDDLE);
        jCameraView.setErrorLisenter(new ErrorListener() {
            @Override
            public void onError() {
                //错误监听
                Intent intent = new Intent();
                setResult(RES_CAMERA_ERR, intent);
                finish();
            }

            @Override
            public void AudioPermissionError() {
                Toast.makeText(CameraActivity.this, "给点录音权限可以?", Toast.LENGTH_SHORT).show();
            }
        });
        //JCameraView监听
        jCameraView.setJCameraLisenter(new JCameraListener() {
            @Override
            public void captureSuccess(Bitmap bitmap) {
                //获取图片bitmap
//                Log.i("JCameraView", "bitmap = " + bitmap.getWidth());
                String path = FileUtil.saveBitmap("JCamera", bitmap);
                Intent intent = new Intent();
                intent.putExtra("path", path);
                setResult(RES_CAMERA_PICTURE, intent);
                finish();
            }

            @Override
            public void recordSuccess(String url, Bitmap firstFrame) {
                //获取视频路径
                String path = FileUtil.saveBitmap("JCamera", firstFrame);
                Log.i("CJT", "url = " + url + ", Bitmap = " + path);
                Intent intent = new Intent();
                intent.putExtra("path", url);
                intent.putExtra("width", firstFrame.getWidth());
                intent.putExtra("height", firstFrame.getHeight());
                setResult(RES_CAMERA_VIDEO, intent);
                finish();
            }
        });

        jCameraView.setLeftClickListener(new ClickListener() {
            @Override
            public void onClick() {
                CameraActivity.this.finish();
            }
        });
        jCameraView.setRightClickListener(new ClickListener() {
            @Override
            public void onClick() {
                Toast.makeText(CameraActivity.this, "Right", Toast.LENGTH_SHORT).show();
            }
        });

        Log.i("CJT", DeviceUtil.getDeviceModel());
    }

    @Override
    protected void onStart() {
        super.onStart();
        //全屏显示
        if (Build.VERSION.SDK_INT >= 19) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        } else {
            View decorView = getWindow().getDecorView();
            int option = View.SYSTEM_UI_FLAG_FULLSCREEN;
            decorView.setSystemUiVisibility(option);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_IMAGE_EDIT && data != null) {
            String path = data.getStringExtra(EXTRA_IMAGE_SAVE_PATH);
            if (TextUtils.isEmpty(path)) {
                return;
            }
            Bitmap bitmap = BitmapFactory.decodeFile(path);
            jCameraView.setEditBitmap(bitmap);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
//        jCameraView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
//        jCameraView.onPause();
    }
}
