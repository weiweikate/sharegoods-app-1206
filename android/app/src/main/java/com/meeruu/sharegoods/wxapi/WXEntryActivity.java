package com.meeruu.sharegoods.wxapi;

import android.widget.Toast;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.umeng.socialize.weixin.view.WXCallbackActivity;

/**
 * Created by zhanglei on 2018/8/17.
 */

public class WXEntryActivity extends WXCallbackActivity {
    public void onResp(BaseResp resp) {

        if(resp.getType()== ConstantsAPI.COMMAND_PAY_BY_WX){
            if(resp.errCode==0){
                Toast.makeText(this, "支付成功", Toast.LENGTH_LONG).show();
            }
            else {
                Toast.makeText(this, "支付失败", Toast.LENGTH_LONG).show();
            }
            finish();
        }
    }
}