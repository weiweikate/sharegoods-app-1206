//
//  UIViewController+Util.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//  

#import "UIViewController+Util.h"

@implementation UIViewController (Util)
- (UIViewController *)xg_getCurrentViewController
{
  NSAssert2([self isKindOfClass:[UIViewController class]], @"%s方法的调用对象不是控制器，其类型为%@", __func__ ,NSStringFromClass([self class]));
  if ([self isKindOfClass:[UITabBarController class]]) {
    
    UITabBarController * tabBarController = (UITabBarController * ) self;
    return [tabBarController.selectedViewController xg_getCurrentViewController];
    
  }else if ([self isKindOfClass:[UINavigationController class]]){
    
    UINavigationController * navigationController = (UINavigationController * ) self;
    return [navigationController.topViewController xg_getCurrentViewController];
    
  }else{
    
    if (self.presentedViewController) {
      return [self.presentedViewController xg_getCurrentViewController];
    }else{
      return self;
    }
    
  }

}
@end
