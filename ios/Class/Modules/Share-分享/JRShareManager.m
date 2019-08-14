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
#import <YYKit.h>
#import "UIImage+Util.h"
@implementation JRShareModel

@end

@implementation JRShareManager

SINGLETON_FOR_CLASS(JRShareManager)
/**
 shareType : 0图片分享 1 图文链接分享
 platformType:0 微信好友 1朋友圈 2qq好友 3qq空间 4微博
 title:分享标题(当为图文分享时候使用)
 dec:内容(当为图文分享时候使用)
 linkUrl:(图文分享下的链接)
 thumImage:(分享图标小图(http链接)图文分享使用)
 shareImage:分享的大图(本地URL)图片分享使用
 **/
-(void)beginShare:(JRShareModel *)shareModel
       completion:(shareFinshBlock) completion
{
  UMSocialPlatformType platefrom = [self getUMSocialPlatformType:[shareModel.platformType  integerValue]];
  
  if(platefrom == UMSocialPlatformType_Sina &&![[UMSocialManager defaultManager]isInstall:platefrom]){
    [JRLoadingAndToastTool showToast:@"微博未安装" andDelyTime:1.5f];
    return;
  }
  
  if ([shareModel.shareType integerValue] == 1 || [shareModel.shareType integerValue] == 2) {//为分享网页

    if ([shareModel.shareType integerValue] == 2 && platefrom == UMSocialPlatformType_WechatSession) {
      [self shareMiniProgramWithModel:shareModel completion:completion];
      return;

    }
    if([shareModel.shareType integerValue] == 2 ){
      shareModel.thumImage = shareModel.hdImageURL;
    }
    [self shareWithPlatefrom:platefrom
                       Title:shareModel.title
                    SubTitle:shareModel.dec
                       Image:shareModel.thumImage
                     LinkUrl:shareModel.linkUrl
                  completion: completion];
  }else{//分享图片
    [self shareImage:platefrom imageUrl:shareModel.shareImage completion: completion];
  }
}
-(void)shareMiniProgramWithModel:(JRShareModel *)shareModel
                      completion:(shareFinshBlock) completion{
  //创建分享消息对象
  UMSocialMessageObject *message = [UMSocialMessageObject messageObject];
  id thumImage = [self getImageWithPath:shareModel.thumImage];
  UMShareMiniProgramObject *shareObject = [UMShareMiniProgramObject shareObjectWithTitle:shareModel.title descr:shareModel.dec thumImage:thumImage];
  shareObject.webpageUrl = shareModel.linkUrl;
  shareObject.userName = shareModel.userName;
  shareObject.path = shareModel.miniProgramPath;
  shareObject.miniProgramType = shareModel.miniProgramType;
  message.shareObject = shareObject;
  shareObject.hdImageData = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"logo" ofType:@"png"]];
  if (shareModel.hdImageURL) {
     NSString *imgUrl = [shareModel.hdImageURL  stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:imgUrl] options:YYWebImageOptionShowNetworkActivity progress:nil transform:^UIImage * _Nullable(UIImage * _Nonnull image, NSURL * _Nonnull url) {
      return image;
    } completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
      if (!error) {
          shareObject.hdImageData = [image compressWithMaxLength:128 * 1024];
      }
       [self shareWithMessageObject:message platform:UMSocialPlatformType_WechatSession completion:completion];
    }];
  }else{
      [self shareWithMessageObject:message platform:UMSocialPlatformType_WechatSession completion:completion];
  }

}
-(void)shareWithPlatefrom:(UMSocialPlatformType)platform
                    Title:(NSString *)title
                 SubTitle:(NSString *)subTitle
                    Image:(NSString *)imageUrl
                  LinkUrl:(NSString *)linkUrl
               completion:(shareFinshBlock) completion
{
  UMSocialMessageObject * message = [[UMSocialMessageObject alloc]init];
  id thumImage = [self getImageWithPath:imageUrl];

  if (platform == UMSocialPlatformType_Sina) {
    UMShareImageObject *shareObject =  [[UMShareImageObject alloc] init];
    shareObject.thumbImage = [UIImage imageNamed:@"icon"];
    [shareObject setShareImage:thumImage];
    message.text = [NSString stringWithFormat:@"%@%@%@",title,subTitle,linkUrl];
    //分享消息对象设置分享内容对象
    message.shareObject = shareObject;
  }else{
    UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:subTitle thumImage:thumImage];
    //设置网页地址
    shareObject.webpageUrl = linkUrl;
    //分享消息对象设置分享内容对象
    message.shareObject = shareObject;
  }
   [self shareWithMessageObject:message platform:platform completion:completion];

}

-(void)shareImage:(UMSocialPlatformType)platform
         imageUrl:(NSString *)imageStr
       completion:(shareFinshBlock) completion
{
  UMSocialMessageObject * message = [[UMSocialMessageObject alloc]init];
  UMShareImageObject *imageObject = [UMShareImageObject shareObjectWithTitle:nil descr:nil thumImage:nil];
  //分享消息对象设置分享内容对象
  if ([imageStr isKindOfClass:[UIImage class]] ||
    ([imageStr isKindOfClass:[NSString class]]&&[imageStr hasPrefix:@"http"])
      ) {
    imageObject.shareImage = imageStr;
  }else{
    imageObject.shareImage = [UIImage imageWithContentsOfFile:imageStr];
  }
  message.shareObject = imageObject;

  [self shareWithMessageObject:message platform:platform completion:completion];
}

