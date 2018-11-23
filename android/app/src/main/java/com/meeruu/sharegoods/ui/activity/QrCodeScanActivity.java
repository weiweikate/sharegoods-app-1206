package com.meeruu.sharegoods.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;

import com.meeruu.commonlib.utils.ParameterUtils;
import com.meeruu.permissions.Permission;
import com.meeruu.permissions.PermissionUtil;
import com.meeruu.sharegoods.R;
import com.smartstudy.qrcode.CodeScanActivity;

import java.util.Arrays;
import java.util.List;

public class QrCodeScanActivity extends CodeScanActivity implements PermissionUtil.PermissionCallbacks {

    public static final int SCAN_RESULT_CODE = 501;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        if (!PermissionUtil.hasPermissions(this, Permission.CAMERA)) {
            PermissionUtil.requestPermissions(this, Permission.getPermissionContent(Arrays.asList(Permission.CAMERA)),
                    ParameterUtils.REQUEST_CODE_CAMERA, Permission.CAMERA);
        }
        super.onResume();
    }

    @Override
    public void handleResult(final String result) {
        super.handleResult(result);
        //TODO
        Intent intent = new Intent();
        intent.putExtra("isSuccess",true);
        intent.putExtra("ScanInfo",result);
        setResult(SCAN_RESULT_CODE,intent);
        finish();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        PermissionUtil.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    public void onPermissionsGranted(int requestCode, List<String> perms) {
        onStart();
        findViewById(R.id.sbv_scan).postInvalidate();
    }

    @Override
    public void onPermissionsDenied(int requestCode, List<String> perms) {
        Intent intent = new Intent();
        intent.putExtra("isSuccess",false);
        setResult(SCAN_RESULT_CODE,intent);
        finish();
    }
}
