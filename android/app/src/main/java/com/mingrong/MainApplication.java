package com.mingrong;

import android.app.Application;
import android.content.Context;
import android.graphics.Bitmap;
import android.support.annotation.Nullable;

import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.mingrong.BuildConfig;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnicornImageLoader;
import com.qiyukf.unicorn.api.YSFOptions;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static Context context;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RNPackage(),
            new MainReactPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new AutoHeightWebViewPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    context=getApplicationContext();
    Unicorn.init(this, "db5a6f7eb0a3a8542e8ea36957e9122a", options(), new UnicornImageLoader() {
      @Nullable
      @Override
      public Bitmap loadImageSync(String uri, int width, int height) {
        return null;
      }

      @Override
      public void loadImage(String uri, int width, int height, ImageLoaderListener listener) {

      }
    });
    UMConfigure.init(this,"5b7663a3f29d9830cb0000d8"
            ,"umeng",UMConfigure.DEVICE_TYPE_PHONE,"");//58edcfeb310c93091c000be2 5965ee00734be40b580001a0
    PlatformConfig.setWeixin("wxf5ab8d9143aa38e9", "3252881956221212770d73a7995d057d");
  }
  public static Context getContext(){
    return context;
  }
  // 如果返回值为null，则全部使用默认参数。
  private YSFOptions options() {
    YSFOptions options = new YSFOptions();
    options.statusBarNotificationConfig = new StatusBarNotificationConfig();
    UICustomization uiCustomization=new UICustomization();
    uiCustomization.avatarShape=0;
    uiCustomization.titleBackgroundColor=0xFF12CDB0;
    uiCustomization.titleBarStyle=1;
    uiCustomization.topTipBarBackgroundColor=0xFF666666;
    uiCustomization.titleCenter=true;
    uiCustomization.topTipBarTextColor=0xFFFFFFFF;
    options.categoryDialogStyle=0;
    options.uiCustomization=uiCustomization;
    return options;
  }
}
