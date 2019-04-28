package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.react.bridge.UiThreadUtil;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridViewAdapter;

import java.util.ArrayList;
import java.util.List;

public class ShowRecommendAdapter extends BaseQuickAdapter<ShowRecommendBean, BaseViewHolder> {

    public ShowRecommendAdapter() {
        super(R.layout.item_showground_image_goods);
        NineGridView.setImageLoader(new NineGridView.ImageLoader() {
            @Override
            public void onDisplayImage(Context context, SimpleDraweeView imageView, String url) {
                ImageLoadUtils.loadRoundNetImage(url, imageView, 0);
            }
        });

    }

    @Override
    protected void convert(final BaseViewHolder helper, final ShowRecommendBean item) {
        final TextView content = helper.getView(R.id.content);
        final TextView button = helper.getView(R.id.content_button);

        //如果不需要展开按钮隐藏
        content.post(new Runnable() {
            @Override
            public void run() {
                if(content.getLineCount() > 3){
                    return;
                }
                int ellipsisCount = content.getLayout().getEllipsisCount(content.getLineCount() - 1);
                if(ellipsisCount>0){
                    button.setVisibility(View.VISIBLE);
                }else {
                    button.setVisibility(View.GONE);
                }
            }
        });

        //展开按钮
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!item.isHasExpand()){
                    UiThreadUtil.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            content.setMaxLines(Integer.MAX_VALUE);
                            setExpandValue(helper.getAdapterPosition(),true);
                            button.setText(R.string.pack_up);
                        }
                    });
                }else {
                    UiThreadUtil.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            content.setMaxLines(3);
                            setExpandValue(helper.getAdapterPosition(),false);
                            button.setText(R.string.spread_out);
                        }
                    });
                }
            }
        });

        NineGridView nineGridView = helper.getView(R.id.nine_grid);
        List<ImageInfo> imageInfoList = new ArrayList<>();
        for (int i = 0; i < item.getImageUrls().size(); i++) {
            String url = (String) item.getImageUrls().get(i);
            ImageInfo info = new ImageInfo();
            info.setImageUrl(url);
            imageInfoList.add(info);
        }

        NineGridViewAdapter adapter = new NineGridViewAdapter(mContext, imageInfoList);
        nineGridView.setAdapter(adapter);

    }

    private void setExpandValue(int index,boolean expandValue){
        List<ShowRecommendBean> list = ShowRecommendAdapter.this.getData();
        ShowRecommendBean bean = list.get(index);
        bean.setHasExpand(expandValue);
        ShowRecommendAdapter.this.replaceData(list);
    }
}
