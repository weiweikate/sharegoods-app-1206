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
#import "UIViewController+Util.h"
#import "JVERIFICATIONService.h"
#import "NSObject+Util.h"

@implementation PhoneAuthenModule

RCT_EXPORT_MODULE(PhoneAuthenModule)

RCT_EXPORT_METHOD(isCanPhoneAuthen:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
//  resolve(@{@"isCanAuthen":@22});
////  return;
  if( [PhoneAutherTool isCanPhoneAuthen]){
    resolve(@{@"isCanAuthen":@0});
  }else{
    resolve(@{@"isCanAuthen":@0});
  }
}
RCT_EXPORT_METHOD(startPhoneAuthenWithPhoneNum:(NSString *)phoneNum resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
//  [PhoneAutherTool startPhoneAutherWithPhoneNum:phoneNum andFinshBlock:^(NSDictionary * _Nonnull resultDic) {
//    resolve(resultDic);
//  }];
}

RCT_EXPORT_METHOD(startLoginAuth:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [JVERIFICATIONService getAuthorizationWithController:self.currentViewController_XG completion:^(NSDictionary *result) {
      NSLog(@"一键登录 result:%@", result);
      if ([result[@"code"] integerValue] == 6000) {
        if (resolve) {
          resolve(result[@"loginToken"]);
        }
      }else{
        if ([result[@"code"] integerValue] != 6002) {
          reject(@"555",@"取消授权",[NSError new]);
        }else{
          reject(@"666",@"一键登录失败",[NSError new]);
        }
      }
    }];
  });
}

RCT_EXPORT_METHOD(checkInitResult:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  if( [PhoneAutherTool isCanPhoneAuthen]){
    resolve(@(true));
  }else{
    resolve(@(false));
  }
  
}

RCT_EXPORT_METHOD(getVerifyToken:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  [JVERIFICATIONService getToken:0 completion:^(NSDictionary *result) {
     if ([result[@"code"] integerValue] == 2000 && result[@"token"]) {
       NSLog(@"%@",result);
       resolve(result[@"token"]);
     }else{
       reject(@"0",@"获取失败",[NSError new]);
     }
  }];
}

RCT_EXPORT_METHOD(closeAuth)
{
  [JVERIFICATIONService dismissLoginController];
}

RCT_EXPORT_METHOD(preLogin)
{
  [JVERIFICATIONService preLogin:0 completion:^(NSDictionary *result) {
    
  }];
}

@end
