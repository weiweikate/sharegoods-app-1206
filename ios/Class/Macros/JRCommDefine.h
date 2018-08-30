//
//  JRCommDefine.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef JRCommDefine_h
#define JRCommDefine_h

//获取存储对象
#define kUserDefaults       [NSUserDefaults standardUserDefaults]
//时间
#define kDate(t)                            [NSDate dateWithTimeIntervalSince1970:t]
//获取屏幕宽高
#define KScreenWidth         [[UIScreen mainScreen] bounds].size.width
#define KScreenHeight        [[UIScreen mainScreen] bounds].size.height
#define KRootVC    [UIApplication sharedApplication].keyWindow.rootViewController

// iPhone X
#define kStatusBarHeight     CGRectGetHeight([UIApplication sharedApplication].statusBarFrame) //状态栏高度
#define kTabBarMoreHeight    (kIPhoneX ? 34.f : 0.f) // tab 底部高度
#define kNavBarHeight        (kStatusBarHeight + 64.f)
#define kTabBarHeight        (kTabBarMoreHeight + 49.f)
#define KNoNavHeight         KScreenHeight - kNavBarHeight
#define KNoTabHeight         KScreenHeight - kTabBarHeight
#define KNoNavTabHeight      KScreenHeight - kNavBarHeight - kTabBarHeight

//根据ip6的屏幕来拉伸
#define kRealValue(with)     ((with)*(KScreenWidth/375.f))
#define kIphone4             (KScreenHeight == 480.f)
#define kIphoneN             (KScreenHeight == 667.f)
#define kIPhoneX             (KScreenHeight == 812.f ? YES : NO)

///IOS 版本判断
#define IOSAVAILABLEVERSION(version) ([[UIDevice currentDevice] availableVersion:version] < 0)
// 当前系统版本
#define kCurrentSystemVersion [[UIDevice currentDevice] systemVersion]
#define kAppVersion     [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]
#define kAppBundleId    [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"]

//强弱引用
#define WS(weakSelf)  __weak __typeof(&*self)weakSelf = self;
#define kStrongSelf(type) __strong typeof(type) type = weak##type;
//当前语言
#define CurrentLanguage (［NSLocale preferredLanguages] objectAtIndex:0])

//-------------------打印日志-------------------------
//DEBUG  模式下打印日志,当前行
#ifdef DEBUG
#define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#else
#define DLog(...)
#endif

//拼接字符串
#define kFormat(string, args...)            [NSString stringWithFormat:string, args]

//颜色
#define RGB(r, g, b)                        [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:1.0]
#define RGBA(r, g, b, a)                    [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:a]
#define HEXCOLOR(c)                         [UIColor colorWithRed:((c>>16)&0xFF)/255.0 green:((c>>8)&0xFF)/255.0 blue:(c&0xFF)/255.0 alpha:1.0];
#define kRandomColor    KRGBColor(arc4random_uniform(256)/255.0,arc4random_uniform(256)/255.0,arc4random_uniform(256)/255.0)        //随机色生成

//读取本地图片
#define kIMAGE(_X_) [UIImage imageNamed:_X_]

//数据验证
#define StrValid(f) (f!=nil && [f isKindOfClass:[NSString class]] && ![f isEqualToString:@""])
#define SafeStr(f) (StrValid(f) ? f:@"")
#define HasString(str,key) ([str rangeOfString:key].location!=NSNotFound)

#define ValidStr(f) StrValid(f)
#define ValidDict(f) (f!=nil && [f isKindOfClass:[NSDictionary class]])
#define ValidArray(f) (f!=nil && [f isKindOfClass:[NSArray class]] && [f count]>0)
#define ValidNum(f) (f!=nil && [f isKindOfClass:[NSNumber class]])
#define ValidClass(f,cls) (f!=nil && [f isKindOfClass:[cls class]])
#define ValidData(f) (f!=nil && [f isKindOfClass:[NSData class]])

//发送通知
#define kNotificationCenter [NSNotificationCenter defaultCenter]
#define KPostNotification(name,obj) [[NSNotificationCenter defaultCenter] postNotificationName:name object:obj];

//单例化一个类
#define SINGLETON_FOR_HEADER(className) \
\
+ (className *)sharedInstance;

#define SINGLETON_FOR_CLASS(className) \
\
+ (className *)sharedInstance { \
static className *shared##className = nil; \
static dispatch_once_t onceToken; \
dispatch_once(&onceToken, ^{ \
shared##className = [[self alloc] init]; \
}); \
return shared##className; \
}

//代理宏定义
#define CALL_DELEGATE(_delegate, _selector) \
do { \
id _theDelegate = _delegate; \
if(_theDelegate != nil && [_theDelegate respondsToSelector:_selector]) { \
[_theDelegate performSelector:_selector]; \
} \
} while(0);

#define CALL_DELEGATE_WITH_ARG(_delegate, _selector, _argument) \
do { \
id _theDelegate = _delegate; \
if(_theDelegate != nil && [_theDelegate respondsToSelector:_selector]) { \
[_theDelegate performSelector:_selector withObject:_argument]; \
} \
} while(0);

#define CALL_DELEGATE_WITH_ARGS(_delegate, _selector, _arg1, _arg2) \
do { \
id _theDelegate = _delegate; \
if(_theDelegate != nil && [_theDelegate respondsToSelector:_selector]) { \
[_theDelegate performSelector:_selector withObject:_arg1 withObject:_arg2]; \
} \
} while(0);

#endif /* JRCommDefine_h */
