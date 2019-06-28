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
  CGFloat width = 1.0;
  CGFloat height = 1.0;
   NSDictionary * aspectRatioDic = [self.showImage getURLParameters];
  if ([aspectRatioDic valueForKey:@"width"]) {
    width = [[aspectRatioDic valueForKey:@"width"] floatValue];
  }
  if ([aspectRatioDic valueForKey:@"height"]) {
    height = [[aspectRatioDic valueForKey:@"height"] floatValue];
  }
  
  return width / height;
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
 CGFloat aspectRatio = self.aspectRatio;
 return  [self.showImage getUrlAndWidth:itemWidth height:itemWidth*aspectRatio];
}

- (CGFloat)aspectRatio_show{
  CGFloat aspectRatio = self.aspectRatio;
  CGFloat minRatio = 120 / 167.0;
  CGFloat maxRatio = 240 / 167.0;
  if (aspectRatio < minRatio) {
    aspectRatio = minRatio;
  }
  
  if (aspectRatio > maxRatio) {
    aspectRatio = maxRatio;
  }
  return aspectRatio;
}
@end
