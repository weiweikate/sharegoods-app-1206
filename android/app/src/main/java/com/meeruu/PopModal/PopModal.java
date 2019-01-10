package com.meeruu.PopModal;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Handler;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.PopupWindow;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;
import com.meeruu.commonlib.utils.ScreenUtils;

import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

public class PopModal extends ViewGroup implements LifecycleEventListener {


    private DialogRootViewGroup mHostView;
    private Rect rect;
    EventDispatcher eventDispatcher;
    private boolean focus = true;
    private @Nullable
    PopupWindow popupWindow;
    public static WeakReference<ReactContext> mContext;
    // Set this flag to true if changing a particular property on the view requires a new Dialog to
    // be created.  For instance, animation does since it affects Dialog creation through the theme
    // but transparency does not since we can access the window to update the property.

    public PopModal(ReactContext context) {
        super(context);
        mContext = new WeakReference<>(context);

        context.addLifecycleEventListener(this);
        mHostView = new DialogRootViewGroup(context);
        eventDispatcher =
                context.getNativeModule(UIManagerModule.class).getEventDispatcher();
    }

    public boolean isShow() {
        if (popupWindow != null) {
            return popupWindow.isShowing();
        }
        return false;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        // Do nothing as we are laid out by UIManager
    }

    @Override
    public void addView(View child, int index) {
        mHostView.addView(child, index);
    }

    @Override
    public int getChildCount() {
        return mHostView.getChildCount();
    }

    @Override
    public View getChildAt(int index) {
        return mHostView.getChildAt(index);
    }

    @Override
    public void removeView(View child) {
        mHostView.removeView(child);
    }

    @Override
    public void removeViewAt(int index) {
        View child = getChildAt(index);
        mHostView.removeView(child);
    }

    @Override
    public void addChildrenForAccessibility(ArrayList<View> outChildren) {
        // Explicitly override this to prevent accessibility events being passed down to children
        // Those will be handled by the mHostView which lives in the dialog
    }

    @Override
    public boolean dispatchPopulateAccessibilityEvent(AccessibilityEvent event) {
        // Explicitly override this to prevent accessibility events being passed down to children
        // Those will be handled by the mHostView which lives in the dialog
        return false;
    }

    public void onDropInstance() {
        ReactContext context = mContext.get();
        if (context != null) {
            context.removeLifecycleEventListener(this);
        }
        dismiss();
    }

    public void dismiss() {
        if (popupWindow != null) {
            if (popupWindow.isShowing()) {
                popupWindow.dismiss();
            }
            popupWindow = null;
            // We need to remove the mHostView from the parent
            // It is possible we are dismissing this dialog and reattaching the hostView to another
            ViewGroup parent = (ViewGroup) mHostView.getParent();
            parent.removeViewAt(0);
        }
    }


    @Override
    public void onHostResume() {
        // We show the dialog again when the host resumes
//        showOrUpdate();
    }

    @Override
    public void onHostPause() {
        // We dismiss the dialog and reconstitute it onHostResume
        dismiss();
    }

    @Override
    public void onHostDestroy() {
        // Drop the instance if the host is destroyed which will dismiss the dialog
        onDropInstance();
        if (mHostView != null) {
            mHostView.removeAllViews();
        }
    }

    @VisibleForTesting
    public @Nullable
    PopupWindow getDialog() {
        return popupWindow;
    }

    public static boolean isAppOnForeground(Context context) {

        ActivityManager activityManager = (ActivityManager) context.getApplicationContext()
                .getSystemService(Context.ACTIVITY_SERVICE);
        String packageName = context.getApplicationContext().getPackageName();
        /**
         * 获取Android设备中所有正在运行的App
         */
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager
                .getRunningAppProcesses();
        if (appProcesses == null)
            return false;

        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            // The name of the process that this object is associated with.
            if (appProcess.processName.equals(packageName)
                    && appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                return true;
            }
        }

