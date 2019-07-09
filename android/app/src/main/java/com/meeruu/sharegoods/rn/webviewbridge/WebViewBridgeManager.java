package com.meeruu.sharegoods.rn.webviewbridge;

import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.sharegoods.rn.reactwebview.RNCWebViewManager;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;

import java.util.Map;

import javax.annotation.Nullable;

public class WebViewBridgeManager extends RNCWebViewManager {
    private static final String REACT_CLASS = "RCTWebViewBridge";
    private EventDispatcher mEventDispatcher;
    public static final int COMMAND_SEND_TO_BRIDGE = 101;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandsMap = super.getCommandsMap();

        commandsMap.put("sendToBridge", COMMAND_SEND_TO_BRIDGE);

        return commandsMap;
    }

    @Override
    protected WebView createViewInstance(ThemedReactContext reactContext) {
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        WebView root = super.createViewInstance(reactContext);
        root.setVerticalScrollBarEnabled(false);
        WebSettings settings = root.getSettings();
        String ua = settings.getUserAgentString();
        settings.setUserAgentString(ua + " xiugou");
        SensorsDataAPI.sharedInstance().showUpWebView(root, true);
        root.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                mEventDispatcher.dispatchEvent(new WebViewProgressEvent(view.getId(), newProgress));
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage message) {
                if (ReactBuildConfig.DEBUG) {
                    return super.onConsoleMessage(message);
                }
                // Ignore console logs in non debug builds.
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
        root.addJavascriptInterface(new JavascriptBridge(root), "WebViewBridge");
        return root;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "mrWebProgressEvent",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", "onProgressChanged")))

                .build();
    }


    @Override
    public void receiveCommand(WebView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        switch (commandId) {
            case COMMAND_SEND_TO_BRIDGE:
                sendToBridge(root, args.getString(0));
                break;
            default:
                //do nothing!!!!
        }
    }

    private void sendToBridge(WebView root, String message) {
        String script = "WebViewBridge.sg_onMessage('" + message + "');";
        WebViewBridgeManager.evaluateJavascript(root, script);
    }

    static private void evaluateJavascript(WebView root, String javascript) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            root.evaluateJavascript(javascript, null);
        } else {
            root.loadUrl("javascript:" + javascript);
        }
    }

    @ReactProp(name = "allowFileAccessFromFileURLs")
    public void setAllowFileAccessFromFileURLs(WebView root, boolean allows) {
        root.getSettings().setAllowFileAccessFromFileURLs(allows);
    }

    @Override
    @ReactProp(name = "allowUniversalAccessFromFileURLs")
    public void setAllowUniversalAccessFromFileURLs(WebView root, boolean allows) {
        root.getSettings().setAllowUniversalAccessFromFileURLs(allows);
    }
}
