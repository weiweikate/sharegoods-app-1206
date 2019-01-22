package com.meeruu.nativedb;

import java.util.List;

public interface MultiGetCallback {
    void onSuccess(Object data);
    void onFail(String type);
}
