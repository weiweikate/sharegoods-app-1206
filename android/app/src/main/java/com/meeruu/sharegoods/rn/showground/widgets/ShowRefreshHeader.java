package com.meeruu.sharegoods.rn.showground.widgets;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.airbnb.lottie.LottieAnimationView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.sharegoods.R;
import com.scwang.smartrefresh.layout.api.RefreshKernel;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.constant.RefreshState;
import com.scwang.smartrefresh.layout.constant.SpinnerStyle;

public class ShowRefreshHeader extends LinearLayout implements com.scwang.smartrefresh.layout.api.RefreshHeader {

    private final String PULLDOWN = "下拉刷新'";
    private final String LOOSEN = "松开刷新";
    private final String REFRESHING = "刷新中...";
    private final String REFRESHED = "刷新完成";
    private LottieAnimationView lottieAnimationView;
    private TextView stateText;
    RefreshState newState = RefreshState.None;

    public ShowRefreshHeader(Context context) {
        super(context);
        initView(context);
    }

    @NonNull
    @Override
    public View getView() {
        return this;
    }

    @NonNull
    @Override
    public SpinnerStyle getSpinnerStyle() {
        return SpinnerStyle.FixedBehind;
    }

    @Override
    public void setPrimaryColors(int... colors) {

    }

    @Override
    public void onInitialized(@NonNull RefreshKernel kernel, int height, int maxDragHeight) {

    }

    @Override
    public void onMoving(boolean isDragging, float percent, int offset, int height, int maxDragHeight) {
        int y = DensityUtils.px2dip(offset);
        if (newState == RefreshState.PullDownToRefresh) {
            if (y > DensityUtils.dip2px(90)) {
                setProgress(0.1f);
            } else {
                setProgress(y / 1000f);
            }
        } else if (newState == RefreshState.ReleaseToRefresh) {
            setProgress(0.1f);
        }
    }

    @Override
    public void onReleased(@NonNull RefreshLayout refreshLayout, int height, int maxDragHeight) {

    }

    @Override
    public void onStartAnimator(@NonNull RefreshLayout refreshLayout, int height, int maxDragHeight) {
    }

    @Override
    public int onFinish(@NonNull RefreshLayout refreshLayout, boolean success) {
        return 0;
    }

    @Override
    public void onHorizontalDrag(float percentX, int offsetX, int offsetMax) {

    }

    @Override
    public void onStateChanged(@NonNull RefreshLayout refreshLayout, @NonNull RefreshState oldState, @NonNull RefreshState newState) {
        this.newState = newState;
        if (newState == RefreshState.Refreshing) {
            lottieAnimationView.setMinAndMaxFrame(30, 150);
            lottieAnimationView.playAnimation();
            stateText.setText(REFRESHING);
        } else if (newState == RefreshState.None) {
            lottieAnimationView.setMinAndMaxFrame(0, 30);
            stateText.setText(PULLDOWN);
        } else if (newState == RefreshState.ReleaseToRefresh) {
            stateText.setText(LOOSEN);
        } else if (newState == RefreshState.RefreshFinish) {
            stateText.setText(REFRESHED);
        }
    }

    @Override
    public boolean isSupportHorizontalDrag() {
        return false;
    }

    private void initView(Context context) {
        LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View view = layoutInflater.inflate(R.layout.view_refresh_header, this);
        lottieAnimationView = (LottieAnimationView) view.findViewById(R.id.lottie_view);
        stateText = view.findViewById(R.id.refresh_text);
        stateText.setText(PULLDOWN);
    }

    /**
     * Set animation view json.
     *
     * @param animName json文件名
     */
    public void setAnimationViewJson(String animName) {
        lottieAnimationView.setAnimation(animName);
    }

    public void setProgress(float progress) {
        lottieAnimationView.setProgress(progress);
    }

}
