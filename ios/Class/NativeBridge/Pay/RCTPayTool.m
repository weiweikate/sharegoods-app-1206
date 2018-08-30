//
//  RCTPayTool.m
//  JiPei
//
//  Created by 魏家园潇 on 2017/4/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#define kDictNotEmpty(objDict) ([objDict isKindOfClass:[NSDictionary class]] && objDict && objDict.count > 0)
#define kStringNotEmpty(str) ([str isKindOfClass:[NSString class]] && str && str.length > 0)

#import "RCTPayTool.h"
#import <React/RCTBridgeModule.h>
#import "JRPay.h"

@interface RCTPayTool ()<RCTBridgeModule>

@end

@implementation RCTPayTool

RCT_EXPORT_MODULE();

#pragma mark - 支付宝支付
RCT_EXPORT_METHOD(appAliPay:(NSString *)parameter andResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (kStringNotEmpty(parameter)) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [[JRPay sharedPay] payWithPayMethod:AlipayMethod andPayInfo:parameter andComplete:^(PayResutl *payResutl) {
        if (payResutl){
          resolve(@{
                    @"code":[NSNumber numberWithInteger:payResutl.code],
                    @"sdkCode":[NSNumber numberWithInteger:payResutl.sdkCode],
                    @"msg":payResutl.msg,
                    @"aliPayResult": payResutl.aliPayResult?:@{},
                    });
        }
      }];
    });
  }else{
    resolve(@{@"errorMsg":@"支付参数不能为空"});
  }
}


#pragma mark - 微信支付
RCT_EXPORT_METHOD(appWXPay:(NSDictionary *)parameter andResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (kDictNotEmpty(parameter)) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [[JRPay sharedPay] payWithPayMethod:WXPayMothod andPayInfo:parameter andComplete:^(PayResutl *payResutl) {
        if (payResutl){
          resolve(@{
                    @"code":[NSNumber numberWithInteger:payResutl.code],
                    @"sdkCode":[NSNumber numberWithInteger:payResutl.sdkCode],
                    @"msg":payResutl.msg
                    });
        }
      }];
    });
  }else{
    resolve(@{@"errorMsg":@"支付参数不能为空"});
  }
}




@end
