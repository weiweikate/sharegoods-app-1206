package com.meeruu.sharegoods.loginAndSharing;

import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.meeruu.sharegoods.bean.WXLoginBean;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import java.util.Map;

public class LoginAndSharingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "LoginAndShareModule";
    private UMShareListener umShareListener = new UMShareListener() {
        /**
         * @descrption 分享开始的回调
         * @param platform 平台类型
         */
        @Override
        public void onStart(SHARE_MEDIA platform) {
        }

        /**
         * @descrption 分享成功的回调
         * @param platform 平台类型
         */
        @Override
        public void onResult(SHARE_MEDIA platform) {
            Toast.makeText(getCurrentActivity(), "成功了", Toast.LENGTH_LONG).show();
        }

        /**
         * @descrption 分享失败的回调
         * @param platform 平台类型
         * @param t 错误原因
         */
        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
            Toast.makeText(getCurrentActivity(), "失败" + t.getMessage(), Toast.LENGTH_LONG).show();
        }

        /**
         * @descrption 分享取消的回调
         * @param platform 平台类型
         */
        @Override
        public void onCancel(SHARE_MEDIA platform) {
            Toast.makeText(getCurrentActivity(), "取消了", Toast.LENGTH_LONG).show();
        }
    };

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public LoginAndSharingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void share(ReadableMap params) {
        /**
         * api参考地址：https://developer.umeng.com/docs/66632/detail/66639
         jsonData 参数

         shareType : 0 图文链接分享  1图片分享
         platformType: 0 朋友圈 1 会话
         title:分享标题(当为图文分享时候使用)
         dec:内容(当为图文分享时候使用)
         linkUrl:(图文分享下的链接)
         thumImage:(分享图标小图(http链接)图文分享使用)
         shareImage:分享的大图(本地URL)图片分享使用
         **/
        int shareType = params.getInt("shareType");
        SHARE_MEDIA platform = params.getInt("platformType") == 1 ? SHARE_MEDIA.WEIXIN : SHARE_MEDIA.WEIXIN_CIRCLE;
        switch (shareType) {
            case 0:
                UMImage image = new UMImage(getCurrentActivity(), params.getString("thumImage"));//网络图片
                UMWeb web = new UMWeb("http://www.baidu.com");
                web.setTitle(params.getString("title"));//标题
                web.setThumb(image);  //缩略图
                web.setDescription("my description");//描述
                new ShareAction(getCurrentActivity())
                        .setPlatform(platform)//传入平台
                        .withMedia(web)
                        .withText(params.getString("dec"))//分享内容
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 1:
                image = new UMImage(getCurrentActivity(), params.getString("thumImage"));//网络图片
                new ShareAction(getCurrentActivity())
                        .setPlatform(platform)//传入平台
                        .withMedia(image)
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
        }
    }

    @ReactMethod
    public void loginWX(final Callback callback) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).getPlatformInfo(getCurrentActivity(), SHARE_MEDIA.WEIXIN, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                Log.e(TAG, "onStart授权开始: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //sdk是6.4.5的,但是获取值的时候用的是6.2以前的(access_token)才能获取到值,未知原因
                String uid = map.get("uid");
                String openid = map.get("openid");//微博没有
                String unionid = map.get("unionid");//微博没有
                String access_token = map.get("access_token");
                String refresh_token = map.get("refresh_token");//微信,qq,微博都没有获取到
                String expires_in = map.get("expires_in");
                String name = map.get("name");//名称
                String gender = map.get("gender");//性别
                String iconurl = map.get("iconurl");//头像地址

                Log.e(TAG, "onStart授权完成: " + openid);
                Log.e(TAG, "onStart授权完成: " + unionid);
                Log.e(TAG, "onStart授权完成: " + access_token);
                Log.e(TAG, "onStart授权完成: " + refresh_token);
                Log.e(TAG, "onStart授权完成: " + expires_in);
                Log.e(TAG, "onStart授权完成: " + uid);
                Log.e(TAG, "onStart授权完成: " + name);
                Log.e(TAG, "onStart授权完成: " + gender);
                Log.e(TAG, "onStart授权完成: " + iconurl);
                umengDeleteOauth(SHARE_MEDIA.WEIXIN);
                WXLoginBean bean = new WXLoginBean();
                bean.setDevice(android.os.Build.DEVICE);
                bean.setOpenid(openid);
                bean.setSystemVersion(android.os.Build.VERSION.RELEASE);
                bean.setNickName(name);
                Gson gson = new Gson();
                String s = gson.toJson(bean);
                callback.invoke(s);
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Toast.makeText(getCurrentActivity(), "授权失败", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权失败");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Toast.makeText(getCurrentActivity(), "授权取消", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权取消");
            }
        });
    }

    private void umengDeleteOauth(SHARE_MEDIA share_media_type) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).deleteOauth(getCurrentActivity(), share_media_type, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                //开始授权
                Log.e(TAG, "onStart: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //取消授权成功 i=1
                Log.e(TAG, "onComplete: ");
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                //授权出错
                Log.e(TAG, "onError: ");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                //取消授权
                Log.e(TAG, "onCancel: ");
            }
        });
    }

    @ReactMethod
    public void shareScreen(final Callback callback) {

    }
}
