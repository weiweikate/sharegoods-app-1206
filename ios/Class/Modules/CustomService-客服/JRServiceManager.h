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
/**
 * 初始化七鱼客服
 */
-(void)initQYChat:(id)jsonData;

-(void)qiYUChat:(id)josnData;
/**
 清理缓存
 */
-(void)onCleanCache;
-(void)qiYULogout;
@end
