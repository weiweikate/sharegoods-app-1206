

#基本指令
-optimizationpasses 5  #指定代码的压缩级别 0 - 7
-dontskipnonpubliclibraryclassmembers  #如果应用程序引入的有jar包，并且想混淆jar包里面的class
-printmapping proguardMapping.txt
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*  #混淆时采用的算法
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature  #过滤泛型（不写可能会出现类型转换错误，一般情况把这个加上就是了）
-dontpreverify  #预校验

-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn java.nio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**

-keepclassmembers class * {
   public <init> (org.json.JSONObject);
}
-keep public class com.meeruu.sharegoods.R$*{
public static final int *;
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-ignorewarnings

-keep class * {
    public private *;
}
-keep class * {
    public protected *;
}