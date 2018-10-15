//
//  UIViewController+Util.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIViewController (Util)

/**
 获取这个VC的最顶上的VC
 */
- (UIViewController *)xg_getCurrentViewController;
@end
