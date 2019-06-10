package com.meeruu.sharegoods.rn.showground.adapter;

import android.content.Context;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.OrientationHelper;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.react.bridge.UiThreadUtil;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.ShowActivityBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.ImageInfo;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridViewAdapter;
import com.reactnative.ivpusic.imagepicker.ImagesUtils;

import java.util.ArrayList;
import java.util.List;

public class ShowActivityAdapter extends BaseQuickAdapter<ShowActivityBean, BaseViewHolder> {
    private float[] arr_raduis = {5, 5, 5, 5, 0, 0, 0, 0};

    public ShowActivityAdapter() {
        super(R.layout.item_show_activity);
    }

    @Override
    protected void convert(final BaseViewHolder helper, final ShowActivityBean item) {
        SimpleDraweeView imageView = helper.getView(R.id.activity_image);
        ImageLoadUtils.loadRoundNetImage(item.getUrl(), imageView, arr_raduis);
    }
}
