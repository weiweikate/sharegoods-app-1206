package com.reactnative.ivpusic.imagepicker.picture.lib.imaging.core.clip;

import java.util.ArrayList;

public class ClipRatioConfig {
    public static final float RatioNone = 0;
    public static final float Ratio43 = 4/3f;
    public static final float Ratio11 = 1;
    public static final float Ratio34 = 3/4f;
    public static float CURRENT_CLIP_RATIO_CONFIG = RatioNone;


    public static void setCurrentClipRatioConfig(float type) {
        CURRENT_CLIP_RATIO_CONFIG = type;
    }

}
