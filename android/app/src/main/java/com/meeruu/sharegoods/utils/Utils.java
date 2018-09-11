package com.meeruu.sharegoods.utils;

import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import java.util.List;

/**
 * Created by zhanglei on 2018/7/18.
 */

public class Utils {

    static SharedPreferences preferences;

    public static void setUserData(Context context, String setWhat_type, String setWhat_content){
        preferences=context.getSharedPreferences("UserData", context.MODE_PRIVATE);
        SharedPreferences.Editor editor=preferences.edit();
        editor.putString(setWhat_type,setWhat_content);
        editor.commit();
    }
    public static String getUserData(Context context, String needWhat){
        preferences=context.getSharedPreferences("UserData",context.MODE_PRIVATE);
        SharedPreferences.Editor editor=preferences.edit();
        return preferences.getString(needWhat,"");
    }
    public static String getAppPackageName(Context context){
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> taskInfo = activityManager.getRunningTasks(1);
        ComponentName componentInfo = taskInfo.get(0).topActivity;
        Log.d("lixx", "当前应用:" + componentInfo.getPackageName());
        return componentInfo.getPackageName();
    }

    /** px转换dip */
    public static int px2dip(int px,Context context) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (px / scale + 0.5f);
    }
}
