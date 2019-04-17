package com.meeruu.commonlib.config;

import com.meeruu.commonlib.R;
import com.meeruu.qiyu.activity.QiyuServiceMessageActivity;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.YSFOptions;

public class QiyuConfig {

    // 如果返回值为null，则全部使用默认参数。
    public static YSFOptions options() {
        YSFOptions options = new YSFOptions();
        StatusBarNotificationConfig statusBarNotificationConfig = new StatusBarNotificationConfig();
        statusBarNotificationConfig.notificationEntrance = QiyuServiceMessageActivity.class;
        statusBarNotificationConfig.notificationSmallIconId = R.mipmap.ic_launcher_round;
        options.statusBarNotificationConfig = statusBarNotificationConfig;
        UICustomization uiCustomization = new UICustomization();
        // 头像风格，0为圆形，1为方形
        uiCustomization.avatarShape = 0;
        // 标题栏背景
        uiCustomization.titleBackgroundColor = 0xFFFFFFFF;
        uiCustomization.titleBarStyle = 0;
        uiCustomization.topTipBarBackgroundColor = 0xFF666666;
        uiCustomization.titleCenter = true;
        uiCustomization.topTipBarTextColor = 0xFFFFFFFF;
        options.categoryDialogStyle = 0;
        options.uiCustomization = uiCustomization;
        return options;
    }
}
