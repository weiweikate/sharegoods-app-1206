//
//  ShowShareImgMaker.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@interface ShowShareImgMakerModel : NSObject
@property(nonatomic, copy)NSString * imageType;// image
@property(nonatomic, copy)NSString * imageUrlStr;
@property(nonatomic, copy)NSString * titleStr;
@property(nonatomic, copy)NSString * priceType;
@property(nonatomic, copy)NSString * priceStr;
@property(nonatomic, copy)NSString * retailPrice;
@property(nonatomic, copy)NSString * spellPrice;
@property(nonatomic, copy)NSString * QRCodeStr;
@end
typedef  void(^ShowImageMakercompletionBlock)(NSString * paths, NSString *errorStr);
typedef  void(^completionBlock)(BOOL success);

@interface ShowShareImgMaker : NSObject
SINGLETON_FOR_HEADER(ShowShareImgMaker)
/**
 生成二维码分享的图片，保存在本地,商品详情里面
 */
- (void)creatShareImageWithShareImageMakerModel:(ShowShareImgMakerModel *)model
                                     completion:(ShowImageMakercompletionBlock) completion;

@end

