//
//  JXModel.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXModel.h"

@implementation JXModel

+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass{
  return @{
           @"data" : @"JXModelData",
           };
}

@end

@implementation JXModelData

+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass{
  return @{
           @"products" : @"GoodsDataModel",
           @"resource" : @"SourcesModel",
           };
}

@end

@implementation GoodsDataModel

@end

@implementation SourcesModel

@end

@implementation UserInfoModel

@end

@implementation promotionResultModel

@end

@implementation ActityModel

@end
