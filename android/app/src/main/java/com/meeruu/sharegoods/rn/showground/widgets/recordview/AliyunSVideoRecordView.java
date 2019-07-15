package com.meeruu.sharegoods.rn.showground.widgets.recordview;

import android.Manifest;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.hardware.Camera;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.SurfaceView;
import android.view.View;
import android.widget.FrameLayout;

import com.aliyun.common.global.AliyunTag;
import com.aliyun.common.utils.CommonUtil;
import com.aliyun.recorder.AliyunRecorderCreator;
import com.aliyun.recorder.supply.AliyunIClipManager;
import com.aliyun.recorder.supply.AliyunIRecorder;
import com.aliyun.recorder.supply.EncoderInfoCallback;
import com.aliyun.recorder.supply.RecordCallback;
import com.aliyun.svideo.sdk.external.struct.common.VideoQuality;
import com.aliyun.svideo.sdk.external.struct.encoder.EncoderInfo;
import com.aliyun.svideo.sdk.external.struct.encoder.VideoCodecs;
import com.aliyun.svideo.sdk.external.struct.recorder.CameraParam;
import com.aliyun.svideo.sdk.external.struct.recorder.CameraType;
import com.aliyun.svideo.sdk.external.struct.recorder.FlashType;
import com.aliyun.svideo.sdk.external.struct.recorder.MediaInfo;
import com.aliyun.svideo.sdk.external.struct.snap.AliyunSnapVideoParam;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.utils.OrientationDetector;
import com.meeruu.sharegoods.rn.showground.utils.PermissionUtils;
import com.meeruu.sharegoods.rn.showground.utils.ThreadUtils;
import com.meeruu.sharegoods.rn.showground.utils.TimeFormatterUtils;
import com.meeruu.sharegoods.rn.showground.widgets.recordview.control.ControlView;
import com.meeruu.sharegoods.rn.showground.widgets.recordview.control.ControlViewListener;
import com.meeruu.sharegoods.rn.showground.widgets.recordview.control.RecordState;
import com.qu.preview.callback.OnFrameCallBack;
import com.qu.preview.callback.OnTextureIdCallBack;
import com.reactnative.ivpusic.imagepicker.picture.lib.PictureSelector;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureConfig;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureMimeType;

import java.io.File;
import java.lang.ref.WeakReference;
import java.util.List;

import static com.meeruu.sharegoods.rn.showground.ShowModule.result_code;

public class AliyunSVideoRecordView extends FrameLayout implements ScaleGestureDetector.OnScaleGestureListener {
    private static final String TAG = AliyunSVideoRecordView.class.getSimpleName();
    private SurfaceView mSurfaceView;
    private AliyunIRecorder recorder;
    public ControlView mControlView;
    private AlivcCountDownView mCountDownView;
    private AliyunIClipManager clipManager;
    private OnBackClickListener mBackClickListener;
    private com.aliyun.svideo.sdk.external.struct.recorder.CameraType cameraType
            = com.aliyun.svideo.sdk.external.struct.recorder.CameraType.FRONT;
    //录制视频是否达到最大值
    private boolean isMaxDuration = false;
    private AsyncTask<Void, Void, Void> finishRecodingTask;
    private Activity mActivity;
    private boolean mIsBackground;
    private OnFinishListener mCompleteListener;
    private Runnable pendingCompseFinishRunnable;
    //编码方式
    private VideoCodecs mVideoCodec = VideoCodecs.H264_SOFT_FFMPEG;
    //关键帧间隔
    private int mGop = 5;
    //录制码率
    private int mBitrate = 25;
    //录制时长
    private int recordTime = 0;
    //文件存放位置
    private String videoPath;
    //视频比例
    private int mRatioMode = AliyunSnapVideoParam.RATIO_MODE_3_4;
    //最小录制时长
    private int minRecordTime = 2000;
    //最大录制时长
    private int maxRecordTime = 15 * 1000;
    private ProgressDialog progressBar;
    private OrientationDetector orientationDetector;
    //视频分辨率
    private int mResolutionMode = AliyunSnapVideoParam.RESOLUTION_540P;
    //视频质量
    private VideoQuality mVideoQuality = VideoQuality.HD;
    /**
     * 相机的原始NV21数据
     */
    private byte[] frameBytes;
    private byte[] mFuImgNV21Bytes;
    /**
     * 原始数据宽
     */
    private int frameWidth;
    /**
     * 原始数据高
     */
    private int frameHeight;
    /**
     * 用于防止sdk的oncomplete回调之前, 再次调用startRecord
     */
    private boolean tempIsComplete = true;
    private int rotation;
    private boolean isOpenFailed = false;
    private boolean activityStoped;