- (void)shareWithMessageObject: (UMSocialMessageObject *) message
                      platform:(UMSocialPlatformType)platform
                    completion:(shareFinshBlock) completion{

  [[UMSocialManager defaultManager]shareToPlatform:platform messageObject:message currentViewController:self.currentViewController_XG completion:^(id result, NSError *error) {
    if(error){
      NSString *msg =error.userInfo[@"message"];
      if (error.code == 2008) {
        if (platform == UMSocialPlatformType_QQ || platform == UMSocialPlatformType_Qzone) {
          msg = @"QQ未安装";
        }else if (platform == UMSocialPlatformType_WechatSession || platform == UMSocialPlatformType_WechatTimeLine) {
          msg = @"微信未安装";
        }else if (platform == UMSocialPlatformType_Sina) {
          msg = @"微博未安装";
        }
      }
      if(msg == nil || msg.length == 0){
         msg = @"分享取消";
      }
      [JRLoadingAndToastTool showToast:msg andDelyTime:1.5f];
      completion(msg);
    }else{
      completion(nil);
    }
  }];
}

- (UMSocialPlatformType)getUMSocialPlatformType:(NSInteger) platefrom {
  switch (platefrom) {
    case 0:
      return UMSocialPlatformType_WechatSession;
    case 1:
      return UMSocialPlatformType_WechatTimeLine;
    case 2:
      return UMSocialPlatformType_QQ;
    case 3:
      return UMSocialPlatformType_Qzone;
    case 4:
      return UMSocialPlatformType_Sina;
    default:
      return UMSocialPlatformType_UnKnown;
      break;
  }
}

- (id)getImageWithPath:(NSString *)imageUrl{
  if ([imageUrl hasPrefix:@"http"]){
    return [imageUrl  stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];;
  }else if ([imageUrl hasSuffix:@"/"]){
    return [UIImage imageWithContentsOfFile:imageUrl];
  }else{
   return [UIImage imageNamed:imageUrl];
  }
}

#pragma 微信登陆
-(void)getUserInfoForPlatform:(UMSocialPlatformType)platformType withCallBackBlock:(loginFinshBlock)finshBlock{

  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_WechatSession currentViewController:self.currentViewController_XG completion:^(id result, NSError *error) {
     UMSocialUserInfoResponse * res = result;
    if(error || !res.unionId){
      if(finshBlock){ 
        finshBlock(@[@""]);
      }
      [JRLoadingAndToastTool showToast:@"授权失败" andDelyTime:0.5];
      return;
    }
    NSDictionary *dicData = @{
                              @"appOpenid":res.openid?res.openid:[NSNull null],
                              @"systemVersion":[JRDeviceInfo systemVersion],
                              @"device":[JRDeviceInfo device],
                              @"nickName":res.name?res.name:@"---",
                              @"headerImg":res.iconurl?res.iconurl:[NSNull null],
                              @"unionid":res.unionId
                              };
    NSLog(@"%@",res);
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
      [JRLoadingAndToastTool showToast:@"保存失败\n请确认图片保存权限已开启" andDelyTime:0.5f];
    }
  }];

}

//保存图片到相册
-(void)saveDownloadImage:(UIImage *)image{
  __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
  [lib writeImageToSavedPhotosAlbum:image.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
    NSLog(@"assetURL = %@, error = %@", assetURL, error);
    lib = nil;
    if (!error) {
//      [JRLoadingAndToastTool showToast:@"文案已复制,图片已下载到相册" andDelyTime:0.5f];
    }else{
//      [JRLoadingAndToastTool showToast:@"保存失败\n请确认图片保存权限已开启" andDelyTime:0.5f];
    }
  }];

}


//videoPath为视频下载到本地之后的本地路径
- (void)saveVideo:(NSString *)videoPath  withCallBackBlock:(shareFinshBlock)finshBlock{

  if (videoPath) {
    NSURL *url = [NSURL URLWithString:videoPath];
    BOOL compatible = UIVideoAtPathIsCompatibleWithSavedPhotosAlbum([url path]);
    if (compatible)
    {
      //保存相册核心代码
      UISaveVideoAtPathToSavedPhotosAlbum([url path], self, @selector(savedPhotoImage:didFinishSavingWithError:contextInfo:), (__bridge_retained
 void * _Nullable)(finshBlock));
    }
  }
}


//保存视频完成之后的回调
- (void) savedPhotoImage:(UIImage*)image didFinishSavingWithError: (NSError *)error contextInfo: (void *)contextInfo {
  shareFinshBlock finshBlock = (__bridge shareFinshBlock)contextInfo;
  if (error) {
    NSLog(@"保存视频失败%@", error.localizedDescription);
    [JRLoadingAndToastTool showToast:@"保存视频失败" andDelyTime:0.5f];
  }else {
    NSLog(@"保存视频成功");
    finshBlock(@"");
//    [JRLoadingAndToastTool showToast:@"文案已复制,视频已下载到相册" andDelyTime:0.5f];
  }
}

-(BOOL)saveVideoToLocation:(NSString *)videoPath data:(NSData *)data{
  NSString * path =NSHomeDirectory();
  NSString * Pathimg =[path stringByAppendingString:videoPath];
 return [data writeToFile:Pathimg atomically:YES];
}



@end
