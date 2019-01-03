/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * @author huyufeng
 * @date on 2018/9/3
 * @describe iosUIApplication
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "ShareImageMaker.h"
#import "UIImage+Util.h"
#import "WelcomeView.h"
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self JR_ConfigLib:application didFinishLaunchingWithOptions:launchOptions];
  [self JR_ConfigVC:application didFinishLaunchingWithOptions:launchOptions];
  [self JR_ConfigAPNS:application didFinishLaunchingWithOptions:launchOptions];
  [self initSensorsAnalyticsWithLaunchOptions:launchOptions];
//  if ([[NSUserDefaults standardUserDefaults] boolForKey:@"isNotFrist"]) {
//
//  }else{
//    [self addWelcomeView];
//  }
  [self addLaunchToWindow];
 
  return YES;
}

- (void)addWelcomeView
{
  WelcomeView * welcomeView = [[WelcomeView alloc]initWithData:@[@"welcome_bg1",@"welcome_bg2",@"welcome_bg3",@"welcome_bg4"]];
  welcomeView.frame = self.window.bounds;
  [self.window addSubview:welcomeView];
}
- (void)addLaunchToWindow
{
  UIImageView *imgView = [UIImageView new];
  imgView.image = [UIImage getLaunchImage];
  imgView.center = self.window.center;
  imgView.bounds = self.window.bounds;
  [self.window addSubview:imgView];
  self.launchImgView = imgView;
}
- (void)removeLaunch
{
  //跳转指定页可以在这里写,启动时候
//   [[UIApplication sharedApplication]openURL:[NSURL URLWithString:@"meeruu://path/DebugPanelPage"]];
  [UIView animateWithDuration:1.5 animations:^{
    self.launchImgView.alpha = 0;
    self.launchImgView.transform = CGAffineTransformScale(CGAffineTransformIdentity, 1.1, 1.1);
  } completion:^(BOOL finished) {
    [self.launchImgView removeFromSuperview];
  }];
}

@end