    private RecordTimelineView mRecordTimeView;

    /**
     * 视频是是否正正在已经调用stopRecord到onComplete回调过程中这段时间，这段时间不可再次调用stopRecord
     * true: 正在调用stop~onComplete, false反之
     */
    private boolean isStopToCompleteDuration;
    public static final int PERMISSION_REQUEST_CODE = 1000;
    //最小录制时长
    private static final int MIN_RECORD_TIME = 0;
    //最大录制时长
    private static final int MAX_RECORD_TIME = Integer.MAX_VALUE;
    private static int TEST_VIDEO_WIDTH = 540;
    private static int TEST_VIDEO_HEIGHT = 960;
    /**
     * 权限申请
     */
    String[] permission = {
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };


    /**
     * 返回按钮事件监听
     */
    public interface OnBackClickListener {
        void onClick();
    }


//    private FocusView mFocusView;

    public AliyunSVideoRecordView(Context context){
        super(context);
        initVideoView();
    }

    public AliyunSVideoRecordView (Context context, AttributeSet attributeSet){
        super(context,attributeSet);
        initVideoView();
    }

    public AliyunSVideoRecordView (Context context,AttributeSet attributeSet,int defStyleAttr){
        super(context,attributeSet,defStyleAttr);
        initVideoView();
    }

    private void initVideoView(){
        initSurfaceView();
        initControlView();
        initCountDownView();
        initRecorder();
        initRecordTimeView();

    }

