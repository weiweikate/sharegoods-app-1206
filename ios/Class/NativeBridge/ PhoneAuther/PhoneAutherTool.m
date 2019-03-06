//
//  PhoneAutherTool.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PhoneAutherTool.h"
#import <ATAuthSDK/ATAuthSDK.h>
@implementation PhoneAutherTool
+(void)startPhoneAutherWithPhoneNum:(NSString *)phoneNum andFinshBlock:(void (^)(NSDictionary * _Nonnull))finshBlock{
  /*
   * 返回：字典形式
   *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡
   *      accessCode：预取的编码
   *      msg：文案或错误提示
   */
  if ([TXCommonAuthHandler checkGatewayVerifyEnable:phoneNum]) {
    [TXCommonAuthHandler getAccessCodeWithTimeout:4000 complete:^(NSDictionary * _Nonnull resultDic) {
      if (finshBlock) {
        finshBlock(resultDic);
      }
    }];
  }else{
    finshBlock(@{@"resultCode":@(-1)});
  }
 
}

+(BOOL)isCanPhoneAuthen{
               [TXCommonAuthHandler getVersion];
  BOOL isCan = [TXCommonAuthHandler checkGatewayVerifyEnable:nil];
  return isCan;
}
@end
