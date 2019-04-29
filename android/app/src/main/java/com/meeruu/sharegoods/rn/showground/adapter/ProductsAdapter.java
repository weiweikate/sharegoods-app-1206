package com.meeruu.sharegoods.rn.showground.adapter;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;

import java.util.List;

public class ProductsAdapter extends RecyclerView.Adapter<ProductsAdapter.VH> {
    public static class VH extends RecyclerView.ViewHolder {
        //        public final TextView title;
        public VH(View v) {
            super(v);
//            title = (TextView) v.findViewById(R.id.title);
        }
    }

    private List<String> mDatas;

    public ProductsAdapter(List<String> data) {
        this.mDatas = data;
    }

    @Override
    public void onBindViewHolder(@NonNull VH vh, int i) {

    }

    @Override
    public int getItemCount() {
        return mDatas.size();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_product, viewGroup, false);
        if (getItemCount() > 1) {
            int width = ScreenUtils.getScreenWidth()-DensityUtils.dip2px(80);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT);
            if(i != mDatas.size()-1){
                lp.setMargins(0,0,10,0);
            }
            view.setLayoutParams(lp);
        }

        return new VH(view);
    }
}
