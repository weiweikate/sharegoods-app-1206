package com.meeruu.sharegoods.rn;

import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.flat.RCTTextInputManager;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.uimanager.ViewManager;
//import com.facebook.react.views.textinput.ReactTextInputManager;
//import com.meeruu.commonlib.utils.SPCacheUtils;
//import com.meeruu.sharegoods.rn.textinput.RCTTextInputMRManager;
//import com.meeruu.sharegoods.rn.textinput.ReactTextInputMRManager;

import java.util.Iterator;
import java.util.List;

/**
 * 修复rn输入框的bug
 */
public class MainReactPackage extends com.facebook.react.shell.MainReactPackage {

    public MainReactPackage(MainPackageConfig config) {
        super(config);
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = super.createViewManagers(reactContext);
//        boolean useFlatUi = (boolean) SPCacheUtils.get("flat_uiimplementation", false);
//        Iterator<ViewManager> it = viewManagers.iterator();
//        while (it.hasNext()) {
//            ViewManager view = it.next();
//            if (view instanceof RCTTextInputManager) {
//                it.remove();
//                break;
//            }
//            if (view instanceof ReactTextInputManager) {
//                it.remove();
//                break;
//            }
//        }
//        if (useFlatUi) {
//            viewManagers.add(new RCTTextInputMRManager());
//        } else {
//            viewManagers.add(new ReactTextInputMRManager());
//        }
        return viewManagers;
    }
}
