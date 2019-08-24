package com.meeruu.sharegoods.rn.showground.widgets.littlevideo;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.net.Uri;
import android.text.TextUtils;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.MappingTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.upstream.DefaultAllocator;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.meeruu.commonlib.callback.BaseCallback;
import com.meeruu.commonlib.config.BaseRequestConfig;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.HttpUrlUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.SPCacheUtils;
import com.meeruu.commonlib.utils.TimeUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.BaseVideoListAdapter;
import com.meeruu.sharegoods.rn.showground.adapter.LittleVideoListAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.OnAttentionPressEvent;
import com.meeruu.sharegoods.rn.showground.event.OnBackPressEvent;
import com.meeruu.sharegoods.rn.showground.event.OnBuyEvent;
import com.meeruu.sharegoods.rn.showground.event.OnCollectionEvent;
import com.meeruu.sharegoods.rn.showground.event.OnPressTagEvent;
import com.meeruu.sharegoods.rn.showground.event.OnSeeUserEvent;
import com.meeruu.sharegoods.rn.showground.event.OnZanPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onDownloadPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onSharePressEvent;
import com.meeruu.sharegoods.rn.showground.model.VideoModel;
import com.meeruu.sharegoods.rn.showground.utils.CacheDataSourceFactory;
import com.meeruu.sharegoods.rn.showground.utils.NetWatchdog;
import com.meeruu.sharegoods.rn.showground.widgets.RnFrameLayout;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.view.View.GONE;

public class VideoListView {
    private static String TAG = VideoListView.class.getSimpleName();
    private Context mContext;
    private RecyclerViewEmptySupport recycler;
    private LittleVideoListAdapter adapter;
    private PagerLayoutManager pagerLayoutManager;
    private RnFrameLayout mPlayerViewContainer;
    private PlayerView videoView;
    private ExoPlayer exoPlayer;
    private VideoModel videoModel;
    public static boolean isLogin;
    public static String userCode;
    private boolean isCollect;
    private boolean isPersonal;
    private String personalCode;
    private String tabType = "0";
    /**
     * 数据是否到达最后一页
     */
    private boolean isEnd;
    private String currentShowNo;
    public static int userImgW = DensityUtils.dip2px(30f);

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
    private ImageView back;
    private SimpleDraweeView userIcon;
    private TextView tvName, tvHotCount, tvAttention;
    private EventDispatcher eventDispatcher;
    private List<String> attentionList = new ArrayList<>();
    private List<String> noAttentionList = new ArrayList<>();

    private GestureDetector gestureDetector;
    private int minBufferMs = DefaultLoadControl.DEFAULT_MIN_BUFFER_MS;
    private int maxBufferMs = DefaultLoadControl.DEFAULT_MAX_BUFFER_MS;
    private int bufferForPlaybackMs = DefaultLoadControl.DEFAULT_BUFFER_FOR_PLAYBACK_MS;
    private int bufferForPlaybackAfterRebufferMs = DefaultLoadControl.DEFAULT_BUFFER_FOR_PLAYBACK_AFTER_REBUFFER_MS;
    private static final String SPKey = "ShowVideoNetWarning";
    /**
     * 网络状态监听器
     */
    private NetWatchdog netWatchdog;
    private ExtractorMediaSource.Factory factory;
    private CacheDataSourceFactory cacheDataSourceFactory;

    public View getVideoListView(ReactContext context) {
        this.mContext = context;
        View view = LayoutInflater.from(mContext).inflate(R.layout.layout_video_list, null, false);
        eventDispatcher = context.getNativeModule(UIManagerModule.class).getEventDispatcher();
        // 网络监听
        initNetWatchDog(view);
        initPlayer(view);
        init(view);
        return view;
    }

    private void initNetWatchDog(View view) {
        netWatchdog = new NetWatchdog(this.mContext);
        netWatchdog.setNetChangeListener(new MyNetConnectedListener(view));
    }

