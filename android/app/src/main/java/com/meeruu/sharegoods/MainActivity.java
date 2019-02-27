package com.meeruu.sharegoods;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewStub;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.sharegoods.event.HideSplashEvent;
import com.meeruu.sharegoods.rn.preload.ReactNativePreLoader;
import com.meeruu.sharegoods.ui.activity.GuideActivity;
import com.meeruu.sharegoods.ui.activity.MainRNActivity;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

/**
 * @author louis
 * @desc 启动页
 * @time created at 17/3/30 下午4:50
 * @company www.sharegoodsmall.com
 */
public class MainActivity extends BaseActivity {

    private SimpleDraweeView ivAdv;
    private SimpleDraweeView ivAdvBg;
    private TextView tvGo;

    private WeakHandler mHandler;
    private boolean needGo = false;
    private boolean isFirst = true;
    private boolean hasGo = false;
    private boolean canSkip = false;
    private boolean hasAdResp = false;
    private String adId;
    private String title;
    private String adUrl;
    private CountDownTimer countDownTimer = null;
    private String ossHost = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setChangeStatusTrans(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        ReactNativePreLoader.preLoad(MainActivity.this, ParameterUtils.RN_MAIN_NAME);
        Log.d("is_phone", !Utils.isEmulator() + "");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (hasBasePer) {
//            splashP.getAdInfo();
        }
        if (isFirst) {
            isFirst = false;
//            String imgUrl = (String) SPCacheUtils.get("adImg", "");
//            if (!TextUtils.isEmpty(imgUrl)) {
//                //有广告时延迟时间增加
//                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 4000);
//            } else {
//                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2600);
//            }
            if (canSkip) {
                mHandler.sendEmptyMessage(ParameterUtils.EMPTY_WHAT);
            }
        } else {
            if (needGo && hasBasePer) {
                goIndex();
            }
        }
    }

    @Override
    protected void onDestroy() {
        releaseRes();
        super.onDestroy();
    }

    private void releaseRes() {
        if (countDownTimer != null) {
            countDownTimer.onFinish();
            countDownTimer = null;
        }
    }

    @Override
    protected void initViewAndData() {
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (!hasAdResp) {
                    mHandler.sendEmptyMessage(ParameterUtils.EMPTY_WHAT);
                }
            }
        }, 3000);
        String hostJson = (String) SPCacheUtils.get(ParameterUtils.API_SERVER, "");
        if (!TextUtils.isEmpty(hostJson)) {
            JSONObject object = JSON.parseObject(hostJson);
            ossHost = object.getString("oss");
            Uri uri = Uri.parse(ossHost + "/app/start_adv_bg.png?" + System.currentTimeMillis());
            LoadingAdv(uri);
        } else {
            hasAdResp = true;
            mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2600);
        }
        /**在应用的入口activity加入以下代码，解决首次安装应用，点击应用图标打开应用，点击home健回到桌面，再次点击应用图标，进入应用时多次初始化SplashActivity的问题*/
        if ((getIntent().getFlags() & Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT) != 0) {
            finish();
            return;
        }
        if (!isTaskRoot()) {
            finish();
            return;
        }
    }

    private void LoadingAdv(Uri uri) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.downloadImage(uri, new BaseBitmapDataSubscriber() {

                @Override
                protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                    hasAdResp = true;
                    mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2600);
                }

                @Override
                protected void onNewResultImpl(@Nullable Bitmap bitmap) {
                    hasAdResp = true;
                    if (bitmap == null) {
                        mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2600);
                        return;
                    }
                    Message msg = Message.obtain();
                    msg.obj = bitmap;
                    msg.what = ParameterUtils.TIMER_START;
                    mHandler.sendMessage(msg);
                }
            });
        }
    }

    @Override
    public void initEvent() {
        mHandler = new WeakHandler(new Handler.Callback() {
            @Override
            public boolean handleMessage(Message msg) {
                switch (msg.what) {
                    case ParameterUtils.EMPTY_WHAT:
                        needGo = true;
                        if (hasBasePer && !hasGo) {
                            goIndex();
                        }
                        break;
                    case ParameterUtils.TIMER_START:
                        //有广告时延迟时间增加
                        mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 4000);
                        ((ViewStub) findViewById(R.id.vs_adv)).inflate();
                        ivAdv = findViewById(R.id.iv_adv);
                        String url = ossHost + "/app/start_adv.png?" + System.currentTimeMillis();
                        ImageLoadUtils.loadScaleTypeNetImage(url, ivAdv,
                                ScalingUtils.ScaleType.FIT_CENTER);
                        ivAdvBg = findViewById(R.id.iv_adv_bg);
                        tvGo = findViewById(R.id.tv_go);
                        Bitmap bmp = (Bitmap) msg.obj;
                        if (bmp != null && !bmp.isRecycled()) {
                            ivAdvBg.setImageBitmap((Bitmap) msg.obj);
                        }
                        initAdvEvent();
                        startTimer();
                        break;
                    default:
                        break;
                }
                return false;
            }
        });
    }

    private void initAdvEvent() {
        ivAdv.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (!TextUtils.isEmpty(adUrl)) {
                    hasGo = true;
                    //广告页
                }
                return false;
            }
        });
        tvGo.setOnClickListener(this);
    }

    //跳转到首页
    private void goIndex() {
        boolean hasGuide = (boolean) SPCacheUtils.get("hasGuide", false);
        if (hasGuide) {
            startActivity(new Intent(MainActivity.this, MainRNActivity.class));
        } else {
            startActivity(new Intent(MainActivity.this, GuideActivity.class));
        }
    }

    @Override
    protected void doClick(View v) {
        if (v.getId() == R.id.tv_go) {
            if (canSkip) {
                hasGo = true;
                //跳过
                goIndex();
            }

        }
    }

    @Override
    public void hasBasePermission() {
        //权限授予成功
        if (needGo) {
            goIndex();
        }
    }

    protected void startTimer() {
        countDownTimer = new CountDownTimer(3500, 1000) {

            @Override
            public void onTick(long millisUntilFinished) {
                tvGo.setText(String.format(getString(R.string.ad_loop), millisUntilFinished / 1000));
                canSkip = false;
            }

            @Override
            public void onFinish() {
                tvGo.setText(String.format(getString(R.string.ad_loop), 0));
                canSkip = true;
            }
        };
        countDownTimer.start();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK) {
            return;
        }
//        switch (requestCode) {
//            case ParameterUtils.REQUEST_CODE_WEBVIEW:
//                goIndex();
//                break;
//            default:
//                break;
//        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void hideSplash(HideSplashEvent event) {
        if (hasBasePer && needGo && !hasGo) {
            if (!isFinishing()) {
                finish();
            }
        }
    }
}
