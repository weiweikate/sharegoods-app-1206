package com.reactnative.ivpusic.imagepicker;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.File;

/**
 * Created by xzm on 17-3-2.
 */

public class ImageDetail extends AppCompatActivity {

    ImageView back;
    TextView title;
    ImageView image;
    String index, all, path;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_detail);
        Intent intent = getIntent();
        index = intent.getStringExtra("index");
        all = intent.getStringExtra("all");
        path = intent.getStringExtra("path");

        initView();
        bindEvent();
    }

    private void initView() {
        back = (ImageView) findViewById(R.id.id_iv_back);
        title = (TextView) findViewById(R.id.title);
        image = (ImageView) findViewById(R.id.image);
        title.setText(index + "/" + all);
        File file = new File(path);
        if (file.exists()) {
            Bitmap bitmap = BitmapFactory.decodeFile(path);
            image.setImageBitmap(bitmap);
        }


    }

    private void bindEvent() {
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
}
