package com.meeruu.commonlib.base;

import android.content.ComponentCallbacks2;
import android.content.Context;
import android.os.Build;
import android.os.Looper;
import android.os.MessageQueue;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.text.TextUtils;
import android.webkit.WebView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.soloader.SoLoader;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.callback.ForegroundCallbacks;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.config.FrescoImagePipelineConfig;
import com.meeruu.commonlib.event.Event;
import com.meeruu.commonlib.handler.CrashHandler;
import com.meeruu.commonlib.rn.QiyuImageLoader;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.umeng.UShare;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.qiyu.activity.QiyuServiceMessageActivity;
import com.meituan.android.walle.WalleChannelReader;
import com.qiyukf.unicorn.api.OnBotEventListener;
import com.qiyukf.unicorn.api.OnMessageItemClickListener;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.YSFOptions;

import org.greenrobot.eventbus.EventBus;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import cn.jpush.android.api.JPushInterface;

import static com.meeruu.commonlib.config.QiyuConfig.options;

public class BaseApplication extends MultiDexApplication {

    private static BaseApplication instance;
    public static Context appContext;
    private boolean isDownload = false;
    private String downLoadUrl;
    private String packageName = "";

    public boolean isDownload() {
        return isDownload;
    }

    public void setDownload(boolean isDownload) {
        this.isDownload = isDownload;
    }

    public String getDownLoadUrl() {
        return downLoadUrl;
    }

    public void setDownLoadUrl(String downLoadUrl) {
        this.downLoadUrl = downLoadUrl;
    }

    public static BaseApplication getInstance() {
        if (null == instance) {
            synchronized (BaseApplication.class) {
                if (null == instance) {
                    instance = new BaseApplication();
                }
            }
        }
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        appContext = this;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WebView.setDataDirectorySuffix("com.meeruu." + packageName);
        }
        if (packageName.equals(getPackageName())) {
            SoLoader.init(getApplicationContext(), /* native exopackage */ false);
            Fresco.initialize(getApplicationContext(),
                    FrescoImagePipelineConfig.getDefaultImagePipelineConfig(getApplicationContext()));
            // 拿到主线程的MessageQueue
            Looper.myQueue().addIdleHandler(new MessageQueue.IdleHandler() {

                @Override
                public boolean queueIdle() {
                    // 在这里去处理你想延时加载的东西
                    delayLoad();
                    // 最后返回false，后续不用再监听了。
                    return false;
                }
            });
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
        // 修复部分手机GC超时
        AppUtils.daemonsFix();
        if (TextUtils.isEmpty(packageName)) {
            packageName = AppUtils.getProcessName(this);
        }
    }

    private void delayLoad() {
        // 监听应用前后台
        ForegroundCallbacks.init(this);
        // 神策初始化
        SensorsUtils.init(this);
        // 初始化一键登录
        JVerificationInterface.init(this);
        // umeng初始化
        String channel = WalleChannelReader.getChannel(getApplicationContext(), "guanwang");
        // 友盟统计
        UApp.init(getApplicationContext(), ParameterUtils.UM_KEY, channel);
        // 初始化分享
        UShare.init(getApplicationContext(), ParameterUtils.UM_KEY);
        // 初始化极光
        JPushInterface.init(getApplicationContext());
        if (Utils.isApkInDebug()) {
            // 七鱼初始化
            Unicorn.init(getApplicationContext(), "ae7a2c616148c5aec7ffedfa50ad90a7", QiYuOptions(),
                    new QiyuImageLoader(getApplicationContext()));
            // jpush debug
            JPushInterface.setDebugMode(true);
            // umeng debug
            UApp.debug();
            // 禁止极光捕获crash
            JPushInterface.stopCrashHandler(getApplicationContext());
            // 一键登录debug
            JVerificationInterface.setDebugMode(true);
            // 神策
//            SensorsDataAPI.sharedInstance().enableLog(true);
        } else {
            // 七鱼初始化
            Unicorn.init(getApplicationContext(), "b87fd67831699ca494a9d3de266cd3b0", QiYuOptions(),
                    new QiyuImageLoader(getApplicationContext()));
            JPushInterface.setDebugMode(false);
            JPushInterface.initCrashHandler(getApplicationContext());
            JPushInterface.setChannel(getApplicationContext(), channel);
            // 捕获闪退日志
            CrashHandler.getInstance().init(getApplicationContext());
        }
    }

    private YSFOptions QiYuOptions() {
        YSFOptions ysfOptions = options();
        ysfOptions.onMessageItemClickListener = new OnMessageItemClickListener() {
            // 响应url点击事件
            @Override
            public void onURLClicked(Context context, String url) {
                try {
                    url = URLDecoder.decode(url, "utf-8");
                    LogUtils.d("=====" + url);
                    // 商品卡片，订单卡片
                    if (url.contains("h5.sharegoodsmall.com/product") || url.contains("http:///")) {
                        EventBus.getDefault().post(new com.meeruu.qiyu.Event.QiyuUrlEvent(url));
                    } else {
                        EventBus.getDefault().post(new Event.MR2HTMLEvent(url));
                    }
                    ((QiyuServiceMessageActivity) context).finish();
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        };
        getShopInfo(ysfOptions);
        return ysfOptions;
    }

    /**
     * 获取七鱼商家信息
     *
     * @param ysfOptions
     */
    private void getShopInfo(YSFOptions ysfOptions) {
        ysfOptions.onBotEventListener = new OnBotEventListener() {
            @Override
            public boolean onUrlClick(Context context, String s) {
                try {
                    s = URLDecoder.decode(s, "utf-8");
                    LogUtils.d("=====" + s);
                    if (s.contains("qiyukf.com/client")) {
                        final String bid = HttpUrlUtils.getValueByName(s, "bid");
                        RequestManager.getInstance().doGet(ParameterUtils.NETWORK_ELSE_CACHED, new BaseRequestConfig() {
                            @Override
                            public String getUrl() {
                                return HttpUrlUtils.getUrl(HttpUrlUtils.URL_SHOPINFO);
                            }

                            @Override
                            public Map getParams() {
                                Map<String, String> map = new HashMap();
                                map.put("supplierCode", bid);
                                return map;
                            }
                        }, new BaseCallback<String>() {
                            @Override
                            public void onErr(String errCode, String msg) {
                                ToastUtils.showToast("获取商家信息失败");
                            }

                            @Override
                            public void onSuccess(String result) {
                                JSONObject object = JSON.parseObject(result);
                                String shopId = object.getString("shopId");
                                String title = object.getString("title");
                                EventBus.getDefault().post(new com.meeruu.qiyu.Event.QiyuShopIdEvent(shopId, title));
                            }
                        });
                    }
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                return true;
            }
        };
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        try {
            if (level >= ComponentCallbacks2.TRIM_MEMORY_MODERATE) {
                if (ImagePipelineFactory.hasBeenInitialized()) {
                    ImagePipelineFactory.getInstance().getImagePipeline().clearMemoryCaches();
                }
            }
        } catch (Exception e) {
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        try {
            if (ImagePipelineFactory.hasBeenInitialized()) {
                ImagePipelineFactory.getInstance().getImagePipeline().clearMemoryCaches();
            }
        } catch (Exception e) {
        }
    }
}
