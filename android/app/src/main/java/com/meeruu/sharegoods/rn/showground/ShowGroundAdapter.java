package com.meeruu.sharegoods.rn.showground;

import android.text.TextUtils;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;


public class ShowGroundAdapter extends BaseQuickAdapter<NewestShowGroundBean.DataBean, BaseViewHolder> {

    //    public static final int Featured = 1;
//    public static final int Hot = 2;
    private static final int Recommend = 3;
    private static final int New = 4;
    private final int realWidth;


    private final int radius = DensityUtils.dip2px(5);
    private float[] arr_raduis = {radius, radius, radius, radius, 0, 0, 0, 0};

    public ShowGroundAdapter() {
        super(R.layout.item_showground);
        realWidth = (ScreenUtils.getScreenWidth() - 40) / 2;
    }

    @Override
    protected void convert(BaseViewHolder helper, NewestShowGroundBean.DataBean item) {
        final SimpleDraweeView userIcon = helper.getView(R.id.showground_item_userIcon);
        String userTag = (String) userIcon.getTag();
        String userUrl = item.getUserHeadImg();
        if (!TextUtils.equals(userUrl, userTag)) {
            ImageLoadUtils.loadCircleNetImage(userUrl, userIcon);
            userIcon.setTag(userUrl);
        }
        final SimpleDraweeView imageView = helper.getView(R.id.showground_item_image);
        float width = 1;
        float height = 1;
        String imgUrl;
        if (item.getGeneralize() == New || item.getGeneralize() == Recommend) {
            width = item.getCoverImgWide();
            height = item.getCoverImgHigh();
            imgUrl = item.getCoverImg();
        } else {
            width = item.getImgWide();
            height = item.getImgHigh();
            imgUrl = item.getImg();
        }
        if (TextUtils.isEmpty(imgUrl)) {
            imgUrl = "res://" + imageView.getContext().getPackageName() + "/" + R.drawable.bg_app_img;
        }
        int realHeight = (int) ((height / width) * realWidth);
        if (realHeight <= 1) {
            realHeight = realWidth;
        }
        String tag = (String) imageView.getTag();

        if (!TextUtils.equals(imgUrl, tag)) {
            imageView.setTag(imgUrl);
            RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) imageView.getLayoutParams();
            params.width = realWidth;
            params.height = realHeight;
            imageView.setLayoutParams(params);
            ImageLoadUtils.loadRoundNetImage(imgUrl, imageView, arr_raduis);
        }
        TextView name = helper.getView(R.id.showground_item_name);
        name.setText(item.getUserName());

        TextView time = helper.getView(R.id.showground_item_time);
        time.setText(item.getTime());

        TextView title = helper.getView(R.id.showground_item_title);
        title.setText(item.getPureContent());

        TextView showTimes = helper.getView(R.id.showground_item_show_times);
        int times = item.getClick();
        String seeTimes = "";
        if (times > 999999) {
            seeTimes = 999999 + "+";
        } else {
            seeTimes = times + "";
        }
        showTimes.setText(seeTimes);
    }
}
