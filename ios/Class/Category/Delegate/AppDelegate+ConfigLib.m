//
//  AppDelegate+ConfigLib.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate+ConfigLib.h"
#import "EasyTextGlobalConfig.h"
#import "EasyLoadingGlobalConfig.h"
#import "JRPay.h"
#import <QYSDK.h>
#import <UMShare/UMShare.h>
#import <UMCommon/UMCommon.h>
#import "IQKeyboardManager.h"

@implementation AppDelegate (ConfigLib)
-(void)JR_ConfigLib:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self configUM];
  [self configQYLib];
//  [self configAPNS];
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
  [[QYSDK sharedSDK] registerAppId:KQiYuKey appName:@"app名字"];
}
#pragma mark 配置推送
-(void)configAPNS{
  //推送消息相关处理
  if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerForRemoteNotifications)])
  {
    UIUserNotificationType types = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound |         UIRemoteNotificationTypeAlert;
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types
                                                                             categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  }
  else
  {
    UIRemoteNotificationType types = UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound |         UIRemoteNotificationTypeBadge;
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:types];
  }
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
//应用退出后的bgde后期根据具体业务再说
//  NSInteger count = [[[QYSDK sharedSDK] conversationManager] allUnreadCount];
//  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
}
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //提交token给七鱼 ,应用如果再接入其他三方推送,也可以写入此方法,根据后期业务具体调整
  [[QYSDK sharedSDK] updateApnsToken:deviceToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"register remote notification failed %@",error);
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  if ([UIApplication sharedApplication].applicationState == UIApplicationStateInactive) {
    [self showChatViewController:userInfo];
  }
}

#pragma mark - delegate
//支持目前所有iOS系统
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
      [[JRPay sharedPay] handleOpenUrl:url];
  }
  return YES;
}

#pragma mark 推送来的消息解析
-(void)showChatViewController:(NSDictionary *)userInfo{
  id object = [userInfo objectForKey:@"nim"]; //含有“nim”字段，就表示是七鱼的消息
  if (object)
  {

  }
}
@end
