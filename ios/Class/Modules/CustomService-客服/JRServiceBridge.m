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
{
  bool hasListeners;
}


-(NSArray<NSString *> *)supportedEvents{
  return @[
           QY_MSG_CHANGE
           ];
}

RCT_EXPORT_MODULE(JRQYService)
/***
 *用户登录后触发此方法
 *初始化七鱼客服，包括七鱼sesstion的创建，基础信息的配置
 */
RCT_EXPORT_METHOD(initQYChat:(NSDictionary *)info){
  NSLog(@"%@",info);
  [[JRServiceManager sharedInstance]initQYChat:info];
}

RCT_EXPORT_METHOD(beginQYChat:(NSDictionary *)chatInfo){
//  NSLog(@"%@",chatInfo);
  dispatch_async(dispatch_get_main_queue(), ^{
     [[JRServiceManager sharedInstance] swichGroup:chatInfo];
  });
}
RCT_EXPORT_METHOD(qiYULogout){
  [[JRServiceManager sharedInstance] qiYULogout];
}

// 在添加第一个监听函数时触发
-(void)startObserving {
  hasListeners = YES;
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(aaa:)
                                               name:QY_MSG_CHANGE
                                             object:nil];
}
- (void)aaa:(NSNotification*)notification {
  if (hasListeners) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:QY_MSG_CHANGE body:notification.object];
    });
  }
}

- (void)stopObserving {
  hasListeners = NO;
}

@end
