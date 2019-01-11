//
//  JRShareManager.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UMSocialWechatHandler.h>

typedef void(^loginFinshBlock)(id userInfo);
typedef void(^shareFinshBlock)(NSString *errorStr);
/*info:包含截屏参数
shareType : 0图片分享 1 图文链接分享
platformType:0 微信好友 1朋友圈 2qq好友 3qq空间 4微博
title:分享标题(当为图文分享时候使用)
dec:内容(当为图文分享时候使用)
linkUrl:(图文分享下的链接)
thumImage:(分享图标小图(http链接)图文分享使用)
shareImage:分享的大图(本地URL)图片分享使用
 userName //"小程序username，如 gh_3ac2059ac66f";
 miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";
**/
@interface JRShareModel : NSObject
@property(nonatomic, strong)NSDictionary *info;
@property(nonatomic, strong)NSNumber *shareType;
@property(nonatomic, strong)NSNumber *platformType;
@property(nonatomic, copy)NSString *title;
@property(nonatomic, copy)NSString *dec;
@property(nonatomic, copy)NSString *linkUrl;
@property(nonatomic, copy)NSString *thumImage;
@property(nonatomic, copy)NSString *shareImage;
@property(nonatomic, copy)NSString *userName;
@property(nonatomic, copy)NSString *miniProgramPath;
@property(nonatomic, copy)NSString *hdImageURL;
@property(nonatomic, assign)NSInteger miniProgramType;


@end
@interface JRShareManager : NSObject

SINGLETON_FOR_HEADER(JRShareManager)
- (void)getUserInfoForPlatform:(UMSocialPlatformType)platformType
             withCallBackBlock:(loginFinshBlock)finshBlock;

//-(void)shareWithPlatefrom:(UMSocialPlatformType)platform
//                    Title:(NSString *)title
//                 SubTitle:(NSString *)subTitle
//                    Image:(NSString *)imageUrl
//                  LinkUrl:(NSString *)linkUrl;
//
//-(void)shareImage:(UMSocialPlatformType)platform
//         imageUrl:(NSString *)imageStr;

-(void)beginShare:(JRShareModel *)shareModel
       completion:(shareFinshBlock) completion;

-(void)saveImage:(UIImage *)image;
  
  

@end
