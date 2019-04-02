package com.meeruu.sharegoods.task;

import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Message;
import android.text.TextUtils;

import com.meeruu.commonlib.handler.WeakHandler;
import com.meeruu.commonlib.utils.ParameterUtils;
import com.smartstudy.qrcode.qrdecode.BarcodeFormat;
import com.smartstudy.qrcode.qrdecode.DecodeEntry;

/**
 * @author louis
 * @date on 2018/3/20
 * @describe 扫描二维码
 * @org sharegoods.meeruu.com
 * @email luoyongming@meeruu.com
 */

public class ScanQrcodeTask extends AsyncTask<Bitmap, Integer, String> {

    private WeakHandler mHandler;
    private BarcodeFormat barcodeFormat;

    public ScanQrcodeTask(WeakHandler handler) {
        this.mHandler = handler;
        this.barcodeFormat = new BarcodeFormat();
        this.barcodeFormat.add(BarcodeFormat.BARCODE);
        this.barcodeFormat.add(BarcodeFormat.QRCODE);
    }

    @Override
    protected String doInBackground(Bitmap... bitmaps) {
        return DecodeEntry.getPixelsByBitmap(bitmaps[0], barcodeFormat, false);
    }

    @Override
    protected void onPostExecute(String result) {
        if (!TextUtils.isEmpty(result)) {
            Message msg = Message.obtain();
            msg.what = ParameterUtils.MSG_WHAT_REFRESH;
            msg.obj = result;
            mHandler.sendMessage(msg);
        }
    }
}
