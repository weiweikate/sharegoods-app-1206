/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.meeruu.sharegoods.rn.textinput;

/**
 * Implement this interface to be informed of selection changes in the ReactTextEdit
 * This is used by the ReactTextInputManager to forward events from the EditText to JS
 */
interface SelectionWatcher {
    void onSelectionChanged(int start, int end);
}
