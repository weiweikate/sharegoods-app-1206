package com.meeruu.sharegoods.rn.showground.widgets.littlevideo;

import android.content.Context;
import android.media.MediaPlayer;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.alibaba.fastjson.JSON;
import com.brentvatne.exoplayer.DataSourceUtil;
import com.brentvatne.exoplayer.ExoPlayerView;
import com.facebook.react.modules.network.CookieJarContainer;
import com.facebook.react.modules.network.ForwardingCookieHandler;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSourceFactory;
import com.google.android.exoplayer2.extractor.DefaultExtractorsFactory;
import com.google.android.exoplayer2.extractor.ExtractorsFactory;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;
import com.google.android.exoplayer2.upstream.BandwidthMeter;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultAllocator;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;
import com.google.android.exoplayer2.upstream.TransferListener;
import com.google.android.exoplayer2.util.Util;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.BaseVideoListAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.VideoListBean;
import com.meeruu.sharegoods.rn.showground.model.VideoModel;
import com.meeruu.sharegoods.rn.showground.widgets.ShowVideoView;

import java.util.ArrayList;
import java.util.List;

import okhttp3.JavaNetCookieJar;
import okhttp3.OkHttpClient;

public class VideoListView extends FrameLayout {
    private static String TAG = VideoListView.class.getSimpleName();
    private Context mContext;
    private RecyclerViewEmptySupport recycler;
    private BaseVideoListAdapter adapter;
    private PagerLayoutManager pagerLayoutManager;
    private View mPlayerViewContainer;
    private ImageView mPlayIcon;
    private ExoPlayerView videoView;
    private ExoPlayer exoPlayer;
    private VideoModel videoModel;
    /**
     * 数据是否到达最后一页
     */
    private boolean isEnd;
    private List<NewestShowGroundBean.DataBean> list;
    private String currentShowNo;

    /**
     * 判断是否处于加载数据的状态中
     */
    private boolean isLoadingData;
    /**
     * 预加载位置, 默认离底部还有5条数据时请求下一页视频列表
     */
    private static final int DEFAULT_PRELOAD_NUMBER = 2;
    /**
     * 是否点击暂停
     */
    private boolean isPauseInvoke = true;
    /**
     * 当前选中位置
     */
    private int mCurrentPosition;
    /**
     * 正常滑动，上一个被暂停的位置
     */
    private int mLastStopPosition = -1;

    private GestureDetector gestureDetector;

    public VideoListView(Context context) {
        super(context);
        this.mContext = context;
        initPlayer();
        init();
    }

