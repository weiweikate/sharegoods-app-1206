//
//  MBVideoModel.m
//  MBVideoPlayer
//
//  Created by chenda on 2018/5/9.
//  Copyright © 2018年 chenda. All rights reserved.
//

#import "MBVideoModel.h"

@implementation MBVideoModel

+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass{
  return @{
           @"data" : @"MBModelData",
           };
}
@end

@implementation MBModelData

+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass{
  return @{
           @"products" : @"MBGoodsDataModel",
           @"resource" : @"MBSourcesModel",
           @"showTags" : @"MBShowTags"
           };
}

- (NSString *)title
{
  if (_title) {
    return _title;
  }
  return  @"";
}


@end

@implementation MBGoodsDataModel

@end

@implementation MBSourcesModel

@end

@implementation MBUserInfoModel

@end

@implementation MBPromotionResultModel

@end

@implementation MBActityModel

@end


