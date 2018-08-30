//
//  JRShareManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRShareManager.h"
#import "JRDeviceInfo.h"
#import <AssetsLibrary/AssetsLibrary.h>

@implementation JRShareManager

SINGLETON_FOR_CLASS(JRShareManager)
/**
 jsonData 参数

 shareType : 0 图文链接分享  1图片分享
 platformType: 0 朋友圈 1 会话
 title:分享标题(当为图文分享时候使用)
 dec:内容(当为图文分享时候使用)
 linkUrl:(图文分享下的链接)
 thumImage:(分享图标小图(http链接)图文分享使用)
 shareImage:分享的大图(本地URL)图片分享使用
 **/
-(void)beginShare:(id)param{
  NSDictionary * dicParam = param;
  if ([dicParam[@"platformType"] integerValue] == 0) {
    //朋友圈
    if ([dicParam[@"shareType"] integerValue] == 0) {
      //图文链接
      [self shareWithPlatefrom:UMSocialPlatformType_WechatTimeLine Title:dicParam[@"title"] SubTitle:dicParam[@"dec"] Image:dicParam[@"thumImage"] LinkUrl:dicParam[@"linkUrl"]];
    }else{
      //图片
      [self shareImage:UMSocialPlatformType_WechatTimeLine imageUrl:dicParam[@"shareImage"]];
    }
  }else{
    //会话
    if ([dicParam[@"shareType"] integerValue] == 0) {
      //图文链接
      [self shareWithPlatefrom:UMSocialPlatformType_WechatSession Title:dicParam[@"title"] SubTitle:dicParam[@"dec"] Image:dicParam[@"thumImage"] LinkUrl:dicParam[@"linkUrl"]];
    }else{
      //图片
      [self shareImage:UMSocialPlatformType_WechatSession imageUrl:dicParam[@"shareImage"]];
    }
  }
}
-(void)shareWithPlatefrom:(UMSocialPlatformType)platform
                    Title:(NSString *)title
                 SubTitle:(NSString *)subTitle
                    Image:(NSString *)imageUrl
                  LinkUrl:(NSString *)linkUrl
{
  UMSocialMessageObject * message = [[UMSocialMessageObject alloc]init];
  NSString* thumbURL =  linkUrl;
  UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:subTitle thumImage:thumbURL];
  //设置网页地址
  shareObject.webpageUrl = linkUrl;
  //分享消息对象设置分享内容对象
  message.shareObject = shareObject;
  [[UMSocialManager defaultManager]shareToPlatform:UMSocialPlatformType_WechatTimeLine messageObject:message currentViewController:KRootVC completion:^(id result, NSError *error) {
    
  }];
}
-(void)shareImage:(UMSocialPlatformType)platform
         imageUrl:(NSString *)imageStr
{
  UMSocialMessageObject * message = [[UMSocialMessageObject alloc]init];
  UMShareImageObject *imageObject = [UMShareImageObject shareObjectWithTitle:nil descr:nil thumImage:nil];
  //分享消息对象设置分享内容对象
  imageObject.shareImage = [imageStr isKindOfClass:[UIImage class]]?imageStr :  [UIImage imageWithContentsOfFile:imageStr];
  message.shareObject = imageObject;
  [[UMSocialManager defaultManager]shareToPlatform:platform messageObject:message currentViewController:KRootVC completion:^(id result, NSError *error) {
  }];
}
//分享小程序
//-(void)shareMin:(NSDictionary *)minInfo{
//  UMShareMiniProgramObject *minShareObj = [[UMShareMiniProgramObject alloc]init];
//  minShareObj.userName = @"小程序";
//  minShareObj.path = @"pages/index/index";
//}


-(void)getUserInfoForPlatform:(UMSocialPlatformType)platformType withCallBackBlock:(loginFinshBlock)finshBlock{
  BOOL wx = [[UIApplication sharedApplication]canOpenURL:[NSURL URLWithString:@"weixin://"]];
  if (!wx) {
     NSDictionary * dic = @{@"msg":@"未安装微信"};
    if (finshBlock) {
      finshBlock(@[dic]);
      }
    [JRLoadingAndToastTool showLoadingText:@"未安装微信"];
    return;
  }
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_WechatSession currentViewController:KRootVC completion:^(id result, NSError *error) {
    UMSocialUserInfoResponse * res = result ;
    NSDictionary *dicData = @{
                              @"openid":res.openid?res.openid:[NSNull null],
                              @"systemVersion":[JRDeviceInfo systemVersion],
                              @"device":[JRDeviceInfo device]
                              };
    
    if(finshBlock){
      finshBlock(@[dicData]);
    }
  }];
}
//压缩图片
- (NSData *)resizeData:(UIImage *)image{
  NSData *data = UIImageJPEGRepresentation(image, 1.0);
  NSUInteger dataLength = [data length];
  CGFloat x = 1.0;
  if(dataLength > 31000.f) {
    x = 1.0 - 31000.f / dataLength;
  }
  return UIImageJPEGRepresentation(image, x);
}
//保存图片到相册
-(void)saveImage:(UIImage *)image{
    __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
    [lib writeImageToSavedPhotosAlbum:image.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
      NSLog(@"assetURL = %@, error = %@", assetURL, error);
      lib = nil;
      if (!error) {
        [JRLoadingAndToastTool showToast:@"图片保存成功" andDelyTime:0.5f];
      }else{
        [JRLoadingAndToastTool showToast:@"图片保存失败" andDelyTime:0.5f];
      }
    }];
}


@end
