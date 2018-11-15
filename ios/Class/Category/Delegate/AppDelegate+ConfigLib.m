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
#import "EasyTextGlobalConfig.h"
#import "EasyLoadingGlobalConfig.h"
#import "JRPay.h"
#import <QYSDK.h>
#import <UMShare/UMShare.h>
#import <UMCommon/UMCommon.h>
#import "IQKeyboardManager.h"
#import <React/RCTLinkingManager.h>



@implementation AppDelegate (ConfigLib)
-(void)JR_ConfigLib:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self configUM];
  [self configQYLib];
  [self configGlobalToastAndLoading];
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

-(void)configGlobalToastAndLoading{
  EasyTextGlobalConfig *textGlobalConfig = [EasyTextGlobalConfig shared];
  textGlobalConfig.superReceiveEvent = YES;
  textGlobalConfig.animationType = TextAnimationTypeFade;
  textGlobalConfig.bgColor = [UIColor blackColor];
  textGlobalConfig.titleFont = [UIFont systemFontOfSize:13];
  textGlobalConfig.titleColor = [UIColor whiteColor];
  textGlobalConfig.shadowColor = [UIColor clearColor];
  textGlobalConfig.textShowTimeBlock = ^float(NSString * _Nonnull text) {
    return 2.f;//全部设置成两秒，后期根据需求再改
  };
  
  EasyLoadingGlobalConfig * loadingGlobalConfig = [EasyLoadingGlobalConfig shared];
  loadingGlobalConfig.animationType = LoadingAnimationTypeNone;
  loadingGlobalConfig.showOnWindow = YES;
  loadingGlobalConfig.superReceiveEvent = NO;
  loadingGlobalConfig.tintColor = [UIColor whiteColor];
  loadingGlobalConfig.LoadingType = LoadingShowTypeIndicatorLeft;
  loadingGlobalConfig.textFont = [UIFont systemFontOfSize:13];
  loadingGlobalConfig.bgColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.9];
}
-(void)configUM{
  [UMConfigure initWithAppkey:KUmSocialAppkey channel:nil];
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
  result = [RCTLinkingManager application:application openURL:url
                        sourceApplication:nil annotation:nil];
  return YES;
}


@end
