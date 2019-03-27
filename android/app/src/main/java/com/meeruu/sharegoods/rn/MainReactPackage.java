package com.meeruu.sharegoods.rn;

import android.text.TextUtils;

import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.storage.AsyncStorageModule;
import com.facebook.react.shell.MainPackageConfig;
import com.meeruu.commonlib.rn.storage.MRAsyncStorageModule;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.inject.Provider;

/**
 * 修复rn输入框的bug
 */
public class MainReactPackage extends com.facebook.react.shell.MainReactPackage {

    public MainReactPackage(MainPackageConfig config) {
        super(config);
    }

    @Override
    public List<ModuleSpec> getNativeModules(final ReactApplicationContext context) {
        List<ModuleSpec> moduleSpecs = super.getNativeModules(context);
        List<ModuleSpec> modules = new ArrayList<>(moduleSpecs);

        Iterator<ModuleSpec> it = modules.iterator();
        while (it.hasNext()) {
            ModuleSpec module = it.next();

            if (TextUtils.equals(AsyncStorageModule.class.getName(), module.getProvider().get().getClass().getName())) {
                it.remove();
                break;
            }
        }
        modules.add(ModuleSpec.nativeModuleSpec(
                MRAsyncStorageModule.class,
                new Provider<NativeModule>() {
                    @Override
                    public NativeModule get() {
                        return new MRAsyncStorageModule(context);
                    }
                }));
        return modules;
    }
}
