package com.meeruu.sharegoods.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.alibaba.fastjson.JSON;
import com.meeruu.sharegoods.rn.AppPayModule;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

/**
 * Created by zhanglei on 2018/8/17.
 */

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {
    private IWXAPI api;
    private static final String App_ID = "wx401bc973f010eece";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = WXAPIFactory.createWXAPI(this, null);
        api = WXAPIFactory.createWXAPI(WXPayEntryActivity.this, App_ID, true);
        api.handleIntent(getIntent(), this);
        finish();
    }


    @Override
    public void onResp(BaseResp baseResp) {
        WxResp wxResp = new WxResp();
        wxResp.setCode(baseResp.errCode);
        wxResp.setMsg(baseResp.errStr);
        wxResp.setSdkCode(baseResp.openId);
        String json = JSON.toJSONString(wxResp);
        AppPayModule.wxPayPromise.resolve(json);

    }

    @Override
    public void onReq(BaseReq baseReq) {

    }
}
