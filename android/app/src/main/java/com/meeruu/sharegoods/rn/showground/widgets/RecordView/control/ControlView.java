package com.meeruu.sharegoods.rn.showground.widgets.RecordView.control;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.StateListDrawable;
import android.support.v4.content.ContextCompat;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.aliyun.svideo.sdk.external.struct.recorder.CameraType;
import com.aliyun.svideo.sdk.external.struct.recorder.FlashType;
import com.meeruu.commonlib.utils.FastClickUtil;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.utils.UIConfigManager;

import java.util.ArrayList;
import java.util.List;

public class ControlView extends RelativeLayout implements View.OnTouchListener {
    private static final int MAX_ITEM_COUNT = 5;
    private ImageView aliyunSwitchLight;
    private ImageView aliyunSwitchCamera;
    private TextView aliyunComplete;
    private ImageView aliyunBack;
    private LinearLayout aliyunRecordLayoutBottom;
    private TextView aliyunRecordDuration;
    private FrameLayout aliyunRecordBtn;
    private TextView aliyunDelete;
    private FrameLayout mTitleView;
    private TextView mRecordTipTV;
    private ControlViewListener mListener;
    //闪光灯类型
    private FlashType flashType = FlashType.OFF;
    //摄像头类型
    private CameraType cameraType = CameraType.FRONT;
    //录制按钮宽度
    private int itemWidth;
    private RecordMode recordMode = RecordMode.LONG_PRESS;

    private RecordState recordState = RecordState.STOP;
    private boolean isRecording = false;
    private boolean hasRecordPiece = false;
    //是否可以完成录制，录制时长大于最小录制时长时为true
    private boolean canComplete = false;
    public ControlView(Context context) {
        this(context, null);
    }

    public ControlView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public ControlView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init(){
        calculateItemWidth();
        //Inflate布局
        LayoutInflater.from(getContext()).inflate(R.layout.aliyun_svideo_view_control, this, true);
        assignViews();
        setViewListener();
        //更新view的显示
        updateAllViews();
    }

    private void updateAllViews(){
        //准备录制和音乐选择的时候所有view隐藏
//        if (isMusicSelViewShow || recordState == RecordState.READY) {
//            setVisibility(GONE);
//        } else {
//            setVisibility(VISIBLE);
//            updateBottomView();
//            updateTittleView();
//        }
    }

