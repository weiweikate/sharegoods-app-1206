package com.meeruu.sharegoods;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewStub;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.event.Event;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.sharegoods.event.HideSplashEvent;
import com.meeruu.sharegoods.rn.preload.ReactNativePreLoader;
import com.meeruu.sharegoods.ui.activity.GuideActivity;
import com.meeruu.sharegoods.ui.activity.MainRNActivity;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.HashMap;
import java.util.Map;

/**
 * @author louis
 * @desc 启动页
 * @time created at 17/3/30 下午4:50
 * @company www.sharegoodsmall.com
 */
public class MainActivity extends BaseActivity {

    private SimpleDraweeView ivAdv;
    private TextView tvGo;

    private WeakHandler mHandler;
    private boolean needGo = false;
    private boolean isFirst = true;
    private boolean hasGo = false;
    private String adUrl;
    private CountDownTimer countDownTimer = null;
    private boolean showLoading = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setChangeStatusTrans(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
        Log.d("is_phone", !Utils.isEmulator(getApplicationContext()) + "");
    }

    @Override
    protected void onStart() {
        super.onStart();
        // 预加载rn
        ReactNativePreLoader.preLoad(this, ParameterUtils.RN_MAIN_NAME);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (hasBasePer) {
            RequestManager.getInstance().doPost(new BaseRequestConfig() {
                @Override
                public String getUrl() {
                    return HttpUrlUtils.getUrl(HttpUrlUtils.URL_START_AD);
                }

                @Override
                public Map getParams() {
                    Map params = new HashMap();
                    // 开机广告
                    params.put("type", 16 + "");
                    return params;
                }
            }, new BaseCallback<String>() {
                @Override
                public void onErr(String errCode, String msg) {
                    ToastUtils.showToast(msg);
                }

                @Override
                public void onSuccess(String result) {
                    JSONArray array = JSON.parseArray(result);
                    if (array != null && array.size() > 0) {
                        JSONObject object = array.getJSONObject(0);
                        adUrl = object.getString("linkTypeCode");
                        SPCacheUtils.put("adBgImg", object.getString("image"));
                        SPCacheUtils.put("adImg", object.getString("assistantImage"));
                    } else {
                        SPCacheUtils.put("adBgImg", "");
                        SPCacheUtils.put("adImg", "");
                    }
                }
            });
        }
        if (isFirst) {
            isFirst = false;
            String imgUrl = (String) SPCacheUtils.get("adBgImg", "");
            if (!TextUtils.isEmpty(imgUrl)) {
                //有广告时延迟时间增加
                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 4000);
            } else {
                mHandler.sendEmptyMessageDelayed(ParameterUtils.EMPTY_WHAT, 2600);
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
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    private void releaseRes() {
        if (countDownTimer != null) {
            countDownTimer.onFinish();
            countDownTimer = null;
        }
    }

    @Override
    protected void initViewAndData() {
        String imgUrl = (String) SPCacheUtils.get("adBgImg", "");
        String url = (String) SPCacheUtils.get("adImg", "");
        if (!TextUtils.isEmpty(imgUrl) && Fresco.hasBeenInitialized()) {
            ((ViewStub) findViewById(R.id.vs_adv)).inflate();
            ivAdv = findViewById(R.id.iv_adv);
            SimpleDraweeView iv_adv_bg = findViewById(R.id.iv_adv_bg);
            tvGo = findViewById(R.id.tv_go);
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) ivAdv.getLayoutParams();
            params.width = ScreenUtils.getScreenWidth();
            params.height = (ScreenUtils.getScreenWidth() * 7) / 5;
            ivAdv.setLayoutParams(params);
            ImageLoadUtils.loadNetImage(imgUrl, iv_adv_bg);
            if (!TextUtils.isEmpty(url)) {
                ImageLoadUtils.loadScaleTypeNetImage(url, ivAdv,
                        ScalingUtils.ScaleType.FIT_CENTER, true);
            }
            initAdvEvent();
            startTimer();
        }

        /** 在应用的入口activity加入以下代码，解决首次安装应用，点击应用图标打开应用，点击home健回到桌面，再次点击应用图标，进入应用时多次初始化SplashActivity的问题*/
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
                        if (hasBasePer) {
                            if (!hasGo) {
                                goIndex();
                            }
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
                    goIndex();
                    EventBus.getDefault().post(new Event.MR2HTMLEvent(adUrl));
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
            startActivity(new Intent(MainActivity.this, MainRNActivity.class)
                    .putExtra("showLoading", showLoading));
        } else {
            startActivity(new Intent(MainActivity.this, GuideActivity.class));
        }
        finish();
    }

    @Override
    protected void doClick(View v) {
        switch (v.getId()) {
            case R.id.tv_go:
                hasGo = true;
                //跳过
                goIndex();
                break;
            default:
                break;
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
        switch (requestCode) {
            case ParameterUtils.REQUEST_CODE_WEBVIEW:
                goIndex();
                break;
            default:
                break;
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void hideSplash(HideSplashEvent event) {
        showLoading = false;
    }
}
