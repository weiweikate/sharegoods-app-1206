package com.meeruu.sharegoods.ui.activity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.customview.clipimagelayout.ClipImageLayout;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;

import java.io.File;

import static android.text.TextUtils.isEmpty;
import static android.view.View.VISIBLE;
import static android.view.Window.FEATURE_NO_TITLE;
import static com.meeruu.commonlib.customview.clipimagelayout.ClipImageLayout.CIRCLE;
import static com.meeruu.commonlib.customview.clipimagelayout.ClipImageLayout.SQUARE;

public class ClipPictureActivity extends BaseActivity {

    private TextView topdefault_centertitle;

    private ClipImageLayout mClipImageLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(FEATURE_NO_TITLE);// 去掉标题栏
        super.onCreate(savedInstanceState);
        super.setContentView(R.layout.activity_clip_picture);
    }

    @Override
    protected void initViewAndData() {
        topdefault_centertitle = (TextView) findViewById(R.id.topdefault_centertitle);
        topdefault_centertitle.setText(getString(R.string.move_and_zoom));
        Intent intent = getIntent();
        String type = intent.getStringExtra("clipType");
        if (CIRCLE.equals(type)) {
            mClipImageLayout = (ClipImageLayout) findViewById(R.id.id_clipImageLayout_circle);
        } else if (SQUARE.equals(type)) {
            mClipImageLayout = (ClipImageLayout) findViewById(R.id.id_clipImageLayout_square);
        }
        mClipImageLayout.setVisibility(VISIBLE);
        String path = intent.getStringExtra("path");
        File file = new File(path);
        if (isEmpty(path) || !(file.exists())) {
            ToastUtils.showToast(getString(R.string.picture_load_failure));
            return;
        }
        ImageLoadUtils.downloadImage(Uri.fromFile(file), new BaseBitmapDataSubscriber() {

            @Override
            protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
            }

            @Override
            protected void onNewResultImpl(@javax.annotation.Nullable Bitmap bitmap) {
                if (bitmap == null) {
                    ToastUtils.showToast(getString(R.string.picture_load_failure));
                    return;
                }
                mClipImageLayout.setBitmap(bitmap);
            }
        });
    }

    @Override
    public void initEvent() {
        findViewById(R.id.topdefault_leftbutton).setOnClickListener(this);
        findViewById(R.id.id_action_clip).setOnClickListener(this);
    }

    @Override
    protected void doClick(View v) {
        int id = v.getId();
        if (id == R.id.topdefault_leftbutton) {
            finish();
        } else if (id == R.id.id_action_clip) {
            Bitmap bitmap = mClipImageLayout.clip();
            BitmapUtils.saveImageAsFile(bitmap, "_clip.png");
        }
    }
}
