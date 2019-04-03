//
//  ShareImageMaker.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@interface ShareImageMakerModel : NSObject
@property(nonatomic, copy)NSString * imageType;// product\web
@property(nonatomic, copy)NSString * imageUrlStr;
@property(nonatomic, copy)NSString * titleStr;
@property(nonatomic, copy)NSString * priceStr;
@property(nonatomic, copy)NSString * retailPrice;
@property(nonatomic, copy)NSString * spellPrice;
@property(nonatomic, copy)NSString * QRCodeStr;
@end
typedef  void(^ShareImageMakercompletionBlock)(NSString * pathStr, NSString *errorStr);
typedef  void(^completionBlock)(BOOL success);
@interface ShareImageMaker : NSObject
SINGLETON_FOR_HEADER(ShareImageMaker)
/**
 生成二维码分享的图片，保存在本地,商品详情里面
 */
- (void)creatShareImageWithShareImageMakerModel:(ShareImageMakerModel *)model
                                    completion:(ShareImageMakercompletionBlock) completion;
/**
 邀请好友返回二维码
 */
- (void)creatQRCodeImageWithQRCodeStr:(NSString *)QRCodeStr
                                     completion:(ShareImageMakercompletionBlock) completion;

- (void)createPromotionShareImageWithQRString:(NSString *)QRString
                                     completion:(ShareImageMakercompletionBlock) completion;

- (void)saveInviteFriendsImage:(NSString*)QRString
                     logoImage:(NSString*)logoImage
                    completion:(completionBlock) completion;

- (void)saveShopInviteFriendsImage:(NSDictionary*)dic
                    completion:(completionBlock) completion;
@end


