//
//  LoginAndShareModule.m
//  jure
//
//  Created by Max on 2018/8/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LoginAndShareModule.h"
#import "UIView+captureSceen.h"
#import "ShareImageMaker.h"

@implementation LoginAndShareModule
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(loginWX:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(), ^{
//#ifdef DEBUG
//          NSDictionary * dicData = @{
//                                     @"device":@"iphone 6s",
//                                     @"openid":@"ojoMs1M5csUdHkt8RFu2Ab6l41zM" ,
//                                     @"systemVersion" : @"11.4.1"
//                                     };
//          callback(@[dicData]);
//#else
              [[JRShareManager sharedInstance] getUserInfoForPlatform:UMSocialPlatformType_WechatSession withCallBackBlock:^(id userInfo) {
                callback(userInfo);
              }];
//#endif
    
  });
}

//info
//shareType
//RCT_EXPORT_METHOD(shareScreen:(id)jsonParam){
//
//  dispatch_async(dispatch_get_main_queue(), ^{
//    UIImage * img = [UIView captureSceenImage:jsonParam[@"info"]];
//
//    if(img){
//      NSMutableDictionary *dicParam = [NSMutableDictionary dictionaryWithDictionary:jsonParam];
//      [dicParam setObject:img forKey:@"shareImage"];
//      [[JRShareManager sharedInstance]beginShare:dicParam];
//    } else{
//      [JRLoadingAndToastTool showToast:@"截屏失败" andDelyTime:.5f];
//    }
//  });
//}


/**
 jsonData 参数
// info:包含截屏参数
 shareType : 0图片分享 1 图文链接分享
 platformType: 0 朋友圈 1 会话
 title:分享标题(当为图文分享时候使用)
 dec:内容(当为图文分享时候使用)
 linkUrl:(图文分享下的链接)
 thumImage:(分享图标小图(http链接)图文分享使用)
 shareImage:分享的大图(本地URL)图片分享使用
 **/
RCT_EXPORT_METHOD(share:(id)jsonParam
                  onSuccess:(RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[JRShareManager sharedInstance] beginShare:[JRShareModel modelWithJSON:jsonParam]
                                     completion:^(NSString *errorStr) {
                                       if (errorStr) {
                                         onError(@[errorStr]);
                                       }else{
                                         onSuccess(@[]);
                                       }
                                     }];
  });
}

RCT_EXPORT_METHOD(saveImage:(NSString *) imgStr){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIImage * img = [UIImage imageWithContentsOfFile:imgStr];
    if(img){
      [[JRShareManager sharedInstance]saveImage:img];
    } else{
      [JRLoadingAndToastTool showToast:@"保存失败" andDelyTime:.5f];
    }
  });
}

/**
 

 @param id
 {
    imageUrlStr: NSString,
    titleStr: NSString,
    priceStr: NSString,
    QRCodeStr: NSString,
 }
  onSuccess(NSSting) 成功的回调
  onError(NSSting)   失败的回调
 */
RCT_EXPORT_METHOD(creatShareImage:(id) jsonParam
                  onSuccess:(RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    ShareImageMakerModel * model = [ShareImageMakerModel modelWithJSON:jsonParam];
  [[ShareImageMaker sharedInstance] creatShareImageWithShareImageMakerModel:model
                                                               completion:^(NSString *pathStr, NSString *errorStr) {
                                                                 if (errorStr) {
                                                                   onError(@[errorStr]);
                                                                 }else{
                                                                   onSuccess(@[pathStr]);
                                                                 }
                                                               }];
  });
}
              
@end
