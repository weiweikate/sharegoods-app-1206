//
//  AppDelegate+APNS.m
//  crm_app_xiugou
//
//  Created by Max on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate+APNS.h"
//#import "JSPush"

// iOS10 注册 APNs 所需头文件
//#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
//#endif
// 如果需要使用 idfa 功能所需要引入的头文件
#import <AdSupport/AdSupport.h>
#import "JVERIFICATIONService.h"
#import <SensorsAnalyticsSDK.h>
#import "UIView+SDAutoLayout.h"
#import "UIButton+ImageText.h"

#define NotificationStatusTime @"NotificationStatusTime"

@implementation AppDelegate (APNS)

-(void)JR_ConfigAPNS:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  [self configAPNSWithOption:launchOptions];
  [self checkCurrentNotificationStatus];
  NSDictionary *pushNotificationKey = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  [self showChatViewController:pushNotificationKey];
  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
}

- (void)clearBadge{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [JPUSHService resetBadge];
  });
}
// 自定义消息 回调
- (void)networkDidReceiveMessage:(NSNotification *)notification {
  NSDictionary * userInfo = [notification userInfo];
  NSString *typeString = userInfo[@"content_type"];
  if (typeString && [typeString isEqualToString:@"HomeRefresh"]) {
    NSString *homeTypeStr = userInfo[@"content"];
    NSDictionary * dic = [self dictionaryWithJsonString:homeTypeStr];
    [[NSNotificationCenter defaultCenter]postNotificationName:@"HOME_CUSTOM_MSG" object:dic[@"homeType"]];
  }else if (typeString && [@"ActivitySkip" isEqualToString:typeString]){
     NSDictionary *homeTypeDic = userInfo[@"content"];
    if (homeTypeDic) {
         [[NSNotificationCenter defaultCenter]postNotificationName:@"HOME_CUSTOM_SKIP" object:homeTypeDic];
    }
  }else if (typeString && [@"sendTipsTagEvent" isEqualToString:typeString]){
    NSDictionary *mineTypeDic = userInfo[@"content"];
    if (mineTypeDic) {
      [[NSNotificationCenter defaultCenter]postNotificationName:@"MINE_CUSTON_MESSAGE" object:mineTypeDic];
    }
  }else if (typeString && [@"sendMemberLevelUpEvent" isEqualToString:typeString]){
    NSDictionary *mineTypeDic = userInfo[@"content"];
    if (mineTypeDic) {
      [[NSNotificationCenter defaultCenter]postNotificationName:@"nativeEvent_userUpdate" object:mineTypeDic];
    }
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

  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionAlert;
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {}
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];

  [JPUSHService setupWithOption:launchOptions
                         appKey:KJSPushKey
                        channel:@"App Store"
               apsForProduction:KJisProduction
          advertisingIdentifier:nil];
  
  JVAuthConfig *config = [[JVAuthConfig alloc] init];
  config.appKey = KJSPushKey;
  [JVERIFICATIONService setupWithConfig:config];
  [JVERIFICATIONService setDebug:YES];
  [self customUI];
}

