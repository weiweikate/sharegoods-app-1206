package com.meeruu.sharegoods.rn.showground.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.VideoView;

public class ShowVideoView extends VideoView {
    private int mVideoWidth;
    private int mVideoHeight;
    private PlayPauseListener mListener;

    public ShowVideoView(Context context) {
        super(context);
    }

    public ShowVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ShowVideoView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }


    public void setPlayPauseListener(PlayPauseListener listener) {
        mListener = listener;
    }

    @Override
    public void pause() {
        super.pause();
        if (mListener != null) {
            mListener.onPause();
        }
    }

    @Override
    public void start() {
        super.start();
        if (mListener != null) {
            mListener.onPlay();
        }
    }

    public interface PlayPauseListener {
        void onPlay();
        void onPause();
    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
	    /* The following code is to make videoView view length-width
	    based on the parameters you set to decide. */
        int width = getDefaultSize(mVideoWidth, widthMeasureSpec);
        int height = getDefaultSize(mVideoHeight, heightMeasureSpec);
        setMeasuredDimension(width, height);
    }
}
