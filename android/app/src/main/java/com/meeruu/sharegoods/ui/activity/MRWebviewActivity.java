package com.meeruu.sharegoods.ui.activity;

import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.meeruu.commonlib.base.BaseActivity;
import com.meeruu.commonlib.callback.OnWebCommonListener;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.ui.fragment.MRWebviewFragment;

import static com.meeruu.commonlib.utils.ParameterUtils.TITLE;
import static com.meeruu.commonlib.utils.ParameterUtils.WEBVIEW_ACTION;
import static com.meeruu.commonlib.utils.ParameterUtils.WEBVIEW_URL;

public class MRWebviewActivity extends BaseActivity implements OnWebCommonListener {

    private MRWebviewFragment mrWebviewFragment;
    private TextView topTitle;
    private ProgressBar progressbar;
    private ImageView ivBack;
    private boolean useTitile;
    private String mTitle;
    private String webUrl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mr_webview);
    }

    @Override
    protected void onDestroy() {
        releaseRes();
        super.onDestroy();
    }

    private void releaseRes() {
        if (mrWebviewFragment != null) {
            mrWebviewFragment = null;
        }
    }

    @Override
    protected void initViewAndData() {
        Intent intent = getIntent();
        View decorView = getWindow().getDecorView();
        // 此处的控件ID可以使用界面当中的指定的任意控件
        View contentView = findViewById(R.id.show_webview);
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(getGlobalLayoutListener(decorView, contentView));
        topTitle = findViewById(R.id.topdefault_centertitle);
        progressbar = findViewById(R.id.progressbar);
        mrWebviewFragment = new MRWebviewFragment();
        ivBack = findViewById(R.id.topdefault_leftbutton);
        ivBack.setOnClickListener(this);
        useTitile = intent.getBooleanExtra("use_title", false);
        mTitle = intent.getStringExtra(TITLE);
        topTitle.setText(mTitle);
        Bundle data = new Bundle();
        webUrl = intent.getStringExtra(WEBVIEW_URL);
        data.putString(WEBVIEW_URL, webUrl);
        data.putString(WEBVIEW_ACTION, intent.getStringExtra(WEBVIEW_ACTION));
        data.putString("postData", intent.getStringExtra("postData"));
        mrWebviewFragment.setArguments(data);
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.flyt_body, mrWebviewFragment);
        transaction.commit();
    }

    @Override
    public void initEvent() {
    }

    @Override
    protected void doClick(View v) {
        switch (v.getId()) {
            case R.id.topdefault_leftbutton:
                finish();
                break;
            default:
                break;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            handleGoBack();
        }
        return false;
    }

    public void handleGoBack() {
        WebView mWebView = mrWebviewFragment.getWebView();
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
            mWebView.goBack();
        } else {
            Intent data = new Intent();
            setResult(RESULT_OK, data);
            finish();
        }
    }

    @Override
    public void handleTitle(String title) {
        //设置标题
        if (!useTitile) {
            if (TextUtils.isEmpty(title)) {
                if (TextUtils.isEmpty(mTitle)) {
                    topTitle.setText("详情");
                } else {
                    topTitle.setText(mTitle);
                }
            } else {
                topTitle.setText(title);
            }
        } else {
            if (TextUtils.isEmpty(mTitle)) {
                topTitle.setText("详情");
            } else {
                topTitle.setText(mTitle);
            }
        }
    }

    @Override
    public void onProgress(int newProgress) {
        if (newProgress < 100) {
            progressbar.setProgress(newProgress);
        } else {
            progressbar.setVisibility(View.GONE);
        }
    }

    private ViewTreeObserver.OnGlobalLayoutListener getGlobalLayoutListener(final View decorView, final View contentView) {
        return new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect r = new Rect();
                decorView.getWindowVisibleDisplayFrame(r);

                int height = decorView.getContext().getResources().getDisplayMetrics().heightPixels;
                int diff = height - r.bottom;

                if (diff != 0) {
                    if (contentView.getPaddingBottom() != diff) {
                        contentView.setPadding(0, 0, 0, diff);
                    }
                } else {
                    if (contentView.getPaddingBottom() != 0) {
                        contentView.setPadding(0, 0, 0, 0);
                    }
                }
            }
        };
    }

    @Override
    public void showWebView(String webUrl) {
        Intent toMoreDetails = new Intent(this, MRWebviewActivity.class);
        toMoreDetails.putExtra(WEBVIEW_URL, webUrl);
        toMoreDetails.putExtra(WEBVIEW_ACTION, "get");
        startActivity(toMoreDetails);
    }
}
