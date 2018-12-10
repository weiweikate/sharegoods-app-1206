//
//  JRLoadingAndToastTool.m
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRLoadingAndToastTool.h"
#import "MBProgressHUD+PD.h"
@implementation JRLoadingAndToastTool

+(void)showLoadingText:(NSString *)loadingStr{
  [MBProgressHUD showMessage:loadingStr toView:nil];
}
+(void)dissmissLoading{
  [MBProgressHUD hideHUD];
}
+(void)showToast:(NSString *)toastStr andDelyTime:(NSTimeInterval)delyTime{
  
  [MBProgressHUD showSuccess:toastStr];
}
@end
