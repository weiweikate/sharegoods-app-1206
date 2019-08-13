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


-(instancetype)init{
  if (self = [super init]) {
    [self initUploader];
  }
  return self;
}
-(void)initUploader{
  _uploader = [VODUploadClient new];
  __weak VODUploadClient *weakClient = _uploader;
  __weak HYFUploaderVideo *weakSelf = self;
  OnUploadFinishedListener testFinishCallbackFunc = ^(UploadFileInfo* fileInfo,  VodUploadResult* result){
    dispatch_async(dispatch_get_main_queue(), ^{
      self.finshBlock(@"finsh");
      [JRLoadingAndToastTool dissmissLoading];
    });
  };
  
  OnUploadFailedListener testFailedCallbackFunc = ^(UploadFileInfo* fileInfo, NSString *code, NSString* message){
    dispatch_async(dispatch_get_main_queue(), ^{
      self.errorBlock(@"finsh");
      [JRLoadingAndToastTool dissmissLoading];
      [JRLoadingAndToastTool showToast:@"上传失败" andDelyTime:0.5];
    });
  };
  
  OnUploadProgressListener testProgressCallbackFunc = ^(UploadFileInfo* fileInfo, long uploadedSize, long totalSize) {
    UploadFileInfo* info;
    int i = 0;
    for(; i<[[weakClient listFiles] count]; i++) {
      info = [[weakClient listFiles] objectAtIndex:i];
      if (info == fileInfo) {
        break;
      }
    }
    if (nil == info) {
      return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
      
    });
  };
  
  OnUploadTokenExpiredListener testTokenExpiredCallbackFunc = ^{
    NSLog(@"token expired.");
    self.errorBlock(@"finsh");
    dispatch_async(dispatch_get_main_queue(), ^{
      [JRLoadingAndToastTool showToast:@"token过期" andDelyTime:0.5];
    });
  };
  
  OnUploadRertyListener testRetryCallbackFunc = ^{
    dispatch_async(dispatch_get_main_queue(), ^{
      [JRLoadingAndToastTool dissmissLoading];
    });
  };
  
  OnUploadRertyResumeListener testRetryResumeCallbackFunc = ^{
     [JRLoadingAndToastTool dissmissLoading];
  };
  
  OnUploadStartedListener testUploadStartedCallbackFunc = ^(UploadFileInfo* fileInfo) {
    [weakClient setUploadAuthAndAddress:fileInfo uploadAuth:weakSelf.uploadAuth uploadAddress:weakSelf.uploadAddress];
    dispatch_async(dispatch_get_main_queue(), ^{
      [JRLoadingAndToastTool showLoadingText:@"上传中"];
    });
  };
  
  VODUploadListener *listener = [[VODUploadListener alloc] init];
  listener.finish = testFinishCallbackFunc;
  listener.failure = testFailedCallbackFunc;
  listener.progress = testProgressCallbackFunc;
  listener.expire = testTokenExpiredCallbackFunc;
  listener.retry = testRetryCallbackFunc;
  listener.retryResume = testRetryResumeCallbackFunc;
  listener.started = testUploadStartedCallbackFunc;
  // 点播上传。每次上传都是独立的鉴权，所以初始化时，不需要设置鉴权
  [_uploader setListener:listener];
}
-(void)startUpLoad:(NSString *)fileName and:(NSString *)filePath and:(NSString *)title andUpLoadAuth:(NSString *)uploadAuth andUpLoadAddress:(NSString *)uploadAddress{
  [HYFUploaderVideo sharedInstance].uploadAuth = uploadAuth;
  [HYFUploaderVideo sharedInstance].uploadAddress = uploadAddress;
  VodInfo  * info = [VodInfo new];
  info.title = title;
  [_uploader addFile:filePath vodInfo:info];
  [_uploader start];
}


@end