-(void)customUI{
  /*移动*/
  JVMobileUIConfig *mobileUIConfig = [[JVMobileUIConfig alloc] init];
  mobileUIConfig.privacyState = true;
  mobileUIConfig.logoImg = [UIImage imageNamed:@"cmccLogo"];
  mobileUIConfig.navColor = [UIColor whiteColor];
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  mobileUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  mobileUIConfig.logoImg = [UIImage imageNamed:@"oneLoginLogo"];
  mobileUIConfig.navReturnImg = [UIImage imageNamed:@"oneLoginCancel"];
  mobileUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
   mobileUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  mobileUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  mobileUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  mobileUIConfig.sloganTextColor = [UIColor clearColor];
  [JVERIFICATIONService customUIWithConfig:mobileUIConfig customViews:^(UIView *customAreaView) {
    [self customLoginView:customAreaView];
  }];
  
  /*联通*/
  JVUnicomUIConfig *unicomUIConfig = [[JVUnicomUIConfig alloc] init];
  unicomUIConfig.privacyState = true;
  unicomUIConfig.navColor = [UIColor whiteColor];
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  unicomUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  unicomUIConfig.logoImg = [UIImage imageNamed:@"oneLoginLogo"];
  unicomUIConfig.navReturnImg = [UIImage imageNamed:@"oneLoginCancel"];
  unicomUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
  unicomUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  unicomUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  unicomUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  unicomUIConfig.sloganTextColor = [UIColor clearColor];
  
  [JVERIFICATIONService customUIWithConfig:unicomUIConfig customViews:^(UIView *customAreaView) {
    [self customLoginView:customAreaView];
  }];
  
  /*电信*/
  JVTelecomUIConfig *telecomUIConfig = [[JVTelecomUIConfig alloc] init];
  telecomUIConfig.privacyState = true;
  telecomUIConfig.navColor = [UIColor whiteColor];
  //  https://h5.sharegoodsmall.com/static/protocol/service.html
  telecomUIConfig.appPrivacyOne = @[@"用户协议",@"https://h5.sharegoodsmall.com/static/protocol/service.html"];
  telecomUIConfig.logoImg = [UIImage imageNamed:@"oneLoginLogo"];
  telecomUIConfig.navReturnImg = [UIImage imageNamed:@"oneLoginCancel"];
  telecomUIConfig.logBtnImgs = @[[UIImage imageNamed:@"umcsdk_login_btn_normal"],
                                [UIImage imageNamed:@"umcsdk_login_btn_unable"],
                                [UIImage imageNamed:@"umcsdk_login_btn_press"],];
  telecomUIConfig.appPrivacyColor = @[[UIColor colorWithHexString:@"#3d3d3d"], [UIColor colorWithHexString:@"#F00050"]];
  telecomUIConfig.checkedImg = [UIImage imageNamed:@"umcsdk_check_image"];
  telecomUIConfig.uncheckedImg = [UIImage imageNamed:@"umcsdk_uncheck_image"];
  telecomUIConfig.sloganTextColor = [UIColor clearColor];
  [JVERIFICATIONService customUIWithConfig:telecomUIConfig customViews:^(UIView *customAreaView) {
    [self customLoginView:customAreaView];
  }];
}

- (void)customLoginView:(UIView *)customView{
  UIView *bgView = [UIView new];
  [customView addSubview:bgView];
  bgView.sd_layout.bottomSpaceToView(customView, kRealValue(70)+kTabBarMoreHeight).leftEqualToView(customView).rightEqualToView(customView).heightIs(110);
  UILabel *tittleLabel = [[UILabel alloc] init];
  tittleLabel.text = @"其他登录方式";
  tittleLabel.textColor = RGB(102, 102, 102);
  tittleLabel.font = [UIFont systemFontOfSize:13];
  [bgView addSubview:tittleLabel];
  tittleLabel.sd_layout.centerXEqualToView(bgView).topEqualToView(bgView).heightIs(19);
  [tittleLabel setSingleLineAutoResizeWithMaxWidth:300];
  
  UIView *lineLeftView = [[UIView alloc] init];
  lineLeftView.backgroundColor = RGB(228, 228, 228);
  [bgView addSubview:lineLeftView];
  lineLeftView.sd_layout.rightSpaceToView(tittleLabel, 7).centerYEqualToView(tittleLabel).widthIs(kRealValue(102)).heightIs(1);
  
  UIView *lineRightView = [[UIView alloc] init];
  lineRightView.backgroundColor = RGB(228, 228, 228);
  [bgView addSubview:lineRightView];
  lineRightView.sd_layout.leftSpaceToView(tittleLabel, 7).centerYEqualToView(tittleLabel).widthIs(kRealValue(102)).heightIs(1);
  
  UIButton *leftBtn = [UIButton buttonWithType:UIButtonTypeCustom];
  [leftBtn setImage:[UIImage imageNamed:@"oneLoginWeix"] forState:UIControlStateNormal];
  [leftBtn setTitle:@"微信登录" forState:UIControlStateNormal];
  [leftBtn setTitleColor:RGB(153, 153, 153) forState:UIControlStateNormal];
  [leftBtn addTarget:self action:@selector(weiXLoginAction) forControlEvents:UIControlEventTouchUpInside];
  leftBtn.titleLabel.font = [UIFont systemFontOfSize:11];
  [bgView addSubview:leftBtn];
  leftBtn.sd_layout.centerXEqualToView(bgView)
  .offset(-74).bottomEqualToView(bgView).heightIs(73).widthIs(60);
  [leftBtn layoutButtonWithImageTitleSpace:10];
  
  UIButton *rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
  [rightBtn setImage:[UIImage imageNamed:@"oneLoginPhone"] forState:UIControlStateNormal];
  [rightBtn setTitle:@"手机号登录" forState:UIControlStateNormal];
  [rightBtn setTitleColor:RGB(153, 153, 153) forState:UIControlStateNormal];
  [rightBtn addTarget:self action:@selector(phoneLoginAction) forControlEvents:UIControlEventTouchUpInside];
  rightBtn.titleLabel.font = [UIFont systemFontOfSize:11];
  [bgView addSubview:rightBtn];
  rightBtn.sd_layout.centerXEqualToView(bgView).offset(74).bottomEqualToView(bgView)
  .heightIs(73).widthIs(60);
  [rightBtn layoutButtonWithImageTitleSpace:10];
}

