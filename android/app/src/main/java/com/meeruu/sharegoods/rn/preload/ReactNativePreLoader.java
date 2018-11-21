package com.meeruu.sharegoods.rn.preload;

import android.view.ViewGroup;

import com.facebook.react.ReactRootView;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.MainActivity;
import com.meeruu.sharegoods.MainApplication;

import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Map;

public class ReactNativePreLoader {

    private static final Map<String, ReactRootView> CACHE = new HashMap<>();

    /**
     * 初始化ReactRootView，并添加到缓存
     *
     * @param softReference
     * @param componentName
     */
    public static void preLoad(SoftReference<MainActivity> softReference, String componentName) {

        if (CACHE.get(componentName) != null) {
            return;
        }
        // 1.创建ReactRootView
        ReactRootView rootView = new ReactRootView(softReference.get());
        rootView.startReactApplication(
                ((MainApplication) softReference.get().getApplication()).getReactNativeHost().getReactInstanceManager(),
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
