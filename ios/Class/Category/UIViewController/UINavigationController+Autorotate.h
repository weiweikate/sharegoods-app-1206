//
//  UINavigationController+Autorotate.h
//  xiaoZhang
//
//  Created by 胡胡超 on 2018/11/28.
//  Copyright © 2018年 胡胡超. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UINavigationController (Autorotate)

@end

@interface UINavigationController (Pop)
- (void)popWithStep:(NSInteger)step
           animated:(BOOL)animated;
@end

@interface UITabBarController (Autorotate)

@end

NS_ASSUME_NONNULL_END
