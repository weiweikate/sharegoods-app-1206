package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ShowGroundAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollStateChangedEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollYEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowGroundView implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private int page = 1;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private ShowGroundAdapter adapter;
    private ShowgroundPresenter presenter;
    private EventDispatcher eventDispatcher;
    private onItemPressEvent itemPressEvent;
    private onScrollYEvent onScrollYEvent;
    private onStartRefreshEvent startRefreshEvent;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;
    private View errView;
    private WeakReference<View> showgroundView;
    private Handler handler;
    private View errImg;

    public ViewGroup getShowGroundView(ReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();

        return (ViewGroup) view;
    }

    private void initView(Context context, final View view) {
        handler = new Handler();
        showgroundView = new WeakReference<>(view);
        errView = view.findViewById(R.id.err_view);
        errImg = view.findViewById(R.id.errImg);
        errImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                swipeRefreshLayout.setVisibility(View.VISIBLE);
                errView.setVisibility(View.INVISIBLE);
                swipeRefreshLayout.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        swipeRefreshLayout.setRefreshing(true);
                        onRefresh();
                    }
                }, 200);
            }
        });

        errView.setVisibility(View.INVISIBLE);
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        recyclerView = view.findViewById(R.id.home_recycler_view);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                swipeRefreshLayout.setRefreshing(true);
                onRefresh();
            }
        }, 200);
        itemPressEvent = new onItemPressEvent();
        startRefreshEvent = new onStartRefreshEvent();
        startScrollEvent = new onStartScrollEvent();
        onScrollYEvent = new onScrollYEvent();
        endScrollEvent = new onEndScrollEvent();
        adapter = new ShowGroundAdapter();
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        final StaggeredGridLayoutManager layoutManager = new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                switch (newState) {
                    case RecyclerView.SCROLL_STATE_IDLE:
                        endScrollEvent = new onEndScrollEvent();
                        endScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(endScrollEvent);
                        break;
                    case RecyclerView.SCROLL_STATE_DRAGGING:
                        startScrollEvent = new onStartScrollEvent();
                        startScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(startScrollEvent);
                        break;
                    default:
                        break;
                }

            }
        });
        adapter.setEnableLoadMore(true);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                page++;
                presenter.getShowList(page);
            }
        }, recyclerView);
        adapter.setLoadMoreView(new CustomLoadMoreView());
        adapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(final BaseQuickAdapter adapter, View view1, final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                if (data != null) {
                    NewestShowGroundBean.DataBean item = data.get(position);
                    String json = JSONObject.toJSONString(item);
                    Map map = JSONObject.parseObject(json, new TypeReference<Map>() {
                    });
                    map.put("index", position);
                    WritableMap realData = Arguments.makeNativeMap(map);
                    if (eventDispatcher != null) {
                        itemPressEvent = new onItemPressEvent();
                        itemPressEvent.init(view.getId());
                        itemPressEvent.setData(realData);
                        eventDispatcher.dispatchEvent(itemPressEvent);
                    }
                }
            }
        });
        recyclerView.addItemDecoration(new SpaceItemDecoration(15));
        recyclerView.setAdapter(adapter);
        ((SimpleItemAnimator) recyclerView.getItemAnimator()).setSupportsChangeAnimations(false);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                if (eventDispatcher != null) {
                    StaggeredGridLayoutManager manager = (StaggeredGridLayoutManager) recyclerView.getLayoutManager();
                    int position = manager.findFirstVisibleItemPositions(null)[0];
                    View firstView = manager.findViewByPosition(position);
                    int itemHeight = firstView.getHeight();
                    int flag = (position) * itemHeight - firstView.getTop();
                    onScrollYEvent = new onScrollYEvent();
                    onScrollYEvent.init(view.getId());
                    WritableMap ymap = Arguments.createMap();
                    ymap.putInt("YDistance",  DensityUtils.px2dip(flag));
                    onScrollYEvent.setData(ymap);
                    eventDispatcher.dispatchEvent(onScrollYEvent);
                }
            }

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                if (eventDispatcher != null) {
                    onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
                    onScrollStateChangedEvent.init(view.getId());
                    WritableMap map = Arguments.createMap();
                    map.putInt("state", newState);
                    onScrollStateChangedEvent.setData(map);
                    eventDispatcher.dispatchEvent(onScrollStateChangedEvent);
                }
                StaggeredGridLayoutManager layoutManager = (StaggeredGridLayoutManager) recyclerView.getLayoutManager();
                int[] first = new int[2];
                layoutManager.findFirstCompletelyVisibleItemPositions(first);
                if (newState == RecyclerView.SCROLL_STATE_IDLE && (first[0] == 1 || first[1] == 1)) {
                    layoutManager.invalidateSpanAssignments();
                }
            }
        });
    }

    private void initData() {
        presenter = new ShowgroundPresenter(this);
    }

    @Override
    public void onRefresh() {
        if (eventDispatcher != null) {
            View view = showgroundView.get();
            if (view != null) {
                startRefreshEvent = new onStartRefreshEvent();
                startRefreshEvent.init(view.getId());
                eventDispatcher.dispatchEvent(startRefreshEvent);
            }
        }
        adapter.setEnableLoadMore(false);
        page = 1;
        presenter.getShowList(page);
    }

    @Override
    public void loadMoreFail(final String code) {
        swipeRefreshLayout.setRefreshing(false);
        if (adapter != null) {
            adapter.loadMoreFail();
        }

        handler.post(new Runnable() {
            @Override
            public void run() {
                if (TextUtils.equals(code, "9999") && page == 1) {
                    errView.setVisibility(View.VISIBLE);
                    swipeRefreshLayout.setVisibility(View.INVISIBLE);
                } else {
                    errView.setVisibility(View.INVISIBLE);
                    swipeRefreshLayout.setVisibility(View.VISIBLE);
                }
            }
        });
    }

    @Override
    public void viewLoadMore(final List data) {
        showList();
        if (data != null) {
            adapter.addData(data);
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(data);
            swipeRefreshLayout.setRefreshing(false);
        }
    }

    @Override
    public void loadMoreEnd() {
        showList();
        if (adapter != null) {
            adapter.loadMoreEnd();
        }
    }

    @Override
    public void repelaceData(final int index, final int clickNum) {
        if (adapter != null) {
            final List<NewestShowGroundBean.DataBean> data = adapter.getData();

            recyclerView.postDelayed(new Runnable() {
                @Override
                public void run() {
                    NewestShowGroundBean.DataBean bean = data.get(index);
                    bean.setHotCount(clickNum);
                    adapter.replaceData(data);

                }
            }, 200);
        }
    }

    @Override
    public void addDataToTop(final String value) {
        if (adapter != null && !TextUtils.isEmpty(value)) {
            final List<NewestShowGroundBean.DataBean> data = adapter.getData();
            recyclerView.postDelayed(new Runnable() {
                @Override
                public void run() {
                    NewestShowGroundBean.DataBean bean = JSON.parseObject(value, NewestShowGroundBean.DataBean.class);
                    data.add(0, bean);
                    adapter.replaceData(data);
                    recyclerView.scrollToPosition(0);
                }
            }, 200);
        }
    }

    @Override
    public void repelaceItemData(final int index, final String value) {
        if (adapter != null && !TextUtils.isEmpty(value)) {
            final List<NewestShowGroundBean.DataBean> data = adapter.getData();
            recyclerView.postDelayed(new Runnable() {
                @Override
                public void run() {
                    NewestShowGroundBean.DataBean bean = JSON.parseObject(value, NewestShowGroundBean.DataBean.class);
                    data.set(index, bean);
                    adapter.replaceData(data);
                }
            }, 200);
        }
    }

    public void scrollIndex(int index){
        if(recyclerView != null){
            recyclerView.smoothScrollToPosition(index);
        }
    }

    @Override
    public void loadMoreComplete() {
        showList();
        adapter.loadMoreComplete();
    }

    public void addHeader(View view) {
        int i = adapter.getHeaderLayoutCount();
        if (i != 0) {
            adapter.removeAllHeaderView();
        }
        adapter.addHeaderView(view);
        recyclerView.scrollToPosition(0);
    }

    public void setParams(HashMap map) {
        if (presenter != null) {
            presenter.setParams(map);
        }
    }

    private void showList() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                errView.setVisibility(View.INVISIBLE);
                swipeRefreshLayout.setVisibility(View.VISIBLE);
            }
        });
    }
}
