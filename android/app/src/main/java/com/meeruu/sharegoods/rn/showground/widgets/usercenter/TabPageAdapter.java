package com.meeruu.sharegoods.rn.showground.widgets.usercenter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.meeruu.sharegoods.R;

import java.util.ArrayList;
import java.util.List;

public class TabPageAdapter extends PagerAdapter {
    public static final String ARTICLE = "article";
    public static final String COLLECTION = "collection";
    public static final String COLLECTIONANDARTICLE = "collectionAndArticle";
    private Context context;
    private String type;

    public TabPageAdapter(Context context,String type) {
        super();
        this.context = context;
        this.type = type;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {
//        return super.instantiateItem(container, position);
//        View view = inflater.inflate(R.layout.fragment_list_view, container, false);
        View view = LayoutInflater.from(context).inflate(R.layout.fragment_list_view,null);

        RecyclerView mRecyclerView = view.findViewById(R.id.mRecyclerView);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(context));
        List<String> data = new ArrayList<>();
        for(int i=0; i<30;i++){
            data.add("美食"+i);
        }
        DemoAdapter mAdapter = new DemoAdapter( R.layout.item_ification_class);
        mRecyclerView.setAdapter(mAdapter);//设置adapter
        mAdapter.setNewData(data);

        container.addView(view);
        return  view;
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object o) {
        return false;
    }

    @Override
    public int getCount() {
//        int count  = 0;
//        switch (type) {
//            case ARTICLE:
//                count = 1;
//                break;
//            case COLLECTION:
//                count = 1;
//                break;
//            case COLLECTIONANDARTICLE:
//                count = 2;
//                break;
//        }
//        return count;
        return  2;
    }

    /**
     * adapter
     */
    class DemoAdapter extends BaseQuickAdapter<String, BaseViewHolder> {
        public DemoAdapter( int LayoutId) {
            super(LayoutId);

        }

        @Override
        public void convert(BaseViewHolder helper, String str) {
            helper.setText(R.id.tvTitle,str);
        }
    }
}
