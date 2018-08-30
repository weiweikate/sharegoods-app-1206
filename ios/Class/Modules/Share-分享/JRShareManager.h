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
@interface JRShareManager : NSObject

SINGLETON_FOR_HEADER(JRShareManager)
- (void)getUserInfoForPlatform:(UMSocialPlatformType)platformType withCallBackBlock:(loginFinshBlock)finshBlock;
-(void)shareWithPlatefrom:(UMSocialPlatformType)platform
                    Title:(NSString *)title
                 SubTitle:(NSString *)subTitle
                    Image:(NSString *)imageUrl
                  LinkUrl:(NSString *)linkUrl;
-(void)shareImage:(UMSocialPlatformType)platform
         imageUrl:(NSString *)imageStr;

-(void)beginShare:(id)param;

-(void)saveImage:(UIImage *)image;
  
  

@end
