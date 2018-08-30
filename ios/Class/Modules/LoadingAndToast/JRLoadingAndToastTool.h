//
//  JRLoadingAndToastTool.h
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JRLoadingAndToastTool : NSObject

/**
 loading
 @param loadingStr loading string
 */
+(void)showLoadingText:(NSString *)loadingStr;

/**
 dissmiss loading
 */
+(void)dissmissLoading;

/**
 loading with time
 @param toastStr laoding string
 @param delyTime dely time (seconde)
 */
+(void)showToast:(NSString *)toastStr andDelyTime:(NSTimeInterval)delyTime;
@end
