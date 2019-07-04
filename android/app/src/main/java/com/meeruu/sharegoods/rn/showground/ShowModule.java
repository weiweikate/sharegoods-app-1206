package com.meeruu.sharegoods.rn.showground;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;

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
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.event.ShowVideoEvent;
import com.meeruu.sharegoods.rn.showground.Activity.VideoRecordActivity;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoAuthBean;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;

public class ShowModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String MODULE_NAME = "ShowModule";
    private ReactApplicationContext mContext;
    private Promise videoPromise;
    private Promise uploadPromise;
    VODUploadClient uploader;



    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public ShowModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        reactContext.addLifecycleEventListener(this);
        initUploader();
    }

    private void initUploader(){
        uploader = new VODUploadClientImpl(mContext.getApplicationContext());
        VODUploadCallback callback = new VODUploadCallback() {
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
            }
        };
        uploader.init(callback);
    }

    @ReactMethod
    public void recordVideo(Promise promise){
        Intent intent = new Intent(getCurrentActivity(), VideoRecordActivity.class);
        getCurrentActivity().startActivity(intent);
        videoPromise = promise;
    }

    @ReactMethod
    public void uploadVideo(final String title, final String path, final Promise promise){
//        UploadFileInfo uploadFileInfo = new UploadFileInfo();
//        uploader.setUploadAuthAndAddress(uploadFileInfo,"","");
        File file = new File(path);
        if(!file.exists()){
            promise.reject("文件不存在");
            return;
        }
        final String fileName = file.getName();

        uploadPromise = promise;
        ShowVideoAuthRequest showVideoAuthRequest = new ShowVideoAuthRequest();
        HashMap hashMap = new HashMap();
        hashMap.put("fileName",fileName);
        hashMap.put("title",title);
        showVideoAuthRequest.setParams(hashMap);
        RequestManager.getInstance().doPost(showVideoAuthRequest, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
                promise.reject(msg);
            }

            @Override
            public void onSuccess(String result) {
                VideoAuthBean videoAuthBean = JSON.parseObject(result, VideoAuthBean.class);
                startUpload(title,fileName,path,videoAuthBean);
            }
        });
    }

    private void startUpload(String title, String fileName,String path,VideoAuthBean videoAuthBean){

        UploadFileInfo uploadFileInfo = new UploadFileInfo();
        uploadFileInfo.setFilePath(path);
        VodInfo vodInfo = new VodInfo();
        vodInfo.setFileName(fileName);
        vodInfo.setTitle(title);
        uploadFileInfo.setVodInfo(vodInfo);
        uploader.setUploadAuthAndAddress(uploadFileInfo, videoAuthBean.getUploadAuth(), videoAuthBean.getUploadAddress());
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
        writableMap.putString("videoPath",event.getPath());
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


}
