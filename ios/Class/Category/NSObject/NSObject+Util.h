//
//  NSObject+Util.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSObject (Util)
/**
 添加一个计算属性,获取当前VC
 */
@property(nonatomic, nonnull, readonly) UIViewController *currentViewController_XG;
@end
