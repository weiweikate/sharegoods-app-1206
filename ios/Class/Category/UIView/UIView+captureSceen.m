//
//  UIView+captureSceen.m
//  jure
//
//  Created by nuomi on 2018/8/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UIView+captureSceen.h"

@implementation UIView (captureSceen)

+ (UIImage *)captureSceenImage:(NSDictionary *)info{
  
  UIView * view = UIApplication.sharedApplication.keyWindow.rootViewController.view;
  
  NSArray * subViewArr = UIApplication.sharedApplication.keyWindow.subviews;
  if (subViewArr.count > 1) {
    view = subViewArr[1];
  }
  
  CGFloat width = [info[@"width"] floatValue];
  CGFloat height = [info[@"height"] floatValue];
  CGFloat left = [info[@"left"] floatValue];
  CGFloat top = [info[@"top"] floatValue];
  BOOL allScreen = [info[@"allScreen"] boolValue];
  
  UIGraphicsBeginImageContextWithOptions(view.frame.size,NO, 0);
  
  [view.layer renderInContext:UIGraphicsGetCurrentContext()];
  
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  
  if(allScreen){
    
    UIGraphicsEndImageContext();
    
    return image;
  }
  CGRect myImageRect = CGRectMake(left * image.scale, top * image.scale, width * image.scale, height * image.scale);
  
  CGImageRef imageRef = image.CGImage;
  
  CGImageRef subImageRef = CGImageCreateWithImageInRect(imageRef,myImageRect );
  
  CGContextRef context = UIGraphicsGetCurrentContext();
  
  CGContextDrawImage(context, myImageRect, subImageRef);
  
  UIImage* smallImage = [UIImage imageWithCGImage:subImageRef];
  
  CGImageRelease(subImageRef);
  
  UIGraphicsEndImageContext();
  
  return smallImage;
}

@end
