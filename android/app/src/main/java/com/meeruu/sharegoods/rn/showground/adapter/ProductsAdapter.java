package com.meeruu.sharegoods.rn.showground.adapter;

import android.graphics.Paint;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;

import java.util.List;

public class ProductsAdapter extends RecyclerView.Adapter<ProductsAdapter.VH> {
    private AddCartListener addCartListener;

    public static class VH extends RecyclerView.ViewHolder {
        public TextView originalPrice;
        public ImageView cart;
        public TextView name;
        public SimpleDraweeView productImg;
        public VH(View v) {
            super(v);
            originalPrice = v.findViewById(R.id.originalPrice);
            name = v.findViewById(R.id.product_name);
            productImg = v.findViewById(R.id.product_img);
            originalPrice.getPaint().setFlags(Paint.STRIKE_THRU_TEXT_FLAG | Paint.ANTI_ALIAS_FLAG);
            cart = v.findViewById(R.id.cart);
        }
    }

    private List<NewestShowGroundBean.DataBean.ProductsBean> mDatas;

    public ProductsAdapter(List<NewestShowGroundBean.DataBean.ProductsBean> data) {
        this.mDatas = data;
    }

    public void setAddCartListener(AddCartListener addCartListener) {
        this.addCartListener = addCartListener;
    }

    @Override
    public void onBindViewHolder(@NonNull VH vh, int i) {
        final AddCartListener addCartListener = this.addCartListener;
        final NewestShowGroundBean.DataBean.ProductsBean bean = this.mDatas.get(i);
        vh.name.setText(bean.getName());
        String url = bean.getImgUrl();
        String tag = (String) vh.productImg.getTag();
        if (!TextUtils.equals(url, tag)) {
            ImageLoadUtils.loadRoundNetImage(url, vh.productImg,5);
            vh.productImg.setTag(url);
        }
        vh.cart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (addCartListener != null) {
                    addCartListener.onAddCart(bean.getProdCode());
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
            int width = ScreenUtils.getScreenWidth() - DensityUtils.dip2px(110);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT);
            if (i != mDatas.size() - 1) {
                lp.setMargins(0, 0, 10, 0);
            }
            view.setLayoutParams(lp);
        }

        return new VH(view);
    }

    public interface AddCartListener {
        void onAddCart(String code);
    }
}
