package com.meeruu.nativedb;

import java.util.List;

public interface MultiGetCallback {
    void onSuccess(List data);
    void onFail(String type);
}
