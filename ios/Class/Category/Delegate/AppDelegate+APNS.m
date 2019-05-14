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
#import "JVERIFICATIONService.h"
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
  
  // 下边为一键登录相关设置,有问题请联系胡玉峰同志 OK? 如需使用 IDFA 功能请添加此代码并在初始化配置类中设置 advertisingId
//  NSString *idfaStr = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  JVAuthConfig *config = [[JVAuthConfig alloc] init];
  config.appKey = KJSPushKey;
//  config.advertisingId = idfaStr;
  [JVERIFICATIONService setupWithConfig:config];
  [JVERIFICATIONService setDebug:YES];
  [self customUI];
}

-(void)customUI{
  /*移动*/
  JVMobileUIConfig *mobileUIConfig = [[JVMobileUIConfig alloc] init];
  mobileUIConfig.logoImg = [UIImage imageNamed:@"cmccLogo"];
   mobileUIConfig.navColor = [UIColor whiteColor];
  NSMutableAttributedString * attriString =[[NSMutableAttributedString  alloc]initWithString:@"一键登录"];
  [ attriString  addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#4d4d4d"] range:NSMakeRange(0, 4)];
  mobileUIConfig.navText = attriString;
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  mobileUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  mobileUIConfig.logoImg = [UIImage imageNamed:@"logo"];
  mobileUIConfig.navReturnImg = [UIImage imageNamed:@"back"];
  mobileUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
   mobileUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  mobileUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  mobileUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  /*
   mobileUIConfig.authPageBackgroundImage = [UIImage imageNamed:@"背景图"];
   mobileUIConfig.navColor = [UIColor redColor];
   mobileUIConfig.barStyle = 0;
   mobileUIConfig.navText = [[NSAttributedString alloc] initWithString:@"自定义标题"];
   mobileUIConfig.navReturnImg = [UIImage imageNamed:@"自定义返回键"];
   UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
   button.frame = CGRectMake(0, 0, 44, 44);
   button.backgroundColor = [UIColor greenColor];
   mobileUIConfig.navControl = [[UIBarButtonItem alloc] initWithCustomView:button];
   mobileUIConfig.logoWidth = 100;
   mobileUIConfig.logoHeight = 100;
   mobileUIConfig.logoOffsetY = 50;
   mobileUIConfig.logoHidden = NO;
   mobileUIConfig.logBtnText = @"自定义登录按钮文字";
   mobileUIConfig.logoOffsetY = 100;
   mobileUIConfig.logBtnTextColor = [UIColor redColor];
   mobileUIConfig.numberColor = [UIColor blueColor];
   mobileUIConfig.numFieldOffsetY = 80;
   mobileUIConfig.uncheckedImg = [UIImage imageNamed:@"未选中图片"];
   mobileUIConfig.checkedImg = [UIImage imageNamed:@"选中图片"];
   mobileUIConfig.appPrivacyOne = @[@"应用自定义服务条款1",@"https://www.jiguang.cn/about"];
   mobileUIConfig.appPrivacyTwo = @[@"应用自定义服务条款2",@"https://www.jiguang.cn/about"];
   mobileUIConfig.appPrivacyColor = @[[UIColor redColor], [UIColor blueColor]];
   mobileUIConfig.privacyOffsetY = 20;
   mobileUIConfig.sloganOffsetY = 70;
   mobileUIConfig.sloganTextColor = [UIColor redColor];
   */
  [JVERIFICATIONService customUIWithConfig:mobileUIConfig customViews:^(UIView *customAreaView) {
    /*
     //添加一个自定义label
     UILabel *lable  = [[UILabel alloc] init];
     lable.text = @"这是一个自定义label";
     [lable sizeToFit];
     lable.center = customAreaView.center;
     [customAreaView addSubview:lable];
     */
  }];
  
  /*联通*/
  JVUnicomUIConfig *unicomUIConfig = [[JVUnicomUIConfig alloc] init];
  unicomUIConfig.logoImg = [UIImage imageNamed:@"cmccLogo"];
  unicomUIConfig.navColor = [UIColor whiteColor];
  unicomUIConfig.navText = attriString;
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  unicomUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  unicomUIConfig.logoImg = [UIImage imageNamed:@"logo"];
  unicomUIConfig.navReturnImg = [UIImage imageNamed:@"back"];
  unicomUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
  unicomUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  unicomUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  unicomUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  /*
   unicomUIConfig.authPageBackgroundImage = [UIImage imageNamed:@"背景图"];
   unicomUIConfig.navColor = [UIColor redColor];
   unicomUIConfig.barStyle = 0;
   unicomUIConfig.navText = [[NSAttributedString alloc] initWithString:@"自定义标题"];
   unicomUIConfig.navReturnImg = [UIImage imageNamed:@"自定义返回键"];
   UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
   button.frame = CGRectMake(0, 0, 44, 44);
   button.backgroundColor = [UIColor greenColor];
   unicomUIConfig.navControl = [[UIBarButtonItem alloc] initWithCustomView:button];
   unicomUIConfig.logoWidth = 100;
   unicomUIConfig.logoHeight = 100;
   unicomUIConfig.logoOffsetY = 50;
   unicomUIConfig.logoHidden = NO;
   unicomUIConfig.logBtnText = @"自定义登录按钮文字";
   unicomUIConfig.logoOffsetY = 100;
   unicomUIConfig.logBtnTextColor = [UIColor redColor];
   unicomUIConfig.numberColor = [UIColor blueColor];
   unicomUIConfig.numFieldOffsetY = 80;
   unicomUIConfig.uncheckedImg = [UIImage imageNamed:@"未选中图片"];
   unicomUIConfig.checkedImg = [UIImage imageNamed:@"选中图片"];
   unicomUIConfig.appPrivacyOne = @[@"应用自定义服务条款1",@"https://www.jiguang.cn/about"];
   unicomUIConfig.appPrivacyTwo = @[@"应用自定义服务条款2",@"https://www.jiguang.cn/about"];
   unicomUIConfig.appPrivacyColor = @[[UIColor redColor], [UIColor blueColor]];
   unicomUIConfig.privacyOffsetY = 20;
   unicomUIConfig.sloganOffsetY = 70;
   unicomUIConfig.sloganTextColor = [UIColor redColor];
   */
  [JVERIFICATIONService customUIWithConfig:unicomUIConfig customViews:^(UIView *customAreaView) {
    //添加自定义控件
  }];
  
  /*电信*/
  JVTelecomUIConfig *telecomUIConfig = [[JVTelecomUIConfig alloc] init];
  telecomUIConfig.logoImg = [UIImage imageNamed:@"ctccLogo"];
  telecomUIConfig.navColor = [UIColor whiteColor];
  telecomUIConfig.navText = attriString;
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  telecomUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  telecomUIConfig.logoImg = [UIImage imageNamed:@"logo"];
  telecomUIConfig.navReturnImg = [UIImage imageNamed:@"back"];
  telecomUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
  telecomUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  telecomUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  telecomUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  /*
   telecomUIConfig.authPageBackgroundImage = [UIImage imageNamed:@"背景图"];
   telecomUIConfig.navColor = [UIColor redColor];
   telecomUIConfig.barStyle = 0;
   telecomUIConfig.navText = [[NSAttributedString alloc] initWithString:@"自定义标题"];
   telecomUIConfig.navReturnImg = [UIImage imageNamed:@"自定义返回键"];
   UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
   button.frame = CGRectMake(0, 0, 44, 44);
   button.backgroundColor = [UIColor greenColor];
   telecomUIConfig.navControl = [[UIBarButtonItem alloc] initWithCustomView:button];
   telecomUIConfig.logoWidth = 100;
   telecomUIConfig.logoHeight = 100;
   telecomUIConfig.logoOffsetY = 50;
   telecomUIConfig.logoHidden = NO;
   telecomUIConfig.logBtnText = @"自定义登录按钮文字";
   telecomUIConfig.logoOffsetY = 100;
   telecomUIConfig.logBtnTextColor = [UIColor redColor];
   telecomUIConfig.numberColor = [UIColor blueColor];
   telecomUIConfig.numFieldOffsetY = 80;
   telecomUIConfig.uncheckedImg = [UIImage imageNamed:@"未选中图片"];
   telecomUIConfig.checkedImg = [UIImage imageNamed:@"选中图片"];
   telecomUIConfig.appPrivacyOne = @[@"应用自定义服务条款1",@"https://www.jiguang.cn/about"];
   telecomUIConfig.appPrivacyTwo = @[@"应用自定义服务条款2",@"https://www.jiguang.cn/about"];
   telecomUIConfig.appPrivacyColor = @[[UIColor redColor], [UIColor blueColor]];
   telecomUIConfig.privacyOffsetY = 20;
   telecomUIConfig.sloganOffsetY = 70;
   telecomUIConfig.sloganTextColor = [UIColor redColor];
   */
  [JVERIFICATIONService customUIWithConfig:telecomUIConfig customViews:^(UIView *customAreaView) {
    /*
     UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom]}
     button.frame = CGRectMake(50, 300, 44, 44);
     button.backgroundColor = [UIColor redColor];
     [button addTarget:self action:@selector(buttonTouch) forControlEvents:UIControlEventTouchUpInside];
     [customAreaView addSubview:button];
     */
  }];
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
