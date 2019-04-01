//
//  JRServiceBridge.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#define QY_MSG_CHANGE  @"QY_MSG_CHANGE"

NS_ASSUME_NONNULL_BEGIN


@interface JRServiceBridge : RCTEventEmitter <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
