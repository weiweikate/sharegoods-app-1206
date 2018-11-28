package com.meeruu.commonlib.customview.loopbanner.holder;

import android.view.View;

public interface CBViewHolderCreator {

    Holder createHolder(View itemView);

    int getLayoutId();
}
