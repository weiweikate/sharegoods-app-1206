package com.meeruu.permissions;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.RestrictTo;
import androidx.appcompat.app.AppCompatActivity;

@RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
public class AppSettingsDialogHolderActivity extends AppCompatActivity implements DialogInterface.OnClickListener {
    private AppSettingsDialog mDialog;

    public static Intent createShowDialogIntent(Context context, AppSettingsDialog dialog) {
        return new Intent(context, AppSettingsDialogHolderActivity.class)
                .putExtra(AppSettingsDialog.EXTRA_APP_SETTINGS, dialog);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (mDialog == null) {
            if (getIntent() != null) {
                mDialog = getIntent().getParcelableExtra(AppSettingsDialog.EXTRA_APP_SETTINGS);
            }
        }
        if (mDialog != null) {
            mDialog.dialogDismiss();
            mDialog.setContext(this);
            mDialog.setActivityOrFragment(this);
            mDialog.setNegativeListener(this);
            mDialog.showDialog();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        releaseDialog();
    }

    private void releaseDialog() {
        if (mDialog != null) {
            mDialog.dialogDismiss();
            mDialog = null;
        }
    }

    @Override
    public void onClick(DialogInterface dialog, int which) {
        setResult(Activity.RESULT_CANCELED);
        releaseDialog();
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        setResult(resultCode, data);
        releaseDialog();
        finish();
    }
}
