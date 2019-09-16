//
//  ShowShareImgMaker.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ShareImageMaker.h"
@interface ShowShareImgMaker : NSObject

/**
返回true合法
 */
+(BOOL)checkLegalWithShareImageMakerModel:(ShareImageMakerModel *)model
                                     completion:(ShareImageMakercompletionBlock) completion;

+ (NSDictionary *)getParamsWithImages:(NSArray<UIImage *> *)images
                                model:(ShareImageMakerModel *)model;

+ (NSDictionary *)getParamsWithWEBImages:(NSArray<UIImage *> *)images
                                model:(ShareImageMakerModel *)model;

+ (NSDictionary *)getParamsWithInviteImages:(NSArray<UIImage *> *)images
                                      model:(ShareImageMakerModel *)model;

+ (NSString *)getShowProductImageModelImages:(NSArray<UIImage *> *)images
                                           model:(ShareImageMakerModel *)model;

/**
 *  拼团图片绘制
 */
+ (NSDictionary *)getParamsWithGroupImages:(NSArray<UIImage *> *)images
                                   model:(ShareImageMakerModel *)model;
@end

