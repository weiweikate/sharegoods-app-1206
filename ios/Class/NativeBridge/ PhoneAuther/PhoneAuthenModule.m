//
//  PhoneAuthenBridge.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/4.
//  Copyright © 2019 Facebook. All rights reserved.
//
/**
 * 手机号认证桥接导出模块
 *
 *
 */

#import "PhoneAuthenModule.h"
#import <React/RCTBridge.h>
#import "PhoneAutherTool.h"

@implementation PhoneAuthenModule

RCT_EXPORT_MODULE(PhoneAuthenModule)

RCT_EXPORT_METHOD(isCanPhoneAuthen:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
//  resolve(@{@"isCanAuthen":@22});
////  return;
  if( [PhoneAutherTool isCanPhoneAuthen]){
    resolve(@{@"isCanAuthen":@1});
  }else{
    resolve(@{@"isCanAuthen":@0});
  }
}
RCT_EXPORT_METHOD(startPhoneAuthenWithPhoneNum:(NSString *)phoneNum resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
  
//  [PhoneAutherTool ]
  //  if([PhoneAutherTool isCan])
  
}

@end
