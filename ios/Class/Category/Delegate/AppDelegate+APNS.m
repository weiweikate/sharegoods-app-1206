//
//  AppDelegate+APNS.m
//  crm_app_xiugou
//
//  Created by Max on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate+APNS.h"
// 引入 JPush 功能所需头文件
#import "JPUSHService.h"
//#import "JSPush"

// iOS10 注册 APNs 所需头文件
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
// 如果需要使用 idfa 功能所需要引入的头文件
#import <AdSupport/AdSupport.h>
#import <SensorsAnalyticsSDK.h>

@implementation AppDelegate (APNS)

-(void)JR_ConfigAPNS:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  [self configAPNSWithOption:launchOptions];
  
  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
}
// 自定义消息 回调
- (void)networkDidReceiveMessage:(NSNotification *)notification {
  NSDictionary * userInfo = [notification userInfo];
  [[NSNotificationCenter defaultCenter]postNotificationName:@"HOME_CUSTOM_MSG" object:nil];
  NSString *typeString = userInfo[@"content_type"];
  
  if ([typeString isEqualToString:@"HomeRefresh"]) {
    NSString *homeTypeStr = userInfo[@"content"];
    NSDictionary * dic = [self dictionaryWithJsonString:homeTypeStr];
    [[NSNotificationCenter defaultCenter]postNotificationName:@"HOME_CUSTOM_MSG" object:dic[@"homeType"]];
  }
}
-(NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
  if (jsonString == nil) {
    return nil;
  }
  
  NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *err;
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                        error:&err];
  if(err)
  {
    NSLog(@"json解析失败：%@",err);
    return nil;
  }
  return dic;
}

#pragma mark 配置推送
-(void)configAPNSWithOption:(NSDictionary *)launchOptions{
  //  //推送消息相关处理
  //  if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerForRemoteNotifications)])
  //  {
  //    UIUserNotificationType types = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound |         UIRemoteNotificationTypeAlert;
  //    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types
  //                                                                             categories:nil];
  //    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  //    [[UIApplication sharedApplication] registerForRemoteNotifications];
  //  }
  //  else
  //  {
  //    UIRemoteNotificationType types = UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound |         UIRemoteNotificationTypeBadge;
  //    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:types];
  //  }
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionAlert;
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {}
  __weak typeof(self)  weakSelf = self;
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:weakSelf];
  // 获取 IDFA
  // 如需使用 IDFA 功能请添加此代码并在初始化方法的 advertisingIdentifier 参数中填写对应值
  //  NSString *advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  
  // Required
  // init Push
  // notice: 2.1.5 版本的 SDK 新增的注册方法，改成可上报 IDFA，如果没有使用 IDFA 直接传 nil
  // 如需继续使用 pushConfig.plist 文件声明 appKey 等配置内容，请依旧使用 [JPUSHService setupWithOption:launchOptions] 方式初始化。
  
  BOOL isProduction = NO;
  
#if DEBUG
  isProduction = NO;
#else
  isProduction = YES;
#endif
  
  [JPUSHService setupWithOption:launchOptions
                         appKey:KJSPushKey
                        channel:@"App Store"
               apsForProduction:isProduction
          advertisingIdentifier:nil];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //Optional
  NSLog(@"hyf--------did Fail To Register For Remote Notifications With Error: %@", error);
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
  //应用退出后的bgde后期根据具体业务再说
  //  NSInteger count = [[[QYSDK sharedSDK] conversationManager] allUnreadCount];
  //  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //提交token给七鱼 ,应用如果再接入其他三方推送,也可以写入此方法,根据后期业务具体调整
//  [[QYSDK sharedSDK] updateApnsToken:deviceToken];
  //极光提交
  [JPUSHService registerDeviceToken:deviceToken];
  [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
    NSLog(@"%@",registrationID);
    if (resCode == 0) {
      // 将极光推送的 Registration Id 存储在神策分析的用户 Profile "jgId" 中
      [SensorsAnalyticsSDK.sharedInstance profilePushKey:@"jgId" pushId:registrationID];
    }
  }];
  

}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  if ([UIApplication sharedApplication].applicationState == UIApplicationStateInactive) {
    [self showChatViewController:userInfo];
  }
}
#pragma mark 推送来的消息解析
-(void)showChatViewController:(NSDictionary *)userInfo{
  id object = [userInfo objectForKey:@"nim"]; //含有“nim”字段，就表示是七鱼的消息
  if (object)
  {
    
  }
}
@end
