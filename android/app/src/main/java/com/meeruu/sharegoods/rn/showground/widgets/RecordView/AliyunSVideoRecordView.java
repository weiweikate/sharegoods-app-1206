package com.meeruu.sharegoods.rn.showground.widgets.RecordView;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.hardware.Camera;
import android.os.AsyncTask;
import android.os.Environment;
import android.support.v4.app.FragmentActivity;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
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
import com.aliyun.svideo.sdk.external.struct.encoder.EncoderInfo;
import com.aliyun.svideo.sdk.external.struct.recorder.CameraParam;
import com.aliyun.svideo.sdk.external.struct.recorder.CameraType;
import com.aliyun.svideo.sdk.external.struct.recorder.FlashType;
import com.aliyun.svideo.sdk.external.struct.recorder.MediaInfo;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.utils.OrientationDetector;
import com.meeruu.sharegoods.rn.showground.utils.PermissionUtils;
import com.meeruu.sharegoods.rn.showground.utils.ThreadUtils;
import com.meeruu.sharegoods.rn.showground.utils.TimeFormatterUtils;
import com.meeruu.sharegoods.rn.showground.widgets.RecordView.control.ControlView;
import com.meeruu.sharegoods.rn.showground.widgets.RecordView.control.ControlViewListener;
import com.meeruu.sharegoods.rn.showground.widgets.RecordView.control.RecordState;
import com.qu.preview.callback.OnFrameCallBack;
import com.qu.preview.callback.OnTextureIdCallBack;

import java.io.File;
import java.lang.ref.WeakReference;
import java.util.List;

public class AliyunSVideoRecordView extends FrameLayout implements ScaleGestureDetector.OnScaleGestureListener {
    private static final String TAG = AliyunSVideoRecordView.class.getSimpleName();
    private SurfaceView mSurfaceView;
    private AliyunIRecorder recorder;
    public ControlView mControlView;
    private AliyunIClipManager clipManager;
    private OnBackClickListener mBackClickListener;
    private com.aliyun.svideo.sdk.external.struct.recorder.CameraType cameraType
            = com.aliyun.svideo.sdk.external.struct.recorder.CameraType.FRONT;
    //录制视频是否达到最大值
    private boolean isMaxDuration = false;
    private AsyncTask<Void, Void, Void> finishRecodingTask;
    private FragmentActivity mActivity;
    private boolean mIsBackground;

    //录制时长
    private int recordTime = 0;
    //文件存放位置
    private String videoPath;

    //最小录制时长
    private int minRecordTime = 2000;
    //最大录制时长
    private int maxRecordTime = 15 * 1000;
    private ProgressDialog progressBar;
    private OrientationDetector orientationDetector;
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
        initRecorder();

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
//                mRecordTimeView.deleteLast();
                clipManager.deletePart();
                isMaxDuration = false;
                if (mControlView != null) {
                    if (clipManager.getDuration() < clipManager.getMinDuration()) {
                        mControlView.setCompleteEnable(false);
                    }

//                    mControlView.updataCutDownView(true);
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
    public void setActivity(FragmentActivity mActivity) {
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
                        isAllowChangeMv = false;
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
                        restoreConflictEffect();
                        if (effectPaster != null) {
                            addEffectToRecord(effectPaster.getPath());
                        }

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
                if (faceInitResult && currentBeautyFaceMode == BeautyMode.Advanced && faceUnityManager != null) {
                    /**
                     * faceInitResult fix bug:反复退出进入会出现黑屏情况,原因是因为release之后还在调用渲染的接口,必须要保证release了之后不能再调用渲染接口
                     */
                    return faceUnityManager.draw(frameBytes, mFuImgNV21Bytes, textureId, frameWidth, frameHeight, mFrameId++, mControlView.getCameraType().getType());
                }
                //******************************** end ********************************************
                return textureId;
            }

            OpenGLTest test;

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
                if (faceUnityManager != null && faceInitResult) {
                    faceUnityManager.release();
                    faceInitResult = false;
                }
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
//                    if (mRecordTimeView != null) {
//                        mRecordTimeView.setDuration(0);
//
//                        if (mRecordTimeView.getTimelineDuration() == 0) {
//                            mControlView.setHasRecordPiece(false);
//                        }
//                    }
                    return;
                }

                if (duration > 200) {
//                    if (mRecordTimeView != null) {
//                        mRecordTimeView.setDuration((int)duration);
//                        mRecordTimeView.clipComplete();
//                    }
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
}
