//
//  UIImage+Util.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/10.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UIImage+Util.h"

@implementation UIImage (Util)
+ (UIImage *)getLaunchImage{
  
  CGSize viewSize = [UIScreen mainScreen].bounds.size;
  NSString *viewOr = @"Portrait";//垂直
  NSString *launchImage = nil;
  NSArray *launchImages =  [[[NSBundle mainBundle] infoDictionary] valueForKey:@"UILaunchImages"];
  
  for (NSDictionary *dict in launchImages) {
    CGSize imageSize = CGSizeFromString(dict[@"UILaunchImageSize"]);
    
    if (CGSizeEqualToSize(viewSize, imageSize) && [viewOr isEqualToString:dict[@"UILaunchImageOrientation"]]) {
      launchImage = dict[@"UILaunchImageName"];
    }
  }
  return [UIImage imageNamed:launchImage];
}

@end
