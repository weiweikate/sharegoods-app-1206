//
//  MRImagePickerBridge.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/23.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MRImagePickerBridge.h"
#import <React/RCTBridge.h>
#import "MRImageVideoManager.h"

@implementation MRImagePickerBridge

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getImageOrVideo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  

  dispatch_async(dispatch_get_main_queue(), ^{
    [[MRImageVideoManager sharedInstance]startSelectImageOrVideo];
  });
  
}
@end
