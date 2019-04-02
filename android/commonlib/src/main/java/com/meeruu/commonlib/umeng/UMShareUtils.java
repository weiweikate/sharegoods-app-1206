package com.meeruu.commonlib.umeng;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.meeruu.commonlib.R;
import com.meeruu.commonlib.utils.ToastUtils;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMMin;
import com.umeng.socialize.media.UMWeb;

import java.io.File;
import java.lang.ref.WeakReference;
import java.net.URI;
import java.util.Map;


/**
 * Created by louis on 17/4/5.
 */

public class UMShareUtils {

    public static void showShare(Activity mContext, Map params, Callback success, Callback fail) {
        //         api参考地址：https://developer.umeng.com/docs/66632/detail/66639
        //         jsonData 参数
        //
        //        0图片分享
        //        shareImage:分享的大图(本地URL)图片分享使用
        //
        //        1 图文链接分享
        //        title:分享标题(当为图文分享时候使用)
        //        dec:内容(当为图文分享时候使用)
        //        linkUrl:(图文分享下的链接)
        //                thumImage:(分享图标小图 图文分享使用)
        //        支持 1.本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）
        //                2分享小程序
        //                title
        //                dec
        //                thumImage
        //                linkUrl"兼容微信低版本网页地址";
        //        userName //"小程序username，如 gh_3ac2059ac66f";
        //                miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";
        ShareListener umShareListener = new ShareListener(mContext, success, fail);
        int shareType = (int) params.get("shareType");
        int platformType = (int) params.get("platformType");
        SHARE_MEDIA platform = null;
        switch (platformType) {
            case 0:
                platform = SHARE_MEDIA.WEIXIN;
                break;
            case 1:
                platform = SHARE_MEDIA.WEIXIN_CIRCLE;
                break;
            case 2:
                platform = SHARE_MEDIA.QQ;
                break;
            case 3:
                platform = SHARE_MEDIA.QZONE;
                break;
            case 4:
                platform = SHARE_MEDIA.SINA;
                break;
            default:
                if (fail != null) {
                    fail.invoke("获取分享平台失败！");
                }
                break;
        }

        //分享类型为小程序，且不为微信会话
        if (platformType != 0 && shareType == 2) {
            shareType = 1;
        }

        switch (shareType) {
            case 0:
                UMImage image = fixThumImage(mContext, params.get("shareImage") + "");

                new ShareAction(mContext).setPlatform(platform)//传入平台
                        .withMedia(image).setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 1:

                if (params.containsKey("hdImageURL")) {
                    image = fixThumImage(mContext, params.get("hdImageURL") + "");
                } else {
                    image = fixThumImage(mContext, params.get("thumImage") + "");
                }

                UMWeb web = new UMWeb(params.get("linkUrl") + "");
                if (params.containsKey("title")) {
                    web.setTitle(params.get("title") + "");//标题
                }
                web.setThumb(image);  //缩略图
                String dec = null;
                if (params.containsKey("dec")) {
                    dec = params.get("dec") + "";
                    web.setDescription(dec);//描述
                }
                new ShareAction(mContext).setPlatform(platform)//传入平台
                        .withMedia(web).withText(dec)//分享内容
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 2:
                UMMin umMin = new UMMin(params.get("linkUrl") + "");
                if (params.containsKey("hdImageURL")) {
                    image = fixThumImage(mContext, params.get("hdImageURL") + "");
                } else {
                    image = fixThumImage(mContext, params.get("thumImage") + "");
                }
                umMin.setThumb(image);
                if (params.containsKey("title")) {
                    umMin.setTitle(params.get("title") + "");
                }

                if (params.containsKey("dec")) {
                    umMin.setDescription(params.get("dec") + "");
                }
                if (params.containsKey("miniProgramPath")) {
                    umMin.setPath(params.get("miniProgramPath") + "");
                }
                if (params.containsKey("userName")) {
                    umMin.setUserName(params.get("userName") + "");
                }
                new ShareAction(mContext).withMedia(umMin).setPlatform(platform).setCallback(umShareListener).share();

        }
    }

    private static class ShareListener implements UMShareListener {
        Callback success;
        Callback fail;
        WeakReference<Context> contextWeakReference;

        public ShareListener(Context context, Callback success, Callback fail) {
            this.success = success;
            this.fail = fail;
            this.contextWeakReference = new WeakReference<>(context);
        }

        @Override
        public void onStart(SHARE_MEDIA share_media) {

        }

        @Override
        public void onResult(SHARE_MEDIA share_media) {
            if (success != null) {
                success.invoke();
            }
        }

        @Override
        public void onError(SHARE_MEDIA share_media, Throwable throwable) {
            ToastUtils.showToast("分享失败");
            if (fail != null) {
                fail.invoke("失败" + throwable.getMessage());
            }
        }

        @Override
        public void onCancel(SHARE_MEDIA share_media) {
            ToastUtils.showToast("分享取消");
            if (fail != null) {
                fail.invoke("取消了");
            }
        }
    }

    //本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）
    private static UMImage fixThumImage(Activity mContext, String url) {
        if (TextUtils.isEmpty(url)) {
            return new UMImage(mContext, R.mipmap.ic_launcher);
        }
        if (url.startsWith("http")) {
            return new UMImage(mContext, url);//网络图片
        } else if (url.startsWith("file") || url.startsWith("content")) {
            try {
                Uri uri = Uri.parse(url);
                File file = new File(new URI(uri.toString()));
                return new UMImage(mContext, file);
            } catch (Exception e) {

            }

            return new UMImage(mContext, R.mipmap.ic_launcher);


        } else {
            if (url.endsWith(".png") || url.endsWith(".jpg")) {
                url = url.substring(0, url.length() - 4);
            }
            int res = getRes(mContext, url);
            if (res == 0) {
                return new UMImage(mContext, R.mipmap.ic_launcher);
            } else {
                return new UMImage(mContext, getRes(mContext, url));//资源文件
            }
        }
    }

    public static int getRes(Activity mContext, String name) {
        ApplicationInfo appInfo = mContext.getApplicationInfo();
        int resID = mContext.getResources().getIdentifier(name, "drawable", appInfo.packageName);
        return resID;
    }
}
