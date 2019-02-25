//
//  UIImage+Util.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/10.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (Util)
+ (UIImage *)getLaunchImage;
-(NSData *)compressWithMaxLength:(NSUInteger)maxLength;
@end

NS_ASSUME_NONNULL_END
