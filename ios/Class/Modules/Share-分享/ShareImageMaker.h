//
//  ShareImageMaker.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@interface ShareImageMakerModel : NSObject

@property(nonatomic, copy)NSString * imageUrlStr;
@property(nonatomic, copy)NSString * titleStr;
@property(nonatomic, copy)NSString * priceStr;
@property(nonatomic, copy)NSString * QRCodeStr;
@end
typedef  void(^ShareImageMakercompletionBlock)(NSString * pathStr, NSString *errorStr);
@interface ShareImageMaker : NSObject
SINGLETON_FOR_HEADER(ShareImageMaker)
/**
 生成二维码分享的图片，保存在本地

 @param urlStr 图片的url字符串
 @param titleStr 标题字符串
 @param priceStr 价格字符串
 @param QRCodeStr 二维码字符串
 @return 返回保存的本地图片的路径
 */
- (void)creatShareImageWithShareImageMakerModel:(ShareImageMakerModel *)model
                                    completion:(ShareImageMakercompletionBlock) completion;

- (void)creatQRCodeImageWithQRCodeStr:(NSString *)QRCodeStr
                                     completion:(ShareImageMakercompletionBlock) completion;


@end


