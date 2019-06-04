package com.meeruu.sharegoods.rn.showground;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.listener.OnItemChildClickListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ProductsAdapter;
import com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.event.addCartEvent;
import com.meeruu.sharegoods.rn.showground.event.onDownloadPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onNineClickEvent;
import com.meeruu.sharegoods.rn.showground.event.onPressProductEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollStateChangedEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollYEvent;
import com.meeruu.sharegoods.rn.showground.event.onSharePressEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onZanPressEvent;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowRecommendView implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private RnRecyclerView recyclerView;
    private ShowRecommendAdapter adapter;
    private EventDispatcher eventDispatcher;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;
    private onZanPressEvent onZanPressEvent;
    private onSharePressEvent onSharePressEvent;
    private onDownloadPressEvent onDownloadPressEvent;
    private onScrollYEvent onScrollYEvent;
    private ShowgroundPresenter presenter;
    private WeakReference<View> showgroundView;
    private onStartRefreshEvent startRefreshEvent;
    private onItemPressEvent itemPressEvent;
    private SwipeRefreshLayout swipeRefreshLayout;
    private Handler handler;
    private View errView;
    private View errImg;

    private int page = 1;

    public ViewGroup getShowRecommendView(ReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();

        return (ViewGroup) view;
    }

    public void initView(Context context, final View view) {
        handler = new Handler();
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
        showgroundView = new WeakReference<>(view);
        startRefreshEvent = new onStartRefreshEvent();
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                swipeRefreshLayout.setRefreshing(true);
                onRefresh();
            }
        }, 200);
        final onNineClickEvent onNineClickEvent = new onNineClickEvent();
        final addCartEvent addCartEvent = new addCartEvent();
        recyclerView = view.findViewById(R.id.home_recycler_view);
        startScrollEvent = new onStartScrollEvent();
        endScrollEvent = new onEndScrollEvent();
        itemPressEvent = new onItemPressEvent();
        onZanPressEvent = new onZanPressEvent();
        onDownloadPressEvent = new onDownloadPressEvent();
        onSharePressEvent = new onSharePressEvent();
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
//                public static final int SCROLL_STATE_IDLE = 0;
//                public static final int SCROLL_STATE_DRAGGING = 1;
//                public static final int SCROLL_STATE_SETTLING = 2;
                super.onScrollStateChanged(recyclerView, newState);
                final onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
                onScrollStateChangedEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putInt("state", newState);
                onScrollStateChangedEvent.setData(map);
                eventDispatcher.dispatchEvent(onScrollStateChangedEvent);

                switch (newState) {
                    case RecyclerView.SCROLL_STATE_IDLE:
                        endScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(endScrollEvent);
                        break;
                    case RecyclerView.SCROLL_STATE_DRAGGING:
                        startScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(startScrollEvent);
                        break;
                    default:
                        break;
                }
            }
        });
        ProductsAdapter.AddCartListener addCartListener = new ProductsAdapter.AddCartListener() {
            @Override
            public void onAddCart(String code) {
                addCartEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putString("prodCode", code);
                addCartEvent.setData(map);
                eventDispatcher.dispatchEvent(addCartEvent);
            }
        };

        ProductsAdapter.PressProductListener pressProductListener = new ProductsAdapter.PressProductListener() {
            @Override
            public void onPressProduct(String code) {
                onPressProductEvent onPressProductEvent = new onPressProductEvent();
                onPressProductEvent.init(view.getId());
                WritableMap writableMap = Arguments.createMap();
                writableMap.putString("prodCode", code);
                onPressProductEvent.setData(writableMap);
                eventDispatcher.dispatchEvent(onPressProductEvent);
            }
        };

        NineGridView.clickL clickL = new NineGridView.clickL() {
            @Override
            public void imageClick(List urls, int index) {
                onNineClickEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                WritableArray array = Arguments.makeNativeArray(urls);
                map.putArray("imageUrls", array);
                map.putInt("index", index);
                onNineClickEvent.setData(map);
                eventDispatcher.dispatchEvent(onNineClickEvent);
            }
        };

        adapter = new ShowRecommendAdapter(clickL, addCartListener, pressProductListener);
        View emptyView=LayoutInflater.from(context).inflate(R.layout.show_empty_view, null);
        emptyView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));


        adapter.setEmptyView(emptyView);
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        LinearLayoutManager layoutManager = new LinearLayoutManager(context);
        recyclerView.setLayoutManager(layoutManager);
        ((SimpleItemAnimator) recyclerView.getItemAnimator())
                .setSupportsChangeAnimations(false);
        adapter.setEnableLoadMore(true);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                page++;
                presenter.getShowList(page);
            }
        }, recyclerView);
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
        adapter.setLoadMoreView(new CustomLoadMoreView());
        setRecyclerViewItemEvent(view);
        adapter.setHasStableIds(true);
        adapter.setHeaderAndEmpty(false);
        recyclerView.setAdapter(adapter);
        ((DefaultItemAnimator) recyclerView.getItemAnimator()).setSupportsChangeAnimations(false);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                if (eventDispatcher != null) {
                    LinearLayoutManager manager = (LinearLayoutManager) recyclerView.getLayoutManager();
                    int position = manager.findFirstVisibleItemPosition();
                    View firstView = manager.findViewByPosition(position);
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

        });
    }


    private void setRecyclerViewItemEvent(final View view) {
        recyclerView.addOnItemTouchListener(new OnItemChildClickListener() {
            @Override
            public void onSimpleItemChildClick(final BaseQuickAdapter adapter, View itemview, final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                final NewestShowGroundBean.DataBean bean = data.get(position);
                int id = itemview.getId();
                switch (id) {
                    case R.id.icon_hand: {
                        recyclerView.postDelayed(new Runnable() {
                            @Override
                            public void run() {
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
                                    onZanPressEvent.init(view.getId());
                                    String jsonStr = JSON.toJSONString(bean);
                                    Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                                    });
                                    Map result = new HashMap();
                                    result.put("index", position);
                                    result.put("detail", map);
                                    WritableMap realData = Arguments.makeNativeMap(result);
                                    onZanPressEvent.setData(realData);
                                    eventDispatcher.dispatchEvent(onZanPressEvent);
                                }
                                data.set(position, bean);
                                adapter.replaceData(data);
                            }
                        }, 200);
                    }
                    break;
                    case R.id.icon_download: {
                        UiThreadUtil.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                onDownloadPressEvent.init(view.getId());
                                String jsonStr = JSON.toJSONString(bean);
                                Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                                });
                                Map result = new HashMap();
                                result.put("index", position);
                                result.put("detail", map);
                                WritableMap realData = Arguments.makeNativeMap(result);
                                onDownloadPressEvent.setData(realData);
                                eventDispatcher.dispatchEvent(onDownloadPressEvent);
                            }
                        });

                    }
                    break;
                    case R.id.icon_share: {
                        onSharePressEvent.init(view.getId());
                        String jsonStr = JSON.toJSONString(bean);
                        Map map = JSONObject.parseObject(jsonStr, new TypeReference<Map>() {
                        });
                        Map result = new HashMap();
                        result.put("index", position);
                        result.put("detail", map);
                        WritableMap realData = Arguments.makeNativeMap(result);
                        onSharePressEvent.setData(realData);
                        eventDispatcher.dispatchEvent(onSharePressEvent);
                    }
                    break;
                    default:
                        break;
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
            adapter.addData(resolveData(data));
        }
    }

    @Override
    public void addDataToTop(String s) {

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

//                    adapter.setData(index,bean);
                }
            }, 200);
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(resolveData(data));
            swipeRefreshLayout.setRefreshing(false);
        }
    }

    private List resolveData (List data){
        if(data != null){
            for(int i = 0;i<data.size();i++){
                NewestShowGroundBean.DataBean bean = (NewestShowGroundBean.DataBean)data.get(i);
                if(bean.getItemType() == 1){
                    List<NewestShowGroundBean.DataBean.ResourceBean> resource = bean.getResource();
                    List<ImageInfo> resolveResource = new ArrayList<>();
                    if(resource != null){
                        for(int j = 0;j<resource.size();j++){
                            NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                            if(resourceBean.getType() == 2){
                                ImageInfo imageInfo = new ImageInfo();
                                imageInfo.setImageUrl(resourceBean.getUrl());
                                resolveResource.add(imageInfo);
                            }
                        }
                        bean.setNineImageInfos(resolveResource);
                    }
                    data.set(i,bean);
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

    }

    public void scrollIndex(int index) {
        if (recyclerView != null) {
            recyclerView.smoothScrollToPosition(index);
        }
    }

    @Override
    public void loadMoreComplete() {
        showList();
        adapter.loadMoreComplete();
    }

    public void addHeader(View view) {
        adapter.setHeaderView(view);
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

    public void refresh() {
        recyclerView.invalidate();
    }
}
