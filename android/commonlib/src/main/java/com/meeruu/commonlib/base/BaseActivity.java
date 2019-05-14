package com.meeruu.commonlib.base;

import android.os.Bundle;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.View;

import com.meeruu.commonlib.R;
import com.meeruu.commonlib.umeng.UApp;
import com.meeruu.commonlib.utils.NoFastClickUtils;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.commonlib.utils.StringUtis;
import com.meeruu.permissions.AfterPermissionGranted;
import com.meeruu.permissions.AppSettingsDialog;
import com.meeruu.permissions.Permission;
import com.meeruu.permissions.PermissionUtil;
import com.meeruu.statusbar.BarHide;
import com.meeruu.statusbar.ImmersionBar;

import java.util.Arrays;
import java.util.List;

import cn.jpush.android.api.JPushInterface;


/**
 * activity父类基本封装
 * Created by louis on 2017/2/22.
 */
public abstract class BaseActivity extends AppCompatActivity implements View.OnClickListener, PermissionUtil.PermissionCallbacks {
    private boolean changeStatusTrans = false;
    private AppSettingsDialog permissionDialog;
    private int statusColor = R.color.app_top_color;
    public LayoutInflater mInflater;
    protected boolean hasBasePer = false;
    protected boolean canFastClick = false;
    private static String[] mDenyPerms = StringUtis.concatAll(
            Permission.STORAGE, Permission.PHONE, Permission.LOCATION);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mInflater = LayoutInflater.from(this);
        super.onCreate(savedInstanceState);
        initStatusBar();
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onResume() {
        requestPermissions();
        super.onResume();
        UApp.pageSessionStart(this);
        JPushInterface.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        UApp.pageSessionEnd(this);
        JPushInterface.onPause(this);
    }

    @AfterPermissionGranted(ParameterUtils.REQUEST_CODE_PERMISSIONS)
    public void requestPermissions() {
        if (!PermissionUtil.hasPermissions(this, mDenyPerms)) {
            hasBasePer = false;
            //申请基本的权限
            PermissionUtil.requestPermissions(this, Permission.getPermissionContent(Arrays.asList(mDenyPerms)),
                    ParameterUtils.REQUEST_CODE_PERMISSIONS, mDenyPerms);
        } else {
            hasBasePer = true;
            hasBasePermission();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (permissionDialog != null) {
            permissionDialog.dialogDismiss();
            permissionDialog = null;
        }
    }

    //填充页面视图
    @Override
    public void setContentView(@LayoutRes int layoutResID) {
        setContentView(mInflater.inflate(layoutResID, null));
    }

    @Override
    public void setContentView(View view) {
        super.setContentView(view);
        initViewAndData();
        initEvent();
    }

    protected void setChangeStatusTrans(boolean changeStatusTrans) {
        this.changeStatusTrans = changeStatusTrans;
    }

    protected void setStatusColor(int color) {
        this.statusColor = color;
    }

    /**
     * 沉浸式状态栏
     */
    public void initStatusBar() {
        ImmersionBar immersionBar = ImmersionBar.with(this);
        if (changeStatusTrans) {
            immersionBar.transparentStatusBar();
        } else {
            immersionBar.barColor(statusColor)
                    .hideBar(BarHide.FLAG_SHOW_BAR)
                    .fitsSystemWindows(true);
        }
        immersionBar.navigationBarColor(statusColor)
                .statusBarDarkFont(true)
                .navigationBarDarkIcon(true)
                .init();
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
    }

    //初始化view
    protected abstract void initViewAndData();

    //初始化事件
    public abstract void initEvent();

    //响应点击事件
    protected abstract void doClick(View v);

    //获取了100%的基本权限
    public void hasBasePermission() {
    }

    //物理回退
    @Override
    public void onBackPressed() {
        finish();
    }

    //点击事件
    @Override
    public void onClick(View v) {
        if (canFastClick) {
            doClick(v);
        } else {
            if (!NoFastClickUtils.isFastClick()) {
                doClick(v);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        PermissionUtil.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }


    @Override
    public void onPermissionsGranted(int requestCode, List<String> perms) {
    }

    @Override
    public void onPermissionsDenied(int requestCode, List<String> denyPerms) {
        String[] perms = new String[denyPerms.size()];
        mDenyPerms = denyPerms.toArray(perms);
        if (PermissionUtil.shouldShowRationale(this, mDenyPerms)) {
            //继续申请被拒绝了的基本权限
            PermissionUtil.requestPermissions(this, Permission.getPermissionContent(denyPerms),
                    requestCode, mDenyPerms);
        } else {
            verifyPermission(denyPerms);
        }
    }

    public void verifyPermission(List<String> denyPerms) {
        if (denyPerms != null && denyPerms.size() > 0) {
            if (permissionDialog != null && permissionDialog.isShowing()) {
                permissionDialog.dialogDismiss();
            }
            permissionDialog = new AppSettingsDialog.Builder(this).build(denyPerms);
            permissionDialog.show();
        }
    }
}

