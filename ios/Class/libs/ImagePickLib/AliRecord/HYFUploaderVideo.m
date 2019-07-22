//
//  HYFUploaderVideo.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "HYFUploaderVideo.h"
#import <VODUpload/VODUploadClient.h>



@interface HYFUploaderVideo ()

@property (nonatomic,strong)  VODUploadClient* uploader;
@property (nonatomic,strong) NSString * uploadAuth;
@property (nonatomic,strong) NSString * uploadAddress;

@end
@implementation HYFUploaderVideo

SINGLETON_FOR_CLASS(HYFUploaderVideo)


//-(VODUploadClient *)uploader{
//  if (!_uploader) {
//    _uploader =  [VODUploadClient new];
//    VODUploadListener * listener = [[VODUploadListener alloc]init];
//    listener.finish = ^(UploadFileInfo *fileInfo, VodUploadResult *result) {
//      [JRLoadingAndToastTool showToast:@"上传成功" andDelyTime:0.5];
//    };
//    listener.started = ^(UploadFileInfo *fileInfo) {
//      [_uploader setUploadAuthAndAddress:fileInfo uploadAuth:_uploadAuth uploadAddress:_uploadAddress];
//      [JRLoadingAndToastTool showLoadingText:@"上传中"];
//    };
//    listener.failure = ^(UploadFileInfo *fileInfo, NSString *code, NSString *message) {
//      [JRLoadingAndToastTool showToast:@"上传失败" andDelyTime:0.5];
//    };
//    listener.expire = ^{
//
//    };
//    [_uploader setListener:listener];
//  }
//  return _uploader;
//}


+(void)startUpLoad:(NSString *)fileName and:(NSString *)filePath and:(NSString *)title andUpLoadAuth:(NSString *)uploadAuth andUpLoadAddress:(NSString *)uploadAddress{

  
  [HYFUploaderVideo sharedInstance].uploadAuth = uploadAuth;
  [HYFUploaderVideo sharedInstance].uploadAddress = uploadAddress;
  
  
  VodInfo  * info = [VodInfo new];
  info.title = title;
  VODUploadClient *uploader =  [VODUploadClient new];
  VODUploadListener * listener = [[VODUploadListener alloc]init];
  
  __weak VODUploadClient * weakLoader = uploader;
  listener.finish = ^(UploadFileInfo *fileInfo, VodUploadResult *result) {
    dispatch_async(dispatch_get_main_queue(), ^{
       [JRLoadingAndToastTool dissmissLoading];
      [JRLoadingAndToastTool showToast:@"上传成功" andDelyTime:0.5];
    });
  };
  listener.started = ^(UploadFileInfo *fileInfo) {
    [weakLoader setUploadAuthAndAddress:fileInfo uploadAuth:uploadAuth uploadAddress:uploadAddress];
    dispatch_async(dispatch_get_main_queue(), ^{
       [JRLoadingAndToastTool dissmissLoading];
       [JRLoadingAndToastTool showLoadingText:@"上传中"];
    });
  };
  listener.failure = ^(UploadFileInfo *fileInfo, NSString *code, NSString *message) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [JRLoadingAndToastTool dissmissLoading];
       [JRLoadingAndToastTool showToast:@"message" andDelyTime:0.5];
    });
  };
  listener.expire = ^{
    
  };
  [uploader setListener:listener];
  [uploader stop];
  [uploader clearFiles];
  [uploader addFile:filePath vodInfo:info];
  [HYFUploaderVideo sharedInstance].uploader = uploader;
  [uploader start];
  
  
  
//  [[HYFUploaderVideo sharedInstance].uploader stop];
//  [[HYFUploaderVideo sharedInstance].uploader clearFiles];
//  [[HYFUploaderVideo sharedInstance].uploader addFile:filePath vodInfo:info];
//  [[HYFUploaderVideo sharedInstance].uploader start];
}


@end