        return false;
    }

    /**
     * showOrUpdate will display the Dialog.  It is called by the manager once all properties are set
     * because we need to know all of them before creating the Dialog.  It is also smart during
     * updates if the changed properties can be applied directly to the Dialog or require the
     * recreation of a new Dialog.
     */
    public void showOrUpdate() {
        // If the existing Dialog is currently up, we may need to redraw it or we may be able to update
        // the property without having to recreate the dialog

        if (popupWindow != null) {
            fitPopupWindowOverStatusBar(popupWindow, true);
            popupWindow.showAtLocation(mHostView, Gravity.BOTTOM, 0, 0);
            return;
        }

        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return;
        }
        popupWindow = new PopupWindow(currentActivity);

        popupWindow.setOnDismissListener(new PopupWindow.OnDismissListener() {
            @Override
            public void onDismiss() {

                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if(!isAppOnForeground(getContext())){
                            return;
                        }
                        eventDispatcher.dispatchEvent(
                                new PopModalDismissEvent(
                                        PopModal.this.getId()));
                    }
                }, 200);

            }
        });


        if (Build.VERSION.SDK_INT >= 24) {
            if (rect == null) {
                rect = new Rect();
            }
            mHostView.getGlobalVisibleRect(rect);
            int h = mHostView.getResources().getDisplayMetrics().heightPixels - rect.bottom;
            popupWindow.setHeight(h);
        }
        popupWindow.setFocusable(this.focus);
        popupWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        popupWindow.setWidth(LinearLayout.LayoutParams.MATCH_PARENT);
        popupWindow.setHeight(LinearLayout.LayoutParams.MATCH_PARENT);
        View v = getContentView();
        popupWindow.setContentView(v);
        popupWindow.setWidth(ScreenUtils.getScreenWidth());
        popupWindow.setTouchable(true);// true popwindow优先一切（系统级以外）处理touch  false:popwindow 只是一个view 不影响界面操作
        popupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));//不设置 不是全屏 周围会有空白部分
        popupWindow.setOutsideTouchable(true);
        fitPopupWindowOverStatusBar(popupWindow, true);
        if (currentActivity != null || !currentActivity.isFinishing()) {
            popupWindow.showAtLocation(mHostView, Gravity.BOTTOM, 0, 0);
        }
    }

    public void setFocus(boolean focus){
        this.focus = focus;
        if(popupWindow != null){
            popupWindow.setFocusable(true);
        }
    }

    private @Nullable
    Activity getCurrentActivity() {
        ReactContext context = mContext.get();
        if (context != null) {
            return context.getCurrentActivity();
        } else {
            return null;
        }
    }

    /**
     * Returns the view that will be the root view of the dialog. We are wrapping this in a
     * FrameLayout because this is the system's way of notifying us that the dialog size has changed.
     * This has the pleasant side-effect of us not having to preface all Modals with
     * "top: statusBarHeight", since that margin will be included in the FrameLayout.
     */
    private View getContentView() {
        ReactContext context = mContext.get();
        if (context != null) {
            FrameLayout frameLayout = new FrameLayout(context);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            frameLayout.setLayoutParams(params);
            frameLayout.addView(mHostView);
            frameLayout.setFocusable(true);
            frameLayout.setFocusableInTouchMode(true);
            frameLayout.setPadding(0, 0, 0, 0);
            frameLayout.setFitsSystemWindows(true);
            return frameLayout;
        } else {
            return null;
        }
    }

    //适配全屏
    public void fitPopupWindowOverStatusBar(PopupWindow popupWindow, boolean needFullScreen) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                Field mLayoutInScreen = PopupWindow.class.getDeclaredField("mLayoutInScreen");
                mLayoutInScreen.setAccessible(true);
                mLayoutInScreen.set(popupWindow, needFullScreen);
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * DialogRootViewGroup is the ViewGroup which contains all the children of a Modal.  It gets all
     * child information forwarded from PopModal and uses that to create children.  It is
     * also responsible for acting as a RootView and handling touch events.  It does this the same
     * way as ReactRootView.
     * <p>
     * To get layout to work properly, we need to layout all the elements within the Modal as if they
     * can fill the entire window.  To do that, we need to explicitly set the styleWidth and
     * styleHeight on the LayoutShadowNode to be the window size. This is done through the
     * UIManagerModule, and will then cause the children to layout as if they can fill the window.
     */
    static class DialogRootViewGroup extends ReactViewGroup implements RootView {
        @Override
        public void handleException(Throwable t) {

        }

        private final JSTouchDispatcher mJSTouchDispatcher = new JSTouchDispatcher(this);

        public DialogRootViewGroup(Context context) {
            super(context);
        }

        @Override
        protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
            super.onSizeChanged(w, h, oldw, oldh);
            if (getChildCount() > 0) {
                final int viewTag = getChildAt(0).getId();
                final ReactContext context = mContext.get();
                if (context != null) {
                    context.runOnNativeModulesQueueThread(
                            new GuardedRunnable(context) {
                                @Override
                                public void runGuarded() {
                                    context.getNativeModule(UIManagerModule.class)
                                            .updateNodeSize(viewTag, w, h);
                                }
                            });
                }

            }
        }

        @Override
        public boolean onInterceptTouchEvent(MotionEvent event) {
            mJSTouchDispatcher.handleTouchEvent(event, getEventDispatcher());
            return super.onInterceptTouchEvent(event);
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            mJSTouchDispatcher.handleTouchEvent(event, getEventDispatcher());
            super.onTouchEvent(event);
            // In case when there is no children interested in handling touch event, we return true from
            // the root view in order to receive subsequent events related to that gesture
            return true;
        }

        @Override
        public void onChildStartedNativeGesture(MotionEvent androidEvent) {
            mJSTouchDispatcher.onChildStartedNativeGesture(androidEvent, getEventDispatcher());
        }


        @Override
        public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
            // No-op - override in order to still receive events to onInterceptTouchEvent
            // even when some other view disallow that
        }

        private EventDispatcher getEventDispatcher() {
            ReactContext context = mContext.get();
            if (context != null) {
                return context.getNativeModule(UIManagerModule.class).getEventDispatcher();

            } else {
                return null;
            }

        }
    }
}
