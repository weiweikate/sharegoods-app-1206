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
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self JR_ConfigLib:application didFinishLaunchingWithOptions:launchOptions];
  [self JR_ConfigVC:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

@end
