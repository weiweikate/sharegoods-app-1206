package com.meeruu.sharegoods.rn.showground;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Handler;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.SimpleItemAnimator;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.alibaba.fastjson.JSON;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.listener.OnItemChildClickListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ShowDynamicAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.presenter.DynamicPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class ShowDynamicView implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private String cursor = null;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private StaggeredGridLayoutManager layoutManager;
    private ShowDynamicAdapter adapter;
    private DynamicPresenter presenter;
    private EventDispatcher eventDispatcher;
    private onStartRefreshEvent startRefreshEvent;
    private View errView;
    private WeakReference<View> showgroundView;
    private Handler handler;
    private View errImg;
    private boolean deleteIng = false;
    private int deleteIndex = -1;
    private DynamicInterface dynamicInterface;

    public ViewGroup getShowDynamicView(ReactContext reactContext, DynamicInterface dynamicInterface) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        this.dynamicInterface = dynamicInterface;
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();
        return (ViewGroup) view;
    }

    private void initView(final Context context, final View view) {
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
        startRefreshEvent = new onStartRefreshEvent();
        setRecyclerViewItemEvent(view);
        adapter = new ShowDynamicAdapter();
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        layoutManager = new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        View emptyView = LayoutInflater.from(context).inflate(R.layout.my_publish_empty_view, null);
        emptyView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        TextView button = emptyView.findViewById(R.id.tv_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (dynamicInterface != null) {
                    dynamicInterface.goPublish();
                }
            }
        });
        adapter.setEmptyView(emptyView);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                presenter.getShowList(cursor);
            }
        }, recyclerView);
        adapter.setLoadMoreView(new CustomLoadMoreView());
        adapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(final BaseQuickAdapter adapter, View view1, final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                if (data != null && dynamicInterface != null) {
                    dynamicInterface.onItemPress(data.get(position), position, true, false);
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
//                if (eventDispatcher != null) {
//                    int position = layoutManager.findFirstVisibleItemPositions(null)[0];
//                    View firstView = layoutManager.findViewByPosition(position);
//                    if (firstView == null) {
//                        return;
//                    }
//                    int itemHeight = firstView.getHeight();
//                    int flag = (position) * itemHeight - firstView.getTop();
//                    onScrollYEvent = new onScrollYEvent();
//                    onScrollYEvent.init(view.getId());
//                    WritableMap ymap = Arguments.createMap();
//                    ymap.putInt("YDistance", DensityUtils.px2dip(flag));
//                    onScrollYEvent.setData(ymap);
//                    eventDispatcher.dispatchEvent(onScrollYEvent);
//                }
            }

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
//                switch (newState) {
//                    case RecyclerView.SCROLL_STATE_IDLE:
//                        endScrollEvent = new onEndScrollEvent();
//                        endScrollEvent.init(view.getId());
//                        eventDispatcher.dispatchEvent(endScrollEvent);
//                        break;
//                    case RecyclerView.SCROLL_STATE_DRAGGING:
//                        startScrollEvent = new onStartScrollEvent();
//                        startScrollEvent.init(view.getId());
//                        eventDispatcher.dispatchEvent(startScrollEvent);
//                        break;
//                    default:
//                        break;
//                }
//                if (eventDispatcher != null) {
//                    onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
//                    onScrollStateChangedEvent.init(view.getId());
//                    WritableMap map = Arguments.createMap();
//                    map.putInt("state", newState);
//                    onScrollStateChangedEvent.setData(map);
//                    eventDispatcher.dispatchEvent(onScrollStateChangedEvent);
//                }
                int[] first = new int[2];
                layoutManager.findFirstCompletelyVisibleItemPositions(first);
                if (newState == RecyclerView.SCROLL_STATE_IDLE && (first[0] == 1 || first[1] == 1)) {
                    layoutManager.invalidateSpanAssignments();
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
                    case R.id.iv_delete:
                        if (!deleteIng) {
                            AlertDialog alertDialog = new AlertDialog.Builder(view.getContext()).setTitle("温馨提示").setMessage("确定删除这条动态吗？").setPositiveButton("确定", new DialogInterface.OnClickListener() {//添加"Yes"按钮
                                @Override
                                public void onClick(DialogInterface dialogInterface, int i) {
                                    presenter.deleteItem(bean.getShowNo());
                                    deleteIndex = position;
                                    deleteIng = true;
                                }
                            })

                                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {//添加取消
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                        }
                                    }).create();
                            alertDialog.show();
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    }


    private void initData() {
        presenter = new DynamicPresenter(this);
    }

    private void setEmptyText() {
        if (adapter == null) {
            return;
        }
        List list = adapter.getData();
        if (list == null || list.size() == 0) {
            View view = adapter.getEmptyView();
            TextView textView = view.findViewById(R.id.empty_tv);
            textView.setText("暂无内容，马上去发布文章");
            TextView button = view.findViewById(R.id.tv_button);
            button.setVisibility(View.VISIBLE);
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
        cursor = null;
        presenter.getShowList(cursor);
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
                if (TextUtils.equals(code, "9999") && TextUtils.isEmpty(cursor)) {
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
        if (data != null && data.size() > 0) {
            NewestShowGroundBean.DataBean dataBean =(NewestShowGroundBean.DataBean) data.get(data.size()-1);
            this.cursor = dataBean.getCursor();
            adapter.addData(resolveData(data));
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            if(data != null &&  data.size() > 0 ){
                NewestShowGroundBean.DataBean dataBean =(NewestShowGroundBean.DataBean) data.get(data.size()-1);
                this.cursor = dataBean.getCursor();
            }
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
                    List<String> resolveResource = new ArrayList<>();
                    if (resource != null) {
                        for (int j = 0; j < resource.size(); j++) {
                            NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                            if (resourceBean.getType() == 2) {
                                resolveResource.add(resourceBean.getBaseUrl());
                            }

                            if (resourceBean.getType() == 5) {
                                bean.setVideoCover(resourceBean.getBaseUrl());
                                break;
                            }
                        }
                        bean.setImgUrls(resolveResource);
                    }
                    data.set(i, bean);
                }
                //处理product中的空值
                List products = bean.getProducts();
                if (products != null && products.size() > 0) {
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
        deleteIng = false;
        adapter.remove(deleteIndex);
        deleteIndex = -1;
        setEmptyText();
    }

    @Override
    public void deleteFail(String err) {
        deleteIng = false;
        deleteIndex = -1;
        if (!TextUtils.isEmpty(err)) {
            ToastUtils.showToast(err);
        }
    }

}
