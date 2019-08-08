package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.content.DialogInterface;
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

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.listener.OnItemChildClickListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.CollectionAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.GoCollectionEvent;
import com.meeruu.sharegoods.rn.showground.presenter.CollectionPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class ShowCollectionView  implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private EventDispatcher eventDispatcher;
    private Handler handler;
    private WeakReference<View> showgroundView;
    private View errView;
    private View errImg;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private CollectionAdapter adapter;
    private StaggeredGridLayoutManager layoutManager;
    private int page = 1;
    private CollectionPresenter presenter;
    private DynamicInterface dynamicInterface;
    private boolean deleteIng = false;
    private int deleteIndex = -1;


    public ViewGroup getShowCollectionView(ReactContext reactContext,DynamicInterface dynamicInterface){
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
        setRecyclerViewItemEvent(view);
        adapter = new CollectionAdapter();
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        layoutManager = new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        View emptyView = LayoutInflater.from(context).inflate(R.layout.collection_empty_view, null);
        emptyView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        TextView button = emptyView.findViewById(R.id.tv_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               if(dynamicInterface != null){
                   dynamicInterface.goCollection();
               }
            }
        });
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
                if (data != null && dynamicInterface != null) {
                    dynamicInterface.onItemPress(data.get(position),position,true,true);
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
            }

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
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
                    case R.id.iv_collection:
                        if (!deleteIng) {
                            presenter.deleteItem(bean.getShowNo());
                            deleteIndex = position;
                            deleteIng = true;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    }

    private void initData() {
        presenter = new CollectionPresenter(this);
    }

    private void setEmptyText() {
        if (adapter == null) {
            return;
        }
        List list = adapter.getData();
        if (list == null || list.size() == 0) {
            View view = adapter.getEmptyView();
            TextView textView = view.findViewById(R.id.empty_tv);
            textView.setText("暂无内容，马上去收藏好文");
            TextView button = view.findViewById(R.id.tv_button);
            button.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onRefresh() {
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
                    List<String> resolveResource = new ArrayList<>();
                    if (resource != null) {
                        for (int j = 0; j < resource.size(); j++) {
                            NewestShowGroundBean.DataBean.ResourceBean resourceBean = resource.get(j);
                            if (resourceBean.getType() == 2) {
                                resolveResource.add(resourceBean.getBaseUrl());
                            }
                            if(resourceBean.getType() == 5){
                                bean.setVideoCover(resourceBean.getBaseUrl());
                                bean.setCoverWidth(resourceBean.getWidth());
                                bean.setCoverHeight(resourceBean.getHeight());
                                break;
                            }
                        }
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
    public void loadMoreComplete() {
        showList();
        adapter.loadMoreComplete();
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

    @Override
    public void repelaceData(int index, int clickNum) {

    }

    @Override
    public void repelaceItemData(int index, String value) {

    }

    @Override
    public void addDataToTop(String value) {

    }
}
