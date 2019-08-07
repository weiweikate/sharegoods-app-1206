package com.meeruu.sharegoods.rn.showground;

import android.app.Activity;
import android.content.Intent;

import com.alibaba.fastjson.JSON;
import com.alibaba.sdk.android.vod.upload.VODUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODUploadClient;
import com.alibaba.sdk.android.vod.upload.VODUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.model.UploadFileInfo;
import com.alibaba.sdk.android.vod.upload.model.VodInfo;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.event.ShowVideoEvent;
import com.meeruu.sharegoods.rn.showground.activity.VideoRecordActivity;
import com.meeruu.sharegoods.rn.showground.bean.ImageBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoAuthBean;
import com.meeruu.sharegoods.rn.showground.utils.VideoCoverUtils;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.reactnative.ivpusic.imagepicker.picture.lib.PictureSelector;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMedia;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

public class ShowModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {
    public static final String MODULE_NAME = "ShowModule";
    private ReactApplicationContext mContext;
    private VODUploadCallback callback;
    private Promise videoPromise;
    VODUploadClient uploader;
    private String uploadAuth, uploadAddress;
    public static final int result_code = 1234;


    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public ShowModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        reactContext.addLifecycleEventListener(this);
        reactContext.addActivityEventListener(this);
        initUploader();
    }

    private void initUploader() {
        uploader = new VODUploadClientImpl(mContext.getApplicationContext());
        callback = new VODUploadCallback() {
            @Override
            public void onUploadSucceed(UploadFileInfo info) {
                super.onUploadSucceed(info);
            }

            @Override
            public void onUploadFailed(UploadFileInfo info, String code, String message) {
                super.onUploadFailed(info, code, message);
            }

            @Override
            public void onUploadProgress(UploadFileInfo info, long uploadedSize, long totalSize) {
                super.onUploadProgress(info, uploadedSize, totalSize);
            }

            @Override
            public void onUploadTokenExpired() {
                super.onUploadTokenExpired();
            }

            @Override
            public void onUploadRetry(String code, String message) {
                super.onUploadRetry(code, message);
            }

            @Override
            public void onUploadRetryResume() {
                super.onUploadRetryResume();
            }

            @Override
            public void onUploadStarted(UploadFileInfo uploadFileInfo) {
                super.onUploadStarted(uploadFileInfo);
                uploader.setUploadAuthAndAddress(uploadFileInfo, uploadAuth, uploadAddress);
            }
        };
        uploader.init(callback);
        uploader.setPartSize(1024 * 1024);
    }

    @ReactMethod
    public void recordVideo(Promise promise) {
        Intent intent = new Intent(getCurrentActivity(), VideoRecordActivity.class);
        getCurrentActivity().startActivity(intent);
        videoPromise = promise;
    }

    @ReactMethod
    public void uploadVideo(final String title, final String path, final Promise promise) {
        File file = new File(path);
        if (!file.exists()) {
            promise.reject("文件不存在");
            return;
        }
        final String fileName = file.getName();
        ShowVideoAuthRequest showVideoAuthRequest = new ShowVideoAuthRequest();
        HashMap hashMap = new HashMap();
        hashMap.put("fileName", fileName);
        hashMap.put("title", title);
        showVideoAuthRequest.setParams(hashMap);
        RequestManager.getInstance().doPost(showVideoAuthRequest, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                promise.reject(msg);
            }

            @Override
            public void onSuccess(String result) {
                VideoAuthBean videoAuthBean = JSON.parseObject(result, VideoAuthBean.class);
                uploadAddress = videoAuthBean.getUploadAddress();
                uploadAuth = videoAuthBean.getUploadAuth();
                startUpload(title, fileName, path);
                WritableMap writableMap = Arguments.createMap();
                writableMap.putString("showNo", videoAuthBean.getShowNo());
                writableMap.putString("videoId", videoAuthBean.getVideoId());
                promise.resolve(writableMap);
            }
        });
    }

    private void startUpload(String title, String fileName, String path) {
        VodInfo vodInfo = new VodInfo();
        vodInfo.setFileName(fileName);
        vodInfo.setTitle(title);
        uploader.stop();
        uploader.clearFiles();
        uploader.addFile(path, vodInfo);
        uploader.start();
    }

    @Override
    public void onHostResume() {
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onVideoComplete(ShowVideoEvent event) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("videoPath", event.getPath());
        writableMap.putString("videoCover", event.getCover());
        writableMap.putInt("width", event.getWidth());
        writableMap.putInt("height", event.getHeight());
        videoPromise.resolve(writableMap);
    }


    private static class ShowVideoAuthRequest implements BaseRequestConfig {

        private HashMap map;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.URL_VIDEO_AUTH);
        }

        public void setParams(HashMap params) {
            map = params;
        }

        @Override
        public Map getParams() {
            return map;
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (resultCode == result_code) {
            List<LocalMedia> list = PictureSelector.obtainMultipleResult(data);
            LocalMedia localMedia = list.get(0);
            WritableMap map = new WritableNativeMap();
            map.putString("videoPath", localMedia.getPath());
            ImageBean cover = VideoCoverUtils.getVideoThumb(mContext, localMedia.getPath());
            map.putString("videoCover", cover.getPath());
            map.putInt("width", cover.getWidth());
            map.putInt("height", cover.getHeight());
            if (videoPromise != null) {
                videoPromise.resolve(map);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
