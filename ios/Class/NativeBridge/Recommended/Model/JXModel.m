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
           @"products" : @"GoodsDataModel",
           @"sources" : @"SourcesModel",
           };
}

@end