    private void initPlayer(final View view) {
        releasePlayer();
        mPlayerViewContainer = (RnFrameLayout) View.inflate(mContext, R.layout.layout_player_view, null);
        cacheDataSourceFactory = new CacheDataSourceFactory(mContext, 10 * 1024 * 1024,
                100 * 1024 * 1024);
        factory = new ExtractorMediaSource.Factory(cacheDataSourceFactory);
        videoView = mPlayerViewContainer.findViewById(R.id.video_view);
        videoView.setUseController(false);
        TrackSelection.Factory videoTrackSelectionFactory = new AdaptiveTrackSelection.Factory(new DefaultBandwidthMeter());
        MappingTrackSelector trackSelector = new DefaultTrackSelector(videoTrackSelectionFactory);
        DefaultAllocator allocator = new DefaultAllocator(true, C.DEFAULT_BUFFER_SEGMENT_SIZE);
        DefaultLoadControl defaultLoadControl = new DefaultLoadControl(allocator, minBufferMs, maxBufferMs, bufferForPlaybackMs, bufferForPlaybackAfterRebufferMs, -1, true);
        exoPlayer = ExoPlayerFactory.newSimpleInstance(mContext, trackSelector, defaultLoadControl);
        exoPlayer.setRepeatMode(Player.REPEAT_MODE_ONE);
        exoPlayer.addListener(new Player.EventListener() {

            @Override
            public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
                BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(mCurrentPosition);
                if (playWhenReady) {
                    if (holder != null) {
                        holder.getCoverView().setVisibility(GONE);
                        holder.getPlayIcon().setVisibility(GONE);
                    }
                } else {
                    if (holder != null) {
                        holder.getPlayIcon().setVisibility(View.VISIBLE);
                    }
                }
            }
        });
        videoView.setPlayer(exoPlayer);
        gestureDetector = new GestureDetector(mContext, new GestureDetector.SimpleOnGestureListener() {

            @Override
            public boolean onSingleTapConfirmed(MotionEvent e) {
                //判断当前view是否可见，防止退后台、切换页面和单击同时操作导致，退后台时视频又重新开始播放
                if (view.isShown()) {
                    onPauseClick();
                }
                return true;
            }

            @Override
            public boolean onDown(MotionEvent e) {
                return true;
            }
        });

