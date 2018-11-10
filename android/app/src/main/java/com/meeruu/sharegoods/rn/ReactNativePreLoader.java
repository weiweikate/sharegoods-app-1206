package com.meeruu.sharegoods.rn;

import android.app.Activity;
import android.view.ViewGroup;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactRootView;
import com.meeruu.commonlib.utils.LogUtils;

import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Map;

public class ReactNativePreLoader {

    private static final Map<String, ReactRootView> CACHE = new HashMap<>();

    /**
     * 初始化ReactRootView，并添加到缓存
     *
     * @param activity
     * @param componentName
     */
    public static void preLoad(SoftReference<Activity> activity, String componentName) {

        if (CACHE.get(componentName) != null) {
            return;
        }
        // 1.创建ReactRootView
        ReactRootView rootView = new ReactRootView(activity.get());
        rootView.startReactApplication(
                ((ReactApplication) activity.get().getApplication()).getReactNativeHost().getReactInstanceManager(),
                componentName,
                null);

        // 2.添加到缓存
        CACHE.put(componentName, rootView);
    }

    /**
     * 获取ReactRootView
     *
     * @param componentName
     * @return
     */
    public static ReactRootView getReactRootView(String componentName) {
        return CACHE.get(componentName);
    }

    /**
     * 从当前界面移除 ReactRootView
     *
     * @param component
     */
    public static void deatchView(String component) {
        try {
            ReactRootView rootView = getReactRootView(component);
            ViewGroup parent = (ViewGroup) rootView.getParent();
            if (parent != null) {
                parent.removeView(rootView);
            }
        } catch (Throwable e) {
            LogUtils.e("ReactNativePreLoader", e.getMessage());
        }
    }
}
