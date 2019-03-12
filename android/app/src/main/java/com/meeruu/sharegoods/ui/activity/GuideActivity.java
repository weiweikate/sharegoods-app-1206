package com.meeruu.sharegoods.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.adapter.GuidePageAdapter;

import java.util.ArrayList;
import java.util.List;

public class GuideActivity extends BaseActivity implements ViewPager.OnPageChangeListener {

    private int[] imageIdArray;//图片资源的数组
    private List<RelativeLayout> viewList;//图片资源的集合
    private LinearLayout vg;//放置圆点
    private ImageView[] ivPointArray;

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
        if (ivPointArray != null) {
            ivPointArray = null;
        }
        if (viewList != null) {
            viewList.clear();
            viewList = null;
        }
        if (vg != null) {
            vg.removeAllViews();
            vg = null;
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
        // 加载底部圆点
        initPoint();
    }

    @Override
    public void initEvent() {
    }

    @Override
    protected void doClick(View v) {
    }

    /**
     * 加载底部圆点
     */
    private void initPoint() {
        // 这里实例化LinearLayout
        vg = findViewById(R.id.guide_ll_point);
        // 根据ViewPager的item数量实例化数组
        ivPointArray = new ImageView[viewList.size()];
        // 循环新建底部圆点ImageView，将生成的ImageView保存到数组中
        int size = viewList.size();
        // 实例化原点View
        ImageView iv_point;
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(DensityUtils.dip2px(8), DensityUtils.dip2px(8));
        params.setMargins(DensityUtils.dip2px(7), 0, DensityUtils.dip2px(7), 0);
        for (int i = 0; i < size; i++) {
            iv_point = new ImageView(this);
            iv_point.setLayoutParams(params);
            // 第一个页面需要设置为选中状态，这里采用两张不同的图片
            if (i == 0) {
                iv_point.setBackgroundResource(R.drawable.full_holo);
            } else {
                iv_point.setBackgroundResource(R.drawable.empty_holo);
            }
            ivPointArray[i] = iv_point;
            // 将数组中的ImageView加入到ViewGroup
            vg.addView(ivPointArray[i]);
            iv_point = null;
        }
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
        SimpleDraweeView imageView;
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
            imageView = new SimpleDraweeView(this);
            RelativeLayout.LayoutParams imgParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT);
            imageView.setLayoutParams(imgParams);
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            ImageLoadUtils.loadImageRes(this, imageIdArray[i], imageView);
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
        // 设置滑动监听
        vp.addOnPageChangeListener(this);
    }


    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
    }

    /**
     * 滑动后的监听
     *
     * @param position
     */
    @Override
    public void onPageSelected(int position) {
        // 循环设置当前页的标记图
        int length = imageIdArray.length;
        for (int i = 0; i < length; i++) {
            ivPointArray[position].setBackgroundResource(R.drawable.full_holo);
            if (position != i) {
                ivPointArray[i].setBackgroundResource(R.drawable.empty_holo);
            }
        }
    }

    @Override
    public void onPageScrollStateChanged(int state) {
    }
}
