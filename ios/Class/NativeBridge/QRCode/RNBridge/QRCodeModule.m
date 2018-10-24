//
//  QRCodeModule.m
//  fresh
//
//  Created by wjyx on 2018/5/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "QRCodeModule.h"
#import <React/RCTBridgeModule.h>
#import "SGQRCodeScanManager.h"
#import "WCQRCodeScanningVC.h"
#import <UIKit/UIKit.h>
#import "NSObject+Util.h"

@implementation QRCodeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scanQRCode: (RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if (device) {
      AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
      switch (status) {
        case AVAuthorizationStatusNotDetermined: {
          [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
            dispatch_sync(dispatch_get_main_queue(), ^{
              if (granted) {
                WCQRCodeScanningVC *scanVC = [[WCQRCodeScanningVC alloc] init];
                scanVC.scanResultBlock = ^(NSString *resultStr) {
                 onSuccess(@[resultStr]);
                };
                [self.currentViewController_XG.navigationController pushViewController:scanVC animated:YES];
              } else {
                [self alert:@"您拒绝了访问相机权限" rejecter:onError];
              }
            });
          }];
          break;
        }
        case AVAuthorizationStatusAuthorized: {
          WCQRCodeScanningVC *scanVC = [[WCQRCodeScanningVC alloc] init];
          scanVC.scanResultBlock = ^(NSString *resultStr) {
            onSuccess(@[resultStr]);
          };
          [self.currentViewController_XG.navigationController pushViewController:scanVC animated:YES];
          break;
        }
        case AVAuthorizationStatusDenied: {
          [self alert:@"请去-> [设置 - 隐私 - 相机 - 应用名] 打开访问开关" rejecter:onError];
          break;
        }
        case AVAuthorizationStatusRestricted: {
          [self alert:@"您无权限访问摄像头" rejecter:onError];
          break;
        }
          
        default:
          break;
      }
      return;
    }
    [self alert:@"未检测到您的摄像头" rejecter:onError];
  });
}



- (void)alert:(NSString *)message rejecter:(RCTResponseSenderBlock)reject{
  UIAlertController *alertC = [UIAlertController alertControllerWithTitle:@"温馨提示" message:message preferredStyle:(UIAlertControllerStyleAlert)];
  UIAlertAction *alertA = [UIAlertAction actionWithTitle:@"确定" style:(UIAlertActionStyleDefault) handler:nil];
  [alertC addAction:alertA];
  UINavigationController * nav = (UINavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;
  [nav presentViewController:alertC animated:YES completion:^{
    reject(@[@"RCTResponseSenderBlock"]);
  }];
}



@end