    private void setViewListener(){
        // 返回按钮
        aliyunBack.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (FastClickUtil.isFastClick()) {
                    return;
                }
                if (mListener != null) {
                    mListener.onBackClick();
                }
            }
        });



        // 闪光灯
        aliyunSwitchLight.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (FastClickUtil.isFastClick()) {
                    return;
                }

                if (flashType == FlashType.ON) {
                    flashType = FlashType.OFF;
                } else {
                    flashType = FlashType.ON;
                }

                updateLightSwitchView();
                if (mListener != null) {
                    mListener.onLightSwitch(flashType);
                }
            }
        });

        // 切换相机
        aliyunSwitchCamera.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (FastClickUtil.isFastClick()) {
                    return;
                }
                if (mListener != null) {
                    mListener.onCameraSwitch();
                }
            }
        });

        // 下一步(跳转编辑)
        aliyunComplete.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (FastClickUtil.isFastClick()) {
                    return;
                }
                if (mListener != null) {
                    mListener.onNextClick();
                }
            }
        });
    }

    /**
     * 更新闪光灯按钮
     */
    private void updateLightSwitchView() {
        if (cameraType == CameraType.FRONT) {
            aliyunSwitchLight.setClickable(false);
            // 前置摄像头状态, 闪光灯图标变灰
            aliyunSwitchLight.setColorFilter(ContextCompat.getColor(getContext(), R.color.alivc_svideo_gray_alpha));
            UIConfigManager.setImageResourceConfig(aliyunSwitchLight, R.attr.lightImageUnable, R.mipmap.aliyun_svideo_icon_magic_light_off);

        } else if (cameraType == CameraType.BACK) {
            aliyunSwitchLight.setClickable(true);
            // 后置摄像头状态, 清除过滤器
            aliyunSwitchLight.setColorFilter(null);
            switch (flashType) {
                case ON:
                    aliyunSwitchLight.setSelected(true);
                    aliyunSwitchLight.setActivated(false);
                    UIConfigManager.setImageResourceConfig(aliyunSwitchLight, R.attr.lightImageOpen, R.mipmap.aliyun_svideo_icon_magic_light);
                    break;
                case OFF:
                    aliyunSwitchLight.setSelected(true);
                    aliyunSwitchLight.setActivated(true);
                    UIConfigManager.setImageResourceConfig(aliyunSwitchLight, R.attr.lightImageClose, R.mipmap.aliyun_svideo_icon_magic_light_off);
                    break;
                default:
                    break;
            }
        }

    }


    private void assignViews() {
//        ivReadyRecord = (ImageView) findViewById(R.id.aliyun_ready_record);
        aliyunSwitchLight = (ImageView) findViewById(R.id.aliyun_switch_light);
//        mLlFilterEffect = findViewById(R.id.alivc_record_effect_filter);
        aliyunSwitchCamera = (ImageView) findViewById(R.id.aliyun_switch_camera);
//        mIvMusicIcon = findViewById(R.id.alivc_record_iv_music);
        aliyunComplete = findViewById(R.id.aliyun_complete);
        aliyunBack = (ImageView) findViewById(R.id.aliyun_back);
        aliyunRecordLayoutBottom = (LinearLayout) findViewById(R.id.aliyun_record_layout_bottom);
//        aliyunRateBar = (LinearLayout) findViewById(R.id.aliyun_rate_bar);
//        aliyunRateQuarter = (TextView) findViewById(R.id.aliyun_rate_quarter);
//        aliyunRateHalf = (TextView) findViewById(R.id.aliyun_rate_half);
//        aliyunRateOrigin = (TextView) findViewById(R.id.aliyun_rate_origin);
//        aliyunRateDouble = (TextView) findViewById(R.id.aliyun_rate_double);
//        aliyunRateDoublePower2 = (TextView) findViewById(R.id.aliyun_rate_double_power2);
        aliyunRecordDuration = (TextView) findViewById(R.id.aliyun_record_duration);
        aliyunRecordBtn = (FrameLayout) findViewById(R.id.aliyun_record_bg);
//        aliyunRecordProgress = (FanProgressBar) findViewById(R.id.aliyun_record_progress);
        aliyunDelete = (TextView) findViewById(R.id.aliyun_delete);
//        llBeautyFace = findViewById(R.id.ll_beauty_face);
//        llGifEffect = findViewById(R.id.ll_gif_effect);
//        mPickerView = findViewById(R.id.alivc_video_picker_view);
        mTitleView = findViewById(R.id.alivc_record_title_view);
        mRecordTipTV = findViewById(R.id.alivc_record_tip_tv);
//        mAlivcMusic = findViewById(R.id.alivc_music);
//        mTvMusic = findViewById(R.id.tv_music);
        //uiStyleConfig
        //音乐按钮
        //倒计时
        //完成的按钮图片 - 不可用
        //底部滤镜，美颜，美肌对应的按钮图片
        //底部动图mv对应的按钮图片
//        UIConfigManager.setImageResourceConfig(
//            new ImageView[] {ivReadyRecord, findViewById(R.id.iv_beauty_face), findViewById(R.id.iv_gif_effect)}
//            , new int[] { R.attr.countdownImage, R.attr.faceImage, R.attr.magicImage}
//            , new int[] {R.mipmap.alivc_svideo_icon_magic, R.mipmap.alivc_svideo_icon_beauty_face, R.mipmap.alivc_svideo_icon_gif_effect}
//        );

        //回删对应的图片
        //拍摄中红点对应的图片
        UIConfigManager.setImageResourceConfig(
            new TextView[] {aliyunDelete, aliyunRecordDuration}
            , new int[] {0, 0}
            , new int[] {R.attr.deleteImage, R.attr.dotImage}
            , new int[] {R.mipmap.alivc_svideo_icon_delete, R.mipmap.alivc_svideo_record_time_tip});
        //切换摄像头的图片
        aliyunSwitchCamera.setImageDrawable(getSwitchCameraDrawable());
//        List<String> strings = new ArrayList<>(2);
//        strings.add(getResources().getString(R.string.alivc_record_click));
//        strings.add(getResources().getString(R.string.alivc_record_long_press));
//        mPickerView.setData(strings);
//        //向上的三角形对应的图片
//        mPickerView.setCenterItemBackground(UIConfigManager.getDrawableResources(getContext(), R.attr.triangleImage, R.mipmap.alivc_svideo_icon_selected_indicator));
    }

    /**
     * 获取切换摄像头的图片的selector
     *
     * @return Drawable
     */
    private Drawable getSwitchCameraDrawable() {

        Drawable drawable = UIConfigManager.getDrawableResources(getContext(), R.attr.switchCameraImage, R.mipmap.alivc_svideo_icon_magic_turn);
        Drawable pressDrawable = drawable.getConstantState().newDrawable().mutate();
        pressDrawable.setAlpha(66);//透明度60%
        StateListDrawable stateListDrawable = new StateListDrawable();
        stateListDrawable.addState(new int[] {android.R.attr.state_pressed},
            pressDrawable);
        stateListDrawable.addState(new int[] {},
            drawable);
        return stateListDrawable;
    }

    /**
     * 获取录制按钮宽高
     */
    private void calculateItemWidth() {
        itemWidth = getResources().getDisplayMetrics().widthPixels / MAX_ITEM_COUNT;
    }

    /**
     * 添加各个控件点击监听
     *
     * @param mListener
     */
    public void setControlViewListener(ControlViewListener mListener) {
        this.mListener = mListener;
    }


    @Override
    public boolean onTouch(View v, MotionEvent event) {
        if (FastClickUtil.isRecordWithOtherClick()) {
            return false;
        }
        if (event.getAction() == MotionEvent.ACTION_DOWN) {

            if (recordState != RecordState.COUNT_DOWN_RECORDING && recordMode == RecordMode.LONG_PRESS) {
                if (isRecording) {
                    return true;
                } else {
                    if (mListener != null) {
                        mListener.onStartRecordClick();
                    }
                }
            }

        } else if (event.getAction() == MotionEvent.ACTION_CANCEL
            || event.getAction() == MotionEvent.ACTION_UP) {
            if (recordState == RecordState.COUNT_DOWN_RECORDING) {
                if (mListener != null) {
                    mListener.onStopRecordClick();
                    setRecordState(RecordState.STOP);
                    //停止拍摄后立即展示回删
                    if (hasRecordPiece) {
                        setHasRecordPiece(true);
                    }

                }
            } else {
                if (recordMode == RecordMode.LONG_PRESS) {
                    if (mListener != null && recordState == RecordState.RECORDING) {
                        mListener.onStopRecordClick();
                        setRecordState(RecordState.STOP);
                        //停止拍摄后立即展示回删
                        if (hasRecordPiece) {
                            setHasRecordPiece(true);
                        }
                    }
                } else {
                    if (recordState == RecordState.RECORDING) {
                        if (mListener != null) {
                            mListener.onStopRecordClick();
                            setRecordState(RecordState.STOP);
                            //停止拍摄后立即展示回删
                            if (hasRecordPiece) {
                                setHasRecordPiece(true);
                            }
                        }
                    } else {
                        if (mListener != null && !isRecording) {
                            mListener.onStartRecordClick();
                        }
                    }
                }
            }

        }
        return true;
    }

    public void setRecordState(RecordState recordState) {
        if (recordState == RecordState.RECORDING) {
            if (this.recordState == RecordState.READY) {
                this.recordState = RecordState.COUNT_DOWN_RECORDING;
            } else {
                this.recordState = recordState;
            }
        } else {
            this.recordState = recordState;
        }
        updateAllViews();
    }

    public boolean isHasRecordPiece() {
        return hasRecordPiece;
    }

    public FlashType getFlashType() {
        return flashType;
    }

    /**
     * 是否有录制片段
     *
     * @param hasRecordPiece
     */
    public void setHasRecordPiece(boolean hasRecordPiece) {
        this.hasRecordPiece = hasRecordPiece;
//        updateModeSelView();
        updateDeleteView();
//        updateMusicSelView();
    }
    /**
     * 更新删除按钮
     */
    private void updateDeleteView() {

        if (!hasRecordPiece || recordState == RecordState.RECORDING
            || recordState == RecordState.COUNT_DOWN_RECORDING) {
            aliyunDelete.setVisibility(GONE);
        } else {
            aliyunDelete.setVisibility(VISIBLE);
        }
    }
    /**
     * 设置摄像头类型，并刷新页面，摄像头切换后被调用
     *
     * @param cameraType
     */
    public void setCameraType(CameraType cameraType) {
        this.cameraType = cameraType;
        //        updateCameraView();
        updateLightSwitchView();
    }
    public CameraType getCameraType() {
        return cameraType;
    }

    public void setRecording(boolean recording) {
        isRecording = recording;
    }
    public boolean isRecording() {
        return isRecording;
    }
    /**
     * 设置complete按钮是否可以点击
     *
     * @param enable
     */
    public void setCompleteEnable(boolean enable) {
        canComplete = enable;
        updateCompleteView();
    }

    /**
     * 更新完成录制按钮
     */
    private void updateCompleteView() {
        if (canComplete) {
            aliyunComplete.setSelected(true);
            aliyunComplete.setEnabled(true);
            //完成的按钮图片 - 可用
            //UIConfigManager.setImageResourceConfig(aliyunComplete, R.attr.finishImageAble, R.mipmap.alivc_svideo_icon_next_complete);
        } else {
            aliyunComplete.setSelected(false);
            aliyunComplete.setEnabled(false);
            //完成的按钮图片 - 不可用
            //UIConfigManager.setImageResourceConfig(aliyunComplete, R.attr.finishImageUnable, R.mipmap.alivc_svideo_icon_next_not_ready);
        }
    }

    /**
     * 设置录制事件，录制过程中持续被调用
     *
     * @param recordTime
     */
    public void setRecordTime(String recordTime) {
        aliyunRecordDuration.setText(recordTime);
    }
}
