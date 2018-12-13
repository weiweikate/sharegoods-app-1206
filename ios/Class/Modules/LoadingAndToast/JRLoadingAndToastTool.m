//
//  JRLoadingAndToastTool.m
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRLoadingAndToastTool.h"
#import "MBProgressHUD+PD.h"
MBProgressHUD * hub = nil;
@implementation JRLoadingAndToastTool

+(void)showLoadingText:(NSString *)loadingStr{
  [self dissmissLoading];
  hub = [MBProgressHUD showMessage:loadingStr toView:nil];
}
+(void)dissmissLoading{
  [hub hideAnimated:YES];
}
+(void)showToast:(NSString *)toastStr andDelyTime:(NSTimeInterval)delyTime{
  toastStr = [NSString stringWithFormat:@" %@ ",toastStr];
  [MBProgressHUD showSuccess:toastStr];
}
@end
