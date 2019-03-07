package com.meeruu.sharegoods.application;

import android.content.Context;
import android.support.annotation.Keep;
import android.support.multidex.MultiDex;

import com.meeruu.sharegoods.MainApplication;
import com.taobao.sophix.SophixApplication;
import com.taobao.sophix.SophixEntry;
import com.taobao.sophix.SophixManager;

/**
 * @author louis
 * @date on 2018/9/3
 * @describe Sophix稳健接入
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class SophixStubApplication extends SophixApplication {

    // 此处SophixEntry应指定真正的Application，并且保证RealApplicationStub类名不被混淆。
    @Keep
    @SophixEntry(MainApplication.class)
    static class RealApplicationStub {
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
        initSophix();
    }

    private void initSophix() {
        String appVersion = "0.0.0";
        try {
            appVersion = this.getPackageManager()
                    .getPackageInfo(this.getPackageName(), 0)
                    .versionName;
        } catch (Exception e) {
        }
        SophixManager.getInstance().setContext(this)
                .setAppVersion(appVersion)
                .setSecretMetaData("25218417", "5586172e5cdd9d8719659abb82175eca",
                        "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1ogKmGWpbnkhCmSVWKoKd" +
                                "9vgilOqv0f0esqtnOiBVF3YkbWipMbsl0F8CxdfOi/EBjWwRviJT7LsSbDmMRu3Cyyk0" +
                                "36Rk3+ROCHUepiPgwSscOl+CQ1wF/kYEqORtSF+r6oApEVhSYnjk5u3MFwJOKliBSp6r" +
                                "t9daMJVH/FtQHMzz6ZBzo850INpXhMSAt2oUrxppDXTKMRLYJWCqTusCS3mmAPONZyy+" +
                                "FgjLJb1jMRKnkt9Fvf6HvgsBLq+hlTlD+EW3XkhkGCoIZMQG0f59xKiGxigUEHZt86sC" +
                                "wQ/AP7EyduIF7guYhoLDurzVtdeR8o9TKfypcU3p+BUPjgQdAgMBAAECggEBAKSHu2qG" +
                                "v0d62+4oGCAzpdo964w35VebGnUCWC3MA5nRBN3+lb4eJG8ej9JNMS4SqiBD4U85MpNf" +
                                "cB5CFucxIRNBQXR52cre3Uqqcp1u1jU0Bj8tyXKQXf231elGrJUp6DAs3idVZPJL7UM8" +
                                "xNAJT7dKuJ114MGgaN10AOYSfQzVY0TV/4h2r8x1k4qQXiq83xKFd2oYPV9Vjfk8134t" +
                                "eOtHRClJHq84aGCUVDJCXAfEKSvZdZZiCX2yG16sCZWDYSL3vPmwgA+rGNXFZ2g6FvUS" +
                                "ZMF6Gvn07lIuI9TM46uJPHLpTQIoGP2a7zzvewqxUcX0+lkZifWP8nS4gBYv18ECgYEA" +
                                "2vMYomiSSJFmPGulTzvfFZfGcpoGkyzSeus0vINLOF3CULHlxJAwbchy4UsbdPR+u6F8" +
                                "09xcrDclIxXMtijqLEdky+1j0oqRG9LCipz1sJtTq90yN03Kuqia+eeYYGMGtLVpZFWu" +
                                "Fowf4HcvWO7Efm72XEsh3qGXbyIGT9xMRrUCgYEA1F5aA56h0Vp5RyZoUz/P/+bbqKFC" +
                                "IjjxNly32sZ+b71QJWOmRTrqzPYeA9yAK2SuzMPSVhmmCrUBSrfNZlTP5nfgVB6qDAJy" +
                                "Flawsx1skbYAlcXqBynQ/dRZ3VzfzmbaK0IhpY2XitblIk3KvK5+fE095jIX/Ymde022" +
                                "4QUQgMkCgYEAmNgXHFkPtWT7D7a9weAzzWkUebAYYulpTbGgMPEes4yQN7DYiy11AU5r" +
                                "E+dQlYaQaf9Dmso8T2R3olR3gbpyLtLwBIQFqVZeEiRA9m63/L+R22ogwgamPUOyXD5W" +
                                "WwMGDWSO3CIL02WiYxoQjW6w8OoZRTiVvkrj4grIiTtqa/kCgYAVbqg68Ul3bWAL9C5X" +
                                "KHt/YfcNH6ki9wgw6k6Lv7iG4l4yR8pB9l437Sa+UQSGXJTfiWuy0MfXEMlelwodp7WL" +
                                "ltGG68lRiPWml30htnh8hBevBdhGfMvgsguXsYXMuMiP0Q7APHfsxR8+xQcO37VYKhtz" +
                                "Hd8Z8Ud5aDBqqS4vMQKBgFnfT3n6H/Q5SHDc8Qsn9gjQ5Pahn3E6C1XTv3frpTyR9rCv" +
                                "zVteFRWkyuQxo7Fin1CgLlYuJEtIB9aJtPMCasnMGdcR9DGEH29NaG2IJdXFe9tKgbdY" +
                                "rZ4OWxn5A1falNSZg7926pMY8ss5S1u44QtQ8AspOnO2+2L0jdjJGEue")
                // meeruu 16位md5
                .setAesKey("b191ddf270254ac9")
                .setEnableDebug(false)
                .setEnableFullLog()
                .initialize();
    }
}
