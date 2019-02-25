//
//  ShowQueryModel.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowQueryModel.h"

@implementation ShowQueryModel
+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass
{
  return  @{@"data": @"ShowQuery_dataModel"};
}
@end


@implementation ShowQuery_dataModel
+ (nullable NSDictionary<NSString *, id> *)modelCustomPropertyMapper
{
   return  @{@"ID": @"id"};
}

- (CGFloat)aspectRatio
{
  CGFloat width = 1.0;
  CGFloat height = 1.0;
  if (self.generalize == ShowTypeNew || self.generalize == ShowTypeRecommend) {
    if (_coverImgWide != 0) {
      width = _coverImgWide;
    }
    if (_coverImgHigh != 0) {
      height = _coverImgHigh;
    }
  }else{
    if (_imgWide != 0) {
      width = _imgWide;
    }
    if (_imgHigh != 0) {
      height = _imgHigh;
    }
  }
  return width / height;
}

- (NSString *)showImage
{
  if (self.generalize == ShowTypeNew || self.generalize == ShowTypeRecommend) {
    return _coverImg;
  }else{
    return _img;
  }
}
@end
