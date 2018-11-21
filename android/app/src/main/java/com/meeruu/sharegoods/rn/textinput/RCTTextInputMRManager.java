package com.meeruu.sharegoods.rn.textinput;

import com.facebook.react.flat.RCTTextInput;
import com.facebook.react.module.annotations.ReactModule;

/**
 * Manages instances of TextInput.
 */
@ReactModule(name = RCTTextInputMRManager.REACT_CLASS)
public class RCTTextInputMRManager extends ReactTextInputMRManager {

    /* package */ static final String REACT_CLASS = ReactTextInputMRManager.REACT_CLASS;

    @Override
    public RCTTextInput createShadowNodeInstance() {
        return new RCTTextInput();
    }

    @Override
    public Class<RCTTextInput> getShadowNodeClass() {
        return RCTTextInput.class;
    }
}