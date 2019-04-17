package com.meeruu.sharegoods.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.adapter.GuidePageAdapter;

import java.util.ArrayList;
import java.util.List;

public class GuideActivity extends BaseActivity {

    private int[] imageIdArray;//图片资源的数组
    private List<RelativeLayout> viewList;//图片资源的集合

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setChangeStatusTrans(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guide);
    }

    @Override
    protected void onDestroy() {
        releaseRes();
        super.onDestroy();
    }

    private void releaseRes() {
        if (imageIdArray != null) {
            imageIdArray = null;
        }
        if (viewList != null) {
            viewList.clear();
            viewList = null;
        }
    }

    @Override
    protected void initViewAndData() {
        SPCacheUtils.put("hasGuide", true);
        if (!Fresco.hasBeenInitialized()) {
            Fresco.initialize(getApplicationContext(),
                    FrescoImagePipelineConfig.getDefaultImagePipelineConfig(getApplicationContext()));
        }
        // 加载ViewPager
        initViewPager();
    }

    @Override
    public void initEvent() {
    }

    @Override
    protected void doClick(View v) {
    }

    /**
     * 加载图片ViewPager
     */
    private void initViewPager() {
        ViewPager vp = findViewById(R.id.guide_vp);
        // 实例化图片资源
        imageIdArray = new int[]{R.drawable.img_guide1, R.drawable.img_guide2, R.drawable.img_guide3, R.drawable.img_guide4};
        int[] imgBg = new int[]{R.drawable.bg_guide1, R.drawable.bg_guide2, R.drawable.bg_guide3, R.drawable.bg_guide4};
        viewList = new ArrayList<>();
        // 循环创建View并加入到集合中
        int len = imageIdArray.length;
        ImageView imageView;
        RelativeLayout parent;
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);
        for (int i = 0; i < len; i++) {
            // new ImageView并设置全屏和图片资源
            parent = new RelativeLayout(this);
            parent.setBackgroundResource(imgBg[i]);
            parent.setLayoutParams(params);
            parent.setGravity(Gravity.CENTER);
            imageView = new ImageView(this);
            RelativeLayout.LayoutParams imgParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT);
            imageView.setLayoutParams(imgParams);
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setImageResource(imageIdArray[i]);
            parent.addView(imageView);
            // 将ImageView加入到集合中
            viewList.add(parent);
            // 判断是否是最后一页，若是则显示按钮
            if (i == len - 1) {
                TextView tvClick = new TextView(this);
                RelativeLayout.LayoutParams tvParams = new RelativeLayout.LayoutParams(DensityUtils.dip2px(110f),
                        DensityUtils.dip2px(35f));
                tvParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
                tvParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
                tvParams.bottomMargin = getResources().getDimensionPixelOffset(R.dimen.start_page_marginb);
                tvClick.setLayoutParams(tvParams);
                tvClick.setGravity(Gravity.CENTER);
                tvClick.setText("立即开启");
                tvClick.setTextColor(getResources().getColor(R.color.app_main_color));
                tvClick.setTextSize(17f);
                tvClick.setBackgroundResource(R.drawable.bg_app_trans_btn_blue_border70);
                tvClick.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivity(new Intent(GuideActivity.this, MainRNActivity.class));
                        finish();
                    }
                });
                parent.addView(tvClick);
            }
            imageView = null;
        }
        // View集合初始化好后，设置Adapter
        vp.setAdapter(new GuidePageAdapter(viewList));
    }
}
