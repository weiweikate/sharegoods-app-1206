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

@end

