package com.meeruu.sharegoods.rn.showground.adapter;

import android.graphics.Paint;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;

import java.util.List;

public class ProductsAdapter extends RecyclerView.Adapter<ProductsAdapter.VH> {
    private AddCartListener addCartListener;

    public static class VH extends RecyclerView.ViewHolder {
        public TextView originalPrice;
        public ImageView cart;
        public VH(View v) {
            super(v);
            originalPrice = v.findViewById(R.id.originalPrice);
            originalPrice.getPaint().setFlags(Paint.STRIKE_THRU_TEXT_FLAG | Paint.ANTI_ALIAS_FLAG);
            cart = v.findViewById(R.id.cart);
        }
    }

    private List<String> mDatas;

    public ProductsAdapter(List<String> data) {
        this.mDatas = data;
    }

    public void setAddCartListener(AddCartListener addCartListener){
        this.addCartListener = addCartListener;
    }

    @Override
    public void onBindViewHolder(@NonNull VH vh, int i) {
        final AddCartListener addCartListener = this.addCartListener;
        vh.cart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(addCartListener != null){
                    addCartListener.onAddCart("SPU00004168");
                }
            }
        });
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
            int width = ScreenUtils.getScreenWidth() - DensityUtils.dip2px(80);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT);
            if (i != mDatas.size() - 1) {
                lp.setMargins(0, 0, 10, 0);
            }
            view.setLayoutParams(lp);
        }

        return new VH(view);
    }

    public interface AddCartListener{
        void onAddCart(String code);
    }
}
