package com.meeruu.sharegoods.rn.showground.activity;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.MediaController;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.VideoView;

import com.aliyun.common.utils.MySystemParams;
import com.meeruu.commonlib.utils.NotchScreenUtil;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.event.ShowVideoEvent;
import com.meeruu.sharegoods.rn.showground.bean.ImageBean;
import com.meeruu.sharegoods.rn.showground.utils.VideoCoverUtils;
import com.umeng.analytics.MobclickAgent;

import org.greenrobot.eventbus.EventBus;

public class VideoPlayActivity extends Activity  implements MediaPlayer.OnErrorListener, MediaPlayer.OnPreparedListener, MediaPlayer.OnCompletionListener, View.OnClickListener {
    private String video_path = "";
    private ImageView picture_left_back;
    private MediaController mMediaController;
    private VideoView mVideoView;
    private ImageView iv_play;
    private TextView next;
    private int mPositionWhenPaused = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        MySystemParams.getInstance().init(this);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        Window window = getWindow();
        // 检测是否是全面屏手机, 如果不是, 设置FullScreen
        if (!NotchScreenUtil.checkNotchScreen(this)) {
            window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_show_video_play);
        video_path = getIntent().getStringExtra("video_path");
        if(TextUtils.isEmpty(video_path)){
            finish();
        }
        picture_left_back = (ImageView) findViewById(com.reactnative.ivpusic.imagepicker.R.id.picture_left_back);
        mVideoView = (VideoView) findViewById(com.reactnative.ivpusic.imagepicker.R.id.video_view);
        mVideoView.setBackgroundColor(Color.BLACK);
        iv_play = (ImageView) findViewById(com.reactnative.ivpusic.imagepicker.R.id.iv_play);
        next = findViewById(R.id.tv_right);
        mMediaController = new MediaController(this);
        mVideoView.setOnCompletionListener(this);
        mVideoView.setOnPreparedListener(this);
        mVideoView.setMediaController(mMediaController);
        picture_left_back.setOnClickListener(this);
        iv_play.setOnClickListener(this);
        next.setOnClickListener(this);
    }

    @Override
    public void onStart() {
        // Play Video
        mVideoView.setVideoPath(video_path);
        mVideoView.start();
        super.onStart();
    }

    @Override
    public void onPause() {
        // Stop video when the activity is pause.
        mPositionWhenPaused = mVideoView.getCurrentPosition();
        mVideoView.stopPlayback();

        super.onPause();
    }

    @Override
    protected void onDestroy() {
        mMediaController = null;
        mVideoView = null;
        iv_play = null;
        super.onDestroy();
    }

    @Override
    public void onResume() {
        // Resume video player
        if (mPositionWhenPaused >= 0) {
            mVideoView.seekTo(mPositionWhenPaused);
            mPositionWhenPaused = -1;
        }

        super.onResume();

        MobclickAgent.onResume(VideoPlayActivity.this);
    }

    @Override
    public boolean onError(MediaPlayer player, int arg1, int arg2) {
        return false;
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        if (null != iv_play) {
            iv_play.setVisibility(View.VISIBLE);
        }

    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == R.id.picture_left_back) {
            finish();
        } else if (id == R.id.iv_play) {
            mVideoView.start();
            iv_play.setVisibility(View.INVISIBLE);
        }else if (id == R.id.tv_right){
            ShowVideoEvent event = new ShowVideoEvent();
            event.setPath(video_path);
            ImageBean cover = VideoCoverUtils.getVideoThumb(VideoPlayActivity.this,video_path);
            event.setCover(cover.getPath());
            event.setWidth(cover.getWidth());
            event.setHeight(cover.getHeight());
            EventBus.getDefault().post(event);
            finish();
        }
    }

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(new ContextWrapper(newBase) {
            @Override
            public Object getSystemService(String name) {
                if (Context.AUDIO_SERVICE.equals(name)) {
                    return getApplicationContext().getSystemService(name);
                }
                return super.getSystemService(name);
            }
        });
    }

    @Override
    public void onPrepared(MediaPlayer mp) {
        MobclickAgent.onPause(VideoPlayActivity.this);
        mp.setOnInfoListener(new MediaPlayer.OnInfoListener() {
            @Override
            public boolean onInfo(MediaPlayer mp, int what, int extra) {
                if (what == MediaPlayer.MEDIA_INFO_VIDEO_RENDERING_START) {
                    // video started
                    mVideoView.setBackgroundColor(Color.TRANSPARENT);
                    return true;
                }
                return false;
            }
        });
    }
}
