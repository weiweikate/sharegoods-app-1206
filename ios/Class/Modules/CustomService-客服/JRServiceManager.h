//
//  JRServiceManager.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JRServiceManager : NSObject

SINGLETON_FOR_HEADER(JRServiceManager)

-(void)qiYUChat:(id)josnData;
-(void)startServiceWithGroupId:(int64_t)groupId andStaffId:(int64_t)staffId andTitle:(NSString *)title;
/**
 清理缓存
 */
-(void)onCleanCache;
-(void)qiYULogout;
@end