        mPlayerViewContainer.setOnTouchListener((v, event) -> gestureDetector.onTouchEvent(event));

    }

    /**
     * 视频暂停/恢复的时候使用，
     */
    private void onPauseClick() {
        if (isPauseInvoke) {
            resumePlay();
        } else {
            pausePlay();
        }
    }

    /**
     * 恢复播放
     */
    private void resumePlay() {
        if (!NetWatchdog.hasNet(this.mContext)) {
            ToastUtils.showToast("请检测网络连接");
        }

        long date = (long) SPCacheUtils.get(SPKey, 0L);
        if (date == 0 || !TimeUtils.isSameDate(date, System.currentTimeMillis())) {
            if (NetWatchdog.is4GConnected(this.mContext)) {
                showNetWarning(this.mContext);
                return;
            }
        }

        isPauseInvoke = false;
        exoPlayer.setPlayWhenReady(true);
    }

    /**
     * 暂停播放
     */
    public void pausePlay() {
        if (exoPlayer == null) {
            return;
        }
        isPauseInvoke = true;
        if (exoPlayer.getPlayWhenReady()) {
            exoPlayer.setPlayWhenReady(false);
        }
        if (cacheDataSourceFactory != null) {
            cacheDataSourceFactory.realseCache();
        }
    }

    /**
     * 释放资源
     */
    public void releasePlayer() {
        if (exoPlayer != null) {
            exoPlayer.setPlayWhenReady(false);
            exoPlayer.release();
            exoPlayer = null;
        }
        if (cacheDataSourceFactory != null) {
            cacheDataSourceFactory.realseCache();
        }
    }

    private void init(final View view) {
        view.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                netWatchdog.startWatch();
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
                netWatchdog.stopWatch();
                //view销毁释放player
                if (exoPlayer != null) {
                    exoPlayer.release();
                    exoPlayer = null;
                }
            }
        });

        this.videoModel = new VideoModel();

        back = view.findViewById(R.id.back_icon);
        back.setOnClickListener(v -> {
            OnBackPressEvent backPressEvent = new OnBackPressEvent();
            backPressEvent.init(view.getId());
            eventDispatcher.dispatchEvent(backPressEvent);
        });


        userIcon = view.findViewById(R.id.user_icon);
        userIcon.setOnClickListener(v -> {
            pausePlay();
            OnSeeUserEvent seeUserEvent = new OnSeeUserEvent();
            seeUserEvent.init(view.getId());
            NewestShowGroundBean.DataBean dataBean = getCurrentData();
            String jsonStr = JSON.toJSONString(dataBean);
            Map map = JSONObject.parseObject(jsonStr);
            WritableMap realData = Arguments.makeNativeMap(map);
            seeUserEvent.setData(realData);
            eventDispatcher.dispatchEvent(seeUserEvent);
        });

        tvName = view.findViewById(R.id.tv_name);
        tvHotCount = view.findViewById(R.id.tv_hotCount);
        tvAttention = view.findViewById(R.id.tv_attention);
        tvAttention.setOnClickListener(v -> {
            if (isLogin) {
                NewestShowGroundBean.DataBean dataBean = getCurrentData();
                String userNo = dataBean.getUserInfoVO().getUserNo();
                if (dataBean.getAttentionStatus() == 0) {
                    videoModel.attentionUser(userNo, null);
                    dataBean.setAttentionStatus(1);
                    updateAttentions(userNo, true);
                    setAttentionView(true);
                } else {
                    dataBean.setAttentionStatus(0);
                    videoModel.notAttentionUser(userNo, null);
                    updateAttentions(userNo, false);
                    setAttentionView(false);
                }
            } else {
                OnAttentionPressEvent attentionPressEvent = new OnAttentionPressEvent();
                attentionPressEvent.init(view.getId());
                eventDispatcher.dispatchEvent(attentionPressEvent);
            }
        });

        recycler = view.findViewById(R.id.recycler);
        recycler.setHasFixedSize(true);
        pagerLayoutManager = new PagerLayoutManager(mContext);
        pagerLayoutManager.setItemPrefetchEnabled(true);
        recycler.setLayoutManager(pagerLayoutManager);
        recycler.setEmptyView(view.findViewById(R.id.ll_empty_view));
        LittleVideoListAdapter mVideoAdapter = new LittleVideoListAdapter(mContext);
        setAdapter(mVideoAdapter);

        pagerLayoutManager.setOnViewPagerListener(new PagerLayoutManager.OnViewPagerListener() {
            @Override
            public void onInitComplete() {
                int position = pagerLayoutManager.findFirstVisibleItemPosition();
                if (position != -1) {
                    mCurrentPosition = position;
                }
                int itemCount = adapter.getItemCount();
                if (itemCount - position < DEFAULT_PRELOAD_NUMBER && !isLoadingData && !isEnd) {
                    // 正在加载中, 防止网络太慢或其他情况造成重复请求列表
                    isLoadingData = true;
                    loadMoreData();
                }
                startPlay(mCurrentPosition);
                mLastStopPosition = -1;
            }

            @Override
            public void onPageRelease(boolean isNext, int position) {
                isPauseInvoke = true;
                if (exoPlayer.getPlayWhenReady()) {
                    exoPlayer.setPlayWhenReady(false);
                }
                if (mCurrentPosition != position) {
                    BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(position);
                    if (holder != null) {
                        holder.getCoverView().setVisibility(GONE);
                        holder.getPlayIcon().setVisibility(View.VISIBLE);
                    }
                }

            }

            @Override
            public void onPageSelected(int position, boolean b) {
                mCurrentPosition = position;
                //重新选中视频不播放，如果该位置被stop过则会重新播放视频
                if (mLastStopPosition == position) {
                    return;
                }
                mLastStopPosition = position;
                int itemCount = adapter.getItemCount();
                if (itemCount - position < DEFAULT_PRELOAD_NUMBER && !isLoadingData && !isEnd) {
                    // 正在加载中, 防止网络太慢或其他情况造成重复请求列表
                    isLoadingData = true;
                    loadMoreData();
                }
                if (itemCount == position + 1 && isEnd) {
                    ToastUtils.showToast("已经是最后一个视频了");
                }
                //开始播放选中视频
                startPlay(position);
                List<NewestShowGroundBean.DataBean> list = adapter.getDataList();
                NewestShowGroundBean.DataBean bean = list.get(position);
                changeHeader(bean);
            }
        });

        ImageView ivShare = view.findViewById(R.id.iv_share);
        ivShare.setOnClickListener(v -> {
            NewestShowGroundBean.DataBean dataBean = getCurrentData();
            onSharePressEvent onSharePressEvent = new onSharePressEvent();
            onSharePressEvent.init(view.getId());
            String jsonStr = JSON.toJSONString(dataBean);
            Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
            });
            WritableMap realData = Arguments.makeNativeMap(map);
            onSharePressEvent.setData(realData);
            eventDispatcher.dispatchEvent(onSharePressEvent);
        });

        setRecyclerViewItemEvent(view);
    }

    private void setRecyclerViewItemEvent(final View view) {
        adapter.setVideoListCallback(new LittleVideoListAdapter.VideoListCallback() {
            @Override
            public void onDownload(NewestShowGroundBean.DataBean dataBean, int position) {
                download(dataBean, position, view);
            }

            @Override
            public void onCollection(NewestShowGroundBean.DataBean bean, int position) {
                if (bean.isCollect()) {
                    bean.setCollect(false);
                    if (bean.getCollectCount() > 0) {
                        bean.setCollectCount(bean.getCollectCount() - 1);
                    }
                } else {
                    bean.setCollect(true);
                    bean.setCollectCount(bean.getCollectCount() + 1);
                }
                if (eventDispatcher != null) {
                    OnCollectionEvent buyEvent = new OnCollectionEvent();
                    buyEvent.init(view.getId());
                    String jsonStr = JSON.toJSONString(bean);
                    Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                    });
                    WritableMap realData = Arguments.makeNativeMap(map);
                    buyEvent.setData(realData);
                    eventDispatcher.dispatchEvent(buyEvent);
                }
                List list = adapter.getDataList();
                list.set(position, bean);
                adapter.notifyItemChanged(position, 1);

            }

            @Override
            public void onLike(NewestShowGroundBean.DataBean dataBean, int position) {
                like(dataBean, position, view);
            }

            @Override
            public void onTag(NewestShowGroundBean.DataBean.ShowTagsBean tagsBean, int position) {
                pausePlay();
                OnPressTagEvent pressTagEvent = new OnPressTagEvent();
                pressTagEvent.init(view.getId());
                String jsonStr = JSON.toJSONString(tagsBean);
                Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                });
                WritableMap realData = Arguments.makeNativeMap(map);
                pressTagEvent.setData(realData);
                eventDispatcher.dispatchEvent(pressTagEvent);
            }

            @Override
            public void onBuy(NewestShowGroundBean.DataBean dataBean, int position) {
                OnBuyEvent buyEvent = new OnBuyEvent();
                buyEvent.init(view.getId());
                String jsonStr = JSON.toJSONString(dataBean);
                Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                });
                WritableMap realData = Arguments.makeNativeMap(map);
                buyEvent.setData(realData);
                eventDispatcher.dispatchEvent(buyEvent);
            }
        });
    }

    private void collection(NewestShowGroundBean.DataBean bean, final int position, View view) {
        if (bean.isCollect()) {
            bean.setCollect(false);
            if (bean.getCollectCount() > 0) {
                bean.setCollectCount(bean.getCollectCount() - 1);
            }
        } else {
            bean.setCollect(true);
            bean.setCollectCount(bean.getCollectCount() + 1);
        }
        if (eventDispatcher != null) {
//            OnCollectionEvent onCollectionEvent = new OnCollectionEvent();
//            onCollectionEvent.init(view.getId());
//            String jsonStr = JSON.toJSONString(bean);
//            Map map = JSONObject.parseObject(jsonStr);
//            WritableMap realData = Arguments.makeNativeMap(map);
//            onCollectionEvent.setData(realData);
//            eventDispatcher.dispatchEvent(onCollectionEvent);
            OnCollectionEvent buyEvent = new OnCollectionEvent();
            buyEvent.init(view.getId());
            String jsonStr = JSON.toJSONString(bean);
            Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
            });
            WritableMap realData = Arguments.makeNativeMap(map);
            buyEvent.setData(realData);
            eventDispatcher.dispatchEvent(buyEvent);
        }
        List list = adapter.getDataList();
        list.set(position, bean);
        adapter.notifyItemChanged(position, 1);
    }

    private void download(NewestShowGroundBean.DataBean bean, final int position, View view) {
        if (isLogin) {
            bean.setDownloadCount(bean.getDownloadCount() + 1);
            List list = adapter.getDataList();
            list.set(position, bean);
            adapter.notifyItemChanged(position, 1);
        }
        onDownloadPressEvent onDownloadPressEvent = new onDownloadPressEvent();
        onDownloadPressEvent.init(view.getId());
        String jsonStr = JSON.toJSONString(bean);
        Map map = JSONObject.parseObject(jsonStr);
        WritableMap realData = Arguments.makeNativeMap(map);
        onDownloadPressEvent.setData(realData);
        eventDispatcher.dispatchEvent(onDownloadPressEvent);
    }

    private void like(NewestShowGroundBean.DataBean bean, final int position, View view) {
        if (bean.isLike()) {
            bean.setLike(false);
            if (bean.getLikesCount() > 0) {
                bean.setLikesCount(bean.getLikesCount() - 1);
            }
        } else {
            bean.setLike(true);
            bean.setLikesCount(bean.getLikesCount() + 1);
        }
        if (eventDispatcher != null) {
            OnZanPressEvent onZanPressEvent = new OnZanPressEvent();
            onZanPressEvent.init(view.getId());
            String jsonStr = JSON.toJSONString(bean);
            Map map = JSONObject.parseObject(jsonStr);
            WritableMap realData = Arguments.makeNativeMap(map);
            onZanPressEvent.setData(realData);
            eventDispatcher.dispatchEvent(onZanPressEvent);
        }
        List list = adapter.getDataList();
        list.set(position, bean);
        adapter.notifyItemChanged(position, 1);
    }

    //i == true 表示已关注
    private void setAttentionView(boolean i) {
        if (i) {
            tvAttention.setText("已关注");
            tvAttention.setTextColor(Color.parseColor("#FF9502"));
            tvAttention.setBackgroundResource(R.drawable.has_attention_background);
        } else {
            tvAttention.setText("关注");
            tvAttention.setTextColor(Color.parseColor("#FFFFFF"));
            tvAttention.setBackgroundResource(R.drawable.attention_background);
        }
    }

    /**
     * @param usercode
     * @param add      true表示添加，反之移除
     */
    private void updateAttentions(String usercode, boolean add) {
        if (add) {
            if (!attentionList.contains(usercode)) {
                attentionList.add(usercode);
            }
            if (!noAttentionList.contains(usercode)) {
                noAttentionList.remove(usercode);
            }
        } else {
            if (!attentionList.contains(usercode)) {
                attentionList.remove(usercode);
            }
            if (!noAttentionList.contains(usercode)) {
                noAttentionList.add(usercode);
            }
        }
    }


    private void changeHeader(final NewestShowGroundBean.DataBean bean) {

        final NewestShowGroundBean.DataBean.UserInfoVOBean userInfoVOBean = bean.getUserInfoVO();
        incrHotValue(bean.getShowNo());

        String userUrl = userInfoVOBean.getUserImg();
        if (TextUtils.isEmpty(userUrl)) {
            ImageLoadUtils.loadImageResAsCircle(mContext, R.drawable.bg_app_user, userIcon);
        } else {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon, userImgW, userImgW);
        }
        tvName.setText(userInfoVOBean.getUserName());
        tvHotCount.setText(bean.getHotCount() + "人气值");

        if (TextUtils.equals(userInfoVOBean.getUserNo(), userCode)) {
            tvAttention.setVisibility(View.INVISIBLE);
        } else {
            tvAttention.setVisibility(View.VISIBLE);
        }

        if (bean.getAttentionStatus() == 0 && !attentionList.contains(bean.getUserInfoVO().getUserNo())) {
            setAttentionView(false);
        } else if (bean.getAttentionStatus() != 0 && noAttentionList.contains(bean.getUserInfoVO().getUserNo())) {
            setAttentionView(false);
        } else {
            setAttentionView(true);
        }
    }

    /**
     * 停止视频播放
     */
    private void stopPlay() {
        ViewParent parent = mPlayerViewContainer.getParent();
        if (parent != null && parent instanceof FrameLayout) {
            ((FrameLayout) parent).removeView(mPlayerViewContainer);
        }
        pausePlay();
    }

    /**
     * 开始播放
     *
     * @param position 播放位置
     */
    private void startPlay(int position) {
        List<NewestShowGroundBean.DataBean> list = adapter.getDataList();
        if (position < 0 || position > list.size()) {
            return;
        }
        final NewestShowGroundBean.DataBean video = list.get(position);
        //恢复界面状态
//        isPauseInvoke = false;
        BaseVideoListAdapter.BaseHolder holder = (BaseVideoListAdapter.BaseHolder) recycler.findViewHolderForLayoutPosition(position);
        holder.getPlayIcon().setVisibility(View.VISIBLE);
        holder.getCoverView().setVisibility(View.VISIBLE);
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
        exoPlayer.prepare(buildSource(videoUrl));
    }

    private MediaSource buildSource(String url) {
        Uri mp4VideoUri = Uri.parse(url);
        String fileName = url.substring(url.lastIndexOf("/"), url.lastIndexOf("."));
        cacheDataSourceFactory.setFileName(fileName);
        return factory.createMediaSource(mp4VideoUri);

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
    public void refreshData(List<NewestShowGroundBean.DataBean> list, boolean isPersonal, boolean isCollect, String tabType) {
        isEnd = false;
        isLoadingData = false;
        adapter.refreshData(list);
        NewestShowGroundBean.DataBean dataBean = list.get(0);
        currentShowNo = dataBean.getShowNo();
        this.isPersonal = isPersonal;
        this.isCollect = isCollect;
        this.tabType = tabType;
        if (this.isPersonal) {
            this.personalCode = dataBean.getUserInfoVO().getUserNo();
        }
        loadMoreData();
        changeHeader(dataBean);
    }

    public void setLogin(boolean login) {
        isLogin = login;
    }

    public void setUserCode(String code) {
        userCode = code;
    }

    private void loadMoreData() {
        videoModel.getVideoList(currentShowNo, personalCode, isCollect, tabType, new BaseCallback<String>() {
            @Override
            public void onErr(String errCode, String msg) {
            }

            @Override
            public void onSuccess(String result) {
                NewestShowGroundBean newestShowGroundBean = JSON.parseObject(result, NewestShowGroundBean.class);
                List<NewestShowGroundBean.DataBean> list = newestShowGroundBean.getData();
                if (list != null && list.size() > 0) {
                    addMoreData(list);
                    NewestShowGroundBean.DataBean last = list.get(list.size() - 1);
                    currentShowNo = last.getShowNo();
                } else {
                    isEnd = true;
                }
            }
        });
    }

    /**
     * 设置adapter
     *
     * @param adapter
     */
    public void setAdapter(LittleVideoListAdapter adapter) {
        this.adapter = adapter;
        recycler.setAdapter(adapter);
    }

    private NewestShowGroundBean.DataBean getCurrentData() {
        if (adapter != null) {
            List<NewestShowGroundBean.DataBean> list = adapter.getDataList();
            NewestShowGroundBean.DataBean item = list.get(mCurrentPosition);
            return item;
        }
        return null;
    }

    private static void showNetWarning(Context context) {
        //添加取消
        AlertDialog alertDialog = new AlertDialog.Builder(context).setTitle("温馨提示").setMessage("您当前处于2G/3G/4G环境\n继续播放将使用流量").setPositiveButton("确定", new DialogInterface.OnClickListener() {//添加"Yes"按钮
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                long time = System.currentTimeMillis();
                SPCacheUtils.put(SPKey, time);
            }
        })

                .setNegativeButton("取消", (dialogInterface, i) -> {
                }).create();
        alertDialog.show();
    }


    /**
     * 网络断开重连监听
     */
    private static class MyNetConnectedListener implements NetWatchdog.NetChangeListener {
        private WeakReference<View> weakReference;

        MyNetConnectedListener(View view) {
            weakReference = new WeakReference<>(view);
        }

        @Override
        public void onWifiTo4G() {
            View view = weakReference.get();
            if (view != null && view.isShown()) {
                long date = (long) SPCacheUtils.get(SPKey, 0L);
                if (date == 0 || !TimeUtils.isSameDate(date, System.currentTimeMillis())) {
                    showNetWarning(view.getContext());
                }

            }
        }

        @Override
        public void on4GToWifi() {

        }

        @Override
        public void onNetDisconnected() {

        }
    }


    private static void incrHotValue(String showNo) {
        IncrHotValueConfig incrHotValueConfig = new IncrHotValueConfig();
        incrHotValueConfig.setParams(showNo);
        RequestManager.getInstance().doPost(incrHotValueConfig, null);
    }


    private static class IncrHotValueConfig implements BaseRequestConfig {
        private String showNo;

        @Override
        public String getUrl() {
            return HttpUrlUtils.getUrl(HttpUrlUtils.INCR_COUNT_BY_TYPE);
        }

        public void setParams(String params) {
            showNo = params;
        }

        @Override
        public Map getParams() {
            HashMap map = new HashMap();
            map.put("showNo", showNo);
            map.put("type", 6 + "");
            return map;
        }
    }
}
