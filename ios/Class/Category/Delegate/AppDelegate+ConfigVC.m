//
//  AppDelegate+ConfigVC.m
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

#import "AppDelegate+ConfigVC.h"
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <SandBoxPreviewTool/SuspensionButton.h>
#import <SandBoxPreviewTool/SandBoxPreviewTool.h>
#import <CodePush/CodePush.h>
#import "JRServiceBridge.h"
#import "MRImageVideoManager.h"


@implementation AppDelegate (ConfigVC)

-(void)JR_ConfigVC:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  NSURL *jsCodeLocation;
  #if DEBUG
   jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [CodePush bundleURL];
  #endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"sharegoods"
                                               initialProperties:@{@"statusBarHeight":[NSNumber numberWithFloat:kStatusBarHeight]}
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
 
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  JRBaseVC *rootViewController = [JRBaseVC new];
  rootViewController.view = rootView;
  JRBaseNavVC * nav = [[JRBaseNavVC alloc] initWithRootViewController:rootViewController];
  self.window.rootViewController = nav;
  [self.window makeKeyAndVisible];
//  [NSThread sleepForTimeInterval:3];
//  [self createDebugSuspensionButton];
}

// 创建悬浮球按钮
- (void)createDebugSuspensionButton
{
  SuspensionButton *button = [[SuspensionButton alloc] initWithFrame:CGRectMake(-5, [UIScreen mainScreen].bounds.size.height / 2 - 100, 100, 30) color:[UIColor colorWithRed:135 / 255.0 green:216 / 255.0 blue:80 / 255.0 alpha:1]];
  button.leanType = SuspensionViewLeanTypeEachSide;
  [button addTarget:self action:@selector(testA) forControlEvents:UIControlEventTouchUpInside];
  [button addTarget:SandBoxPreviewTool.sharedTool action:@selector(autoOpenCloseApplicationDiskDirectoryPanel) forControlEvents:UIControlEventTouchUpInside];
  [self.window.rootViewController.view addSubview:button];
}


- (void)testA {
  NSLog(@"testa");
  
//  JRServiceBridge * emitter = [[JRServiceBridge alloc]init];
////  [emitter sendEventWithName:QY_MSG_CHANGE body:@{@"name":@"原生传递过来的数据"}];
//  dispatch_async(dispatch_get_main_queue(), ^{
//   [emitter sendEventWithName:QY_MSG_CHANGE body:@{@"name": @"原生传递过来的数据"}];
//  });
  
  [MRImageVideoManager getImageAndVideo];
  
}

@end