    private VideoListView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        throw new IllegalArgumentException("this view isn't allow create by xml");
    }

    private void initPlayer() {

        mPlayerViewContainer = View.inflate(getContext(), R.layout.layout_player_view, null);
        videoView = mPlayerViewContainer.findViewById(R.id.video_view);
//        videoView.setResizeMode();
        exoPlayer = ExoPlayerFactory.newSimpleInstance(getContext(), new DefaultTrackSelector(), new DefaultLoadControl());
        videoView.setUseTextureView(true);
        exoPlayer.setRepeatMode(Player.REPEAT_MODE_ONE);
        exoPlayer.addListener(new Player.EventListener() {
            @Override
            public void onTimelineChanged(Timeline timeline, Object manifest, int reason) {

            }

            @Override
            public void onTracksChanged(TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {

            }

            @Override
            public void onLoadingChanged(boolean isLoading) {

            }

            @Override
            public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
                if(playWhenReady){
                    BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(mCurrentPosition);
                    if (holder != null) {
                        holder.getCoverView().setVisibility(GONE);
                        holder.getPlayIcon().setVisibility(GONE);
                    }
                    mPlayIcon.setVisibility(View.GONE);
                }
            }

            @Override
            public void onRepeatModeChanged(int repeatMode) {

            }

            @Override
            public void onShuffleModeEnabledChanged(boolean shuffleModeEnabled) {

            }

            @Override
            public void onPlayerError(ExoPlaybackException error) {

            }

            @Override
            public void onPositionDiscontinuity(int reason) {

            }

            @Override
            public void onPlaybackParametersChanged(PlaybackParameters playbackParameters) {

            }

            @Override
            public void onSeekProcessed() {

            }
        });
        videoView.setPlayer((SimpleExoPlayer) exoPlayer);

        mPlayIcon = mPlayerViewContainer.findViewById(R.id.iv_play_icon);
        gestureDetector = new GestureDetector(mContext, new GestureDetector.SimpleOnGestureListener() {

            @Override
            public boolean onSingleTapConfirmed(MotionEvent e) {
                //判断当前view是否可见，防止退后台、切换页面和单击同时操作导致，退后台时视频又重新开始播放
                if (VideoListView.this.isShown()) {
                    onPauseClick();
                }
                return true;
            }

            @Override
            public boolean onDown(MotionEvent e) {
                return true;
            }
        });

        mPlayerViewContainer.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                return gestureDetector.onTouchEvent(event);
            }
        });

    }

    /**
     * 视频暂停/恢复的时候使用，
     */
    public void onPauseClick() {
        if (isPauseInvoke) {
            resumePlay();
        } else {
            pausePlay();
        }
    }

    /**
     * 恢复播放
     */
    public void resumePlay() {
        isPauseInvoke = false;
        mPlayIcon.setVisibility(View.GONE);
//        videoView.start();
        exoPlayer.setPlayWhenReady(true);
    }

    /**
     * 暂停播放
     */
    public void pausePlay() {
        if(exoPlayer == null){
            return;
        }
        isPauseInvoke = true;
        mPlayIcon.setVisibility(View.VISIBLE);
        if (exoPlayer.getPlayWhenReady()) {
            exoPlayer.setPlayWhenReady(false);
        }
    }

    /**
     * 释放资源
     */
    public void releasePlayer() {
        if (exoPlayer!= null) {
            exoPlayer.setPlayWhenReady(false);
            exoPlayer.release();
            exoPlayer = null;
        }
    }

    private void init() {
        this.addOnAttachStateChangeListener(new OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {

            }

            @Override
            public void onViewDetachedFromWindow(View v) {
                if(exoPlayer != null){
                    exoPlayer.release();
                    exoPlayer = null;
                }
            }
        });

        this.videoModel = new VideoModel();

        list = new ArrayList<>();
        View view = LayoutInflater.from(mContext).inflate(R.layout.layout_video_list, this, true);
        recycler = view.findViewById(R.id.recycler);
        recycler.setHasFixedSize(true);
        pagerLayoutManager = new PagerLayoutManager(mContext);
        pagerLayoutManager.setItemPrefetchEnabled(true);
        recycler.setLayoutManager(pagerLayoutManager);
        recycler.setEmptyView(view.findViewById(R.id.ll_empty_view));
        pagerLayoutManager.setOnViewPagerListener(new PagerLayoutManager.OnViewPagerListener() {
            @Override
            public void onInitComplete() {
                Log.e(TAG, "onInitComplete mCurrentPosition= " + mCurrentPosition);
                int position = pagerLayoutManager.findFirstVisibleItemPosition();
                if (position != -1) {
                    mCurrentPosition = position;
                }
                int itemCount = adapter.getItemCount();
                if (itemCount - position < DEFAULT_PRELOAD_NUMBER && !isLoadingData && !isEnd) {
                    // 正在加载中, 防止网络太慢或其他情况造成重复请求列表
                    isLoadingData = true;
                    loadMore();
                }
                startPlay(mCurrentPosition);
                mLastStopPosition = -1;
                Log.e(TAG, "onInitComplete mCurrentPosition= " + mCurrentPosition);

            }

            @Override
            public void onPageRelease(boolean isNext, int position) {

                if (mCurrentPosition == position) {
                    mLastStopPosition = position;
                    stopPlay();
                    BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(position);
                    if (holder != null) {
                        holder.getCoverView().setVisibility(VISIBLE);
                    }
                }

            }

            @Override
            public void onPageSelected(int position, boolean b) {
                //重新选中视频不播放，如果该位置被stop过则会重新播放视频
                if (mCurrentPosition == position && mLastStopPosition != position) {
                    return;
                }

                int itemCount = adapter.getItemCount();
                if (itemCount - position < DEFAULT_PRELOAD_NUMBER && !isLoadingData && !isEnd) {
                    // 正在加载中, 防止网络太慢或其他情况造成重复请求列表
                    isLoadingData = true;
                    loadMore();
                }
                if (itemCount == position + 1 && isEnd) {
                    ToastUtils.showToast("已经是最后一个视频了");
                }
                //开始播放选中视频
                startPlay(position);
                mCurrentPosition = position;
            }
        });
    }

    /**
     * 停止视频播放
     */
    private void stopPlay() {
        ViewParent parent = mPlayerViewContainer.getParent();
        if (parent != null && parent instanceof FrameLayout) {
            ((FrameLayout) parent).removeView(mPlayerViewContainer);
        }
//        videoView.pause();
        pausePlay();
    }

    /**
     * 开始播放
     *
     * @param position 播放位置
     */
    private void startPlay(int position) {
        if (position < 0 || position > list.size()) {
            return;
        }
        NewestShowGroundBean.DataBean video = list.get(position);
        //恢复界面状态
        mPlayIcon.setVisibility(View.VISIBLE);
//        isPauseInvoke = false;
        BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(position);
        ViewParent parent = mPlayerViewContainer.getParent();
        if (parent != null && parent instanceof FrameLayout) {
            ((ViewGroup) parent).removeView(mPlayerViewContainer);
        }

        if (holder != null) {
            holder.getContainerView().addView(mPlayerViewContainer, 0);
        }
        List<NewestShowGroundBean.DataBean.ResourceBean> resource = video.getResource();
        String videoUrl = null;
        if (resource != null) {
            for (int j = 0; j < resource.size(); j++) {
                NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                if (resourceBean.getType() == 4) {
                    videoUrl = resourceBean.getBaseUrl();
                    break;
                }
            }
        }

        //DataSource.Factory dataSourceFactory = new DefaultDataSourceFactory(getContext(), Util.getUserAgent(getContext(), "MainApplication"));
         exoPlayer.prepare(buildSource(videoUrl));

    }

    private MediaSource buildSource(String url){
        Uri mp4VideoUri = Uri.parse(url);
        DataSource.Factory dataSourceFactory = new DefaultDataSourceFactory(getContext(), Util.getUserAgent(getContext(), ""));
        MediaSource videoSource =  new ExtractorMediaSource.Factory(dataSourceFactory).createMediaSource(mp4VideoUri);
        return videoSource;
    }

    /**
     * 加载更多
     */
    private void loadMore() {
//        if (onRefreshDataListener != null) {
//            onRefreshDataListener.onLoadMore();
//        }
    }


    /**
     * 加载更多数据
     *
     * @param list
     */
    public void addMoreData(List<NewestShowGroundBean.DataBean> list) {
        if (list == null || list.size() < 5) {
            isEnd = true;
        } else {
            isEnd = false;
        }
        isLoadingData = false;

        if (adapter != null) {
            adapter.addMoreData(list);
        }

    }




    /**
     * 刷新数据
     *
     * @param list 刷新数据
     */
    public void refreshData(List<NewestShowGroundBean.DataBean> list) {
        isEnd = false;
        isLoadingData = false;
        adapter.refreshData(list);
        currentShowNo = list.get(0).getShowNo();
        loadMoreData();
    }


    private void loadMoreData() {
        videoModel.getVideoList(currentShowNo, null, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
            }

            @Override
            public void onSuccess(String result) {
                NewestShowGroundBean newestShowGroundBean = JSON.parseObject(result,NewestShowGroundBean.class);
                addMoreData(newestShowGroundBean.getData());
            }
        });
    }


    /**
     * 刷新数据
     */
    public interface OnRefreshDataListener {

        /**
         * 上拉加载
         */
        void onLoadMore();
    }

    /**
     * 设置adapter
     *
     * @param adapter
     */
    public void setAdapter(BaseVideoListAdapter adapter) {
        this.adapter = adapter;
        recycler.setAdapter(adapter);
        this.list = adapter.getDataList();
    }
}
