package com.meeruu.sharegoods.rn.showground;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
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
import com.facebook.react.bridge.WritableNativeMap;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.sharegoods.event.ShowVideoEvent;
import com.meeruu.sharegoods.rn.showground.Activity.VideoRecordActivity;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoAuthBean;
import com.meeruu.sharegoods.utils.HttpUrlUtils;
import com.reactnative.ivpusic.imagepicker.picture.lib.PictureSelector;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureConfig;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureMimeType;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMedia;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

public class ShowModule extends ReactContextBaseJavaModule implements LifecycleEventListener ,ActivityEventListener{
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
        reactContext.addActivityEventListener(this);
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
    public void selectVideo(Promise promise){
        videoPromise = promise;
        PictureSelector.create(getCurrentActivity()).openGallery(PictureMimeType.ofVideo())//全部.PictureMimeType.ofAll()、图片.ofImage()、视频.ofVideo()、音频.ofAudio()
                .theme(com.reactnative.ivpusic.imagepicker.R.style.picture_default_style)//主题样式(不设置为默认样式) 也可参考demo values/styles下 例如：R.style.picture.white.style
                .maxSelectNum(1)// 最大图片选择数量 int
                //.minSelectNum()// 最小选择数量 int
                .imageSpanCount(4)// 每行显示个数 int
                .selectionMode(PictureConfig.MULTIPLE)// 多选 or 单选 PictureConfig.MULTIPLE or PictureConfig.SINGLE
                .previewImage(true)// 是否可预览图片 true or false
                .previewVideo(true)// 是否可预览视频 true or false
                .enablePreviewAudio(true) // 是否可播放音频 true or false
                .isCamera(false)// 是否显示拍照按钮 true or false
                .imageFormat(PictureMimeType.PNG)// 拍照保存图片格式后缀,默认jpeg
                .isZoomAnim(true)// 图片列表点击 缩放效果 默认true
                .sizeMultiplier(0.5f)// glide 加载图片大小 0~1之间 如设置 .glideOverride()无效
                // .setOutputCameraPath("/CustomPath")// 自定义拍照保存路径,可不填
                .enableCrop(true)// 是否裁剪 true or false
                .compress(true)// 是否压缩 true or false
                .glideOverride(160, 160)// int glide 加载宽高，越小图片列表越流畅，但会影响列表图片浏览的清晰度
                .withAspectRatio(1, 1)// int 裁剪比例 如16:9 3:2 3:4 1:1 可自定义
                .hideBottomControls(true)// 是否显示uCrop工具栏，默认不显示 true or false
                .isGif(false)// 是否显示gif图片 true or false
                //.compressSavePath(getPath())//压缩图片保存地址
                .freeStyleCropEnabled(true)// 裁剪框是否可拖拽 true or false
                .circleDimmedLayer(false)// 是否圆形裁剪 true or false
                .showCropFrame(true)// 是否显示裁剪矩形边框 圆形裁剪时建议设为false   true or false
                .showCropGrid(true)// 是否显示裁剪矩形网格 圆形裁剪时建议设为false    true or false
                .openClickSound(false)// 是否开启点击声音 true or false
                // .selectionMedia()// 是否传入已选图片 List<LocalMedia> list
                .previewEggs(true)// 预览图片时 是否增强左右滑动图片体验(图片滑动一半即可看到上一张是否选中) true or false
                // .cropCompressQuality()// 裁剪压缩质量 默认90 int
                .minimumCompressSize(100)// 小于100kb的图片不压缩
                .synOrAsy(true)//同步true或异步false 压缩 默认同步
                //.cropWH()// 裁剪宽高比，设置如果大于图片本身宽高则无效 int
                // .rotateEnabled() // 裁剪是否可旋转图片 true or false
                .scaleEnabled(true)// 裁剪是否可放大缩小图片 true or false
                // .videoQuality()// 视频录制质量 0 or 1 int
                .videoMaxSecond(30)// 显示多少秒以内的视频or音频也可适用 int
                .videoMinSecond(1)// 显示多少秒以内的视频or音频也可适用 int
                //.recordVideoSecond()//视频秒数录制 默认60s int
                .isDragFrame(false)// 是否可拖动裁剪框(固定)
                .forResult(PictureConfig.CHOOSE_REQUEST);//结果回调onActivityResult code
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

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        List<LocalMedia> list = PictureSelector.obtainMultipleResult(data);
        LocalMedia localMedia = list.get(0);
        WritableMap map = new WritableNativeMap();
        map.putString("path", "file://" + localMedia.getPath());
        map.putInt("width", localMedia.getWidth());
        map.putInt("height", localMedia.getHeight());
        map.putString("type",localMedia.getPictureType());
        map.putDouble("videoTime",localMedia.getDuration());

        if(videoPromise != null){
            videoPromise.resolve(map);
        }


    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
