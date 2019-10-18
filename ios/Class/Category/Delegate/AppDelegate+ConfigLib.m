//
//  AppDelegate+ConfigLib.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

/**
 * @author huyufeng
 * @date on 2018/9/3
 * @describe ios AppDelegate
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */

#import "AppDelegate+ConfigLib.h"
#import "JRPay.h"
#import <QYSDK.h>
#import <UMShare/UMShare.h>
#import <UMCommon/UMCommon.h>
#import <UMAnalytics/MobClick.h>
#import "IQKeyboardManager.h"
#import <React/RCTLinkingManager.h>
#import "SensorsAnalyticsSDK.h"
#import "BGKeychainTool.h"
#import "JRBaseVC.h"
#import <React-Native-Webview-Bridge/RCTWebViewBridge.h>
#import "StorageFromRN.h"
#import "JRServiceManager.h"
#import "NSString+UrlAddParams.h"
@interface RCTWebViewBridge (ConfigLib)
- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request
 navigationType:(UIWebViewNavigationType)navigationType;
@end
@implementation RCTWebViewBridge (ConfigLib)
+ (void)load
{
  // self -> UIImage
  // 获取imageNamed
  // 获取哪个类的方法
  // SEL:获取哪个方法
  Method imageNamedMethod = class_getInstanceMethod(self, @selector(webView:shouldStartLoadWithRequest:navigationType:));
  // 获取xmg_imageNamed
  Method xmg_imageNamedMethod = class_getInstanceMethod(self, @selector(track_webView:shouldStartLoadWithRequest:navigationType:));
  // 交互方法:runtime
  method_exchangeImplementations(imageNamedMethod, xmg_imageNamedMethod);
  
  
}

- (BOOL)track_webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request
       navigationType:(UIWebViewNavigationType)navigationType{
  if ([[SensorsAnalyticsSDK sharedInstance] showUpWebView:webView WithRequest:request enableVerify:YES]) {
    return NO;
  }
  return [self track_webView:webView shouldStartLoadWithRequest:request navigationType:navigationType];
}

@end

@implementation AppDelegate (ConfigLib)
-(void)JR_ConfigLib:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self configUM];
  [self configQYLib];
  [self IQKeyboardManager];
}

- (void)IQKeyboardManager{
  IQKeyboardManager *manager = [IQKeyboardManager sharedManager];
  // 控制整个功能是否启用
  manager.enable = YES;
  // 控制是否显示键盘上的自动工具条,当需要支持内联编辑(Inline Editing), 这就需要隐藏键盘上的工具条(默认打开)
  manager.enableAutoToolbar = NO;
  // 启用手势触摸:控制点击背景是否收起键盘。
  manager.shouldResignOnTouchOutside = YES;
}


-(void)configUM{
  [UMConfigure initWithAppkey:KUmSocialAppkey channel:nil];
#if DEBUG
  [MobClick setCrashReportEnabled:NO];
#endif
  
  [[UMSocialManager defaultManager] openLog:YES];
  /* 设置微信的appKey和appSecret */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession
                                        appKey:KWechatAppKey
                                     appSecret:KWechatAppSecret
                                   redirectURL:@"http://mobile.umeng.com/social"];
  /* 设置分享到QQ互联的appID
   * U-Share SDK为了兼容大部分平台命名，统一用appKey和appSecret进行参数设置，而QQ平台仅需将appID作为U-Share的appKey参数传进即可。
   */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ
                                        appKey:KQQAppKey/*设置QQ平台的appID*/
                                     appSecret:nil
                                   redirectURL:@"http://mobile.umeng.com/social"];
  /* 设置新浪的appKey和appSecret */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina
                                        appKey:KWeiboKey
                                     appSecret:KWeiboAppSecret
                                   redirectURL:@"https://sns.whalecloud.com/sina2/callback"];
  
}
-(void)configQYLib{
  
  [[QYSDK sharedSDK] registerAppId:KQiYuKey appName:@"秀购"];
  [QYCustomUIConfig sharedInstance].customMessageTextColor=[UIColor whiteColor];
  //  [QYCustomUIConfig sharedInstance].customerMessageBubbleNormalImage = [[UIImage imageNamed:@"qipao"] resizableImageWithCapInsets:UIEdgeInsetsMake(25, 10, 10, 10) resizingMode:UIImageResizingModeStretch];
  //  [QYCustomUIConfig sharedInstance].customerMessageBubblePressedImage = [[UIImage imageNamed:@"qipao"]resizableImageWithCapInsets:UIEdgeInsetsMake(25, 10, 10, 10) resizingMode:UIImageResizingModeStretch];
  [QYCustomUIConfig sharedInstance].serviceMessageHyperLinkColor = [UIColor colorWithHexString:@"#FF0050"];
  [QYCustomUIConfig sharedInstance].serviceMessageTextFontSize = 13.0f;
  //  [QYCustomUIConfig sharedInstance].showShopEntrance = YES;
  
}
#pragma mark - delegate
//支持目前所有iOS系统
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
  BOOL result=NO;
  result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
    [[JRPay sharedPay] handleOpenUrl:url];
  }
  
  if ([[SensorsAnalyticsSDK sharedInstance] handleSchemeUrl:url]) {
    return YES;
  }
  //ios9机型 白色闪屏 延迟跳转
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.8* NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [RCTLinkingManager application:application openURL:url sourceApplication:nil annotation:nil];
  });
  return YES;
}

- (void)initSensorsAnalyticsWithLaunchOptions:(NSDictionary *)launchOptions {
  
  // 初始化 SDK
  SensorsAnalyticsSDK * sdkInstance = [SensorsAnalyticsSDK sharedInstanceWithServerURL:[StorageFromRN getTrackAddress]
                                                                      andLaunchOptions:launchOptions
                                                                          andDebugMode:SA_DEBUG_MODE];
  
  // 打开自动采集, 并指定追踪哪些 AutoTrack 事件
  [sdkInstance enableAutoTrack:SensorsAnalyticsEventTypeAppStart|
                               SensorsAnalyticsEventTypeAppEnd];
//  |
//  SensorsAnalyticsEventTypeAppClick|
//  SensorsAnalyticsEventTypeAppViewScreen
  
  /** 设置公共属性*/
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  NSString *app_Name = [infoDictionary objectForKey:@"CFBundleDisplayName"];
  NSDictionary *superProperties = @{@"platform": @"iOS",
                                    @"platformType": @"iOS",
                                    @"product": [NSString stringWithFormat:@"%@-App", app_Name]
                                    };
  NSString *uuid = [BGKeychainTool getDeviceIDInKeychain];
  
  [sdkInstance registerSuperProperties:superProperties];
  [sdkInstance trackInstallation:@"AppInstall" withProperties:@{@"DownloadChannel": @"appStore"}];
  // 忽略单个页面
  [sdkInstance ignoreAutoTrackViewControllers:@[[JRBaseVC class]]];
  [sdkInstance identify: uuid];
  [[SensorsAnalyticsSDK sharedInstance] addWebViewUserAgentSensorsDataFlag];
  
}


@end
