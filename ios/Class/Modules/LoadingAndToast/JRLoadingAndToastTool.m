//
//  JRLoadingAndToastTool.m
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRLoadingAndToastTool.h"
#import "EasyLoadingConfig.h"
@implementation JRLoadingAndToastTool

+(void)showLoadingText:(NSString *)loadingStr{
  [EasyLoadingView showLoadingText:loadingStr config:^EasyLoadingConfig *{
    return [EasyLoadingConfig shared].setLoadingType(LoadingShowTypeIndicator);
  }];
}
+(void)dissmissLoading{
  [EasyLoadingView hidenLoading];
}
+(void)showToast:(NSString *)toastStr andDelyTime:(NSTimeInterval)delyTime{
  
  [EasyTextView showText:toastStr config:^EasyTextConfig *{
      [EasyTextConfig shared].textShowTimeBlock = ^float(NSString * _Nonnull text) {
      return delyTime;
    };
    return [EasyTextConfig shared];
  }];
}
@end
