//
//  JSPushBridge.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/4/23.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "JSPushBridge.h"
#import <React/RCTBridge.h>

#define HOME_REFRESH @"homeRefresh"
#define HOME_CUSTOM_RN_SKIP @"activitySkip"
#define HOME_CUSTOM_MSG @"HOME_CUSTOM_MSG"
#define HOME_CUSTOM_SKIP @"HOME_CUSTOM_SKIP"

#define MINE_CUSTON_MESSAGE @"MINE_CUSTON_MESSAGE"
#define MINE_NATIVE_TO_RN_MSG @"MINE_NATIVE_TO_RN_MSG"




@implementation JSPushBridge
{
  bool hasListeners;
}


-(NSArray<NSString *> *)supportedEvents{
  return @[
           HOME_REFRESH,
           HOME_CUSTOM_RN_SKIP,
           MINE_NATIVE_TO_RN_MSG
           ];
}
RCT_EXPORT_MODULE(JSPushBridge)


// 在添加第一个监听函数时触发
-(void)startObserving {
  hasListeners = YES;
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(toHomePageCustomMsg:)
                                               name:HOME_CUSTOM_MSG
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter]addObserver:self
                                          selector:@selector(toHomeSkip:) name:HOME_CUSTOM_SKIP object:nil];
  
  [[NSNotificationCenter defaultCenter]addObserver:self
                                          selector:@selector(toMinePageCustomMsg:) name:MINE_CUSTON_MESSAGE object:nil];
}
-(void)toHomePageCustomMsg:(NSNotification *)noti{
  if (noti.object) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:HOME_REFRESH body:noti.object];
    });
  }
}
-(void)toHomeSkip:(NSNotification *)noti{
  if (noti.object) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:HOME_CUSTOM_RN_SKIP body:noti.object];
    });
  }
}

-(void)toMinePageCustomMsg:(NSNotification *)noti{
  if (noti.object) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:MINE_NATIVE_TO_RN_MSG body:noti.object];
    });
  }
}
- (void)stopObserving {
  hasListeners = NO;
}
@end
