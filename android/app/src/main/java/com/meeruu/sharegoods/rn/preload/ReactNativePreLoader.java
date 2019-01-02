package com.meeruu.sharegoods.rn.preload;

import android.app.Activity;
import android.content.Context;
import android.content.MutableContextWrapper;
import android.os.Bundle;
import android.view.ViewGroup;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.sharegoods.MainApplication;

import java.util.Map;
import java.util.WeakHashMap;

public class ReactNativePreLoader {

    private static final Map<String, ReactRootView> CACHE = new WeakHashMap<>();

    /**
     * 初始化ReactRootView，并添加到缓存
     *
     * @param context
     * @param componentName
     */
    public static void preLoad(Context context, String componentName) {

        if (CACHE.get(componentName) != null) {
            return;
        }
        // 1.创建ReactRootView
        ReactRootView rootView = new ReactRootView(new MutableContextWrapper(context.getApplicationContext()));
        rootView.startReactApplication(
                ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager(),
                componentName,
                null);
        // 2.添加到缓存
        CACHE.put(componentName, rootView);
    }

    /**
     * 获取ReactRootView
     *
     * @param componentName 加载的组件名
     * @return ReactRootView
     */
    public static ReactRootView getReactRootView(Activity activity, String componentName) {
        ReactRootView rootView = CACHE.get(componentName);
        if (rootView == null) {
            return null;
        }
        if (rootView.getContext() instanceof MutableContextWrapper) {
            ((MutableContextWrapper) rootView.getContext()).setBaseContext(
                    activity
            );
        }
        return rootView;
    }

    public static ReactRootView startReactApplication(Activity plainActivity, ReactInstanceManager reactInstanceManager, String componentName, Bundle launchOptions) {
        ReactRootView rootView = new ReactRootView(plainActivity);
        rootView.startReactApplication(
                reactInstanceManager,
                componentName,
                launchOptions);
        CACHE.put(componentName, rootView);
        return rootView;
    }

    /**
     * 从当前界面移除 ReactRootView
     *
     * @param componentName 加载的组件名
     */
    public static void detachView(String componentName) {
        try {
            ReactRootView rootView = CACHE.get(componentName);
            if (rootView == null)
                return;
            ViewGroup parent = (ViewGroup) rootView.getParent();
            if (parent != null) {
                parent.removeView(rootView);
            }
            if (rootView.getContext() instanceof MutableContextWrapper) {
                ((MutableContextWrapper) rootView.getContext()).setBaseContext(
                        rootView.getContext().getApplicationContext()
                );
            }
            CACHE.put(componentName, null);
        } catch (Throwable e) {
            LogUtils.e("ReactNativePreLoader", e.getMessage());
        }
    }
}
