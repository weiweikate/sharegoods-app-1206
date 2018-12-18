//
//  AppDelegate+ConfigLib.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate (ConfigLib)

-(void)JR_ConfigLib:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
-(void)initSensorsAnalyticsWithLaunchOptions:(NSDictionary *)launchOptions;
@end
