//
//  AppDelegate+APNS.h
//  crm_app_xiugou
//
//  Created by Max on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate.h"
// 引入 JPush 功能所需头文件
#import "JPUSHService.h"


@interface AppDelegate (APNS) <JPUSHRegisterDelegate>
-(void)JR_ConfigAPNS:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;

@end