- (void)weiXLoginAction{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"EventToRN"
                                                      object:@{@"eventName":@"Event_Login_Type",
                                                               @"login_type":@"1"}];
  [JVERIFICATIONService dismissLoginController];
}

- (void)phoneLoginAction{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"EventToRN"
                                                      object:@{@"eventName":@"Event_Login_Type",
                                                               @"login_type":@"2"}];
  [JVERIFICATIONService dismissLoginController];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //Optional
  NSLog(@"hyf--------did Fail To Register For Remote Notifications With Error: %@", error);
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
  //应用退出后的bgde后期根据具体业务再说
  //  NSInteger count = [[[QYSDK sharedSDK] conversationManager] allUnreadCount];
  //  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
  [self clearBadge];
}
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //提交token给七鱼 ,应用如果再接入其他三方推送,也可以写入此方法,根据后期业务具体调整
//  [[QYSDK sharedSDK] updateApnsToken:deviceToken];
  //极光提交
  [JPUSHService registerDeviceToken:deviceToken];
  [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
    NSLog(@"registrationID%@",registrationID);
    if (resCode == 0) {
      // 将极光推送的 Registration Id 存储在神策分析的用户 Profile "jgId" 中
      [SensorsAnalyticsSDK.sharedInstance profilePushKey:@"jgId" pushId:registrationID];
    }
  }];
}
//增加神策通知埋点
-(void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  // Required
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  // 用户点击通知栏打开消息，使用神策分析记录 "App 打开消息" 事件
  NSMutableDictionary *prop = [NSMutableDictionary dictionary];
  [prop setValue:userInfo[@"aps"][@"alert"] forKey:@"msg_title"];
  [prop setValue:userInfo[@"_j_msgid"] forKey:@"msg_id"];
  [prop setValue:userInfo[@"bizId"] forKey:@"bizId"];
  [prop setValue:userInfo[@"bizType"] forKey:@"bizType"];
  [[SensorsAnalyticsSDK sharedInstance] track:@"AppOpenNotification" withProperties:prop];
  
  // 直接上报数据
  [[SensorsAnalyticsSDK sharedInstance] flush];
  
  [self showChatViewController:response.notification.request.content.userInfo];
  completionHandler();  // 系统要求执行这个方法
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  //处理打开的后台推送消息 在前台的暂不处理
  if ([UIApplication sharedApplication].applicationState == UIApplicationStateInactive) {
    [self showChatViewController:userInfo];
  }
}

