//
//  UINavigationController+Autorotate.m
//  xiaoZhang
//
//  Created by 胡胡超 on 2018/11/28.
//  Copyright © 2018年 胡胡超. All rights reserved.
//

#import "UINavigationController+Autorotate.h"

@implementation UINavigationController (Pop)
- (void)popWithStep:(NSInteger)step
           animated:(BOOL)animated
{
    if (step < 1 || self.viewControllers.count < step+1) {
        return;
    }
    [self.navigationController popToViewController:self.viewControllers[self.viewControllers.count - step] animated:animated];
}
@end

@implementation UINavigationController (Autorotate)
- (BOOL)shouldAutorotate
{
    return [self.viewControllers.lastObject shouldAutorotate];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [self.viewControllers.lastObject supportedInterfaceOrientations];
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return [self.viewControllers.lastObject preferredInterfaceOrientationForPresentation];
}

@end

@implementation UITabBarController (Autorotate)
- (BOOL)shouldAutorotate
{
    return [self.selectedViewController shouldAutorotate];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [self.selectedViewController supportedInterfaceOrientations];
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return [self.selectedViewController preferredInterfaceOrientationForPresentation];
}

@end
