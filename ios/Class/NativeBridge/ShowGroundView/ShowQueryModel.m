//
//  ShowQueryModel.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowQueryModel.h"
#import "NSString+UrlAddParams.h"
@implementation ShowQueryModel
+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass
{
  return  @{@"data": @"ShowQuery_dataModel"};
}
@end

@implementation UserModel

@end

@implementation ResourceModel

@end

@implementation ProductsModel

@end

@implementation ShowQuery_dataModel
+ (nullable NSDictionary<NSString *, id> *)modelCustomPropertyMapper
{
  return  @{@"ID": @"id",
            @"pureContent_1": @"content",
            @"xg_index": @"index",
            };
}

+ (nullable NSDictionary<NSString *, id> *)modelContainerPropertyGenericClass{
  return @{
           @"products" : @"ProductsModel",
           @"resource" : @"ResourceModel",
           };
}

- (CGFloat)aspectRatio
{
  if (_aspectRatio !=0) {
    return _aspectRatio;
  }
  CGFloat width = 167.0;
  CGFloat height = 120.0;
  if(self.showType&&self.showType == 3){
    for(int i=0;i<self.resource.count;i++){
      if(self.resource[i].type==5 && [self.resource[i] valueForKey:@"baseUrl"]){
        if([self.resource[i] valueForKey:@"width"]&&[[self.resource[i] valueForKey:@"width"]floatValue]>0){
          width = [[self.resource[i] valueForKey:@"width"]floatValue];
        }
        if([self.resource[i] valueForKey:@"height"]&&[[self.resource[i] valueForKey:@"height"]floatValue]>0){
          height = [[self.resource[i] valueForKey:@"height"]floatValue];
        }
      }
    }
  }else if([self.resource[0] valueForKey:@"baseUrl"]){
    if([self.resource[0] valueForKey:@"width"]&&[[self.resource[0] valueForKey:@"width"]floatValue]>0){
      width = [[self.resource[0] valueForKey:@"width"]floatValue];
    }
    if([self.resource[0] valueForKey:@"height"]&&[[self.resource[0] valueForKey:@"height"]floatValue]>0){
      height = [[self.resource[0] valueForKey:@"height"]floatValue];
    }
  }
  _aspectRatio = width / height;
  return _aspectRatio;
}

- (NSString *)showImage
{
  NSString * showImage = @"";
  if(self.showType&&self.showType == 3){
    for(int i=0;i<self.resource.count;i++){
      if(self.resource[i].type==5 && [self.resource[i] valueForKey:@"baseUrl"]){
      showImage = [self.resource[i] valueForKey:@"baseUrl"];
      }
    }
  }else if([self.resource[0] valueForKey:@"baseUrl"]){
    showImage = [self.resource[0] valueForKey:@"baseUrl"];
  }
  return showImage;
}

- (NSString *)showImage_oss
{
 CGFloat itemWidth=  [UIScreen mainScreen].bounds.size.width / 2.0;
 CGFloat aspectRatio = self.aspectRatio_show;
 return  [self.showImage getUrlAndWidth:itemWidth height:itemWidth*aspectRatio];
}

- (CGFloat)aspectRatio_show{
  if (_aspectRatio_show !=0) {
    return _aspectRatio_show;
  }
  CGFloat aspectRatio = self.aspectRatio;
//  if(self.showType&&self.showType==3){
//      CGFloat type1 = 9/16.0;
//      CGFloat type2 = 1.0;
//      CGFloat type3 = 4/3.0;
//      double a1 = fabs(type1-aspectRatio);
//      double a2 = fabs(type2-aspectRatio);
//      double a3 = fabs(type3-aspectRatio);
//      if(a1<a2&&a1<a3){
//        return type1;
//      }
//      if(a2<a1&&a2<a3){
//        return type2;
//      }
//      if(a3<a1&&a3<a2){
//        return type3;
//      }
//    return aspectRatio;
//
//  }else{
  
    CGFloat minRatio = 120 / 167.0;
    CGFloat maxRatio = 240 / 167.0;
    if (aspectRatio < minRatio) {
      aspectRatio = minRatio;
    }
    
    if (aspectRatio > maxRatio) {
      aspectRatio = maxRatio;
    }
    _aspectRatio_show = aspectRatio;
    return _aspectRatio_show;
//  }
  
}

- (NSString *)userHeadImg_oss
{
  if (_userInfoVO.userImg) {
   return [_userInfoVO.userImg  getUrlAndWidth:30 height:30];
  }
  return @"";
}

- (CGFloat)titleHeight
{
  if (!_pureContent_1 || _pureContent_1.length == 0) {
    return 0;
  }
  if (_titleHeight) {
    return _titleHeight;
  }
   CGFloat width = (kScreenWidth - 20 -10)/2.0;
  _titleHeight = [_pureContent_1 getHeightWithFontSize:13 viewWidth:width - 20 maxLineCount:2];
  return _titleHeight;
}
@end
