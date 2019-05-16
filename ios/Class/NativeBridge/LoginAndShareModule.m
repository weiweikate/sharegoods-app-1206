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
#import "ShowShareImgMaker.h"

#import <AssetsLibrary/AssetsLibrary.h>

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
RCT_EXPORT_METHOD(saveScreen:(id)jsonParam
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError){

  dispatch_async(dispatch_get_main_queue(), ^{
    UIImage * img = [UIView captureSceenImage:jsonParam];
    if(img){
      __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
      [lib writeImageToSavedPhotosAlbum:img.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
        NSLog(@"assetURL = %@, error = %@", assetURL, error);
        lib = nil;
        if (!error) {
          if (onSuccess) {
            onSuccess(@[]);
          }
        }else{
          if (onError) {
            onError(@[]);
          }
        }
      }];
    } else{
      onError(@[]);
    }
  });
}
RCT_EXPORT_METHOD(saveInviteFriendsImage:(NSString *)qrString
                  logoImage:(NSString*)logoImage
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ShareImageMaker sharedInstance]saveInviteFriendsImage:qrString logoImage:(NSString*)logoImage completion:^(BOOL success) {
      if (success) {
        onSuccess(@[]);
      }else{
        onError(@[]);
      }
    }];
  });
}

/**
 店铺邀请好友图片保存到相册

 @param id {headerImg,shopName,shopId,shopPerson,codeString,wxTip}
 @return 是否成功
 */
RCT_EXPORT_METHOD(saveShopInviteFriendsImage:(id)jsonParam
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ShareImageMaker sharedInstance] saveShopInviteFriendsImage:jsonParam completion:^(BOOL success) {
      if (success) {
        onSuccess(@[]);
      }else{
        onError(@[]);
      }
    }];
  });
}


/**
 jsonData 参数
 shareType : 0图片分享 1 图文链接分享 2分享小程序
 platformType:0 微信好友 1朋友圈 2qq好友 3qq空间 4微博
 
 0图片分享
 shareImage:分享的大图(本地URL)图片分享使用
 
 1 图文链接分享
 title:分享标题(当为图文分享时候使用)
 dec:内容(当为图文分享时候使用)
 linkUrl:(图文分享下的链接)
 thumImage:(分享图标小图 图文分享使用)
           支持 1.本地路径RUL如（/user/logo.png）2.网络URL如(http//:logo.png) 3.项目里面的图片 如（logo.png）
 2分享小程序
 title
 dec
 thumImage
 linkUrl"兼容微信低版本网页地址";
 userName //"小程序username，如 gh_3ac2059ac66f";
 miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";
 
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
RCT_EXPORT_METHOD(creatShowShareImage:(id) jsonParam
                  onSuccess:(RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    ShowShareImgMakerModel * model = [ShowShareImgMakerModel modelWithJSON:jsonParam];
    [[ShowShareImgMaker sharedInstance] createShareImageWithShareImageMakerModel:model completion:^(NSString *paths, NSString *errorStr) {
      if (errorStr) {
        onError(@[errorStr]);
      }else{
        onSuccess(@[paths]);
      }
    }];
  });
}

/**
@QRCodeStr  二维码字符串
onSuccess(NSSting) 成功的回调
onError(NSSting)   失败的回调
*/
RCT_EXPORT_METHOD(creatQRCodeImage:(NSString *) QRCodeStr
                  onSuccess:(RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
   dispatch_async(dispatch_get_main_queue(), ^{
  [[ShareImageMaker sharedInstance] creatQRCodeImageWithQRCodeStr:QRCodeStr completion:^(NSString *pathStr, NSString *errorStr) {
    if (errorStr) {
      onError(@[errorStr]);
    }else{
      onSuccess(@[pathStr]);
    }
  }];
   });
}

/**
 @QRCodeStr  推广的二维码字符串
 onSuccess(NSSting) 成功的回调
 onError(NSSting)   失败的回调
 */
RCT_EXPORT_METHOD(createPromotionShareImage:(NSString *) QRCodeStr
                  onSuccess:(RCTResponseSenderBlock) onSuccess
                  onError:(RCTResponseSenderBlock) onError){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ShareImageMaker sharedInstance] createPromotionShareImageWithQRString:QRCodeStr
                                                                   completion:^(NSString *pathStr, NSString *errorStr) {
                                                                     if (errorStr) {
                                                                       onError(@[errorStr]);
                                                                     }else{
                                                                       onSuccess(@[pathStr]);
                                                                     }
                                                                   }];
  });
}


/**
 @QRCodeStr  生成二维码并且下载到手机
 onSuccess(NSSting) 成功的回调
 onError(NSSting)   失败的回调
 */
RCT_EXPORT_METHOD(createQRToAlbum:(NSString *) QRCodeStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ShareImageMaker sharedInstance] creatQRCodeImageWithQRCodeStr:QRCodeStr completion:^(NSString *pathStr, NSString *errorStr) {
      if (errorStr) {
//        reject(nil,nil,errorStr);
      }else{
        dispatch_async(dispatch_get_main_queue(), ^{
          UIImage * img = [UIImage imageWithContentsOfFile:pathStr];
          if(img){
            [[JRShareManager sharedInstance]saveImage:img];
            resolve(@"0000");
          } else{
//            reject(nil,nil,errorStr);
          }
        });
      }
    }];
  });
}
@end
