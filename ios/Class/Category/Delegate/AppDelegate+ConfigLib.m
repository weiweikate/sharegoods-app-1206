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
#import <UMSocialCore/UMSocialCore.h>

@implementation AppDelegate (ConfigLib)
-(void)JR_ConfigLib:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self configUM];
  [self configQYLib];
//  [self configAPNS];
  [self configGlobalToastAndLoading];
  
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
  [[UMSocialManager defaultManager] setUmSocialAppkey:KUmSocialAppkey];
  [[UMSocialManager defaultManager] openLog:YES];
  /* 微信朋友圈 */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatTimeLine
                                        appKey:KWechatAppKey
                                     appSecret:KWechatAppSecret
                                   redirectURL:@""];
  /* 微信聊天 */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatTimeLine
                                        appKey:KWechatAppKey
                                     appSecret:KWechatAppSecret
                                   redirectURL:@""];
  
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
