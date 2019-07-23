package com.reactnative.ivpusic.imagepicker.picture.lib.imaging.core.clip;

import android.app.Dialog;
import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import com.reactnative.ivpusic.imagepicker.R;
import com.reactnative.ivpusic.imagepicker.picture.lib.widget.PhotoPopupWindow;

public class ClipRatioConfigsPopupWindow extends PopupWindow {
    private TextView ratio43, ratio34,ratio11 ,tv_cancel;
    private LinearLayout ll_root;
    private boolean isDismiss = false;
    private Animation animationIn, animationOut;
    private ItemClickListener itemClickListener;


    public ClipRatioConfigsPopupWindow(Context context){
        super(context);
        View inflate = LayoutInflater.from(context).inflate(R.layout.ratio_config_dialog, null);
        this.setWidth(LinearLayout.LayoutParams.MATCH_PARENT);
        this.setHeight(LinearLayout.LayoutParams.MATCH_PARENT);
        this.setFocusable(true);
        this.setOutsideTouchable(true);
        this.update();
        this.setBackgroundDrawable(new ColorDrawable());
        this.setContentView(inflate);
        animationIn = AnimationUtils.loadAnimation(context, R.anim.up_in);
        animationOut = AnimationUtils.loadAnimation(context, R.anim.down_out);
        ratio43 =inflate.findViewById(R.id.ratio_43);
        ratio34 =inflate.findViewById(R.id.ratio_34);
        ratio11 =inflate.findViewById(R.id.ratio_11);
        tv_cancel =  inflate.findViewById(R.id.picture_tv_cancel);

        ll_root = (LinearLayout) inflate.findViewById(R.id.ll_root);
        ratio43.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ClipRatioConfig.setCurrentClipRatioConfig(ClipRatioConfig.Ratio43);
                dismiss();
                if(itemClickListener != null){
                    itemClickListener.onItemClick();
                }
            }
        });

        ratio34.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ClipRatioConfig.setCurrentClipRatioConfig(ClipRatioConfig.Ratio34);
                dismiss();
                if(itemClickListener != null){
                    itemClickListener.onItemClick();
                }
            }
        });

        ratio11.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ClipRatioConfig.setCurrentClipRatioConfig(ClipRatioConfig.Ratio11);
                dismiss();
                if(itemClickListener != null){
                    itemClickListener.onItemClick();
                }
            }
        });

        tv_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
    }


    public void setItemClickListener(ItemClickListener itemClickListener){
        this.itemClickListener = itemClickListener;
    }

    @Override
    public void showAsDropDown(View parent) {
        try {
            if (Build.VERSION.SDK_INT >= 24) {
                int[] location = new int[2];
                parent.getLocationOnScreen(location);
                int x = location[0];
                int y = location[1] + parent.getHeight();
                this.showAtLocation(parent, Gravity.BOTTOM, x, y);
            } else {
                this.showAtLocation(parent, Gravity.BOTTOM, 0, 0);
            }

            isDismiss = false;
            ll_root.startAnimation(animationIn);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void dismiss() {
        if (isDismiss) {
            return;
        }
        isDismiss = true;
        ll_root.startAnimation(animationOut);
        dismiss();
        animationOut.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                isDismiss = false;
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.JELLY_BEAN) {
                    dismiss4Pop();
                } else {
                    ClipRatioConfigsPopupWindow.super.dismiss();
                }
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }
        });
    }

    /**
     * 在android4.1.1和4.1.2版本关闭PopWindow
     */
    private void dismiss4Pop() {
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                ClipRatioConfigsPopupWindow.super.dismiss();
            }
        });
    }

    public interface ItemClickListener{
        void onItemClick();
    }
}