#pragma mark 推送来的消息解析
-(void)showChatViewController:(NSDictionary *)userInfo{
  NSString *openURL = nil;
  NSString * linkUrl = userInfo[@"linkUrl"];
  NSString * linkNativeUrl = userInfo[@"linkNativeUrl"];
  if (linkUrl &&[linkUrl isKindOfClass:[NSString class]] &&linkUrl.length > 0) {
    NSString*hString = [linkUrl stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "]];
    openURL = [NSString stringWithFormat:@"meeruu://path/HtmlPage/%@",hString];
  }else if(linkNativeUrl &&[linkNativeUrl isKindOfClass:[NSString class]] &&linkNativeUrl.length > 0){
    openURL = [NSString stringWithFormat:@"meeruu://path/%@",linkNativeUrl];
  }
  if (!openURL) {
    return;
  }
  if (!self.isLoadJS) {
    [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(timerRepeat:) userInfo:openURL repeats:YES];
  }else{
    [self openScheme:openURL];
  }
}
- (void)timerRepeat:(NSTimer *)timer{
  if (self.isLoadJS) {
    NSString *openUrl = (NSString *)timer.userInfo;
    if (timer.isValid) {
      [timer  invalidate];
      timer = nil;
    }
    [self openScheme:openUrl];
  }
}

- (void)openScheme:(NSString *)openURL{
  if ([[UIApplication sharedApplication] respondsToSelector:@selector(openURL:options:completionHandler:)]) {
    [[UIApplication sharedApplication]openURL:[NSURL URLWithString:openURL] options:@{} completionHandler:nil];
  }else{
    //openURL卡顿
    dispatch_async(dispatch_get_main_queue(), ^{
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:openURL]];
    });
  }
}

-(void) checkCurrentNotificationStatus
{
  if (@available(iOS 10 , *))
  {
    [[UNUserNotificationCenter currentNotificationCenter] getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
      
      if (settings.authorizationStatus == UNAuthorizationStatusDenied)
      {
        // 没权限
         [self showAlrtToSetting];
      }else{
       
        NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
      [userDefaults removeObjectForKey: NotificationStatusTime];
      }
      
    }];
  }
  else if (@available(iOS 8 , *))
  {
    UIUserNotificationSettings * setting = [[UIApplication sharedApplication] currentUserNotificationSettings];
    
    if (setting.types == UIUserNotificationTypeNone) {
      // 没权限
       [self showAlrtToSetting];
    }else{
      NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
      
      [userDefaults removeObjectForKey: NotificationStatusTime];
    }
  }
  else
  {
    UIRemoteNotificationType type = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
    if (type == UIUserNotificationTypeNone)
    {
      // 没权限
      [self showAlrtToSetting];
    }else{
       NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
      [userDefaults removeObjectForKey: NotificationStatusTime];
    }
  }
}


#pragma mark 没权限的弹窗
-(void) showAlrtToSetting
{
  NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
  NSDate *date = [userDefaults objectForKey: NotificationStatusTime];
  if (!date) {
    [userDefaults setObject:[NSDate new] forKey: NotificationStatusTime];
    return;
  }
  if ( [[date dateByAddingDays: 30] compare:[NSDate new]] == NSOrderedDescending)  {
    return;
  }
    [userDefaults setObject:[NSDate new] forKey: NotificationStatusTime];
  UIAlertController * alert = [UIAlertController alertControllerWithTitle:@"" message:@"开启消息通知，获取秀购最新资讯" preferredStyle:UIAlertControllerStyleAlert];
  
  UIAlertAction * cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    
  }];
  UIAlertAction * setAction = [UIAlertAction actionWithTitle:@"去设置" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    NSURL * url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    dispatch_async(dispatch_get_main_queue(), ^{
      if ([[UIApplication sharedApplication] canOpenURL:url]) {
        [[UIApplication sharedApplication] openURL:url];
      }
    });
    
  }];
  
  [alert addAction:cancelAction];
  [alert addAction:setAction];
  
  [self.currentViewController_XG  presentViewController:alert animated:YES completion:nil];
}

#pragma mark 前台接收推送通知信息
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  completionHandler(UNAuthorizationOptionAlert | UNAuthorizationOptionSound);
}

@end
