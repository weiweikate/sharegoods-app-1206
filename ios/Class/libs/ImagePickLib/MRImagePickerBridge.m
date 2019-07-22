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
#import "NetWorkTool.h"
#import <VODUpload/VODUploadClient.h>
#import <VODUpload/VODUploadModel.h>

#import "HYFUploaderVideo.h"
@implementation MRImagePickerBridge

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getImageOrVideo:(NSDictionary *)info and:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[MRImageVideoManager sharedInstance]startSelectImageOrVideoWithBlock:info and:^(NSArray * _Nonnull imageOrVideoArr) {
      resolve(imageOrVideoArr);
    }];
  });
}

RCT_EXPORT_METHOD(getShowVideo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[MRImageVideoManager sharedInstance] startRecordVideo:^(NSArray * _Nonnull videoArr) {
      if (videoArr.count > 0) {
        resolve(videoArr[0]);
      }
    }];
  });
}

RCT_EXPORT_METHOD(uploadVideo:(NSString *)title and:(NSString *)path :(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString * tempFile ;
    if ([path containsString:@"file:///"]) {
      NSArray * pathArr = [path componentsSeparatedByString:@"//"];
      tempFile = pathArr[1];
    }else{
      tempFile = path;
    }
    if (![[NSFileManager defaultManager] fileExistsAtPath:tempFile]) {
      [JRLoadingAndToastTool showToast:@"文件不存在" andDelyTime:0.5];
      return;
    }
    NSString * fileName =  [path  lastPathComponent];
    NSLog(@"%@---%@",title,path);
    NSDictionary * dicParams = @{
                                 @"fileName": fileName,
                                 @"title":title
                                 };
    [NetWorkTool requestWithURL:ShowApi_Video_Auth params:dicParams toModel:nil success:^(id result) {
      NSLog(@"%@",result);
      NSDictionary * dicResut = @{
                                  @"showNo":result[@"showNo"]?result[@"showNo"]:@"",
                                  @"videoId":result[@"videoId"]?result[@"videoId"]:@""
                                  };
      resolve(dicResut);
      
      NSString * uploadAddress = result[@"uploadAddress"];
      NSString * uploadAuth = result[@"uploadAuth"];
      
      [[HYFUploaderVideo sharedInstance]startUpLoad:fileName and:path and:title andUpLoadAuth:uploadAuth andUpLoadAddress:uploadAddress];
      
    } failure:^(NSString *msg, NSInteger code) {
      NSLog(@"%@",msg);
      reject([NSString stringWithFormat:@"%ld",code],msg,nil);
//      reject(msg);
    } showLoading:nil];
  });
}

@end
