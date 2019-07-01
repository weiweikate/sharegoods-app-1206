package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.listener.OnItemChildClickListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.tool.FastScrollLinearLayoutManager;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ProductsAdapter;
import com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
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
    private WeakHandler mHandler;
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
        errView = view.findViewById(R.id.err_view);
        errImg = view.findViewById(R.id.errImg);
        errImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                swipeRefreshLayout.setVisibility(View.VISIBLE);
                errView.setVisibility(View.INVISIBLE);
                onRefresh();
            }
        });

        errView.setVisibility(View.INVISIBLE);
        showgroundView = new WeakReference<>(view);
        startRefreshEvent = new onStartRefreshEvent();
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        swipeRefreshLayout.setOnRefreshListener(this);
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
            public void onAddCart(String product, String detail) {
                addCartEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putString("product", product);
                map.putString("detail", detail);
                addCartEvent.setData(map);
                eventDispatcher.dispatchEvent(addCartEvent);
            }
        };

        ProductsAdapter.PressProductListener pressProductListener = new ProductsAdapter.PressProductListener() {
            @Override
            public void onPressProduct(String product, String detail) {
                onPressProductEvent onPressProductEvent = new onPressProductEvent();
                onPressProductEvent.init(view.getId());
                WritableMap writableMap = Arguments.createMap();
                writableMap.putString("product", product);
                writableMap.putString("detail", detail);
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
        View emptyView = LayoutInflater.from(recyclerView.getContext()).inflate(R.layout.show_empty_view, null);
        emptyView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        adapter.setEmptyView(emptyView);
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        FastScrollLinearLayoutManager layoutManager = new FastScrollLinearLayoutManager(context);
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
                toDetail(position, view);
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

    private void toDetail(int position, View view) {
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

    private void setRecyclerViewItemEvent(final View view) {
        recyclerView.addOnItemTouchListener(new OnItemChildClickListener() {
            @Override
            public void onSimpleItemChildClick(final BaseQuickAdapter adapter, View itemview, final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                final NewestShowGroundBean.DataBean bean = data.get(position);
                int id = itemview.getId();
                switch (id) {
                    case R.id.icon_hand:
                        delayHandle(bean, view, position, data);
                        break;
                    case R.id.icon_download:
                        delayDownload(view, position, bean);
                        break;
                    case R.id.icon_share:
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
                        break;
                    case R.id.content:
                        toDetail(position, view);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    private void initData() {
        presenter = new ShowgroundPresenter(this);
        if (mHandler == null) {
            mHandler = new WeakHandler(new Handler.Callback() {
                @Override
                public boolean handleMessage(Message msg) {
                    switch (msg.what) {
                        case ParameterUtils.REQUEST_DELAY:
                            page = 1;
                            presenter.getShowList(page);
                            break;
                        case ParameterUtils.SHOW_REPLACE_DELAY:
                            final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                            NewestShowGroundBean.DataBean bean = JSON.parseObject((String) msg.obj, NewestShowGroundBean.DataBean.class);
                            data.set(msg.arg1, bean);
                            adapter.replaceData(data);
                            break;
                        default:
                            break;
                    }
                    return false;
                }
            });
        }
        onRefresh();
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
        swipeRefreshLayout.setRefreshing(true);
        mHandler.sendEmptyMessageDelayed(ParameterUtils.REQUEST_DELAY, 200);
    }

    private void delayHandle(NewestShowGroundBean.DataBean bean, View view, int position,
                             List<NewestShowGroundBean.DataBean> data) {
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


    private void delayDownload(View view, int position, NewestShowGroundBean.DataBean bean) {
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

    @Override
    public void loadMoreFail(final String code) {
        swipeRefreshLayout.setRefreshing(false);
        if (adapter != null) {
            adapter.loadMoreFail();
            setEmptyText();
        }
        if (TextUtils.equals(code, "9999") && page == 1) {
            errView.setVisibility(View.VISIBLE);
            swipeRefreshLayout.setVisibility(View.INVISIBLE);
        } else {
            errView.setVisibility(View.INVISIBLE);
            swipeRefreshLayout.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void viewLoadMore(final List data) {
        swipeRefreshLayout.setRefreshing(false);
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
            Message msg = Message.obtain();
            msg.what = ParameterUtils.SHOW_REPLACE_DELAY;
            msg.arg1 = index;
            msg.obj = value;
            mHandler.sendMessageDelayed(msg, 60);
        }
    }

    @Override
    public void refreshShowground(final List data) {
        swipeRefreshLayout.setRefreshing(false);
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(resolveData(data));
            setEmptyText();
        }
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

                            if (resourceBean.getType() == 5) {
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
                //处理product中的空值
                List products = bean.getProducts();
                if(products != null && products.size()>0){
                    products.removeAll(Collections.singleton(null));
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

    public void addHeader(final View view) {
        adapter.setHeaderAndEmpty(true);
        adapter.setHeaderView(view);
        View emptyView = adapter.getEmptyView();
        final ViewGroup.LayoutParams lp = emptyView.getLayoutParams();
        if (lp != null) {
            lp.height = ScreenUtils.getScreenHeight() - DensityUtils.dip2px(400);
        }
        emptyView.setLayoutParams(lp);
        recyclerView.scrollToPosition(0);
    }

    public void setParams(HashMap map) {
        if (presenter != null) {
            presenter.setParams(map);
        }
    }

    public void setType(String type) {
        adapter.setType(type);
    }

    private void showList() {
        errView.setVisibility(View.INVISIBLE);
        swipeRefreshLayout.setVisibility(View.VISIBLE);
    }

    @Override
    public void deleteSuccess() {

    }

    @Override
    public void deleteFail(String err) {

    }
}
