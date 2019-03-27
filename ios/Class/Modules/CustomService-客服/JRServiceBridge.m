//
//  JRServiceBridge.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "JRServiceBridge.h"
#import <React/RCTBridge.h>
#import "JRServiceManager.h"

@implementation JRServiceBridge

RCT_EXPORT_MODULE(JRQYService)

/***
 *用户登录后触发此方法
 *初始化七鱼客服，包括七鱼sesstion的创建，基础信息的配置
 */
RCT_EXPORT_METHOD(initQYChat:(NSDictionary *)info and:(RCTResponseSenderBlock)callback){
  NSLog(@"%@",info);
  [[JRServiceManager sharedInstance]initQYChat:info];
}




@end
