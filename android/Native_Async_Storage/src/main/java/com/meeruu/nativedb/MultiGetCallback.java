package com.meeruu.nativedb;

import java.util.List;

public interface MultiGetResult {
    void onSuccess(List data);
    void onFail(String type);
}
