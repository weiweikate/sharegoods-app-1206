//
//  NSObject+Util.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NSObject+Util.h"
#import "UIViewController+Util.h"
#import "AppDelegate.h"
@implementation NSObject (Util)
- (UIViewController *)currentViewController_XG
{
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  UIViewController *rootVC = delegate.window.rootViewController;
  return [rootVC xg_getCurrentViewController];
}
@end
