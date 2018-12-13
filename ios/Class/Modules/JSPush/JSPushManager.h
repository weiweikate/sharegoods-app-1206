//
//  JSPushManager.h
//  crm_app_xiugou
//
//  Created by Max on 2018/11/23.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
// 引入 JPush 功能所需头文件
#import "JPUSHService.h"


NS_ASSUME_NONNULL_BEGIN

@interface JSPushManager : NSObject

/**
 设置推送标签
 */
+(void)setTags:(NSSet<NSString *> *)tags;

/**
 设置别名
 @param alias 别名字符串
 */
+(void)setAlias:(NSString *)alia;
@end

NS_ASSUME_NONNULL_END
