//
//  CachesModule.m
//  jure
//
//  Created by Max on 2018/8/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CachesModule.h"

@implementation CachesModule

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(getCachesSize:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[JRCacheManager sharedInstance]getAllCachesWithFinshBlock:^(unsigned long long memorySise) {
      NSNumber * allSize = [NSNumber numberWithLongLong:memorySise];
      callback(@[allSize]);
    }];
  });
}
RCT_EXPORT_METHOD(clearCaches:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[JRCacheManager sharedInstance]deleteAllFileWithFinshBlock:^{
      callback(@[@"成功"]);
    }];
  });
}
@end
