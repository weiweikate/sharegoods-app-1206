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
#import "WelcomeView.h"
#import "NetWorkTool.h"
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
  [self configureUserAgent];
  //添加广告页
  AdView *adView = [AdView new];
  [adView addToWindow];
  self.adView = adView;
  return YES;
}

- (void)addWelcomeView
{
  WelcomeView * welcomeView = [[WelcomeView alloc]initWithData:@[@"welcome_bg1",@"welcome_bg2",@"welcome_bg3",@"welcome_bg4"]];
  welcomeView.frame = self.window.bounds;
  [self.window addSubview:welcomeView];
}

- (void)removeLaunch
{
  self.adView.isLoadJS = YES;
}

- (void)configureUserAgent {
  NSString *orgAgent = [[[UIWebView alloc] init] stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
  NSString *appendAgent = @"xiugou";
  NSString *userAgent = [NSString stringWithFormat:@"%@ %@", orgAgent, appendAgent];
  NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:userAgent, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];

}

@end