    private void initSurfaceView(){
        mSurfaceView = new SurfaceView(getContext());
        final ScaleGestureDetector scaleGestureDetector = new ScaleGestureDetector(getContext(),this);
        final GestureDetector gestureDetector = new GestureDetector(getContext(),new GestureDetector.SimpleOnGestureListener(){
            @Override
            public boolean onSingleTapUp(MotionEvent e) {
                float x = e.getX() / mSurfaceView.getWidth();
                float y = e.getY() / mSurfaceView.getHeight();
                recorder.setFocus(x, y);

//                mFocusView.showView();
//                mFocusView.setLocation(e.getX(), e.getY());
                return true;
            }
        });
        mSurfaceView.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getPointerCount() >= 2) {
                    scaleGestureDetector.onTouchEvent(event);
                } else if (event.getPointerCount() == 1) {
                    gestureDetector.onTouchEvent(event);
                }
                return true;
            }
        });
        addSubView(mSurfaceView);
    }

    /**
     * 初始化倒计时view
     */
    private void initCountDownView() {
        if (mCountDownView == null) {
            mCountDownView = new AlivcCountDownView(getContext());
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT);
            params.gravity = Gravity.CENTER;
            addView(mCountDownView, params);
        }
    }


    private void initRecordTimeView() {
        mRecordTimeView = new RecordTimelineView(getContext());
        LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, DensityUtils.dip2px( 6));

        params.setMargins(DensityUtils.dip2px( 12),
                DensityUtils.dip2px( 6),
                DensityUtils.dip2px(12),
                0);
        mRecordTimeView.setColor(R.color.aliyun_color_record_duraton, R.color.aliyun_music_colorPrimary, R.color.aliyun_white,
                R.color.alivc_bg_record_time);
        mRecordTimeView.setMaxDuration(clipManager.getMaxDuration());
        mRecordTimeView.setMinDuration(clipManager.getMinDuration());
        addView(mRecordTimeView, params);

    }


    /**
     * addSubView 添加子view到布局中
     *
     * @param view 子view
     */
    private void addSubView(View view) {
        LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        addView(view, params);//添加到布局中
    }

    /**
     * 初始化控制栏view
     */
    private void initControlView() {
        mControlView = new ControlView(getContext());
        mControlView.setControlViewListener(new ControlViewListener() {
            @Override
            public void onBackClick() {
                if (mBackClickListener != null) {
                    mBackClickListener.onClick();
                }
            }

            @Override
            public void onNextClick() {
                // 完成录制
                if (!isStopToCompleteDuration) {
                    finishRecording();
                }
            }

            @Override
            public void onReadyRecordClick(boolean isCancel) {
                if (isStopToCompleteDuration) {
                    /*TODO  这里是因为如果 SDK 还没有回调onComplete,倒计时录制，会crash */
                    return;
                }
                if (isCancel) {
                    cancelReadyRecord();
                } else {
                    showReadyRecordView();
                }

            }

            @Override
            public void onCameraSwitch() {
                if (recorder != null) {
                    int cameraId = recorder.switchCamera();
                    for (com.aliyun.svideo.sdk.external.struct.recorder.CameraType type : com.aliyun.svideo.sdk
                            .external.struct.recorder.CameraType
                            .values()) {
                        if (type.getType() == cameraId) {
                            cameraType = type;
                        }
                    }
                    if (mControlView != null) {
                        for (CameraType type : CameraType.values()) {
                            if (type.getType() == cameraId) {
                                mControlView.setCameraType(type);
                            }
                        }

                        if (mControlView.getFlashType() == FlashType.ON
                                && mControlView.getCameraType() == CameraType.BACK) {
                            recorder.setLight(com.aliyun.svideo.sdk.external.struct.recorder.FlashType.TORCH);
                        }
                    }
                }
            }



            @Override
            public void onStartRecordClick() {
                if (!tempIsComplete) {
                    // 连续点击开始录制，停止录制，要保证在onComplete回调回来再允许点击开始录制,
                    // 否则SDK会出现ANR问题, v3.7.8修复会影响较大, 工具包暂时处理
                    return;
                }
                startRecord();
            }

            @Override
            public void onStopRecordClick() {
                if (!tempIsComplete) {
                    // 连续点击开始录制，停止录制，要保证在onComplete回调回来再允许点击开始录制,
                    // 否则SDK会出现ANR问题, v3.7.8修复会影响较大, 工具包暂时处理
                    return;
                }
                stopRecord();
            }

            @Override
            public void onDeleteClick() {
                if (isStopToCompleteDuration) {
                    // 这里是因为如果 SDK 还没有回调onComplete,点击回删会出现删除的不是最后一段的问题
                    return;
                }
                mRecordTimeView.deleteLast();
                clipManager.deletePart();
                isMaxDuration = false;
                if (mControlView != null) {
                    if (clipManager.getDuration() < clipManager.getMinDuration()) {
                        mControlView.setCompleteEnable(false);
                    }

                    mControlView.updataCutDownView(true);
                }

                if (clipManager.getDuration() == 0) {
                    //音乐可以选择
//                    recorder.restartMv();
                    mControlView.setHasRecordPiece(false);
//                    isAllowChangeMv = true;
                }
                mControlView.setRecordTime(TimeFormatterUtils.formatTime(clipManager.getDuration()));
            }

            @Override
            public void onLightSwitch(FlashType flashType) {
                if (recorder != null) {
                    for (com.aliyun.svideo.sdk.external.struct.recorder.FlashType type : com.aliyun.svideo.sdk
                            .external.struct.recorder.FlashType
                            .values()) {
                        if (flashType.toString().equals(type.toString())) {
                            recorder.setLight(type);
                        }
                    }

                }
                if (mControlView.getFlashType() == FlashType.ON
                        && mControlView.getCameraType() == CameraType.BACK) {
                    recorder.setLight(com.aliyun.svideo.sdk.external.struct.recorder.FlashType.TORCH);
                }
            }

            @Override
            public void selectVideo() {
                PictureSelector.create(mActivity).openGallery(PictureMimeType.ofVideo())//全部.PictureMimeType.ofAll()、图片.ofImage()、视频.ofVideo()、音频.ofAudio()
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
                        .forResult(result_code);//结果回调onActivityResult code
            }
        });
        addSubView(mControlView);
    }

    @Override
    public boolean onScale(ScaleGestureDetector detector) {
        return false;
    }

    @Override
    public boolean onScaleBegin(ScaleGestureDetector detector) {
        return false;
    }

    @Override
    public void onScaleEnd(ScaleGestureDetector detector) {

    }

    /**
     * 取消拍摄倒计时
     */
    private void cancelReadyRecord() {
        if (mCountDownView != null) {
            mCountDownView.cancle();
        }
    }

    /**
     * 显示准备拍摄倒计时view
     */
    private void showReadyRecordView() {
        if (mCountDownView != null) {
            mCountDownView.start();
        }
    }


    /**
     * 结束录制，并且将录制片段视频拼接成一个视频 跳转editorActivity在合成完成的回调的方法中
     */
    private void finishRecording() {
        //弹窗提示
        if (progressBar == null) {
            progressBar = new ProgressDialog(getContext());
            progressBar.setMessage("视频合成中....");
            progressBar.setCanceledOnTouchOutside(false);
            progressBar.setCancelable(false);
            progressBar.setProgressStyle(android.app.ProgressDialog.STYLE_SPINNER);
        }
        progressBar.show();
        mControlView.setCompleteEnable(false);
        finishRecodingTask = new FinishRecodingTask(this).executeOnExecutor(
                AsyncTask.THREAD_POOL_EXECUTOR);
    }

    /**
     * 开始录制
     */
    private void startRecord() {
        boolean checkResult = PermissionUtils.checkPermissionsGroup(getContext(), permission);
        if (!checkResult && mActivity != null) {
            PermissionUtils.requestPermissions(mActivity, permission,
                    PERMISSION_REQUEST_CODE);
            return;
        }

        if (CommonUtil.SDFreeSize() < 50 * 1000 * 1000) {
            ToastUtils.showToast(getResources().getString(R.string.aliyun_no_free_memory));
            return;
        }
        if (isMaxDuration) {
            mControlView.setRecordState(RecordState.STOP);
            return;
        }

        if (recorder != null && !mIsBackground) {
            // 快速显示回删字样, 将音乐按钮置灰,假设此时已经有片段, 在录制失败时, 需要改回false
            mControlView.setHasRecordPiece(true);
            mControlView.setRecordState(RecordState.RECORDING);
            mControlView.setRecording(true);
            String outputBasePath = Environment.getExternalStorageDirectory() + File.separator + Environment.DIRECTORY_DCIM + File.separator + "Camera";
            videoPath = outputBasePath + File.separator + System.currentTimeMillis() + "-record.mp4";
            File file = new File(outputBasePath);
            if (!file.exists()) {
                file.mkdirs();
            }
            recorder.setOutputPath(videoPath);
            recorder.startRecording();

            Log.d(TAG, "startRecording    isStopToCompleteDuration:" + isStopToCompleteDuration);
        }

    }


    /**
     * 停止录制
     */
    private void stopRecord() {
        Log.d(TAG, "stopRecord    isStopToCompleteDuration:" + isStopToCompleteDuration);
        if (recorder != null && !isStopToCompleteDuration && mControlView.isRecording()) {//
            isStopToCompleteDuration = true;
            tempIsComplete = false;

            //此处添加判断，progressBar弹出，也即当视频片段合成的时候，不调用stopRecording,
            //否则在finishRecording的时候调用stopRecording，会导致finishRecording阻塞
            //暂时规避，等待sdk解决该问题，取消该判断
            if ((progressBar == null || !progressBar.isShowing())) {
                recorder.stopRecording();

            }

        }

    }



    /**
     * 录制结束的AsyncTask
     */
    public static class FinishRecodingTask extends AsyncTask<Void, Void, Void> {
        WeakReference<AliyunSVideoRecordView> weakReference;

        FinishRecodingTask(AliyunSVideoRecordView recordView) {
            weakReference = new WeakReference<>(recordView);
        }

        @Override
        protected Void doInBackground(Void... voids) {
            if (weakReference == null) {
                return null;
            }

            AliyunSVideoRecordView recordView = weakReference.get();
            if (recordView != null) {
                recordView.recorder.finishRecording();
                Log.e(TAG, "finishRecording");
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            if (weakReference == null) {
                return;
            }
            AliyunSVideoRecordView recordView = weakReference.get();
            if (recordView != null) {
                if (recordView.progressBar != null) {
                    recordView.progressBar.dismiss();
                }
            }
        }
    }
    public void setActivity(Activity mActivity) {
        this.mActivity = mActivity;
    }

    private void initRecorder() {
        recorder = AliyunRecorderCreator.getRecorderInstance(getContext());
        recorder.setDisplayView(mSurfaceView);
        clipManager = recorder.getClipManager();
        recorder.setFocusMode(CameraParam.FOCUS_MODE_CONTINUE);
        clipManager.setMaxDuration(MAX_RECORD_TIME);
        clipManager.setMinDuration(getMaxRecordTime());
        MediaInfo mediaInfo = new MediaInfo();
        mediaInfo.setVideoWidth(TEST_VIDEO_WIDTH);
        mediaInfo.setVideoHeight(TEST_VIDEO_HEIGHT);
        //mediaInfo.setHWAutoSize(true);//硬编时自适应宽高为16的倍数
        recorder.setMediaInfo(mediaInfo);
        cameraType = recorder.getCameraCount() == 1 ? com.aliyun.svideo.sdk.external.struct.recorder.CameraType.BACK
                : cameraType;
        recorder.setCamera(cameraType);
        recorder.setBeautyStatus(false);

        initOritationDetector();
        recorder.setOnFrameCallback(new OnFrameCallBack() {
            @Override
            public void onFrameBack(byte[] bytes, int width, int height, Camera.CameraInfo info) {
                //原始数据回调 NV21,这里获取原始数据主要是为了faceUnity高级美颜使用
                frameBytes = bytes;
                frameWidth = width;
                frameHeight = height;
            }

            @Override
            public Camera.Size onChoosePreviewSize(List<Camera.Size> supportedPreviewSizes,
                                                   Camera.Size preferredPreviewSizeForVideo) {

                return null;
            }

            @Override
            public void openFailed() {
                Log.e(AliyunTag.TAG, "openFailed----------");
                isOpenFailed = true;
            }
        });

        recorder.setRecordCallback(new RecordCallback() {
            @Override
            public void onComplete(final boolean validClip, final long clipDuration) {
                Log.e(TAG, "onComplete   duration : " + clipDuration +
                        ", clipManager.getDuration() = " + clipManager.getDuration());
                tempIsComplete = true;
                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG, "onComplete    isStopToCompleteDuration:" + isStopToCompleteDuration);

                        isStopToCompleteDuration = false;
                        handleStopCallback(validClip, clipDuration);
                        if (isMaxDuration && validClip) {
                            finishRecording();
                        }

                    }
                });

            }

            /**
             * 合成完毕的回调
             * @param outputPath
             */
            @Override
            public void onFinish(final String outputPath) {
                Log.e(TAG, "onFinish:" + outputPath);

                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mCompleteListener != null) {
                            final int duration = clipManager.getDuration();
                            //deleteAllPart();
                            // 选择音乐后, 在录制完合成过程中退后台
                            // 保持在后台情况下, sdk合成完毕后, 会仍然执行跳转代码, 此时会弹起跳转后的页面
                            if (activityStoped) {
                                pendingCompseFinishRunnable =  new Runnable() {
                                    @Override
                                    public void run() {
                                        if (!isStopToCompleteDuration) {
                                            mCompleteListener.onComplete(outputPath, duration);
                                        }
                                    }
                                };
                            } else {
                                if (!isStopToCompleteDuration) {
                                    mCompleteListener.onComplete(outputPath, duration);
                                }
                            }
                        }
                    }
                });

            }

            @Override
            public void onProgress(final long duration) {
                final int currentDuration = clipManager.getDuration();
                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
//                        isAllowChangeMv = false;
                        recordTime = 0;
                        //设置录制进度
                        if (mRecordTimeView != null) {
                            mRecordTimeView.setDuration((int)duration);
                        }

                        recordTime = (int) (currentDuration + duration);
                        if (recordTime <= clipManager.getMaxDuration() && recordTime >= clipManager.getMinDuration()) {
                            // 2018/7/11 让下一步按钮可点击
                            mControlView.setCompleteEnable(true);
                        } else {
                            mControlView.setCompleteEnable(false);
                        }
                        if (mControlView != null && mControlView.getRecordState().equals(RecordState.STOP)) {
                            return;
                        }
                        if (mControlView != null) {
                            mControlView.setRecordTime(TimeFormatterUtils.formatTime(recordTime));
                        }

                    }
                });

            }

            @Override
            public void onMaxDuration() {
                Log.e(TAG, "onMaxDuration:");
                isMaxDuration = true;
                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mControlView != null) {
                            mControlView.setCompleteEnable(false);
                            mControlView.setRecordState(RecordState.STOP);
                            mControlView.updataCutDownView(false);
                        }
                    }
                });

            }

            @Override
            public void onError(int errorCode) {
                Log.e(TAG, "onError:" + errorCode);
                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        recordTime = 0;
                        tempIsComplete = true;
                        handleStopCallback(false, 0);
                    }
                });
            }

            @Override
            public void onInitReady() {
                Log.e(TAG, "onInitReady");
                ThreadUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
//                        restoreConflictEffect();
//                        if (effectPaster != null) {
//                            addEffectToRecord(effectPaster.getPath());
//                        }

                    }
                });
            }

            @Override
            public void onDrawReady() {

            }

            @Override
            public void onPictureBack(final Bitmap bitmap) {

            }

            @Override
            public void onPictureDataBack(final byte[] data) {

            }

        });
        recorder.setOnTextureIdCallback(new OnTextureIdCallBack() {
            @Override
            public int onTextureIdBack(int textureId, int textureWidth, int textureHeight, float[] matrix) {

                //******************************** start ******************************************
                //这块代码会影响到标准版的faceUnity功能 改动的时候要关联app gradle 一起改动
//                if (faceInitResult && currentBeautyFaceMode == BeautyMode.Advanced && faceUnityManager != null) {
//                    /**
//                     * faceInitResult fix bug:反复退出进入会出现黑屏情况,原因是因为release之后还在调用渲染的接口,必须要保证release了之后不能再调用渲染接口
//                     */
//                    return faceUnityManager.draw(frameBytes, mFuImgNV21Bytes, textureId, frameWidth, frameHeight, mFrameId++, mControlView.getCameraType().getType());
//                }
                //******************************** end ********************************************
                return textureId;
            }


            @Override
            public int onScaledIdBack(int scaledId, int textureWidth, int textureHeight, float[] matrix) {
                //if (test == null) {
                //    test = new OpenGLTest();
                //}

                return scaledId;
            }

            @Override
            public void onTextureDestroyed() {
                // sdk3.7.8改动, 自定义渲染（第三方渲染）销毁gl资源，以前GLSurfaceView时可以通过GLSurfaceView.queueEvent来做，
                // 现在增加了一个gl资源销毁的回调，需要统一在这里面做。
//                if (faceUnityManager != null && faceInitResult) {
//                    faceUnityManager.release();
//                    faceInitResult = false;
//                }
            }
        });

        recorder.setEncoderInfoCallback(new EncoderInfoCallback() {
            @Override
            public void onEncoderInfoBack(EncoderInfo info) {
            }
        });
        recorder.setFaceTrackInternalMaxFaceCount(2);
    }

    /**
     * 获取最大录制时长
     *
     * @return
     */
    public int getMaxRecordTime() {
        if (maxRecordTime < MIN_RECORD_TIME) {
            return MIN_RECORD_TIME;
        } else if (maxRecordTime > MAX_RECORD_TIME) {
            return MAX_RECORD_TIME;
        } else {

            return maxRecordTime;
        }

    }
    private void initOritationDetector() {
        orientationDetector = new OrientationDetector(getContext().getApplicationContext());
        orientationDetector.setOrientationChangedListener(new OrientationDetector.OrientationChangedListener() {
            @Override
            public void onOrientationChanged() {
                rotation = getPictureRotation();
                recorder.setRotation(rotation);
            }
        });
    }

    private int getPictureRotation() {
        int orientation = orientationDetector.getOrientation();
        int rotation = 90;
        if ((orientation >= 45) && (orientation < 135)) {
            rotation = 180;
        }
        if ((orientation >= 135) && (orientation < 225)) {
            rotation = 270;
        }
        if ((orientation >= 225) && (orientation < 315)) {
            rotation = 0;
        }
        if (cameraType == com.aliyun.svideo.sdk.external.struct.recorder.CameraType.FRONT) {
            if (rotation != 0) {
                rotation = 360 - rotation;
            }
        }
        return rotation;
    }

    /**
     * 片段录制完成的回调处理
     *
     * @param isValid
     * @param duration
     */
    private void handleStopCallback(final boolean isValid, final long duration) {
        post(new Runnable() {
            @Override
            public void run() {

                mControlView.setRecordState(RecordState.STOP);
                if (mControlView != null) {
                    mControlView.setRecording(false);
                }

                if (!isValid) {
                    if (mRecordTimeView != null) {
                        mRecordTimeView.setDuration(0);

                        if (mRecordTimeView.getTimelineDuration() == 0) {
                            mControlView.setHasRecordPiece(false);
                        }
                    }
                    return;
                }

                if (duration > 200) {
                    if (mRecordTimeView != null) {
                        mRecordTimeView.setDuration((int)duration);
                        mRecordTimeView.clipComplete();
                    }
                    mControlView.setHasRecordPiece(true);
//                    isAllowChangeMv = false;
                } else {

//                    if (mRecordTimeView != null) {
//                        mRecordTimeView.setDuration(0);
//                    }
                    //todo 小于200毫秒的视频会导致合成视频出现异常，这里会做删除
                    clipManager.deletePart();
                    if (clipManager.getDuration() == 0) {
//                        isAllowChangeMv = true;
                        mControlView.setHasRecordPiece(false);
                    }
                    isMaxDuration = false;
                }

            }
        });
    }
    public void setCompleteListener(OnFinishListener mCompleteListener) {
        this.mCompleteListener = mCompleteListener;
    }
    /**
     * 录制完成事件监听
     */
    public interface OnFinishListener {
        void onComplete(String path, int duration);
    }

    public void setRecordMute(boolean recordMute) {
        if (recorder != null) {
            recorder.setMute(recordMute);
        }
    }

    public void onPause() {
        mIsBackground = true;
    }

    public void onResume() {
        mIsBackground = false;
    }

    public void onStop() {
//        if (mFocusView != null) {
//            mFocusView.activityStop();
//        }
    }


    /**
     * 开始预览
     */
    public void startPreview() {
        activityStoped = false;
        if (pendingCompseFinishRunnable != null) {
            pendingCompseFinishRunnable.run();
        }
        pendingCompseFinishRunnable = null;
        if (recorder != null) {
            recorder.startPreview();
//            if (isAllowChangeMv) {
//                restoreConflictEffect();
//            }
            //            recorder.setZoom(scaleFactor);
            if (clipManager.getDuration() >= clipManager.getMinDuration()) {
                // 2018/7/11 让下一步按钮可点击
                mControlView.setCompleteEnable(true);
            } else {
                mControlView.setCompleteEnable(false);
            }
        }
        if (orientationDetector != null && orientationDetector.canDetectOrientation()) {
            orientationDetector.enable();
        }

        mCountDownView.setOnCountDownFinishListener(new AlivcCountDownView.OnCountDownFinishListener() {
            @Override
            public void onFinish() {
                startRecord();
            }
        });

    }

    public void setBackClickListener(OnBackClickListener listener) {
        this.mBackClickListener = listener;
    }

    /**
     * 结束预览
     */
    public void stopPreview() {
        activityStoped = true;
        if (mControlView != null && mCountDownView != null && mControlView.getRecordState().equals(RecordState.READY)) {
            mCountDownView.cancle();
            mControlView.setRecordState(RecordState.STOP);
            mControlView.setRecording(false);
        }

        if (mControlView != null && mControlView.getRecordState().equals(RecordState.RECORDING)) {
            recorder.stopRecording();
        }
        recorder.stopPreview();

//        if (beautyEffectChooser != null) {
//            beautyEffectChooser.dismiss();
//        }
//
//        if (mFaceUnityTask != null) {
//            mFaceUnityTask.cancel(true);
//            mFaceUnityTask = null;
//        }
        if (orientationDetector != null) {
            orientationDetector.disable();
        }

        if (mControlView != null && mControlView.getFlashType() == FlashType.ON
                && mControlView.getCameraType() == CameraType.BACK) {
            mControlView.setFlashType(FlashType.OFF);
        }
    }

    /**
     * 删除所有录制文件
     */
    public void deleteAllPart() {
        if (clipManager != null) {
            clipManager.deleteAllPart();
            if (clipManager.getDuration() < clipManager.getMinDuration() && mControlView != null) {
                mControlView.setCompleteEnable(false);
            }
            if (clipManager.getDuration() == 0) {
                // 音乐可以选择
                //                    musicBtn.setVisibility(View.VISIBLE);
                //                    magicMusic.setVisibility(View.VISIBLE);
                //recorder.restartMv();
                mRecordTimeView.clear();
                mControlView.setHasRecordPiece(false);
            }
        }
    }

    /**
     * 设置Gop
     *
     * @param mGop
     */
    public void setGop(int mGop) {
        this.mGop = mGop;
        if (recorder != null) {
            recorder.setGop(mGop);
        }
    }

    /**
     * 设置码率
     *
     * @param mBitrate
     */
    public void setBitrate(int mBitrate) {
        this.mBitrate = mBitrate;
        if (recorder != null) {
            recorder.setVideoBitrate(mBitrate);
        }
    }

    /**
     * 设置录制时长
     *
     * @param maxRecordTime
     */
    public void setMaxRecordTime(int maxRecordTime) {
        this.maxRecordTime = maxRecordTime;
        if (clipManager != null) {
            clipManager.setMaxDuration(getMaxRecordTime());
        }
        if (mRecordTimeView != null) {
            mRecordTimeView.setMaxDuration(getMaxRecordTime());
        }
    }

    /**
     * 设置最小录制时长
     *
     * @param minRecordTime
     */
    public void setMinRecordTime(int minRecordTime) {
        this.minRecordTime = minRecordTime;
        if (clipManager != null) {
            clipManager.setMinDuration(minRecordTime);
        }
        if (mRecordTimeView != null) {
            mRecordTimeView.setMinDuration(minRecordTime);
        }
    }

    /**
     * 获取拍摄视频宽度
     *
     * @return
     */
    private int getVideoWidth() {
        int width = 0;
        switch (mResolutionMode) {
            case AliyunSnapVideoParam.RESOLUTION_360P:
                width = 360;
                break;
            case AliyunSnapVideoParam.RESOLUTION_480P:
                width = 480;
                break;
            case AliyunSnapVideoParam.RESOLUTION_540P:
                width = 540;
                break;
            case AliyunSnapVideoParam.RESOLUTION_720P:
                width = 720;
                break;
            default:
                width = 540;
                break;
        }

        return width;
    }

    private int getVideoHeight() {
        int width = getVideoWidth();
        int height = 0;
        switch (mRatioMode) {
            case AliyunSnapVideoParam.RATIO_MODE_1_1:
                height = width;
                break;
            case AliyunSnapVideoParam.RATIO_MODE_3_4:
                height = width * 4 / 3;
                break;
            case AliyunSnapVideoParam.RATIO_MODE_9_16:
                height = width * 16 / 9;
                break;
            default:
                height = width;
                break;
        }
        return height;
    }

    private MediaInfo getMediaInfo() {
        MediaInfo info = new MediaInfo();
        info.setFps(35);
        info.setVideoWidth(getVideoWidth());
        info.setVideoHeight(getVideoHeight());
        info.setVideoCodec(mVideoCodec);
        info.setCrf(0);
        return info;
    }

    /**
     * 设置视频比例
     *
     * @param mRatioMode
     */
    public void setRatioMode(int mRatioMode) {
        this.mRatioMode = mRatioMode;
        if (recorder != null) {
            recorder.setMediaInfo(getMediaInfo());

        }
        if (mSurfaceView != null) {
            LayoutParams params = (LayoutParams)mSurfaceView.getLayoutParams();
            int screenWidth = ScreenUtils.getScreenWidth();
            int height = 0;
            int top;
            switch (mRatioMode) {
                case AliyunSnapVideoParam.RATIO_MODE_1_1:
                    //视频比例为1：1的时候，录制界面向下移动，移动位置为顶部菜单栏的高度
                    params.setMargins(0, 54, 0, 0 );
                    height = screenWidth;
                    break;
                case AliyunSnapVideoParam.RATIO_MODE_3_4:
                    //视频比例为3：4的时候，录制界面向下移动，移动位置为顶部菜单栏的高度

                    params.setMargins(0, 54, 0, 0 );
                    height = screenWidth * 4 / 3;
                    break;
                case AliyunSnapVideoParam.RATIO_MODE_9_16:

                    int screenHeight = ScreenUtils.getScreenHeight();
                    float screenRatio = screenWidth / (float)screenHeight;
                    if (screenRatio >= 9 / 16f) {
                        //胖手机宽高比小于9/16
                        params.width = screenWidth;
                        height = screenWidth * 16 / 9;
                    } else {
                        height = screenHeight;
                        params.width = screenHeight * 9 / 16;
                    }
                    Log.e("RealHeight", "height:" + screenHeight + "width:" + screenWidth);
                    params.gravity = Gravity.CENTER;
                    break;
                default:
                    height = screenWidth * 16 / 9;
                    break;
            }
            params.height = height;
            mSurfaceView.setLayoutParams(params);
        }

    }

    /**
     * 设置视频质量
     *
     * @param mVideoQuality
     */
    public void setVideoQuality(VideoQuality mVideoQuality) {
        this.mVideoQuality = mVideoQuality;
        if (recorder != null) {
            recorder.setVideoQuality(mVideoQuality);
        }
    }

    /**
     * 设置视频码率
     *
     * @param mResolutionMode
     */
    public void setResolutionMode(int mResolutionMode) {
        this.mResolutionMode = mResolutionMode;
        if (recorder != null) {
            recorder.setMediaInfo(getMediaInfo());
        }
    }

    /**
     * 设置视频编码方式
     *
     * @param mVideoCodec
     */
    public void setVideoCodec(VideoCodecs mVideoCodec) {
        this.mVideoCodec = mVideoCodec;
        if (recorder != null) {
            recorder.setMediaInfo(getMediaInfo());
        }

    }




}
