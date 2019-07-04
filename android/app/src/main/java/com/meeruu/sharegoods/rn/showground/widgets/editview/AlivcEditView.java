package com.meeruu.sharegoods.rn.showground.widgets.editview;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Point;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.aliyun.common.utils.StorageUtils;
import com.aliyun.crop.AliyunCropCreator;
import com.aliyun.editor.EditorCallBack;
import com.aliyun.querrorcode.AliyunEditorErrorCode;
import com.aliyun.querrorcode.AliyunErrorCode;
import com.aliyun.svideo.sdk.external.struct.common.AliyunVideoParam;
import com.aliyun.svideo.sdk.external.struct.common.VideoDisplayMode;
import com.aliyun.svideo.sdk.external.thumbnail.AliyunIThumbnailFetcher;
import com.aliyun.svideo.sdk.external.thumbnail.AliyunThumbnailFetcherFactory;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.FastClickUtil;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.Activity.EditorActivity;
import com.meeruu.sharegoods.rn.showground.utils.UIConfigManager;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class AlivcEditView extends RelativeLayout implements View.OnClickListener {
    /**
     * 屏幕宽度
     */
    private int mScreenWidth;
    private LinearLayout mBarLinear;
    private RelativeLayout mActionBar;
    private ImageView mIvLeft;
    private TextView mTvRight;
    private TextView mTvCurrTime;
    private FrameLayout mGlSurfaceContainer;
    /**
     * 编辑需要渲染显示的SurfaceView
     */
    private SurfaceView mSurfaceView;
    public FrameLayout mPasterContainer;
    private TextView mPlayImage;
    private Uri mUri;
    private boolean hasTailAnimation = false;
    private AliyunVideoParam mVideoParam;
    private final String PATH_THUMBNAIL = Environment.getExternalStorageDirectory() + File.separator + "thumbnail.jpg";
    /**
     * 编辑核心接口类
     */
    public AlivcEditView(Context context) {
        this(context, null);
    }

    public AlivcEditView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public AlivcEditView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {

//        Dispatcher.getInstance().register(this);

        Point point = new Point();
        WindowManager windowManager = (WindowManager)getContext().getSystemService(Context.WINDOW_SERVICE);
        windowManager.getDefaultDisplay().getSize(point);
        mScreenWidth = point.x;
        LayoutInflater.from(getContext()).inflate(R.layout.aliyun_svideo_activity_editor, this, true);
        initView();
    }

    private void initView(){
//        resCopy = (FrameLayout)findViewById(R.id.copy_res_tip);
//        mTransCodeTip = (FrameLayout)findViewById(R.id.transcode_tip);
//        mTransCodeProgress = (ProgressBar)findViewById(R.id.transcode_progress);
        mBarLinear = (LinearLayout)findViewById(R.id.bar_linear);
        mBarLinear.bringToFront();
        mActionBar = (RelativeLayout)findViewById(R.id.action_bar);
        mActionBar.setBackgroundDrawable(null);
        mIvLeft = (ImageView)findViewById(R.id.iv_left);
        mTvRight = findViewById(R.id.tv_right);
        mIvLeft.setImageResource(R.mipmap.aliyun_svideo_icon_back);
        //uiConfig中的属性
        //UIConfigManager.setImageResourceConfig(mTvRight, R.attr.finishImage, R.mipmap.aliyun_svideo_complete_red);
        mIvLeft.setVisibility(View.VISIBLE);

        mIvLeft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((Activity)getContext()).finish();
            }
        });
        mTvCurrTime = (TextView)findViewById(R.id.tv_curr_duration);

        mGlSurfaceContainer = (FrameLayout)findViewById(R.id.glsurface_view);
        mSurfaceView = (SurfaceView)findViewById(R.id.play_view);
        mPasterContainer = (FrameLayout)findViewById(R.id.pasterView);

        mPlayImage = findViewById(R.id.play_button);
        mPlayImage.setOnClickListener(this);
        switchPlayStateUI(false);

    }

    /**
     * 更改播放状态的图标和文字 播放时,文字内容显示为: 暂停播放, 图标使暂停图标, mipmap/aliyun_svideo_pause 暂停时,文字内容显示为: 播放全篇, 图标使用播放图标,
     * mipmap/aliyun_svideo_play
     *
     * @param changeState, 需要显示的状态,  true: 播放全篇, false: 暂停播放
     */
    public void switchPlayStateUI(boolean changeState) {
//        if (changeState) {
//            mPlayImage.setText(getResources().getString(R.string.alivc_svideo_play_film));
//            UIConfigManager.setImageResourceConfig(mPlayImage, 0, R.attr.playImage, R.mipmap.aliyun_svideo_play);
//        } else {
//            mPlayImage.setText(getResources().getString(R.string.alivc_svideo_pause_film));
//            UIConfigManager.setImageResourceConfig(mPlayImage, 0, R.attr.pauseImage, R.mipmap.aliyun_svideo_pause);
//        }
    }
    @Override
    public void onClick(View v) {

    }

    public void setParam(AliyunVideoParam mVideoParam, Uri mUri, boolean hasTailAnimation, boolean hasWaterMark) {
        this.hasTailAnimation = hasTailAnimation;
        this.mUri = mUri;
        this.mVideoParam = mVideoParam;
        initEditor();

    }

    private void initGlSurfaceView() {
//        if (mVideoParam == null) {
//            return;
//        }
//        RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams)mGlSurfaceContainer.getLayoutParams();
//        FrameLayout.LayoutParams surfaceLayout = (FrameLayout.LayoutParams)mSurfaceView.getLayoutParams();
//        int outputWidth = mVideoParam.getOutputWidth();
//        int outputHeight = mVideoParam.getOutputHeight();
//
//        float percent;
//        if (outputWidth >= outputHeight) {
//            percent = (float)outputWidth / outputHeight;
//        } else {
//            percent = (float)outputHeight / outputWidth;
//        }
//        /*
//          指定surfaceView的宽高比是有必要的，这样可以避免某些非标分辨率下造成显示比例不对的问题
//         */
//        surfaceLayout.width = mScreenWidth;
//        surfaceLayout.height = Math.round((float)outputHeight * mScreenWidth / outputWidth);
////        mPasterContainerPoint = new Point(surfaceLayout.width, surfaceLayout.height);
//        ViewGroup.MarginLayoutParams marginParams = null;
//        if (layoutParams instanceof MarginLayoutParams) {
//            marginParams = (ViewGroup.MarginLayoutParams)surfaceLayout;
//        } else {
//            marginParams = new MarginLayoutParams(surfaceLayout);
//        }
//        if (percent < 1.5) {
//            marginParams.setMargins(0,
//                getContext().getResources().getDimensionPixelSize(R.dimen.alivc_svideo_title_height), 0, 0);
//        } else {
//            if (outputWidth > outputHeight) {
//                marginParams.setMargins(0,
//                    getContext().getResources().getDimensionPixelSize(R.dimen.alivc_svideo_title_height) * 2, 0, 0);
//                //} else {
//                //    int screenWidth = ScreenUtils.getRealWidth(getContext());
//                //    int screenHeight = ScreenUtils.getRealHeight(getContext());
//                //    float screenRatio = screenWidth / (float)screenHeight;
//                //    if (screenRatio <= 9 / 16f) {
//                //        //长手机，宽高比小于9/16
//                //        marginParams.height = screenHeight;
//                //        marginParams.width = screenHeight / 16 * 9;
//                //    }
//            }
//        }
//        mGlSurfaceContainer.setLayoutParams(layoutParams);
//        mPasterContainer.setLayoutParams(marginParams);
//        mSurfaceView.setLayoutParams(marginParams);
        //mCanvasController = mAliyunIEditor.obtainCanvasController(getContext(),
        //                    marginParams.width, marginParams.height);
    }

    private void initEditor() {
        //设置onTextureRender能够回调
//        mEditorCallback.mNeedRenderCallback = EditorCallBack.RENDER_CALLBACK_TEXTURE;
//        mAliyunIEditor = AliyunEditorFactory.creatAliyunEditor(mUri, mEditorCallback);
        initGlSurfaceView();
        {
            //该代码块中的操作必须在AliyunIEditor.init之前调用，否则会出现动图、动效滤镜的UI恢复回调不执行，开发者将无法恢复动图、动效滤镜UI
//            mPasterManager = mAliyunIEditor.createPasterManager();
            FrameLayout.LayoutParams surfaceLayout = (FrameLayout.LayoutParams)mSurfaceView.getLayoutParams();
            /*
              指定显示区域大小后必须调用mPasterManager.setDisplaySize，否则将无法添加和恢复一些需要提前获知区域大小的资源，如字幕，动图等
              如果开发者的布局使用了wrapContent或者matchParent之类的布局，务必获取到view的真实宽高之后在调用
             */
//            try {
//                mPasterManager.setDisplaySize(surfaceLayout.width, surfaceLayout.height);
//            } catch (Exception e) {
//                showToast = FixedToastUtils.show(getContext(), e.getMessage());
//                ((Activity)getContext()).finish();
//                return;
//            }
//            mPasterManager.setOnPasterRestoreListener(mOnPasterRestoreListener);
//            mAnimationFilterController = new AnimationFilterController(getContext().getApplicationContext(),
//                mAliyunIEditor);
//            mAliyunIEditor.setAnimationRestoredListener(AlivcEditView.this);
        }

//        mTranscoder = AliyunCropCreator.createCropInstance(getContext());
        VideoDisplayMode mode = mVideoParam.getScaleMode();
//        int ret = mAliyunIEditor.init(mSurfaceView, getContext().getApplicationContext());
//        mAliyunIEditor.setDisplayMode(mode);
//        mAliyunIEditor.setVolume(mVolume);
//        mAliyunIEditor.setFillBackgroundColor(Color.BLACK);
//        if (ret != AliyunErrorCode.OK) {
//            showToast = FixedToastUtils.show(getContext(),
//                getResources().getString(R.string.aliyun_svideo_editor_init_failed));
//            return;
//        }
//        mEditorService.addTabEffect(UIEditorPage.MV, mAliyunIEditor.getMVLastApplyId());
//        mEditorService.addTabEffect(UIEditorPage.FILTER_EFFECT, mAliyunIEditor.getFilterLastApplyId());
//        mEditorService.addTabEffect(UIEditorPage.AUDIO_MIX, mAliyunIEditor.getMusicLastApplyId());
//        mEditorService.setPaint(mAliyunIEditor.getPaintLastApply());

        mTvRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View v) {
                if (FastClickUtil.isFastClickActivity(EditorActivity.class.getSimpleName())) {
                    return;
                }
                mTvRight.setEnabled(false);
            }
        });
    }

    public void onResume() {
        mTvRight.setEnabled(true);
    }
    public void onPause() {
//        isNeedResume = mAliyunIEditor.isPlaying();
//        playingPause();
//        mAliyunIEditor.saveEffectToLocal();
    }
}
