package com.meeruu.sharegoods.ui.fragment;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import com.facebook.binaryresource.BinaryResource;
import com.facebook.binaryresource.FileBinaryResource;
import com.facebook.cache.common.CacheKey;
import com.facebook.imagepipeline.cache.DefaultCacheKeyFactory;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.imagepipeline.listener.BaseRequestListener;
import com.facebook.imagepipeline.request.ImageRequest;
import com.meeruu.commonlib.base.BaseFragment;
import com.meeruu.commonlib.callback.OnWebBaseListener;
import com.meeruu.commonlib.callback.OnWebCommonListener;
import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.utils.AppUtils;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.NetUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.SensorsUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.meeruu.commonlib.utils.Utils;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.task.ScanQrcodeTask;
import com.meeruu.sharegoods.ui.activity.SelectMyPhotoActivity;
import com.meeruu.sharegoods.ui.dialog.OptionsPopupDialog;
import com.meeruu.sharegoods.utils.HttpUrlUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MRWebviewFragment extends BaseFragment implements Handler.Callback {

    private LinearLayout llWeb;
    private WebView mWebView;

    private WeakHandler mHandler;
    private OnWebBaseListener listener;
    private String webUrl;
    private boolean mIsWebViewAvailable;
    private OptionsPopupDialog mDialog;
    private String qrCodeUrl;
    private List<String> items;
    private ValueCallback<Uri> uploadMessage;
    private ValueCallback<Uri[]> uploadMessageAboveL;


    //接口的实例化 必须
    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        listener = (OnWebBaseListener) mActivity;
    }

    /**
     * Called when the fragment is visible to the user and actively running. Resumes the WebView.
     */
    @Override
    public void onPause() {
        super.onPause();
        mWebView.onPause();
    }

    /**
     * Called when the fragment is no longer resumed. Pauses the WebView.
     */
    @Override
    public void onResume() {
        mWebView.onResume();
        super.onResume();
    }

    /**
     * Called when the WebView has been detached from the fragment.
     * The WebView is no longer available after this time.
     */
    @Override
    public void onDestroyView() {
        mIsWebViewAvailable = false;
        super.onDestroyView();
    }

    /**
     * Called when the fragment is no longer in use. Destroys the internal state of the WebView.
     */
    @Override
    public void onDestroy() {
        if (mWebView != null) {

            // 如果先调用destroy()方法，则会命中if (isDestroyed()) return;这一行代码，需要先onDetachedFromWindow()，再
            // destory()
            if (llWeb != null) {
                llWeb.removeView(mWebView);
            }

            mWebView.stopLoading();
            // 退出时调用此方法，移除绑定的服务，否则某些特定系统会报错
            mWebView.getSettings().setJavaScriptEnabled(false);
            mWebView.clearHistory();
            mWebView.clearView();
            mWebView.removeAllViews();
            mWebView.destroy();
            mWebView = null;
        }
        if (mHandler != null) {
            mHandler = null;
        }
        if (mDialog != null) {
            mDialog.dismiss();
            mDialog = null;
        }
        if (items != null) {
            items.clear();
            items = null;
        }
        if (listener != null) {
            listener = null;
        }
        super.onDestroy();
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_webview;
    }

    @Override
    protected void initView() {
        llWeb = rootView.findViewById(R.id.llyt_web);
        if (mWebView != null) {
            mWebView.destroy();
        }
        try {
            mWebView = new WebView(mActivity);
        } catch (Throwable e) {
            String trace = Log.getStackTraceString(e);
            if (trace.contains("android.content.pm.PackageManager$NameNotFoundException")
                    || trace.contains("java.lang.RuntimeException: Cannot load WebView")
                    || trace.contains("android.webkit.WebViewFactory$MissingWebViewPackageException: Failed to load WebView provider: No WebView installed")) {
                ToastUtils.showToast("暂不支持打开该页面！");
                mActivity.finish();
            } else {
                throw e;
            }
        }
        // SensorsData
        SensorsUtils.trackWebView(mWebView);
        mHandler = new WeakHandler(this);
        mIsWebViewAvailable = true;
        mWebView.setHorizontalScrollBarEnabled(false);
        mWebView.setVerticalScrollBarEnabled(false);
        mWebView.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        llWeb.addView(mWebView);
        //配置webview
        configWebView();
        mWebView.requestFocus();
        mWebView.addJavascriptInterface(new AndroidJavaScriptInterface(), "android");//添加js监听 这样html就能调用客户端
        //alert弹框
//        DialogCreator.createWebviewDialog(mWebView, mActivity);
        mWebView.setWebViewClient(new myWebViewClient());
        mWebView.setWebChromeClient(new myWebChromeClient());
        Bundle data = getArguments();
        String action = data.getString("url_action");
        webUrl = data.getString("web_url");
        if ("get".equals(action)) {
            mWebView.loadUrl(webUrl);
        } else if ("post".equals(action)) {
            String postData = data.getString("postData");
            mWebView.postUrl(webUrl, postData.getBytes());
        } else if ("html".equals(action)) {
            mWebView.loadDataWithBaseURL(null, webUrl, "text/html", "UTF-8", null);
        }
        initEvent();
    }

    private void initEvent() {
        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                WebView.HitTestResult result = mWebView.getHitTestResult();
                if (result.getType() == WebView.HitTestResult.IMAGE_TYPE ||
                        result.getType() == WebView.HitTestResult.SRC_IMAGE_ANCHOR_TYPE) {
                    final String url = result.getExtra();
                    if (!TextUtils.isEmpty(url)) {
                        //识别图片中是否有二维码
                        scanQrCode(url);
                        //弹出菜单
                        if (items == null) {
                            items = new ArrayList<>();
                        }
                        items.clear();
                        items.add("保存图片");
                        mDialog = OptionsPopupDialog.newInstance(mActivity, items).setOptionsPopupDialogListener(new OptionsPopupDialog.OnOptionsItemClickedListener() {
                            @Override
                            public void onOptionsItemClicked(int which) {
                                onItemLongClick(which, url);
                            }
                        });
                        mDialog.show();
                        return true;
                    }
                }
                return false;
            }
        });
    }

    /**
     * 配置webview
     */
    private void configWebView() {
        WebSettings settings = mWebView.getSettings();
        if (settings == null) {
            return;
        }
        // 修改ua使得web端正确判断
        settings.setUserAgentString(Utils.getUserAgent(settings.getUserAgentString()));
        // 支持Js使用
        settings.setJavaScriptEnabled(true);
        settings.setBlockNetworkImage(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }
        // 开启DOM缓存。
        settings.setDomStorageEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setAppCachePath(mActivity.getCacheDir().getAbsolutePath());
        // 是否可访问本地文件，默认值 true
        settings.setAllowFileAccess(true);
        mWebView.setDownloadListener(new MyWebViewDownLoadListener());
        // 设置 缓存模式
        if (NetUtils.isConnected(mActivity)) {
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        } else {
            settings.setCacheMode(
                    WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
        // 设置可以支持缩放
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        //扩大比例的缩放
        settings.setUseWideViewPort(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            // 5.0以上允许加载http和https混合的页面(5.0以下默认允许，5.0+默认禁止)
            settings.setMixedContentMode(
                    WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }
        //自适应屏幕
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        settings.setLoadWithOverviewMode(true);
    }

    private class myWebChromeClient extends WebChromeClient {

        @Override
        public boolean onJsAlert(WebView webView, String url, String message, JsResult result) {
            AlertDialog.Builder localBuilder = new AlertDialog.Builder(webView.getContext());
            localBuilder.setMessage(message).setPositiveButton("确定", null);
            localBuilder.setCancelable(false);
            localBuilder.create().show();

            //注意:
            //必须要这一句代码:result.confirm()表示:
            //处理结果为确定状态同时唤醒WebCore线程
            //否则不能继续点击按钮
            result.confirm();
            return true;
        }

        @Override
        public void onReceivedTitle(WebView view, String title) {
            super.onReceivedTitle(view, title);
            if (listener != null && listener instanceof OnWebCommonListener) {
                ((OnWebCommonListener) listener).handleTitle(title);
            }
        }

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            super.onProgressChanged(view, newProgress);
            if (listener != null && listener instanceof OnWebCommonListener) {
                ((OnWebCommonListener) listener).onProgress(newProgress);
            }
        }

        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            uploadMessage = uploadMsg;
            openImageChooserActivity();
        }

        // For Android  >= 3.0
        public void openFileChooser(ValueCallback valueCallback, String acceptType) {
            uploadMessage = valueCallback;
            openImageChooserActivity();
        }

        //For Android  >= 4.1
        public void openFileChooser(ValueCallback<Uri> valueCallback, String acceptType, String capture) {
            uploadMessage = valueCallback;
            openImageChooserActivity();
        }

        // For Android >= 5.0
        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
            if (uploadMessageAboveL != null) {
                uploadMessageAboveL.onReceiveValue(null);
                uploadMessageAboveL = null;
            }
            uploadMessageAboveL = filePathCallback;
            openImageChooserActivity();
            return true;
        }
    }

    private class MyWebViewDownLoadListener implements DownloadListener {
        @Override
        public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
            if (url != null) {
                Intent intent = new Intent(Intent.ACTION_VIEW,
                        Uri.parse(url));
                if (mActivity.getPackageManager().resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY) != null) {
                    startActivity(intent);
                } else {
                    ToastUtils.showToast("未找到可以打开的页面！");
                }
            }
        }
    }

    private class myWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            LogUtils.d("overrideUrl=======" + url);
            return handleOverrideUrl(view, url);
        }

        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            handler.proceed();// 接受所有网站的证书
        }
    }

    private boolean handleOverrideUrl(WebView webView, String url) {
        if (!TextUtils.isEmpty(url)) {
            if (url.equals(HttpUrlUtils.getGongmaoUrl())) {
                mActivity.setResult(ParameterUtils.SIGN_OK);
                mActivity.finish();
                return true;//表示我已经处理过了
            }
            if (url.startsWith("tel:")) {
                Utils.openWithWeb(webView.getContext(), url);
                return true;
            } else if (url.startsWith("baidumap://")) {
                //打开百度地图
                if (AppUtils.isAvilible(webView.getContext(), "com.baidu.BaiduMap")) {
                    Utils.openWithWeb(webView.getContext(), url);
                    return true;
                }
                return false;
            } else if (url.startsWith("http") || url.startsWith("https")) {
                webView.loadUrl(url);
                return true;
            }
        }
        return false;
    }


    /**
     * The type Android java script interface.
     */
    public final class AndroidJavaScriptInterface {
        @JavascriptInterface
        public void getClient(String str) {
        }
    }

    /**
     * 处理handler消息
     *
     * @param msg
     * @return
     */
    @Override
    public boolean handleMessage(Message msg) {
        switch (msg.what) {
            case ParameterUtils.MSG_WHAT_REFRESH:
                qrCodeUrl = (String) msg.obj;
                mDialog.addItem("识别图中二维码");
                mDialog.refreshItem();
                break;
            default:
                break;
        }
        return false;
    }

    /**
     * Gets the WebView.
     */
    public WebView getWebView() {
        return mIsWebViewAvailable ? mWebView : null;
    }

    private void scanQrCode(String url) {
        ImageLoadUtils.preFetch(Uri.parse(url), 0, 0, new BaseRequestListener() {
            @Override
            public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                super.onRequestSuccess(request, requestId, isPrefetch);
                CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                if (resource == null) {
                    return;
                }
                final File file = ((FileBinaryResource) resource).getFile();
                if (file == null) {
                    return;
                }
                Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                if (bmp != null && !bmp.isRecycled()) {
                    new ScanQrcodeTask(mHandler).execute(bmp);
                }
            }
        });
    }

    private void onItemLongClick(int which, String url) {
        switch (which) {
            case 0:
                //保存图片
                ImageLoadUtils.preFetch(Uri.parse(url), 0, 0, new BaseRequestListener() {
                    @Override
                    public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                        super.onRequestSuccess(request, requestId, isPrefetch);
                        CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                        BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                        if (resource == null) {
                            ToastUtils.showToast("图片保存失败！");
                            return;
                        }
                        final File file = ((FileBinaryResource) resource).getFile();
                        if (file == null) {
                            ToastUtils.showToast("图片保存失败！");
                            return;
                        }
                        // 保存图片
                        Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                        if (bmp != null && !bmp.isRecycled()) {
                            String saveName = System.currentTimeMillis() + ".png";
                            // 存放照片的文件夹
                            File saveFile = SDCardUtils.getFileDirPath(mActivity.getApplicationContext(),
                                    "MR" + File.separator + "picture");
                            BitmapUtils.saveBitmap(bmp, saveFile.getAbsolutePath() + File.separator + saveName, mActivity.getApplicationContext());
                        }
                    }
                });
                break;
            case 1:
                //识别二维码
                if (listener != null) {
                    listener.showWebView(qrCodeUrl);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 打开选择图片页面
     */
    private void openImageChooserActivity() {
        Intent intent = new Intent(mActivity, SelectMyPhotoActivity.class);
        intent.putExtra("singlePic", true);
        startActivityForResult(intent, ParameterUtils.REQUEST_CODE_CHANGEPHOTO);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Uri result = null;
        if (resultCode != Activity.RESULT_OK) {
            if (uploadMessageAboveL != null) {
                uploadMessageAboveL.onReceiveValue(null);
                uploadMessageAboveL = null;
            } else if (uploadMessage != null) {
                uploadMessage.onReceiveValue(null);
                uploadMessage = null;
            }
            return;
        }
        switch (requestCode) {
            case ParameterUtils.REQUEST_CODE_CHANGEPHOTO:
                String temppath = data.getStringExtra("path");
                if (!TextUtils.isEmpty(temppath)) {
                    result = Uri.parse("file://" + temppath);
                    //5.0以上
                    if (uploadMessageAboveL != null) {
                        Uri[] results = result != null ? new Uri[]{result} : null;
                        uploadMessageAboveL.onReceiveValue(results);
                        uploadMessageAboveL = null;
                    } else if (uploadMessage != null) {
                        uploadMessage.onReceiveValue(result);
                        uploadMessage = null;
                    }
                }
                break;
            default:
                break;
        }
    }
}
