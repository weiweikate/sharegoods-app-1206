//
//  PhoneAutherTool.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PhoneAutherTool.h"
//#import <ATAuthSDK/ATAuthSDK.h>
#import "UIViewController+Util.h"
#import "JVERIFICATIONService.h"
#import "NSObject+Util.h"
@implementation PhoneAutherTool
+(void)startPhoneAutherWithPhoneNum:(NSString *)phoneNum andFinshBlock:(void (^)(NSString * _Nonnull))finshBlock{
//  TXCustomModel *modelNew = [[TXCustomModel alloc] init];
//  //modelNew.navColor = UIColor.orangeColor;
//  modelNew.navTitle = [[NSAttributedString alloc] initWithString:@"一键登录" attributes:@{NSForegroundColorAttributeName: [UIColor colorWithHexString:@"#333"],NSFontAttributeName: [UIFont systemFontOfSize:18.0]}];
//  //modelNew.logoImage = [self imageWithColor:UIColor.orangeColor size:CGSizeMake(18 0.0, 180.0) isRoundedCorner:NO];
//  modelNew.logoImage =[UIImage imageNamed:@"logo"];
//  modelNew.logoIsHidden = NO;
//  //modelNew.slogonColor = UIColor.orangeColor;
//  //modelNew.numberColor = UIColor.orangeColor;
//  //modelNew.numberSize = 20.0;
//  modelNew.loginBtnBgColor = UIColor.orangeColor;
//  //modelNew.loginBtnText = @"⼀一键登录";
//  //modelNew.loginBtnTextColor = UIColor.whiteColor;
//  modelNew.privacyOne = @[@"流量量App使⽤用⽅方法1",@"https://www.taobao.com/"]; modelNew.privacyTwo = @[@"流量量App使⽤用⽅方法2",@"https://www.baidu.com/"]; modelNew.privacyColor = UIColor.orangeColor;
//  modelNew.changeBtnColor = UIColor.orangeColor;
//  modelNew.changeBtnIsHidden = NO;
//
//  dispatch_async(dispatch_get_main_queue(), ^{
//    UIViewController * currentVC = [UIApplication sharedApplication].delegate.window.rootViewController;
//    if (currentVC && [currentVC isKindOfClass:[JRBaseNavVC class]]) {
//      JRBaseNavVC * currentNav = (JRBaseNavVC * )currentVC;
//      currentVC = currentNav.viewControllers.lastObject;
//    }
//    __weak UIViewController * weakVC = currentVC;
//    [[TXCommonAuthHandler sharedInstance]getLoginTokenWithController:currentVC
//                                                               model:modelNew
//                                                             timeout:4000
//                                                            complete:^(NSDictionary * _Nonnull resultDic)
//    {
//          NSString *code = [resultDic valueForKey:@"resultCode"];
//          if ([code isEqualToString:TX_Auth_Result_Success]) {// 授权⻚页⾯面成功唤起
//
//          }else if ([code isEqualToString:TX_Login_SSO_Action]) { // 授权⻚页⾯面销毁
//          [weakVC dismissViewControllerAnimated:YES completion:nil];
//          NSString *token = [resultDic valueForKey:@"token"];
//          if (finshBlock) {
//                  finshBlock(token);
//            }
//        }
//    }];
//  });
  dispatch_async(dispatch_get_main_queue(), ^{
    [JVERIFICATIONService getAuthorizationWithController:self.currentViewController_XG completion:^(NSDictionary *result) {
      NSLog(@"一键登录 result:%@", result);
      if ([result[@"code"] integerValue] == 6000) {
        if (finshBlock) {
          finshBlock(result[@"loginToken"]);
        }
      }else{
        if ([result[@"code"] integerValue] != 6002) {
          dispatch_async(dispatch_get_main_queue(), ^{
            [JRLoadingAndToastTool showToast:@"一键登录失败" andDelyTime:0.5];
          });
        }
      }
    }];
  });
}
+(BOOL)isCanPhoneAuthen{
  if(![JVERIFICATIONService checkVerifyEnable]) {
    NSLog(@"当前网络环境不支持认证！");
    return false;
  }else{
    return true;
  }
}
@end
