//
//  UIView+captureSceen.h
//  jure
//
//  Created by nuomi on 2018/8/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (captureSceen)


/*
 * 当前屏幕截屏
 * @info width宽 height高 left左 top上 allScreen是否全屏
 */
+ (UIImage *)captureSceenImage:(NSDictionary *)info;

@end
