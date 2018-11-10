package com.meeruu.sharegoods;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewStub;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.rn.ReactNativePreLoader;
import com.meeruu.sharegoods.ui.MainRNActivity;

/**
 * @author louis
 * @desc 启动页
 * @time created at 17/3/30 下午4:50
 * @company www.smartstudy.com
 */
public class MainActivity extends BaseActivity {

    private ImageView ivAdv;
    private TextView tvGo;

    private WeakHandler mHandler;
    private boolean needGo = false;
    private boolean isFirst = true;
    private boolean hasGo = false;
    private String adId;
    private String title;
    private String adUrl;
    private CountDownTimer countDownTimer = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setChangeStatusTrans(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        ReactNativePreLoader.preLoad(MainActivity.this, ParameterUtils.RN_MAIN_NAME);
    }

    @Override
    protected void onDestroy() {
        releaseRes();
        ReactNativePreLoader.deatchView(ParameterUtils.RN_MAIN_NAME);
        super.onDestroy();
    }

    private void releaseRes() {
        if (mHandler != null) {
            mHandler = null;
        }
        if (countDownTimer != null) {
            countDownTimer.onFinish();
            countDownTimer = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (hasBasePer) {
//            splashP.getAdInfo();
        }
        if (isFirst) {
            isFirst = false;
            String imgUrl = (String) SPCacheUtils.get("adImg", "");
            if (!TextUtils.isEmpty(imgUrl)) {
                //有广告时延迟时间增加
                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 4000);
            } else {
                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2500);
            }
        } else {
            if (needGo && hasBasePer) {
                goIndex();
            }
        }
    }

    @Override
    protected void initViewAndData() {
        String imgUrl = (String) SPCacheUtils.get("adImg", "");
        if (!TextUtils.isEmpty(imgUrl)) {
            ((ViewStub) findViewById(R.id.vs_adv)).inflate();
            ivAdv = findViewById(R.id.iv_adv);
            tvGo = findViewById(R.id.tv_go);
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) ivAdv.getLayoutParams();
            params.width = ScreenUtils.getScreenWidth();
            params.height = (ScreenUtils.getScreenWidth() * 7) / 5;
            ivAdv.setLayoutParams(params);
//            DisplayImageUtils.formatImgUrlNoHolder(this, imgUrl, ivAdv);

            initAdvEvent();
            startTimer();
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
        startActivity(new Intent(MainActivity.this, MainRNActivity.class));
        finish();
    }

    @Override
    protected void doClick(View v) {
        if (v.getId() == R.id.tv_go) {
            hasGo = true;
            //跳过
            goIndex();
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
            }

            @Override
            public void onFinish() {
                tvGo.setText(String.format(getString(R.string.ad_loop), 0));
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
}
