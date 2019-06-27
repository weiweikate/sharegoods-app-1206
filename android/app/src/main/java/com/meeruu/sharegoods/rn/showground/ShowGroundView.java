package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

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
import com.meeruu.commonlib.utils.ImageLoadUtils;
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
import com.meeruu.sharegoods.rn.showground.widgets.GridView.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowGroundView implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private int page = 1;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private StaggeredGridLayoutManager layoutManager;
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
    private boolean sIsScrolling;

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
        layoutManager = new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        View emptyView = LayoutInflater.from(context).inflate(R.layout.show_empty_view, null);
        emptyView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        adapter.setEmptyView(emptyView);
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
        recyclerView.addItemDecoration(new SpaceItemDecoration(10));
        recyclerView.setAdapter(adapter);
        ((SimpleItemAnimator) recyclerView.getItemAnimator()).setSupportsChangeAnimations(false);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                if (eventDispatcher != null) {
                    int position = layoutManager.findFirstVisibleItemPositions(null)[0];
                    View firstView = layoutManager.findViewByPosition(position);
                    if (firstView == null) {
                        return;
                    }
                    int itemHeight = firstView.getHeight();
                    int flag = (position) * itemHeight - firstView.getTop();
                    onScrollYEvent = new onScrollYEvent();
                    onScrollYEvent.init(view.getId());
                    WritableMap ymap = Arguments.createMap();
                    ymap.putInt("YDistance", DensityUtils.px2dip(flag));
                    onScrollYEvent.setData(ymap);
                    eventDispatcher.dispatchEvent(onScrollYEvent);
                }
            }

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
                if (newState == RecyclerView.SCROLL_STATE_DRAGGING || newState == RecyclerView.SCROLL_STATE_SETTLING) {
                    sIsScrolling = true;
                    ImageLoadUtils.pauseLoadImage();
                } else if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    if (sIsScrolling == true) {
                        ImageLoadUtils.resumeLoadImage();
                    }
                    sIsScrolling = false;
                }
                if (eventDispatcher != null) {
                    onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
                    onScrollStateChangedEvent.init(view.getId());
                    WritableMap map = Arguments.createMap();
                    map.putInt("state", newState);
                    onScrollStateChangedEvent.setData(map);
                    eventDispatcher.dispatchEvent(onScrollStateChangedEvent);
                }
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

    private void setEmptyText() {
        if (adapter == null) {
            return;
        }
        List list = adapter.getData();
        if (list == null || list.size() == 0) {
            View view = adapter.getEmptyView();
            TextView textView = view.findViewById(R.id.empty_tv);
            textView.setText("暂无数据");
        }
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
            setEmptyText();
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
            adapter.addData(resolveData(data));
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(resolveData(data));
            swipeRefreshLayout.setRefreshing(false);
            setEmptyText();
        }
    }

    private List resolveData(List data) {
        if (data != null) {
            for (int i = 0; i < data.size(); i++) {
                NewestShowGroundBean.DataBean bean = (NewestShowGroundBean.DataBean) data.get(i);
                if (bean.getItemType() == 1 || bean.getItemType() == 3) {
                    List<NewestShowGroundBean.DataBean.ResourceBean> resource = bean.getResource();
                    List<ImageInfo> resolveResource = new ArrayList<>();
                    if (resource != null) {
                        for (int j = 0; j < resource.size(); j++) {
                            NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                            if (resourceBean.getType() == 2) {
                                ImageInfo imageInfo = new ImageInfo();
                                imageInfo.setImageUrl(resourceBean.getUrl());
                                resolveResource.add(imageInfo);
                            }

                            if(resourceBean.getType() == 5){
                                ImageInfo imageInfo = new ImageInfo();
                                imageInfo.setImageUrl(resourceBean.getUrl());
                                bean.setVideoCover(imageInfo);
                                break;
                            }
                        }
                        bean.setNineImageInfos(resolveResource);
                    }
                    data.set(i, bean);
                }
            }
        }
        return data;
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

    public void scrollIndex(int index) {
        if (recyclerView != null) {
            recyclerView.scrollToPosition(0);
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

    @Override
    public void deleteSuccess() {

    }

    @Override
    public void deleteFail(String err) {

    }
}
