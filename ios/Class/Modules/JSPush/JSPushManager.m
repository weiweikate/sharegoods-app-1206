//
//  JSPushManager.m
//  crm_app_xiugou
//
//  Created by Max on 2018/11/23.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JSPushManager.h"

@implementation JSPushManager

+(void)setTags:(NSSet<NSString *> *)tags{
  [JPUSHService setTags:tags completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
    if (iResCode == 0) {
      DLog(@"极光------更新标签成功");
    }else{
      DLog(@"极光------更新标签失败");
    }
  } seq:[[JSPushManager getNowTimeTimestamp] integerValue]];
}

+(void)setAlias:(NSString *)alia{
  [JPUSHService setAlias:alia completion:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
    if (iResCode == 0) {
      DLog(@"极光------更新标签成功");
    }else{
      DLog(@"极光------更新标签失败");
    }
  } seq:[[JSPushManager getNowTimeTimestamp] integerValue]];
}

+(NSString *)getNowTimeTimestamp{
  NSDate* dat = [NSDate dateWithTimeIntervalSinceNow:0];
  NSTimeInterval a=[dat timeIntervalSince1970];
  NSString*timeString = [NSString stringWithFormat:@"%0.f", a];//转为字符型
  return timeString;
}
@end
