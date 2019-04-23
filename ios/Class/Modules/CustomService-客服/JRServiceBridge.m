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
           QY_MSG_CHANGE,
           QY_CARD_CLICK
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
    //监听长链接发来的消息
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(toRNHandleMsg:)
                                               name:QY_MSG_CHANGE
                                             object:nil];
    //增加卡片点击的监听
  [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(toRNHandleCardClick:)
                                                  name:QY_CARD_CLICK
                                                object:nil];
}
- (void)toRNHandleMsg:(NSNotification*)notification {
  if (hasListeners) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:QY_MSG_CHANGE body:notification.object];
    });
  }
}

-(void)toRNHandleCardClick:(NSNotification *)notification{
  if (hasListeners) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:QY_CARD_CLICK body:notification.object];
    });
  }
}

- (void)stopObserving {
  hasListeners = NO;
}

@end
